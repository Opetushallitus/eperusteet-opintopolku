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

.controller('YlanavigaatioController', function ($scope, $state, $stateParams) {
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
    {label: 'navi.lukiokoulutus', state: 'root.lukiokoulutus'},
    {label: 'navi.ammatillinenperuskoulutus', state: 'root.selaus.ammatillinenperuskoulutus'},
    {label: 'navi.ammatillinenaikuiskoulutus', state: 'root.selaus.ammatillinenaikuiskoulutus'},
  ];

  function stateMatch(osio) {
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
  $scope.$on('$stateChangeSuccess', function () {
    $scope.activeOsio = null;
    _.each($scope.osiot, function (osio) {
      // TODO parent state matching
      osio.active = isStateActive(osio);
      if (osio.active) {
        $scope.activeOsio = osio;
      }
      osio.url = $state.href(osio.state, {lang: $stateParams.lang});
    });
  });
});
