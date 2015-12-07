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
  .service('opsBase', function () {
    this.OPS = '/eperusteet-ylops-service/api/opetussuunnitelmat/:opsId',
    this.CACHEDQUERY = { method: 'GET', isArray: true, cache: true };
  })

  .factory('opsResource', function ($resource, opsBase) {
    return $resource(opsBase.OPS, {opsId: '@id'}, {
      get: {method: 'GET', cache: true},
      getOtsikot: {method: 'GET', url: opsBase.OPS + '/otsikot', cache: true},
      getVlk: {method: 'GET', url: opsBase.OPS + '/vuosiluokkakokonaisuudet/:vlkId', cache: true},
      getOppiaine: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId', cache: true},
      getTekstikappale: {method: 'GET', url: opsBase.OPS + '/tekstit/:viiteId', cache: true},
      getTekstikappaleWithChildren: {method: 'GET', url: opsBase.OPS + '/tekstit/:viiteId/kaikki', cache: true},
      getLaajaalaisetosaamiset: {method: 'GET', isArray: true, url: opsBase.OPS + '/laajaalaisetosaamiset', cache: true}
    })
  })

  .factory('opsPerusteResource', function ($resource, opsBase) {
    return $resource(opsBase.OPS, {opsId: '@id'}, {
      getVlkPeruste: {method: 'GET', url: opsBase.OPS + '/vuosiluokkakokonaisuudet/:vlkId/peruste', cache: true},
      getOppiainePeruste: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId/peruste', cache: true}
    })
  })

  .factory('opsTermisto', function ($resource, opsBase) {
    return $resource(opsBase.OPS + '/termisto/:opsId', {
      opsId: '@id',
    }, {
      query: opsBase.CACHEDQUERY
    })
  });
