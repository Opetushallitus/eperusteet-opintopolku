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
.controller('EsiopetusController', function($q, $scope, $timeout, sisalto, PerusteenOsat,
  $state, $stateParams, MenuBuilder, Utils, MurupolkuData,
  Oppiaineet, TermistoService, Kieli, $document, $rootScope, PerusopetusStateService) {
  var currentRootState = _.take($state.current.name.split('.'), 2).join('.');
  $scope.isNaviVisible = _.constant(true);
  $scope.hasContent = function (obj) {
    return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
  };
  var peruste = sisalto[0];
  $scope.peruste = peruste;
  MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});
  $scope.sisallot = _.zipBy(sisalto[1], 'id');
  $scope.tekstisisalto = sisalto[1];
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


  $scope.navi = {
    header: 'perusteen-sisalto',
    sections: [
      {
        id: 'sisalto',
        items: MenuBuilder.rakennaTekstisisalto($scope.tekstisisalto)
      }
    ]
  };
  _.each($scope.navi.sections[0].items, function (item) {
    item.href = $state.href(currentRootState + '.tekstikappale', {tekstikappaleId: item.$osa.id});
  });

  installClickHandler();

  $timeout(function () {
    if ($state.current.name === currentRootState) {
      var first = _($scope.navi.sections[0].items).filter(function (item) {
        return item.depth === 0;
      }).first();
      if (first) {
        $state.go('.tekstikappale', {tekstikappaleId: first.$osa.id, perusteId: $scope.peruste.id});
      }
    }
  });
});
