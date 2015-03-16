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
  .service('MurupolkuData', function ($rootScope, Kaanna) {
    var data = {};
    this.set = function (key, value) {
      if (_.isObject(key)) {
        _.each(key, function (item, k) {
          data[k] = item;
        });
      } else {
        data[key] = value;
      }
      $rootScope.$broadcast('murupolku:update');
    };
    this.get = function (key) {
      return data[key];
    };
    this.setTitle = function (crumbs) {
      var titleEl = angular.element('head > title');
      var leaf = _.last(crumbs);
      var last = leaf ? Kaanna.kaanna(leaf.label) : null;
      var titleText = (last ? last + ' // ' : '') + Kaanna.kaanna('eperusteet-otsikko');
      titleEl.html(titleText);
    };
  })

  .directive('murupolku', function () {
    return {
      restrict: 'AE',
      scope: {},
      templateUrl: 'views/common/directives/murupolku.html',
      controller: 'MurupolkuController'
    };
  })

  .controller('MurupolkuController', function ($scope, $state, MurupolkuData) {
    var currentState = null;
    var STATE_ROOTS = {};

    var STATES = {
      'root.perusopetus': {
        useData: 'perusteNimi',
        useId: 'perusteId'
      },
      'root.perusopetus.tekstikappale': {
        parent: 'root.perusopetus',
        useData: 'tekstikappaleNimi',
        useId: 'tekstikappaleId',
        customParents: true
      },
      'root.perusopetus.vuosiluokkakokonaisuus': {
        parent: 'root.perusopetus',
        useData: 'vlkNimi',
        useId: 'vlkId'
      },
      'root.perusopetus.vlkoppiaine': {
        parent: 'root.perusopetus.vuosiluokkakokonaisuus',
        useData: 'oppiaineNimi',
        useId: 'oppiaineId',
        customParents: true
      },
      'root.perusopetus.sisallot': {
        parent: 'root.perusopetus',
        useData: 'oppiaineNimi',
        useId: 'oppiaineId',
        customParents: true
      },
    };

    function getPath(state) {
      var tree = [];
      if (!state) {
        return tree;
      }
      var current = STATES[state];
      if (!current) {
        return tree;
      } else {
        tree.push(_.extend({state: state}, current));
        var parents = getPath(current.parent);
        if (current.customParents) {
          _.each(MurupolkuData.get('parents'), function (parent) {
            var treeItem = {state: state};
            if (parent.perusteenOsa) {
              treeItem.params = {tekstikappaleId: parent.id};
              treeItem.label = parent.perusteenOsa.nimi;
            } else {
              treeItem.params = {oppiaineId: parent.id};
              treeItem.label = parent.nimi;
            }
            tree.push(treeItem);
          });
        }
        if (!_.isEmpty(parents)) {
          tree = tree.concat(parents);
        }
      }
      return tree;
    }

    function update() {
      var toState = currentState;
      if (!toState) {
        return;
      }
      $scope.crumbs = [];

      _.each(STATE_ROOTS, function (root, key) {
        if (toState.name.indexOf(key) === 0 && toState.name !== key) {
          $scope.crumbs.push({
            url: $state.href(root.state),
            label: root.label
          });
        }
      });

      var path = getPath(toState.name);
      _(path).reverse().each(function (item) {
        var params = item.params || {};
        if (item.useId) {
          params[item.useId] = MurupolkuData.get(item.useId);
        }
        $scope.crumbs.push({
          url: $state.href(item.state, params),
          label: item.useData ? MurupolkuData.get(item.useData) :
                 (item.label ? item.label : _.last(item.state.split('.')))
        });
      }).value();

      MurupolkuData.setTitle($scope.crumbs);
    }

    $scope.$on('murupolku:update', update);

    $scope.$on('$stateChangeSuccess', function (event, toState) {
      currentState = toState;
      update();
    });
    currentState = $state.current;
    update();

  });
