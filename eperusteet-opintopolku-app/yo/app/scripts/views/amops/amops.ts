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
  .controller('AmopsController', function(
    $scope, ops, otsikot, opsMenuBuilders, epPerusopetusStateService) {
    $scope.ops = ops;
    $scope.otsikot = otsikot;
    //TermistoService.setResource(ops, "OPS");
    //MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});
    /*function clickHandler(event) {
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
    });*/
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
    $scope.navi = {
      header: 'perusteen-sisalto',
      sections: [
        {
          id: 'sisalto',
          $open: true,
          items: opsMenuBuilders.rakennaAmopsTekstikappaleMenu(_.cloneDeep($scope.otsikot))
        }
      ]
    };

    $scope.$on('$stateChangeSuccess', function () {
      epPerusopetusStateService.setState($scope.navi);
    });

    const currentRootState = '';

    //$scope.navi.sections[0].items.unshift({depth: 0, label: 'perusteen-tiedot', link: [currentRootState + '.tiedot']});

  });

/*
    _.each($scope.navi.sections[0].items, function (item) {
      if (item.$osa) {
        item.href = $state.href(currentRootState + '.tekstikappale', {
          perusteId: $scope.peruste.id,
          tekstikappaleId: item.$osa.id
        });
      }
    });

    installClickHandler();

    $scope.$on('$stateChangeSuccess', function () {
      if ($state.current.name === currentRootState) {
        $state.go('.tiedot', {perusteId: $scope.peruste.id}, {location: 'replace'});
      }
    });*/
