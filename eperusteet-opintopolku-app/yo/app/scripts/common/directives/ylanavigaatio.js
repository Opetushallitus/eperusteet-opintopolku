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
.directive('ylanavigaatio', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'views/common/directives/ylanavigaatio.html',
    controller: 'YlanavigaatioController'
  };
})

.controller('YlanavigaatioController', function ($rootScope, $scope, $state, $stateParams, Haku) {

  function updateOsiot() {
    $scope.activeOsio = null;
    _.each($scope.osiot, function (osio) {
      osio.active = isStateActive(osio);
      if (osio.active) {
        $scope.activeOsio = osio;
      }
      osio.url = $state.href(osio.state, {lang: $stateParams.lang});
    });
  }

  var amOsio = null;
  $scope.$watch(function () {
    return Haku.osio;
  }, function (value) {
    amOsio = value;
    updateOsiot();
  });

    $scope.getMobileOsiot = function() {
    var osiot = [];
    _.each($scope.osiot, function (osio) {
      if (!osio.osiot) {
        osiot.push(osio);
      } else {
        _.each(osio.osiot, function (aliosio) {
          osiot.push(aliosio);
        });
      }
    });

    return osiot;
  }

  $scope.osiot = [
    {label: 'navi.etusivu', state: 'root.etusivu'},
    {label: 'navi.esiopetus', state: 'root.esiopetus'},
    {
      label: 'navi.perusopetus',
      state: 'root.perusopetus',
      osiot: [
        {label: 'navi.perusopetus', state: 'root.perusopetus'},
        {label: 'navi.lisaopetus', state: 'root.lisaopetus'}
      ]
    },
    //{label: 'navi.lukiokoulutus', state: 'root.lukiokoulutus'},
    {label: 'navi.ammatillinenperuskoulutus', state: 'root.selaus.ammatillinenperuskoulutus'},
    {label: 'navi.ammatillinenaikuiskoulutus', state: 'root.selaus.ammatillinenaikuiskoulutus'},
  ];

  $scope.kieliLabel = {
    fi: 'På svenska',
    sv: 'Suomeksi'
  };

  $scope.switch = function() {
    $rootScope.$broadcast('vaihda-kieli');
  }

  function stateMatch(osio) {
    if (_.contains(osio.state, 'ammatillinen')) {
      // Jos on navigoitu aikuiskoulutuksen haun puolelta, näytetään se aktiivisena
      var defined = !_.isEmpty(amOsio);
      var definedMatch = _.contains(osio.state, amOsio);
      var inAmState = _.startsWith($state.current.name, 'root.esitys') || _.startsWith($state.current.name, 'root.selaus');
      var perus = _.contains(osio.state, 'ammatillinenperus');
      return inAmState && ((defined && definedMatch) || (!defined && perus));
    }
    return _.startsWith($state.current.name, osio.state);
  }

  function isStateActive(osio) {
    if (!_.isEmpty(osio.osiot)) {
      _.each(osio.osiot, function (child) {
        child.active = stateMatch(child);
        child.url = $state.href(child.state, {lang: $stateParams.lang});
      });
      return stateMatch(osio) || _.some(osio.osiot, stateMatch);
    }
    return stateMatch(osio);
  }

  $scope.activeOsio = null;
  $scope.$on('$stateChangeSuccess', updateOsiot);
});
