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
  .directive('esitysTeksti', function() {
    return {
      restrict: 'EA',
      scope: {
        model: '=esitysTeksti',
        perusteModel: '=esitysPeruste',
        showAll: '=showAll'
      },
      template: '<div ng-if="hasText()"><h2 ng-bind-html="perusteModel.otsikko | kaanna | unsafe"></h2>' +
        '<div ng-show="showAll === true && model.teksti && hasText(perusteModel.teksti)">' +
        '<accordion class="peruste-box">' +
        '<accordion-group is-open="status.avoin">' +
        '<accordion-heading>' +
        '<div><i class="pull-left glyphicon" ng-class="{\'glyphicon-chevron-down\': status.avoin, \'glyphicon-chevron-right\': !status.avoin}"></i>' +
        '<h4 ng-bind-html="\'nayta-perusteen-teksti\' | kaanna | unsafe"></h4>' +
        '</div></accordion-heading><termisto-tekstikentta perusteteksti="perusteModel.teksti"></termisto-tekstikentta></accordion-group>' +
        '</accordion></div>' +
        '<div class="esitys-peruste" ng-show="showPeruste()" ng-bind-html="perusteModel.teksti | kaanna | kuvalinkit | unsafe"></div>' +
        '<div class="esitys-paikallinen" ng-bind-html="model.teksti | kaanna | kuvalinkit | unsafe"></div></div>',

      controller: function ($scope, Kieli) {

        $scope.showPeruste = function () {
          return $scope.model && !_.isEmpty($scope.model.teksti) && !_.isEmpty($scope.model.teksti[Kieli.getSisaltokieli()]) ?
            false : true;
        };

        $scope.hasText = function () {
          var hasPeruste = $scope.perusteModel && !_.isEmpty($scope.perusteModel.teksti) && !_.isEmpty($scope.perusteModel.teksti[Kieli.getSisaltokieli()]);
          var hasPaikallinen = $scope.model && !_.isEmpty($scope.model.teksti) && !_.isEmpty($scope.model.teksti[Kieli.getSisaltokieli()]);
          return (!$scope.showPeruste && hasPaikallinen) || ($scope.showPeruste && (hasPeruste || hasPaikallinen));
        };
      }
    }
  })

  .service('VuosiluokkakokonaisuusMapper', function () {
    this.init = function (scope, laajaalaisetosaamiset, vlkPeruste) {
      scope.peruste = vlkPeruste;
      scope.tunnisteet = _.map(scope.peruste.laajaalaisetosaamiset, '_laajaalainenosaaminen');
      var decorated = _.map(scope.peruste.laajaalaisetosaamiset, function (item) {
        var base = laajaalaisetosaamiset[item._laajaalainenosaaminen];
        item.teksti = item.kuvaus;
        item.otsikko = base ? base.nimi : {fi: '[Ei nimeä]'};
        return item;
      });
      scope.laajaalaiset = _.indexBy(decorated, '_laajaalainenosaaminen');
      scope.paikalliset = _.mapValues(scope.laajaalaiset, function (item) {
        var newItem = _.cloneDeep(item);
        var model = _.find(scope.vlk.laajaalaisetosaamiset, function (osaaminen) {
          return '' + osaaminen._laajaalainenosaaminen === '' + item._laajaalainenosaaminen;
        });
        newItem.teksti = model ? model.kuvaus : {};
        return newItem;
      });
    };
  });

