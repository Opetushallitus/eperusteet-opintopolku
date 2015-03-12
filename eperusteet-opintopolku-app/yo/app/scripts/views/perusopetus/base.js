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
.service('PerusopetusStateService', function ($state, $stateParams, SivunaviUtils, $rootScope) {
  var state = {};
  this.setState = function (navi) {
    this.state = {};
    _.each(navi.sections, function (section) {
      section.$open = false;
      _.each(section.items, function (item) {
        item.$selected = false;
        item.$header = false;
      });
    });
    var section = null;
    var selected = null;

    function processSection(index, cb) {
      section = navi.sections[index];
      if (index === 1) {
        state.vlk = true;
      }
      section.$open = true;
      _.each(section.items, function (item, index) {
        cb(item, index);
        item.$hidden = item.depth > 0;
      });
    }

    if (_.endsWith($state.current.name, 'tekstikappale')) {
      processSection(0, function (item) {
        if (item.$osa) {
          item.$selected = '' + $stateParams.tekstikappaleId === '' + item.$osa.id;
          item.$hidden = item.depth > 0;
          if (item.$selected) {
            selected = item;
          }
        }
      });
    } else if (_.endsWith($state.current.name, 'vuosiluokkakokonaisuus')) {
      processSection(1, function (item) {
        if (item.$vkl) {
          item.$selected = '' + $stateParams.vlkId === '' + item.$vkl.id;
        }
        if (item.$selected) {
          selected = item;
        }
      });
    } else if (_.endsWith($state.current.name, 'vlkoppiaine')) {
      var parentVlkId = null;
      processSection(1, function (item) {
        if (item.$vkl) {
          item.$header = '' + $stateParams.vlkId === '' + item.$vkl.id;
          parentVlkId = item.$vkl.id;
        }
        if (item.$oppiaine) {
          item.$selected = '' + $stateParams.oppiaineId === '' + item.$oppiaine.id &&
            $stateParams.vlkId === '' + parentVlkId;
        }
        if (item.$selected) {
          selected = item;
        }
      });
    }
    if (selected && section) {
      SivunaviUtils.unCollapse(section.items, selected);
      SivunaviUtils.traverse(section.items, 0);
      $rootScope.$broadcast('perusopetus:stateSet');
    }
  };
  this.getState = function () {
    return state;
  };
})

.controller('PerusopetusController', function($q, $scope, $timeout, sisalto, PerusteenOsat,
  OppiaineenVuosiluokkakokonaisuudet, Utils, $state,
  Algoritmit, Notifikaatiot, Oppiaineet, TermistoService, Kieli, $document, $rootScope, PerusopetusStateService) {
  $scope.isNaviVisible = _.constant(true);
  $scope.hasContent = function (obj) {
    return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
  };
  var peruste = sisalto[0];
  $scope.peruste = peruste;
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
  $scope.state = PerusopetusStateService.getState();

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

  $scope.$on('$stateChangeSuccess', function () {
    PerusopetusStateService.setState($scope.navi);
  });

  $scope.filtterit = {
    moodi: 'sivutus',
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

      $scope.valitseOppiaineenVuosiluokka(valittavaVuosiluokka, true);
    }, Notifikaatiot.serverCb);
  }

  function buildOppiaineItem(arr, oppiaine, vlk, depth) {
    if (!oppiaine.nimi[Kieli.getSisaltokieli()]) {
      return;
    }
    arr.push({
      depth: depth,
      $hidden: true,
      $oppiaine: oppiaine,
      label: oppiaine.nimi,
      url: $state.href('root.perusopetus.vlkoppiaine', {vlkId: vlk.id, oppiaineId: oppiaine.id})
    });
  }

  $scope.filteredOppimaarat = function (oppiaine, vlkId) {
    var ret = [];
    if (oppiaine.koosteinen) {
      ret = _(oppiaine.oppimaarat).filter(function (oppimaara) {
        return oppimaara.nimi[Kieli.getSisaltokieli()] &&
          _.some(oppimaara.vuosiluokkakokonaisuudet, function (omVlk) {
          return '' + omVlk._vuosiluokkaKokonaisuus === '' + vlkId;
        });
      }).sortBy(Utils.oppiaineSort).value();
    }
    return ret;
  };

  function rakennaVuosiluokkakokonaisuuksienSisalto() {
    var arr = [];
    _.each($scope.vuosiluokkakokonaisuudet, function (vlk) {
      arr.push({
        $vkl: vlk,
        label: vlk.nimi,
        depth: 0,
        url: $state.href('root.perusopetus.vuosiluokkakokonaisuus', {vlkId: vlk.id})
      });
      var oaFiltered = _(oppiaineet).filter(function(oa) {
        var oppiaineHasVlk = _.some(oa.vuosiluokkakokonaisuudet, function(oavkl) {
          return _.parseInt(oavkl._vuosiluokkaKokonaisuus) === vlk.id;
        });
        var oppimaaraVlkIds = _(oa.oppimaarat).map(function (oppimaara) {
          return _.map(oppimaara.vuosiluokkakokonaisuudet, '_vuosiluokkaKokonaisuus');
        }).flatten().uniq().value();
        return oppiaineHasVlk || _.contains(oppimaaraVlkIds, '' + vlk.id);
      }).value();
      _.each(oaFiltered, function (oa) {
        buildOppiaineItem(arr, oa, vlk, 1);
        _.each($scope.filteredOppimaarat(oa, vlk.id), function (oppimaara) {
          buildOppiaineItem(arr, oppimaara, vlk, 2);
        });
      });

    });
    return arr;
  }

  function rakennaTekstisisalto() {
    var suunnitelma = [];
    Algoritmit.kaikilleLapsisolmuille($scope.tekstisisalto, 'lapset', function(osa, depth) {
      suunnitelma.push({
        $osa: osa,
        label: osa.perusteenOsa ? osa.perusteenOsa.nimi : '',
        depth: depth,
        $hidden: depth > 0
      });
    });
    var levels = {};
    _.each(suunnitelma, function (item, index) {
      levels[item.depth] = index;
      item.$parent = levels[item.depth - 1] || null;
    });
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
    header: 'perusteen-sisalto',
    showOne: true,
    sections: [{
        id: 'suunnitelma',
        include: 'views/perusopetus/tekstisisalto.html',
        items: rakennaTekstisisalto(),
        title: 'yhteiset-osuudet'
      }, {
        title: 'vuosiluokkakokonaisuudet',
        id: 'vlk',
        items: rakennaVuosiluokkakokonaisuuksienSisalto(),
        include: 'views/perusopetus/vlk.html',
        selectOppiaine: selectOppiaine,
        isCurrentOppiaine: isCurrentOppiaine,
        //activeSection: activeSection,
        state: $scope.state,
        //currentSection: function() { return $scope.currentSection; },
        $oppiaineOrder: Utils.oppiaineSort
      }, {
        title: 'opetuksen-sisallot',
        id: 'sisalto',
        include: 'views/perusopetus/navifilters.html',
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
            include: 'views/perusopetus/oppiaineetsivunavi.html',
            selectOppiaine: selectOppiaine,
            isCurrentOppiaine: isCurrentOppiaine,
            //activeSection: activeSection,
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
  installClickHandler();

  $timeout(function () {
    if ($state.current.name === 'root.perusopetus') {
      var first = _($scope.navi.sections[0].items).filter(function (item) {
        return item.depth === 0;
      }).first();
      if (first) {
        $state.go('.tekstikappale', {tekstikappaleId: first.$osa.id, perusteId: $scope.peruste.id});
      }
    }
  });
});
