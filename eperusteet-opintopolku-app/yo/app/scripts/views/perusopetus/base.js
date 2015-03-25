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
  $state, $stateParams, MenuBuilder, Utils, MurupolkuData,
  Oppiaineet, TermistoService, Kieli, $document, $rootScope, PerusopetusStateService) {
  $scope.isNaviVisible = _.constant(true);
  $scope.hasContent = function (obj) {
    return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
  };
  var peruste = sisalto[0];
  $scope.peruste = peruste;
  MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});
  var oppiaineet = _.zipBy(sisalto[2], 'id');
  $scope.oppiaineetMap = oppiaineet;
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

  $scope.naviClasses = function (item) {
    var classes = ['depth' + item.depth];
    if (item.$selected) {
      classes.push('tekstisisalto-active');
    }
    if (item.$header) {
      classes.push('tekstisisalto-active-header');
    }
    return classes;
  };

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

  function paivitaTavoitteet(inSisallot) {
    if ($scope.valittuOppiaine.vlks) {
      var filteritTyhjat = !inSisallot || _.all($scope.filterOsaamiset, function(v) { return v; });
      _.each($scope.valittuOppiaine.vlks.tavoitteet, function(tavoite) {
        if (filteritTyhjat || _.isEmpty(tavoite.laajattavoitteet)) {
          tavoite.$rejected = false;
        } else if (inSisallot) {
          tavoite.$rejected = _.all(tavoite.laajattavoitteet, function(lt) {
            return $scope.filterOsaamiset[lt];
          });
        }
      });
    }
    installClickHandler();
  }

  $scope.processOppiaine = function (oppiaine, vlkIds, inSisallot) {
    $scope.valittuOppiaine = {};
    $scope.valittuOppiaine.oppiaine = oppiaine;
    if (_.isEmpty(vlkIds)) {
      vlkIds = _(oppiaine.vuosiluokkakokonaisuudet).sortBy(function (item) {
        return _.first($scope.vuosiluokkakokonaisuudetMap[item._vuosiluokkaKokonaisuus].vuosiluokat);
      }).map('_vuosiluokkaKokonaisuus').value();
    }
    vlkIds = _.map(vlkIds, String);
    if (inSisallot) {
      $scope.valittuOppiaine.vuosiluokkakokonaisuudet = _.zipBy(_.filter(oppiaine.vuosiluokkakokonaisuudet, function (vlk) {
        return _.some(vlkIds, function (vlkId) {
          return '' + vlk._vuosiluokkaKokonaisuus === '' + vlkId;
        });
      }), '_vuosiluokkaKokonaisuus');
    } else {
      $scope.valittuOppiaine.vuosiluokkakokonaisuudet = _.zipBy(oppiaine.vuosiluokkakokonaisuudet, '_vuosiluokkaKokonaisuus');
    }
    var vlkId = _.contains(vlkIds, inSisallot) ? inSisallot : _.first(vlkIds);
    $scope.valittuOppiaine.vlks = $scope.valittuOppiaine.vuosiluokkakokonaisuudet[vlkId];
    if ($scope.valittuOppiaine.vlks) {
      $scope.valittuOppiaine.sisallot = $scope.sisallot[$scope.valittuOppiaine.vlks._vuosiluokkaKokonaisuus];
    }

    $scope.activeVlkId = vlkId;
    $scope.oppimaarat = MenuBuilder.filteredOppimaarat(oppiaine, vlkIds);
    paivitaTavoitteet(inSisallot);
  };

  $scope.chooseFirstOppiaine = function (section) {
    var aineet = _.find((section || $scope.navi.sections[2]).model.sections, {id: 'oppiaineet'});
    var aine = _.find(aineet.items, {depth: 0});
    if (aine) {
      var params = {perusteId: $scope.peruste.id, oppiaineId: aine.$oppiaine.id};
      $timeout(function () {
        $state.go('root.perusopetus.sisallot', params);
      });
    }
  };

  $scope.onSectionChange = function (section) {
    if (section.id === 'sisalto' && !section.$open) {
      $scope.chooseFirstOppiaine(section);
    }
  };

  $scope.$on('navifilters:set', function (event, value) {
    if (value.sisalto) {
      _.each($scope.navi.sections[2].model.sections[2].items, function (item) {
        item.$selected = _.isEmpty(value.sisalto) || _.contains(value.sisalto, item.value);
        $scope.filterSisalto[item.value] = !item.$selected;
      });
    }
    if (value.osaaminen) {
      _.each($scope.navi.sections[2].model.sections[3].items, function (item) {
        item.$selected = _.isEmpty(value.osaaminen) || _.contains(value.osaaminen, item.value);
        $scope.filterOsaamiset[item.value] = !item.$selected;
      });
      paivitaTavoitteet();
    }
    if (value.vlk) {
      _.each($scope.navi.sections[2].model.sections[0].items, function (vlk) {
        vlk.$selected = _.isEmpty(value.vlk) || _.contains(value.vlk, vlk.value);
      });
      MenuBuilder.rakennaSisallotOppiaineet(oppiaineet, $scope.navi.sections[2].model.sections, selectedFilters(0));
      PerusopetusStateService.setState($scope.navi);
    }
  });

  function selectedFilters(sectionId) {
    return _($scope.navi.sections[2].model.sections[sectionId].items).filter('$selected').map('value').value();
  }

  function updateSelection(sectionId) {
    var MAP = {
      0: 'vlk',
      2: 'sisalto',
      3: 'osaaminen'
    };
    var selected = selectedFilters(sectionId);
    var params = {};
    params[MAP[sectionId]] = selected;
    $state.go($state.current.name, _.extend(params, $stateParams));
  }

  $scope.navi = {
    header: 'perusteen-sisalto',
    showOne: true,
    sections: [{
        id: 'suunnitelma',
        include: 'views/perusopetus/tekstisisalto.html',
        items: MenuBuilder.rakennaTekstisisalto($scope.tekstisisalto),
        naviClasses: $scope.naviClasses,
        title: 'yhteiset-osuudet'
      }, {
        title: 'vuosiluokkakokonaisuudet',
        id: 'vlk',
        items: MenuBuilder.rakennaVuosiluokkakokonaisuuksienSisalto($scope.vuosiluokkakokonaisuudet, oppiaineet),
        naviClasses: $scope.naviClasses,
        include: 'views/perusopetus/vlk.html',
        state: $scope.state,
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
            update: _.partial(updateSelection, 0)
          }, {
            title: 'oppiaineet',
            id: 'oppiaineet',
            items: [],
            naviClasses: $scope.naviClasses,
            $open: true,
            include: 'views/perusopetus/oppiaineetsivunavi.html',
          }, {
            id: 'sisallot',
            title: 'oppiaineen-sisallot',
            $all: true,
            $open: true,
            items: _.map(['tehtava', 'tyotavat', 'ohjaus', 'arviointi', 'sisaltoalueet', 'tavoitteet'], function(item, index) {
              return { label: 'perusopetus-' + item, value: item, depth: 0, $selected: true, order: index };
            }),
            update: _.partial(updateSelection, 2)
          }, {
            id: 'osaamiset',
            title: 'tavoitteiden-osaamiset',
            $all: true,
            $open: true,
            items: _.map($scope.osaamiset, function(item) {
              return { label: item.nimi, value: item.id, depth: 0, $selected: true };
            }),
            update: _.partial(updateSelection, 3)
          }]
        }
      }
    ]
  };

  MenuBuilder.rakennaSisallotOppiaineet(oppiaineet, $scope.navi.sections[2].model.sections, selectedFilters(0));
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
