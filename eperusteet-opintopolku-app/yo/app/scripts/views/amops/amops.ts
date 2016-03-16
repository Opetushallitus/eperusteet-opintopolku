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
    $scope,
    $state,
    $stateParams,
    $rootScope,
    ops,
    otsikot,
    opsMenuBuilders,
    AmopsStateService) {

    $scope.isNaviVisible = _.constant(true);
    $scope.ops = ops;
    $scope.otsikot = otsikot;
    $rootScope.$on('$locationChangeSuccess', function () {
      AmopsStateService.setState($scope.navi);
    });
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


     //installClickHandler();

     $scope.$on('$stateChangeSuccess', function () {
        if ($state.current.name === 'root.amops') {
        $state.go('.tiedot', {opsId: $scope.ops.id}, {location: 'replace'});
       }
     });

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
      header: 'amops',
      showOne: true,
      sections: [{
        title: 'amops-sisallöt',
        id: 'sisalto',
        include: 'views/amops/sivunavi.html',
        items: opsMenuBuilders.rakennaAmopsTekstikappaleMenu(_.cloneDeep($scope.otsikot)),
        naviClasses: $scope.naviClasses
      }]
    };

    $scope.navi.sections[0].items.unshift({
      depth: 0,
      label: 'opetussuunnitelman-tiedot',
      url: $state.href('root.amops.tiedot', {opsId: $stateParams.opsId})
    });

    $scope.$on('$stateChangeSuccess', function () {
      AmopsStateService.setState($scope.navi);
    });

  })

  .controller('AmopsTekstikappaleController', function(
    $scope,
    $rootScope,
    tekstikappale,
    MurupolkuData) {
    $scope.tekstikappale = tekstikappale.tekstiKappale;
    $scope.lapset = tekstikappale.lapset;

   /* $scope.$on('$stateChangeSuccess', function () {
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
    }*/

  })


