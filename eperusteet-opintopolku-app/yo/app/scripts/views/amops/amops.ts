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
    $timeout,
    ops,
    otsikot,
    MurupolkuData,
    opsMenuBuilders,
    AmopsStateService) {

    $scope.isNaviVisible = _.constant(true);
    $scope.ops = ops;
    console.log(ops);
    $scope.otsikot = otsikot;
    $rootScope.$on('$locationChangeSuccess', function () {
      AmopsStateService.setState($scope.navi);
    });
    //TODO TermistoService.setResource(ops, "AMOPS");

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
        items: opsMenuBuilders.rakennaAmopsTekstikappaleMenu(_.cloneDeep($scope.otsikot), ops._teksti),
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

    MurupolkuData.set({opsId: $scope.ops.id, opsNimi: $scope.ops.nimi});

  })

  .controller('AmopsTekstikappaleController', function(
    $scope,
    $rootScope,
    $location,
    $timeout,
    tekstikappale,
    Kieli,
    MurupolkuData) {
    $scope.tekstikappale = tekstikappale.tekstiKappale;
    $scope.lapset = tekstikappale.lapset;

    const getName = (lapset, id) => {
      return _.filter(lapset, (lapsi) => lapsi.id + '' === id + '')[0];
    };

    $timeout(() => {
      var hash = $location.hash();
      var lapsi = hash ? getName($scope.lapset, hash) : false;
      if (lapsi) {
        MurupolkuData.set({
          tekstikappaleId: lapsi.id,
          tekstikappaleNimi: lapsi.tekstiKappale.nimi
        });
      }
      else {
        MurupolkuData.set({tekstikappaleId: $scope.tekstikappale.id, tekstikappaleNimi: $scope.tekstikappale.nimi});
      }
    },50);

    $scope.links = {
      prev: null,
      next: null
    };

    const checkPrevNext = () => {
      var items = $scope.navi.sections[0].items;
      var me = _.findIndex(items, (item) => {
        return item.$id + '' === tekstikappale.id + '';
      });
      if (me === -1) {
        return;
      }
      var i = me + 1;
      var meDepth = items[me].depth;
      for (; i < items.length; ++i) {
        if (items[i].depth <= meDepth) {
          break;
        }
      }
      $scope.links.next = i < items.length ? items[i] : null;
      i = me - 1;
      for (; i >= 0; --i) {
        if (items[i].depth <= meDepth) {
          break;
        }
      }
      $scope.links.prev = i >= 0 && items[i].depth >= 0 ? items[i] : null;
    };

    $scope.$on('amops:stateSet', checkPrevNext);
    checkPrevNext();

  });


