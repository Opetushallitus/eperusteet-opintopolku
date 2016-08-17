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

angular.module('app')
.controller('UutisetController', function ($scope, UusimmatPerusteetService, TiedotteetCRUD, Utils, Kieli) {
  $scope.tiedotteet = [];
  $scope.naytto = {limit: 50, shown: 10};
  $scope.kieli = Kieli.getSisaltokieli();

  $scope.hasContentOnCurrentLang = Utils.hasContentOnCurrentLang;

  const MONTH_OFFSET = 48*30*24*60*60*1000; // 4 vuotta
  const alkaen = (new Date()).getTime() - MONTH_OFFSET;

  TiedotteetCRUD.query({
      alkaen: 0,
      vainJulkiset: true
  }, function (res) {
    $scope.tiedotteet = res;
  });
});
