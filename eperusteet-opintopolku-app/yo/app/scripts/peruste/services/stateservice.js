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
.service('PerusopetusStateService', function ($state, $stateParams, SivunaviUtils, $rootScope) {
  var state = {};
  this.setState = function (navi) {
    this.state = {};
    _.each(navi.sections, function (section) {
      section.$open = false;
      _.each(section.items, function (item) {
        item.$selected = false;
        item.$header = false;
      });
    });
    var section = null;
    var selected = null;
    var items = null;

    function processSection(index, cb) {
      section = navi.sections[index];
      if (index === 1) {
        state.vlk = true;
      }
      section.$open = true;
      _.each(section.items, function (item, index) {
        (cb || angular.noop)(item, index);
        item.$hidden = item.depth > 0;
      });
    }

    if (_.endsWith($state.current.name, 'tekstikappale')) {
      processSection(0, function (item) {
        if (item.$osa) {
          item.$selected = '' + $stateParams.tekstikappaleId === '' + item.$osa.id;
          item.$hidden = item.depth > 0;
          if (item.$selected) {
            selected = item;
          }
        }
      });
    } else if (_.endsWith($state.current.name, 'vuosiluokkakokonaisuus')) {
      processSection(1, function (item) {
        if (item.$vkl) {
          item.$selected = '' + $stateParams.vlkId === '' + item.$vkl.id;
        }
        if (item.$selected) {
          selected = item;
        }
      });
    } else if (_.endsWith($state.current.name, 'vlkoppiaine')) {
      var parentVlkId = null;
      processSection(1, function (item) {
        if (item.$vkl) {
          item.$header = '' + $stateParams.vlkId === '' + item.$vkl.id;
          parentVlkId = item.$vkl.id;
        }
        if (item.$oppiaine) {
          item.$selected = '' + $stateParams.oppiaineId === '' + item.$oppiaine.id &&
            $stateParams.vlkId === '' + parentVlkId;
        }
        if (item.$selected) {
          selected = item;
        }
      });
    } else if (_.endsWith($state.current.name, 'sisallot')) {
      processSection(2);
      items = section.model.sections[1].items;
      _.each(items, function (item) {
        if (item.$oppiaine) {
          item.$selected = '' + $stateParams.oppiaineId === '' + item.$oppiaine.id;
          if (item.$selected) {
            selected = item;
          }
        }
      });
    }
    if (selected && section) {
      var menuItems = items || section.items;
      SivunaviUtils.unCollapse(menuItems, selected);
      SivunaviUtils.traverse(menuItems, 0);
      $rootScope.$broadcast('perusopetus:stateSet');
    }
  };
  this.getState = function () {
    return state;
  };
});
