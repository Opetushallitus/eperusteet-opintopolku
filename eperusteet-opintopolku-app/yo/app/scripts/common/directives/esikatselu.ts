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
        show: '=',
        flat: '='
      },
      template: '' +
        '<div class="esitysteksti" ng-if="teksti || pteksti">' +
        '    <h2 ng-show="hasText(otsikko)" ng-bind="otsikko | kaanna"></h2>' +
        '    <div ng-show="hasText(pteksti)" class="esitys-peruste">' +
        '        <div class="nayta-peruste">' +
        '            <a href="" ng-click="$$avoin = !$$avoin">' +
        '                <img ng-hide="$$avoin" src="images/xs/ikoni-nuoli-oikealle.png">' +
        '                <img ng-show="$$avoin" src="images/xs/ikoni-nuoli-alas.png">' +
        '                <span ng-bind="($$avoin ? \'piilota-perusteen-teksti\' : \'nayta-perusteen-teksti\') | kaanna"></span>' +
        '            </a>' +
        '        </div>' +
        '        <div class="peruste-teksti" ng-show="$$avoin" ng-bind-html="pteksti | kaanna | kuvalinkit | unsafe"></div>' +
        '    </div>' +
        '    <div class="esitys-paikallinen" ng-bind-html="teksti | kaanna | kuvalinkit | unsafe"></div>' +
        '</div>',
      controller: ($scope, Kieli) => {
        $scope.hasText = (field) => _.isObject(field) && !_.isEmpty(field[Kieli.getSisaltokieli()]);
        $scope.otsikko = ($scope.model && $scope.model.otsikko) || ($scope.perusteModel && $scope.perusteModel.otsikko);
        $scope.teksti = ($scope.model && ($scope.model.teksti || $scope.model));
        $scope.pteksti = ($scope.perusteModel && ($scope.perusteModel.teksti || $scope.perusteModel));
        $scope.$$avoin = $scope.show || ($scope.pteksti && !$scope.teksti);
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

