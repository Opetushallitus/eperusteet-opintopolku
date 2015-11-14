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

    var t = opsUtils.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlk,  $scope.oppiaineet);
    console.log("menu", t);

    //MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});
    //var oppiaineet = _.zipBy(sisalto[2], 'id')

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
    console.log("TEXT", tekstikappale);
    $scope.tekstikappale = tekstikappale.tekstiKappale;
  })

  .controller('opsPerusopetusVlkController', function($scope, $stateParams, vlkTeksti, MurupolkuData) {
     $scope.teksti = vlkTeksti;
  })

  .controller('opsPerusopetusVlkoppiaineController', function($scope, tekstikappale) {
     $scope.oppiaine = "This is it";
  });

