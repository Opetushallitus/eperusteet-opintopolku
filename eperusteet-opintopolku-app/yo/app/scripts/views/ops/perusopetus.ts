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
    $scope.oppiaineet = _.map($scope.ops.oppiaineet, 'oppiaine');
    $scope.vlk = opsUtils.sortVlk($scope.ops.vuosiluokkakokonaisuudet);

    console.log("OPPI", $scope.oppiaineet, "VLK", $scope.vlk);

    $timeout(function () {
      if ($state.current.name === 'root.ops.perus') {
          $state.go('.tiedot', {location: 'replace'});
        }
    });

    MurupolkuData.set({opsId: $scope.ops.id, opsNimi: $scope.ops.nimi});

    //TermistoService.setPeruste(peruste);

    console.log(opsUtils.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlk, $scope.oppiaineet));

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

    $scope.$on('$stateChangeSuccess', function () {
      opsStateService.setState($scope.navi);
    });

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

   /* $scope.onSectionChange = function (section) {
      if (section.id === 'sisalto' && !section.$open) {
        $scope.chooseFirstOppiaine(section);
      }
    };*/

    $scope.navi = {
      header: 'opetussuunnitelma',
      showOne: true,
      sections: [
        {
          id: 'tekstikappale',
          include: 'views/ops/opsTekstisisalto.html',
          items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
          naviClasses: $scope.naviClasses,
          title: 'yhteiset-osuudet'
        }, {
          title: 'vuosiluokkakokonaisuudet',
          id: 'vlkoppiaine',
          items: opsUtils.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlk, $scope.oppiaineet),
          naviClasses: $scope.naviClasses,
          include: 'views/ops/opsVlk.html',
          state: $scope.state
        }
      ]
    };

    $scope.navi.sections[0].items.unshift({
      depth: 0,
      label: 'opetussuunnitelman-tiedot',
      link: ['root.ops.perus.tiedot']
    });

    //installClickHandler();


  })

  .controller('OpsPerusopetusTekstikappaleController', function(
    $scope,
    tekstikappale,
    MurupolkuData,
    epTekstikappaleChildResolver) {

    $scope.tekstikappale = tekstikappale.tekstiKappale;

    $scope.$on('$stateChangeSuccess', function () {
      setMurupolku();
    });

    function setMurupolku() {
      MurupolkuData.set({osanId: $scope.tekstikappale.id, tekstikappaleNimi: $scope.tekstikappale.nimi});
      //$scope.lapset = epTekstikappaleChildResolver.getSisalto();

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
      if ($state.current.name === 'root.ops.perus.vuosiluokka') {
        var index = null;
        var selectedIndex = _.reduce($scope.navi.sections[1].items, function (result, item, index) {
          return result += item.$selected === true ? index : '';
        }, '');
        if (selectedIndex) {
          $state.go('root.ops.perus.vuosiluokka.oppiaine', {oppiaineId: $scope.navi.sections[1].items[parseInt(selectedIndex) + 1].$oppiaine.id}, {location: 'replace'});
        }
      }
    });

    MurupolkuData.set({vuosiId: vuosi, vuosi: 'Vuosiluokka' + " " + vuosi});
  })

  .controller('OpsVlkController', function($scope, vlkId, vlkt, MurupolkuData) {
     $scope.vlkTeksti = vlkt;

     MurupolkuData.set({vlkId: vlkId, vlkNimi: $scope.vlkTeksti.nimi});
  })

  .controller('OpsVlkOppiaineController', function($scope,  $timeout, $state, oppiaineId, oppiaine, MurupolkuData) {
     $scope.oppiaine = oppiaine;

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

