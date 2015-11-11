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
  .controller('opsEsiopetusController', function ($q, $scope, $state, TermistoService, perusteenOsat, epMenuBuilder, $timeout, $rootScope, epPerusopetusStateService, perusteId, Kieli, epEsitysSettings, MurupolkuData, $stateParams) {
    $scope.isNaviVisible = _.constant(true);
    $scope.perusteenOsat = perusteenOsat;
    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };

    TermistoService.setPeruste($stateParams.perusteId);

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
      header: 'ops-sisalto',
      sections: [
        {
          id: 'tekstikappale',
          $open: true,
          items: epMenuBuilder.rakennaTekstisisalto($scope.perusteenOsat)
        }
      ]
    };
    var currentRootState = $state.current.name;
    _.each($scope.navi.sections[0].items, function (item) {
      if (item.$osa) {
        item.href = $state.href(currentRootState + '.tekstikappale', {
          perusteId: $stateParams.perusteId,
          tekstikappaleId: item.$osa.id
        });
      }
    });
  })
  .controller('opsTekstiKappaleController', function ($scope, $state, $stateParams, PerusteenOsat, tekstikappale, lapset, MurupolkuData, epParentFinder, epTekstikappaleChildResolver) {
    $scope.tekstikappale = tekstikappale;
    $scope.lapset = epTekstikappaleChildResolver.getSisalto();
    console.log($scope.tekstikappale);
  });
