/*
 * Copyright (c) 2013 The Finnish Board of Education - Opetushallitus
 *
 * This program is free software: Licensed under the EUPL, Version 1.1 or - as
 * soon as they will be approved by the European Commission - subsequent versions
 * of the EUPL (the "Licence");
 *
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at: http://ec.europa.eu/idabc/eupl
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * European Union Public Licence for more details.
 */

'use strict';

epOpintopolkuApp
.controller('PerusopetusController', function($q, $scope, $timeout, sisalto, PerusteenOsat,
  OppiaineenVuosiluokkakokonaisuudet, Utils,
  Algoritmit, Notifikaatiot, Oppiaineet, TermistoService, Kieli, $document, $rootScope) {
  $scope.isNaviVisible = _.constant(true);
  $scope.hasContent = function (obj) {
    return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
  };
  var peruste = sisalto[0];
  var oppiaineet = _.zipBy(sisalto[2], 'id');
  $scope.osaamiset = _.zipBy(sisalto[1], 'id');
  $scope.sisallot = _.zipBy(sisalto[3], 'id');
  $scope.vuosiluokkakokonaisuudet = _(sisalto[3]).each(function(s) { s.vuosiluokat.sort(); })
                                                 .sortBy(function(s) { return _.first(s.vuosiluokat); })
                                                 .value();
  $scope.vuosiluokkakokonaisuudetMap = _.zipBy($scope.vuosiluokkakokonaisuudet, 'id');
  $scope.valittuOppiaine = {};
  $scope.filterSisalto = {};
  $scope.filterOsaamiset = {};
  $scope.tekstisisalto = sisalto[4];
  $scope.currentSection = 'suunnitelma';
  $scope.activeSection = 'suunnitelma';

  TermistoService.setPeruste(peruste);

  function clickHandler(event) {
    var ohjeEl = angular.element(event.target).closest('.popover, .popover-element');
    if (ohjeEl.length === 0) {
      $rootScope.$broadcast('ohje:closeAll');
    }
  }
  function installClickHandler() {
    $document.off('click', clickHandler);
    $timeout(function () {
      $document.on('click', clickHandler);
    });
  }
  $scope.$on('$destroy', function () {
    $document.off('click', clickHandler);
  });

  $scope.filtterit = {
    moodi: 'sivutus',
  };

  $scope.onSectionChange = function(section) {
    $scope.currentSection = section.id;
    $scope.activeSection = section.id;

    if (_.isEmpty($scope.valittuOppiaine) && section.id === 'sisalto') {
      selectOppiaine(_.first(_.keys(oppiaineet)));
    }
  };

  $scope.valitseOppiaineenVuosiluokka = function(vuosiluokka) {
    $timeout(function() {
      $scope.filtterit.valittuKokonaisuus = vuosiluokka;
      $scope.valittuOppiaine.vlks = $scope.valittuOppiaine.vuosiluokkakokonaisuudet[vuosiluokka];
      if ($scope.valittuOppiaine.vlks) {
        $scope.valittuOppiaine.sisallot = $scope.sisallot[$scope.valittuOppiaine.vlks._vuosiluokkaKokonaisuus];
      }
      paivitaTavoitteet();
    });
  };

  function activeSection() {
    return $scope.activeSection;
  }

  function isCurrentOppiaine(item) {
    var id = _.isObject(item) ? item.value : item;
    return $scope.valittuOppiaine && $scope.valittuOppiaine.oppiaine && $scope.valittuOppiaine.oppiaine.id === id;
  }

  function selectOppiaine(oppiaine) {
    var id = _.isObject(oppiaine) ? oppiaine.value : oppiaine;
    Oppiaineet.get({ perusteId: peruste.id, osanId: id }, function(res) {
      var valittuOppiaine = {};
      valittuOppiaine.oppiaine = res;
      valittuOppiaine.vuosiluokkakokonaisuudet = _.zipBy(res.vuosiluokkakokonaisuudet, '_vuosiluokkaKokonaisuus');
      $scope.valittuOppiaine = valittuOppiaine;

      var valittavaVuosiluokka = $scope.valittuOppiaine.vuosiluokkakokonaisuudet[$scope.filtterit.valittuKokonaisuus] ?
        $scope.filtterit.valittuKokonaisuus :
        _.first(_.keys($scope.valittuOppiaine.vuosiluokkakokonaisuudet));

      if ($scope.currentSection === 'vlk') {
        valittavaVuosiluokka = $scope.valittuVuosiluokkakokonaisuus.id;
      }

      $scope.valitseOppiaineenVuosiluokka(valittavaVuosiluokka, true);
      $scope.activeSection = 'sisalto';
    }, Notifikaatiot.serverCb);
  }

  function valitseAktiivinenTekstisisalto(osaId) {
    PerusteenOsat.get({
      osanId: osaId
    }, function(res) {
      $scope.valittuTekstisisalto = res;
      $scope.activeSection = 'suunnitelma';
    });
  }

  function rakennaVuosiluokkakokonaisuuksienSisalto() {
    var sisalto = _.map($scope.vuosiluokkakokonaisuudet, function(vkl) {
      return {
        $oppiaineet: _(oppiaineet).filter(function(oa) {
            return _.some(oa.vuosiluokkakokonaisuudet, function(oavkl) {
              return _.parseInt(oavkl._vuosiluokkaKokonaisuus) === vkl.id;
            });
          }).value(),
        $vkl: vkl,
        label: vkl.nimi,
        depth: 0,
      };
    });

    if (!_.isEmpty(sisalto)) {
      _.first(sisalto).$selected = true;
      $scope.valittuVuosiluokkakokonaisuus = _.first(sisalto).$vkl;
    }
    return sisalto;
  }

  function rakennaTekstisisalto() {
    var suunnitelma = [];
    Algoritmit.kaikilleLapsisolmuille($scope.tekstisisalto, 'lapset', function(osa, depth) {
      suunnitelma.push({
        $osa: osa,
        label: osa.perusteenOsa ? osa.perusteenOsa.nimi : '',
        depth: depth,
      });
    });
    if ($scope.tekstisisalto && $scope.tekstisisalto.lapset && !_.isEmpty($scope.tekstisisalto.lapset)) {
      valitseAktiivinenTekstisisalto($scope.tekstisisalto.lapset[0]._perusteenOsa);
      _.first(suunnitelma).$selected = true;
    }
    return suunnitelma;
  }

  function paivitaTavoitteet() {
    if ($scope.valittuOppiaine.vlks) {
      var filteritTyhjat = _.all($scope.filterOsaamiset, function(v) { return v; });
      _.each($scope.valittuOppiaine.vlks.tavoitteet, function(tavoite) {
        if (filteritTyhjat || _.isEmpty(tavoite.laajattavoitteet)) {
          tavoite.$rejected = false;
        }
        else {
          tavoite.$rejected = _.all(tavoite.laajattavoitteet, function(lt) {
            return $scope.filterOsaamiset[lt];
          });
        }
      });
    }
    installClickHandler();
  }

  function paivitaSivunavi() {
    var navi = {};
    navi.oppiaineet = [];
    _.forEach(_.values(oppiaineet), function(oa) {
      navi.oppiaineet.push(oa);
    });

    _.each($scope.navi.sections[2].model.sections, function(v) {
      if (navi[v.id]) {
        v.items = navi[v.id];
      }
    });
  }

  $scope.navi = {
    header: 'perusteiden-sisalto',
    showOne: true,
    sections: [{
        id: 'suunnitelma',
        include: 'views/partials/perusopetustekstisisalto.html',
        items: rakennaTekstisisalto(),
        title: 'yhteiset-osuudet',
        update: function(item, section) {
          valitseAktiivinenTekstisisalto(item.$osa._perusteenOsa);
          _.each(section.items, function(osa) { osa.$selected = false; });
          item.$selected = true;
        }
      }, {
        title: 'vuosiluokkakokonaisuudet',
        id: 'vlk',
        items: rakennaVuosiluokkakokonaisuuksienSisalto(),
        include: 'views/partials/perusopetuksenvuosiluokkakokonaisuus.html',
        update: function(item, section) {
          _.each(section.items, function(osa) { osa.$selected = false; });
          item.$selected = true;
          $scope.valittuVuosiluokkakokonaisuus = item.$vkl;
          $scope.activeSection = 'vlk';
        },
        selectOppiaine: selectOppiaine,
        isCurrentOppiaine: isCurrentOppiaine,
        activeSection: activeSection,
        currentSection: function() { return $scope.currentSection; },
        $oppiaineOrder: Utils.oppiaineSort
      }, {
        title: 'opetuksen-sisallot',
        id: 'sisalto',
        include: 'views/partials/navifilters.html',
        model: {
          sections: [{
            $condensed: true,
            items: _.map($scope.vuosiluokkakokonaisuudet, function(kokonaisuus) {
              return { label: kokonaisuus.nimi, value: kokonaisuus.id, $selected: true };
            }),
            update: paivitaSivunavi
          }, {
            title: 'oppiaineet',
            id: 'oppiaineet',
            items: [],
            $open: true,
            include: 'views/partials/perusopetusoppiaineetsivunavi.html',
            selectOppiaine: selectOppiaine,
            isCurrentOppiaine: isCurrentOppiaine,
            activeSection: activeSection,
            $oppiaineOrder: Utils.oppiaineSort
          }, {
            id: 'sisallot',
            title: 'oppiaineen-sisallot',
            $all: true,
            items: _.map(['tehtava', 'ohjaus', 'tyotavat', 'tavoitteet'], function(item, index) {
              return { label: 'perusopetus-' + item, value: item, depth: 0, $selected: true, order: index };
            }),
            update: function(item) {
              $scope.filterSisalto[item.value] = !item.$selected;
            }
          }, {
            id: 'osaamiset',
            title: 'tavoitteiden-osaamiset',
            $all: true,
            items: _.map($scope.osaamiset, function(item) {
              return { label: item.nimi, value: item.id, depth: 0, $selected: true };
            }),
            update: function(item) {
              $scope.filterOsaamiset[item.value] = !item.$selected;
              paivitaTavoitteet();
            }
          }]
        }
      }
    ]
  };

  paivitaSivunavi();
});
