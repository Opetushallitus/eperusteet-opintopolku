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
.service('UusimmatPerusteetService', function ($q, Perusteet, $state, Kieli) {
  var uikieli = Kieli.getUiKieli();
  var perusteet = {};
  var paramMap = {
    'koulutustyyppi_1x': {
      nimi: '',
      koulutusala: '',
      tyyppi: 'koulutustyyppi_1,koulutustyyppi_11,koulutustyyppi_12',
      kieli: uikieli,
      opintoala: '',
      siirtyma: false,
      sivu: 0,
      sivukoko: 7,
      perusteTyyppi: 'normaali',
      tila: 'valmis',
      jarjestys: 'muokattu'
    },
    'koulutustyyppi_16': {
      tyyppi: 'koulutustyyppi_16',
      tila: 'valmis'
    },
    'koulutustyyppi_15': {
      tyyppi: 'koulutustyyppi_15',
      tila: 'valmis'
    },
    'koulutustyyppi_6': {
      tyyppi: 'koulutustyyppi_6',
      tila: 'valmis'
    },
    'koulutustyyppi_20': {
      tyyppi: 'koulutustyyppi_20',
      tila: 'valmis'
    }
  };

  function getGeneric(key) {
    var params = paramMap[key];
    return Perusteet.get(params, function (res) {
      perusteet[params.tyyppi] = res.data;
    }).$promise;
  }

  var getPerusopetus = _.partial(getGeneric, 'koulutustyyppi_16');
  var getEsiopetus = _.partial(getGeneric, 'koulutustyyppi_15');
  var getLisaopetus = _.partial(getGeneric, 'koulutustyyppi_6');
  var getVarhaiskasvatus = _.partial(getGeneric, 'koulutustyyppi_20');

  this.fetch = function (cb) {
    var key = 'koulutustyyppi_1x';
    var params = paramMap[key]; // jshint ignore:line
    var amDeferred = Perusteet.get(params, function (res) {
      perusteet[key] = res.data;
      _.each(perusteet[key], function (peruste) {
        peruste.url = $state.href('root.esitys.peruste', {
          perusteId: peruste.id,
          suoritustapa: peruste.koulutustyyppi==='koulutustyyppi_1' ? 'ops':'naytto'
        });
      });
    }).$promise;
    $q.all([amDeferred, getPerusopetus(), getEsiopetus(), getLisaopetus(), getVarhaiskasvatus()]).then(function () {
      cb(perusteet);
    });
  };

  this.getPerusopetus = getPerusopetus;
  this.getEsiopetus = getEsiopetus;
  this.getLisaopetus = getLisaopetus;
  this.getVarhaiskasvatus = getVarhaiskasvatus;
})

.controller('EtusivuController', function ($scope, UusimmatPerusteetService, MurupolkuData,
  TiedotteetCRUD, Utils) {
  MurupolkuData.setTitle(null);
  $scope.uusimmat = {};
  $scope.tiedotteet = [];
  $scope.naytto = {limit: 5, shown: 5};

  UusimmatPerusteetService.fetch(function (res) {
    $scope.uusimmat = res;
    console.log(res);
  });

  $scope.hasContentOnCurrentLang = Utils.hasContentOnCurrentLang;

  var MONTH_OFFSET = 6;
  var tempDate = new Date();
  tempDate.setMonth(tempDate.getMonth() - MONTH_OFFSET);
  var alkaen = tempDate.getTime();

  TiedotteetCRUD.query({alkaen: alkaen , vainJulkiset: true}, function (res) {
    $scope.tiedotteet = res;
  });
})

.controller('TiedoteViewController', function ($scope, TiedotteetCRUD, $stateParams, MurupolkuData) {
  $scope.tiedote = null;

  TiedotteetCRUD.get({tiedoteId: $stateParams.tiedoteId}, function (tiedote) {
    $scope.tiedote = tiedote;
    MurupolkuData.set('tiedoteNimi', tiedote.otsikko);
  });
})

.directive('limitToggler', function () {
  return {
    restrict: 'AE',
    template: '<div class="show-toggler" ng-show="isVisible">' +
          '<a class="action-link" ng-click="toggle()">{{linktext| kaanna}}</a>' +
          '</div>',
    scope: {
      'model': '=',
      'limit': '=',
      'limiter': '='
    },
    controller: function ($scope) {
      $scope.isVisible = false;
      $scope.linktext = 'sivupalkki-näytä-kaikki';
      $scope.$watch('model', function () {
        $scope.isVisible = $scope.model.length > $scope.limit;
      });
      $scope.toggle = function () {
        if ($scope.limiter === $scope.limit) {
          $scope.limiter = $scope.model.length;
          $scope.linktext = 'sivupalkki-piilota';
        } else {
          $scope.limiter = $scope.limit;
          $scope.linktext = 'sivupalkki-näytä-kaikki';
        }
      };
    }
  };
});
