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
/* global _ */

angular.module('app')
  .directive('termistoTekstikentta', function() {
    return {
      restrict: 'E',
      scope: { model: '=tekstikentta', perusteModel: '=perusteteksti'},
      transclude: true,
      template: '<div ng-if="hasContent(model)" ng-bind-html="model | kaanna | kuvalinkit | unsafe" termisto-viitteet="model"></div>' +
                '<div ng-if="perusteModel" class="esitys-peruste" termisto-viitteet="perusteModel" ng-bind-html="perusteModel | kaanna | kuvalinkit | unsafe"></div>',
      controller: function ($scope, Utils) {
        $scope.hasContent = Utils.hasContentOnCurrentLang;
      }
    };
  })
  .directive('termistoViitteet', function (Kaanna, TermistoService, $document, $timeout) {
    var TERMI_MATCHER = 'abbr[data-viite]';
    return {
      restrict: 'A',
      scope: {
        model: '=termistoViitteet'
      },
      link: function (scope, element) {
        scope.popovers = [];
        function destroy() {
          element.find(TERMI_MATCHER).each(function () {
            var jqEl = angular.element(this);
            if (jqEl.popover) {
              jqEl.popover('destroy');
            }
          });
          scope.popovers = [];
        }
        function setup() {
          element.find(TERMI_MATCHER).each(function () {
            var jqEl = angular.element(this);
            var viiteId = jqEl.attr('data-viite');
            if (viiteId) {
              TermistoService.preload();
            }
            var popover = jqEl.popover({
              placement: 'auto',
              html: true,
              title: Kaanna.kaanna('termin-selitys'),
              trigger: 'click'
            }).on('show.bs.popover', function () {
              var res = TermistoService.getWithAvain(viiteId, true);
              var content = res ? Kaanna.kaanna(res.selitys) : Kaanna.kaanna('termia-ei-loytynyt');
              popover.attr('data-content', content);
              if (res) {
                popover.attr('data-original-title', Kaanna.kaanna(res.termi));
              }
              _.each(scope.popovers, function (po) {
                if (po !== popover) {
                  po.popover('hide');
                }
              });
              $timeout(function () {
                var thisPopover = popover.next('.popover');
                var title = thisPopover.find('.popover-title');
                var closer = angular.element(
                  '<span class="closer pull-right">&#x2715;</span>');
                title.append(closer);
                closer.on('click', function () {
                  popover.popover('hide');
                });
              }, 100);
            });
            scope.popovers.push(popover);
          });
        }

        function clickHandler(event) {
          if (element.find(event.target).length > 0) {
            return;
          }
          _.each(scope.popovers, function (popover) {
            popover.popover('hide');
          });
        }

        // Click anywhere to close
        $document.on('click', clickHandler);

        function refresh() {
          $timeout(function () {
            destroy();
            setup();
          }, 500);
        }

        scope.$watch('model', refresh);
        scope.$on('termisto:update', refresh);
        scope.$on('$destroy', function () {
          $document.off('click', clickHandler);
          destroy();
        });
      },
    };
  });
