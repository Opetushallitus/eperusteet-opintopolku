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

.controller('YlanavigaatioController', function ($scope, $state) {
  $scope.osiot = [
    {label: 'navi.etusivu', state: 'root.etusivu'},
    {label: 'navi.esiopetus'},
    {label: 'navi.perusopetus', state: 'root.perusopetus'},
    {label: 'navi.lukiokoulutus'},
    {label: 'navi.ammatillinenperuskoulutus'},
    {label: 'navi.ammatillinenaikuiskoulutus'},
  ];

  $scope.$on('$stateChangeSuccess', function () {
    _.each($scope.osiot, function (osio) {
      // TODO parent state matching
      osio.active = $state.current.name === osio.state;
    });
  });
});
