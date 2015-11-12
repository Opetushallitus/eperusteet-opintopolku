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
  .controller('opsYksinkertainenController', function ($q, $scope, $state, TermistoService, otsikot, epMenuBuilder, $timeout, $rootScope, epPerusopetusStateService, opsId, Kieli, epEsitysSettings, MurupolkuData, $stateParams) {
    $scope.isNaviVisible = _.constant(true);
    $scope.otsikot = otsikot;

    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };

    function getRootState(current) {
      return current.replace(/\.(esiopetus|varhaiskasvatus|lisaopetus)(.*)/, '.$1');
    }

    TermistoService.setPeruste($stateParams.perusteId);

    //MurupolkuData.set({perusteId: perusteId, perusteNimi: peruste.nimi});

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
      epPerusopetusStateService.setState($scope.navi);
    });
    $scope.navi = {
      header: 'opetussuunnitelma',
      sections: [
        {
          id: 'tekstikappale',
          $open: true,
          items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot)
        }
      ]
    };

    var currentRootState = getRootState($state.current.name);

    _.each($scope.navi.sections[0].items, function (item) {
      if (item.$osa) {
        item.href = $state.href(currentRootState + '.tekstikappale', {
          perusteId: $stateParams.perusteId,
          tekstikappaleId: item.$osa.id
        });
      }
    });

    $scope.navi.sections[0].items.unshift({depth: 0, label: 'opetussuunnitelman-tiedot', link: [currentRootState + '.tiedot']});
  })
  .controller('opsYksinkertainenTiedotController', function($scope, ops) {
    console.log("OPS", ops);
    $scope.ops = ops;
  })
  .controller('opsTekstikappaleController', function (
    $scope,
    $state,
    $stateParams,
    tekstikappale,
    MurupolkuData,
    epParentFinder,
    epTekstikappaleChildResolver) {
    console.log(tekstikappale);
    $scope.tekstikappale = tekstikappale.tekstiKappale;
    //$scope.lapset = epTekstikappaleChildResolver.getSisalto();
  });
