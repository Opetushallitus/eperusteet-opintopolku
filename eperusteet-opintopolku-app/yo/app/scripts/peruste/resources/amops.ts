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
  .service('AmopsAPI', function () {
    this.AMOSAA = '/eperusteet-amosaa-service/api/';
    this.BASE = 'http://beta.json-generator.com/api/json/get/';
    this.TEKSTIT = {
      43: 'NytzOkbpe',
      44: 'EkT7wJZpl',
      45: '4Jqdwkb6x',
      46: 'VkRiD1Zal',
      47: 'N1v_L1ZTl'
    };
    this.OTSIKOT = '4J3iNyZpg';
    this.OPS = 'VJMjpyZ6x';
    this.CACHEDQUERY = { method: 'GET', isArray: true, cache: true };
  })

  .factory('AmopsResource', function ($resource, AmopsAPI) {
    return (id='') =>  ($resource(AmopsAPI.BASE, {},{
      getOps: {method: 'GET', url: AmopsAPI.BASE + AmopsAPI.OPS},
      getTekstikappale: {method: 'GET', url: AmopsAPI.BASE + AmopsAPI.TEKSTIT[id]},
      getOtsikot: {method: 'GET', isArray: true, url: AmopsAPI.BASE + AmopsAPI.OTSIKOT}
    }));
  });
