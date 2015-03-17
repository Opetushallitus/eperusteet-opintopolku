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
    'koulutustyyppi_1': {
      nimi: '',
      koulutusala: '',
      tyyppi: 'koulutustyyppi_1',
      kieli: uikieli,
      opintoala: '',
      siirtyma: false,
      sivu: 0,
      sivukoko: 7,
      suoritustapa: 'ops',
      perusteTyyppi: 'normaali',
      tila: 'valmis',
    },
    'koulutustyyppi_16': {
      tyyppi: 'koulutustyyppi_16',
      tila: 'valmis'
    },
    'koulutustyyppi_15': {
      tyyppi: 'koulutustyyppi_15',
      tila: 'valmis'
    }
  };

  function getPerusopetus() {
    var params = paramMap.koulutustyyppi_16; // jshint ignore:line
    return Perusteet.get(params, function (res) {
      perusteet[params.tyyppi] = res.data;
    }).$promise;
  }

  function getEsiopetus() {
    var params = paramMap.koulutustyyppi_15; // jshint ignore:line
    return Perusteet.get(params, function (res) {
      perusteet[params.tyyppi] = res.data;
    }).$promise;
  }

  this.fetch = function (cb) {
    var params = paramMap.koulutustyyppi_1; // jshint ignore:line
    var amDeferred = Perusteet.get(params, function (res) {
      // TODO varmista että uusimmat, pvm?
      perusteet[params.tyyppi] = res.data;
      _.each(perusteet[params.tyyppi], function (peruste) {
        peruste.url = $state.href('root.esitys.peruste', {
          perusteId: peruste.id,
          suoritustapa: params.suoritustapa
        });
      });
    }).$promise;
    $q.all([amDeferred, getPerusopetus(), getEsiopetus()]).then(function () {
      cb(perusteet);
    });
  };

  this.getPerusopetus = getPerusopetus;
  this.getEsiopetus = getEsiopetus;
})

.controller('EtusivuController', function ($scope, UusimmatPerusteetService, MurupolkuData) {
  MurupolkuData.setTitle(null);
  $scope.uusimmat = {};
  UusimmatPerusteetService.fetch(function (res) {
    $scope.uusimmat = res;
  });
});
