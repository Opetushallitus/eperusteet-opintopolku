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
  .controller('OpsPerusopetusController', function(
    $q,
    $scope,
    $timeout,
    $state,
    $stateParams,
    epMenuBuilder,
    Utils,
    MurupolkuData,
    TermistoService,
    Kieli,
    $document,
    $rootScope,
    opsStateService,
    epEsitysSettings,
    opsUtils,
    otsikot,
    perusOps) {

    $scope.isNaviVisible = _.constant(true);
    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };
    $scope.otsikot = otsikot;
    $scope.ops = perusOps;
    $scope.vlkMap = _.map($scope.ops.vuosiluokkakokonaisuudet, function(v){
      return {
        nimi: v.vuosiluokkakokonaisuus.nimi,
        tunniste: v.vuosiluokkakokonaisuus._tunniste
      };
    });

    $scope.oppiaineet = _.map($scope.ops.oppiaineet, 'oppiaine');
    $scope.vlkt = opsUtils.sortVlk($scope.ops.vuosiluokkakokonaisuudet);

    $scope.$on('$stateChangeSuccess', function () {
      opsStateService.setState($scope.navi);
      if ($state.current.name === 'root.ops.perusopetus') {
        $state.go('.tiedot', {location: 'replace'});
      }
      if (_.endsWith(_.keys($state.params), 'vuosi')){
        var vuosi = $state.params.vuosi;
        moveToOppiaine(vuosi);
      }
    });

    MurupolkuData.set({opsId: $scope.ops.id, opsNimi: $scope.ops.nimi});

    TermistoService.setPeruste(perusOps, true);

    $scope.naviClasses = function (item) {
      var classes = ['depth' + item.depth];
      if (item.$selected) {
        classes.push('tekstisisalto-active');
      }
      if (item.$header) {
        classes.push('tekstisisalto-active-header');
      }
      if (!item.$selected && item.$tyyppi && (item.$tyyppi !== 'yhteinen')) {
        classes.push('perusopetus-paikallinen')
      }
      if (item.$selected && item.$tyyppi && (item.$tyyppi !== 'yhteinen')) {
        classes.push('perusopetus-paikallinen-active')
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

    function moveToOppiaine(vuosi) {
      var vlk = 'vuosiluokka_' + vuosi;
      var firstOppiaine = _.find($scope.navi.sections[1].items, {$parent_vuosi: vlk});
      return firstOppiaine ? $state.go('root.ops.perusopetus.vuosiluokka.oppiaine',
        {opsId: $state.params.opsId, oppiaineId: firstOppiaine.$oppiaine.id}) : null;
    }

    $scope.onSectionChange = function (section) {
      if (section.id === 'vlkoppiaine' && !section.$open) {
        moveToOppiaine(section);
      }
    };

    $scope.navi = {
      header: 'opetussuunnitelma',
      showOne: true,
      sections: [
        {
          id: 'tekstikappale',
          include: 'views/ops/opstekstisisalto.html',
          items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
          naviClasses: $scope.naviClasses,
          title: 'yhteiset-osuudet'
        }, {
          title: 'vuosiluokkakokonaisuudet',
          id: 'vlkoppiaine',
          items: opsUtils.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlkt, $scope.oppiaineet),
          naviClasses: $scope.naviClasses,
          include: 'views/ops/opsvlk.html',
          state: $scope.state
        }
      ]
    };

    $scope.navi.sections[0].items.unshift({
      depth: 0,
      label: 'opetussuunnitelman-tiedot',
      link: ['root.ops.perusopetus.tiedot']
    });

    installClickHandler();

  })

  .controller('OpsPerusopetusTekstikappaleController', function(
    $scope,
    tekstikappaleWithChildren,
    MurupolkuData) {

    $scope.tekstikappale = tekstikappaleWithChildren.tekstiKappale;
    $scope.lapset = tekstikappaleWithChildren.lapset;

    $scope.$on('$stateChangeSuccess', function () {
      setMurupolku();
    });

    function setMurupolku() {
      MurupolkuData.set({osanId: $scope.tekstikappale.id, tekstikappaleNimi: $scope.tekstikappale.nimi});

      $scope.sectionItem = _.reduce($scope.navi.sections[0].items, function (result, item, index) {
        if (item.$selected === true) {
          item.index = index;
          result = item;
        }
        return result;
      }, '');

      function findParent(set, child) {
        return set[child.$parent].$osa.tekstiKappale;
      }

      if ($scope.sectionItem && $scope.sectionItem.depth > 1) {
        MurupolkuData.set('parents', [findParent($scope.navi.sections[0].items, $scope.sectionItem)]);
      }
    }
  })

  .controller('OpsPerusopetusTiedotController', function($scope) {
  })

  .controller('OpsVuosiluokkaController', function($scope, $state, $timeout, Kieli, vuosi, MurupolkuData){
    $timeout(function () {
      if ($state.current.name === 'root.ops.perusopetus.vuosiluokka') {
        var index = null;
        var selectedIndex = _.reduce($scope.navi.sections[1].items, function (result, item, index) {
          return result += item.$selected === true ? index : '';
        }, '');
        if (selectedIndex) {
          $state.go('root.ops.perusopetus.vuosiluokka.oppiaine', {oppiaineId: $scope.navi.sections[1].items[parseInt(selectedIndex) + 1].$oppiaine.id}, {location: 'replace'});
        }
      }
    });

    MurupolkuData.set({vuosiId: vuosi, vuosi: 'Vuosiluokka' + " " + vuosi});
  })

  .controller('OpsVlkController', function(
    $scope,
    vlkId,
    vlkt,
    baseLaajaalaiset,
    MurupolkuData,
    Utils,
    vlkPeruste,
    VuosiluokkakokonaisuusMapper) {

    $scope.vlk = vlkt;
    $scope.peruste = vlkPeruste;
    //$scope.osaamiset = _.zipBy(baseLaajaalaiset, 'tunniste');

    var laajaalaisetosaamiset = _.indexBy(baseLaajaalaiset, 'tunniste');
    var laajaalaisetOrder = _(baseLaajaalaiset).sortBy(Utils.sort).map('tunniste').value();

    $scope.orderFn = function (tunniste) {
      return laajaalaisetOrder.indexOf(tunniste);
    };

    VuosiluokkakokonaisuusMapper.init($scope, laajaalaisetosaamiset, vlkPeruste);

    MurupolkuData.set({vlkId: vlkId, vlkNimi: $scope.vlk.nimi});

  })


.controller('OpsVlkOppiaineController', function($scope,  $timeout, $state, oppiaineId, oppiaine, MurupolkuData) {
    $scope.oppiaine = oppiaine;

    var currentVlk = _($scope.vlkMap)
      .filter(function(vlk){
        var vuodet = vlk.nimi.fi.replace(/\D/g, '').split('') || vlk.nimi.sv.replace(/\D/g, '').split('');
        vuodet = _.map(vuodet, function(v) { return parseInt(v); });
        return parseInt($state.params.vuosi) >= vuodet[0] && parseInt($state.params.vuosi) <= vuodet[1]
      })
      .map(function(v){
        return v.tunniste
      })
      .value()
      .pop();

    $scope.valittuVlk = _.filter(oppiaine.vuosiluokkakokonaisuudet, function(vlk){
      return vlk._vuosiluokkakokonaisuus == currentVlk;
    }).pop();

    $scope.$on('$stateChangeSuccess', function () {
      setMurupolku();
    });

    function setMurupolku() {

      $scope.item = _.reduce($scope.navi.sections[1].items, function (result, item, index) {
        if (item.$selected === true) {
          item.index = index;
          result = item;
        }
        return result;
      }, '');

      function findParents(set, index) {
        var slicedSet = _.take(set, parseInt(index));
        var found = _.findLast(slicedSet, function (item) {
          return item.depth === 2;
        });
        return found.$oppiaine;
      }

      var murupolkuParams = {};
      if ($scope.item && $scope.item.depth === 2) {
        murupolkuParams = {
          parents: null,
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi
        };
      }
      if ($scope.item.depth === 3) {
        murupolkuParams = {
          parents: [findParents($scope.navi.sections[1].items, $scope.item.index)],
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi
        };
      }

      MurupolkuData.set(murupolkuParams);
    }

  });

