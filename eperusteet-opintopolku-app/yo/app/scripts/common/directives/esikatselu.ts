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
        show: '='
      },
      templateUrl: 'scripts/common/directives/esitysteksti.html',
      controller: ($scope, Kieli) => {
        const hasText = (field) => field && _.isObject(field.teksti) && !_.isEmpty(field.teksti[Kieli.getSisaltokieli()]);
        $scope.hasPerusteText = () => hasText($scope.perusteModel);
        $scope.hasPaikallinenText = () => hasText($scope.model);
        $scope.hasText = () => $scope.hasPerusteText() || $scope.hasPaikallinenText();
        $scope.$$avoin = $scope.show || ($scope.hasPerusteText && !$scope.hasPaikallinenText());
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

