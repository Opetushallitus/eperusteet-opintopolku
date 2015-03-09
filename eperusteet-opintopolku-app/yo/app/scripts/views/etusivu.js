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
  var amParams = {
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
    tila: 'valmis'
  };
  var perusParams = {
    tyyppi: 'koulutustyyppi_16',
    tila: 'valmis'
  };

  function getPerusopetus() {
    return Perusteet.get(perusParams, function (res) {
      perusteet[perusParams.tyyppi] = res.data;
    }).$promise;
  }

  this.fetch = function (cb) {
    var amDeferred = Perusteet.get(amParams, function (res) {
      // TODO varmista että uusimmat, pvm?
      perusteet[amParams.tyyppi] = res.data;
      _.each(perusteet[amParams.tyyppi], function (peruste) {
        peruste.url = $state.href('root.esitys.peruste', {
          perusteId: peruste.id,
          suoritustapa: amParams.suoritustapa
        });
      });
    }).$promise;
    var perusopetus = getPerusopetus();
    $q.all([amDeferred, perusopetus]).then(function () {
      cb(perusteet);
    });
  };

  this.getPerusopetus = getPerusopetus;
})

.controller('EtusivuController', function ($scope, UusimmatPerusteetService) {
  $scope.uusimmat = {};
  UusimmatPerusteetService.fetch(function (res) {
    $scope.uusimmat = res;
  });
});
