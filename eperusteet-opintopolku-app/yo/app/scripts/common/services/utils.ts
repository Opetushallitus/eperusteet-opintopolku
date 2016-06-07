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


angular.module('app')
.service('Utils', function ($window, Kieli, Kaanna) {
  this.scrollTo = function (selector, offset) {
    var element = angular.element(selector);
    if (element.length) {
      $('html, body').animate({
        scrollTop: element.eq(0).offset().top + (offset || 0)
      }, 400);
    }
  };

  this.hasLocalizedText = function (field) {
    if (!_.isObject(field)) {
      return false;
    }
    var hasContent = false;
    var langs = _.values(Kieli.SISALTOKIELET);
    _.each(langs, function (key) {
      if (!_.isEmpty(field[key])) {
        hasContent = true;
      }
    });
    return hasContent;
  };

  this.hasContentOnCurrentLang = function (item) {
      return item && !_.isEmpty(item[Kieli.getSisaltokieli()]);
  };

  this.oppiaineSort = function(oa) {
    return oa.jnro ? oa.jnro : Kaanna.kaanna(oa.nimi).toLowerCase();
  };

  this.sort = function (item) {
    return Kaanna.kaanna(item.nimi, false, true).toLowerCase();
  };

  this.nameSort = function (item, key) {
    return Kaanna.kaanna(_.isString(key) ? item[key] : item.nimi).toLowerCase();
  };
})

/* Shows "back to top" link when scrolled beyond cutoff point */
.directive('backtotop', function ($window, $document, Utils) {
  return {
    restrict: 'AE',
    scope: {},
    template: '<div id="backtotop" ng-hide="hidden" title="{{\'takaisin-ylos\' | kaanna}}">' +
      '<a class="action-link" icon-role="arrow-up" ng-click="backToTop()"></a></div>',
    link: function (scope) {
      scope.backToTop = function () {
        Utils.scrollTo('#ylasivuankkuri');
      };
      scope.hidden = true;
      var window = angular.element($window);
      var document = angular.element($document);
      var scroll = function () {
        var fitsOnScreen = document.height() <= window.height() * 1.5;
        var inTopArea = window.scrollTop() < window.height() / 2;
        var hidden = fitsOnScreen || inTopArea;
        if (hidden !== scope.hidden) {
          scope.$apply(function () {
            scope.hidden = hidden;
          });
        }
      };
      window.on('scroll', scroll);
      scope.$on('$destroy', function () {
        window.off('scroll', scroll);
      });
    }
  };
})

.run(function() {
  _.mixin({arraySwap: function(array, a, b) {
      if (_.isArray(array) && _.size(array) > a && _.size(array) > b) {
        var temp = array[a];
        array[a] = array[b];
        array[b] = temp;
      }
      return array;
    }});
  _.mixin({zipBy: function(array, kfield, vfield) {
      if (_.isArray(array) && kfield) {
        if (vfield) {
          return _.zipObject(_.map(array, kfield), _.map(array, vfield));
        }
        else {
          return _.zipObject(_.map(array, kfield), array);
        }
      }
      else {
        return {};
      }
    }});
  _.mixin({set: function(obj, field) {
      return function(value) {
        obj[field] = value;
      };
    }});
  _.mixin({setWithCallback: function(obj, field, cb) {
      return function(value) {
        cb = cb || angular.noop;
        obj[field] = value;
        cb(value);
      };
    }});
});
