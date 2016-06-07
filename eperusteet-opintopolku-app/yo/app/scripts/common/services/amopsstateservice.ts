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

angular.module('app')
  .service('AmopsStateService', function ($state, $stateParams, $location, epSivunaviUtils, $rootScope) {
    let state: any = {};
    let section = null;

    const processSection = (navi, index, cb) =>{
      section = navi.sections[index];
      section.$open = true;
      _.each(section.items, function (item, index) {
        (cb || angular.noop)(item, index);
        item.$hidden = item.depth > 0;
      });
    }

    this.setState = function (navi) {
      this.state = {};
      _.each(navi.sections, function (section) {
        section.$open = false;
        _.each(section.items, function (item) {
          item.$selected = false;
          item.$header = false;
          if (item.depth > 0) {
            item.$hidden = true;
          }
        });
      });
      section = null;
      let selected = null;
      let items = null;

      const setParentHeader = () => {
        if (selected) {
          var found = _.find(items, function (item) {
            return item.lapset && _.indexOf(item.lapset,selected.id) > -1;
          });
          if (found) {
            found.$header = true;
          }
        }
      };

      const textCallback = (item) => {
        if (item.depth === 0 && !$location.hash()) {
          item.$selected = $stateParams.tekstikappaleId + '' === item.$id + '';
        }
        if ($location.hash()) {
          item.$selected = $location.hash() === item.$id + '';
        }
        if (item.$selected) {
          selected = item;
        }
      };

      var states = {
        tekstikappale: {
          index: 0,
          callback: textCallback,
          actions: function () {
            items = section.items;
            setParentHeader();
          }
        },
        tiedot: {
          index: 0,
          callback: function (item) {
            item.$selected = _.endsWith(item.url, 'tiedot') && _.endsWith($state.current.name,'tiedot');
          }
        }
      };

      _.each(states, function (value, key) {
        if (_.endsWith($state.current.name, key)) {
          processSection(navi, value.index, value.callback || angular.noop);
          (value.actions || angular.noop)();
        }
      });

      if (selected && section) {
        var menuItems = items || section.items;
        var parent = selected.$parent;
        while (_.isNumber(parent)) {
          menuItems[parent].$header = true;
          parent = menuItems[parent].$parent;
        }
        epSivunaviUtils.unCollapse(menuItems, selected);
        epSivunaviUtils.traverse(menuItems, 0);
        $rootScope.$broadcast('lukio:stateSet');
      }
    };
    this.getState = function () {
      return state;
    };
  });



