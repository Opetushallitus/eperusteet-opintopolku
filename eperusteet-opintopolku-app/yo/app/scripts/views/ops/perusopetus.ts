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
  .controller('opsPerusopetusController', function(
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
    $scope.perusOps = perusOps;
    $scope.oppiaineet = _.map($scope.perusOps.oppiaineet, 'oppiaine');
    $scope.vlk = opsUtils.sortVlk($scope.perusOps.vuosiluokkakokonaisuudet);

    $timeout(function () {
      if ($state.current.name === 'root.ops') {
        var first = _($scope.navi.sections[0].items).filter(function (item) {
          return item.depth === 0;
        }).first();
        if (first) {
          $state.go('.tekstikappale', {tekstikappaleId: $scope.otsikot.lapset[0].id}, {location: 'replace'});
        }
      }
    });

    //MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});

    //TermistoService.setPeruste(peruste);

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

   /* function clickHandler(event) {
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

    $scope.onSectionChange = function (section) {
      if (section.id === 'sisalto' && !section.$open) {
        $scope.chooseFirstOppiaine(section);
      }
    };
*/

    $scope.navi = {
      header: 'opetussuunnitelma',
      showOne: true,
      sections: [
        {
          id: 'tekstikappale',
          include: 'eperusteet-esitys/views/tekstisisalto.html',
          items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
          naviClasses: $scope.naviClasses,
          title: 'yhteiset-osuudet'
        }, {
          title: 'vuosiluokkakokonaisuudet',
          id: 'vlkoppiaine',
          items: opsUtils.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlk, $scope.oppiaineet),
          naviClasses: $scope.naviClasses,
          include: 'eperusteet-esitys/views/vlk.html',
          state: $scope.state
        }
      ]
    };
    $scope.navi.sections[0].items.unshift({
      depth: 0,
      label: 'opetussuunnitelma-tiedot',
      link: ['root.ops.perus.tiedot']
    });

    //installClickHandler();


  })

  .controller('opsPerusopetusTekstikappaleController', function($scope, tekstikappale) {
    $scope.tekstikappale = tekstikappale.tekstiKappale;
  })

  .controller('opsVuosiluokkaController', function($scope, $state, $timeout, vuosi){
    $timeout(function () {
      if ($state.current.name === 'root.ops.perus.vuosiluokka') {
        var index = null;
        var selectedIndex = _.reduce($scope.navi.sections[1].items, function (result, item, index) {
          console.log(result, item, index);
          return result += item.$selected === true ? index : '';
        }, '');
        if (selectedIndex) {
          $state.go('root.ops.perus.vuosiluokka.oppiaine', {oppiaineId: $scope.navi.sections[1].items[parseInt(selectedIndex) + 1].$oppiaine.id}, {location: 'replace'});
        }
      }
    });
  })

  .controller('opsVlkController', function($scope, vlkId, vlkt) {
     console.log(vlkId);
     $scope.vlkTeksti = vlkt;
  })

  .controller('opsVlkOppiaineController', function($scope, oppiaineId, oppiaine) {
     console.log("OP", oppiaine, oppiaineId);
     $scope.oppiaine = oppiaine;
  });

