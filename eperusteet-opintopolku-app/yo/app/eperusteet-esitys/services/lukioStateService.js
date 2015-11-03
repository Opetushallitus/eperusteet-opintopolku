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

/* Sets sivunavi items active based on current state */
angular.module('eperusteet.esitys')
.service('epLukioStateService', function ($state, $stateParams, $location, epSivunaviUtils, $rootScope) {
  var state = {};
  var section = null;


  function processSection(navi, index, cb) {
    section = navi.sections[index];
    if (index === 1) {
      state.oppiaine = true;
    }
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
      });
    });
    section = null;
    var selected = null;
    var items = null;

    function setParentOppiaineHeader() {
        if (selected && selected.$kurssi) {
          found = _.find(items, function (item) {
            return item.$kurssi && '' + item.$kurssi.id === '' + $location.hash();
          });
          if (found) {
            found.$header = true;
          }
        } else {
        if (selected && selected.$oppiaine._oppiaine) {
          var found = _.find(items, function (item) {
            return item.$oppiaine && '' + item.$oppiaine.id === '' + selected.$oppiaine._oppiaine;
          });
          if (found) {
            found.$header = true;
          }
        }
      }
    }

    function setParentOppiaineHeaderForKurssi() {
      var found = null;
      if(selected && selected.$kurssi) {
        found = _.find(items, function(item) {
          return item.$kurssi && '' + item.$kurssi.id === '' + $location.hash();
        });
      }
      if (found) {
        found.$header = true;
      }
    }

    function textCallback(item)  {
      if (item.$osa) {
        item.$selected = '' + $stateParams.tekstikappaleId === '' + item.$osa.id;
        item.$hidden = item.depth > 0;
      }
      if (item.$selected) {
        selected = item;
      }
    }

    var states = {
      tekstikappale: {
        index: 0,
        callback: textCallback
      },
      oppiaine: {
        index: 1,
        callback: function (item) {
          if (item.$oppiaine && !$location.hash()) {
            item.$selected = '' + $stateParams.oppiaineId === '' + item.$oppiaine.id;
          }
          if (item.$kurssi) {
            item.$selected = '' + $location.hash() === '' + item.$id;
            item.$hidden = item.depth > 0;
          }
          if (item.$selected) {
            selected = item;
          }
        },
        actions: function () {
          items = section.items;
          setParentOppiaineHeader();
        }
      },
      kurssi: {
        index: 1,
        callback: function (item) {
          if (item.$kurssi) {
            item.$selected = '' + $stateParams.kurssiId === '' + item.$kurssi.id;
          }
          if (item.$selected) {
            selected = item;
          }
        },
        actions: function () {
          items = section.items;
          setParentOppiaineHeaderForKurssi();
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
