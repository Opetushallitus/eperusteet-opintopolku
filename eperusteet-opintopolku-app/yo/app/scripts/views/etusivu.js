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
.controller('EtusivuController', function ($scope, Kieli, Perusteet, $state) {
  $scope.uusimmat = [];
  var uikieli = Kieli.getUiKieli();
  var params = {
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
  Perusteet.get(params, function (res) {
    // TODO varmista että uusimmat, pvm?
    $scope.uusimmat = res.data;
    _.each($scope.uusimmat, function (peruste) {
      peruste.url = $state.href('root.esitys.peruste', {
        perusteId: peruste.id,
        suoritustapa: params.suoritustapa
      });
    });
  });
});
