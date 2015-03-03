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
.service('eperusteetConfig', function($http, $q) {
  var serviceLocation = '/eperusteet-service/api';
  var inited = false;

  this.init = function () {
    var deferred = $q.defer();

    if (!inited) {
      inited = true;
      $http({
        url: '/config.json'
      }).success(function (res) {
        if (!res['eperusteet-service']) {
          deferred.resolve('Virheellinen configuraatio: config.json: "eperusteet-service" puuttuu');
        }
        serviceLocation = res['eperusteet-service'] + '/api';
        deferred.resolve(true);
      }).error(function () {
        deferred.resolve('Virheellinen configuraatio: config.json puuttuu');
      });
    }

    return deferred.promise;
  };

  this.getServiceLocation = function () {
    return serviceLocation;
  };
});
