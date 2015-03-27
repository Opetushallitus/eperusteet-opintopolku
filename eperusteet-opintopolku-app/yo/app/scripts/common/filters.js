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
.filter('mapFilter', function() {
  return function(input, f) {
    input = _.filter(input, function(v) {
      var bool = f(v);
      return bool;
    });
    return input;
  };
})

.filter('tyhja', function (Kaanna) {
  return function (input) {
    return _.isEmpty(input) ? Kaanna.kaanna('ei-asetettu') : input;
  };
})

.filter('unsafe', ['$sce', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
}])

.filter('paragraphsplit', function() {
  return function(text) {
    return text.split('\n');
  };
})

.directive('pvm', function (Kaanna, $filter) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.pvm, function (value) {
        if (!value) {
          element.text(Kaanna.kaanna('ei-asetettu'));
          return;
        }
        var date = new Date(value);
        element.text($filter('date')(date, 'd.M.yyyy'));
      });
    }
  };
});
