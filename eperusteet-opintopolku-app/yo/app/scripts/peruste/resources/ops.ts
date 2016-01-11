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
    this.OPS = '/eperusteet-ylops-service/api/opetussuunnitelmat/:opsId';
    this.LUKIO_OPS = '/eperusteet-ylops-service/api/opetussuunnitelmat/lukio/:opsId';
    this.CACHEDQUERY = { method: 'GET', isArray: true, cache: true };
  })

  .factory('OpsResource', function ($resource, opsBase) {
    return (useCache = false) => ($resource(opsBase.OPS, {opsId: '@id'}, {
      get: {method: 'GET', cache: false},
      getOtsikot: {method: 'GET', url: opsBase.OPS + '/otsikot', cache: useCache},
      getVlk: {method: 'GET', url: opsBase.OPS + '/vuosiluokkakokonaisuudet/:vlkId', cache: useCache},
      getOppiaine: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId', cache: useCache},
      getOppiaineVlk: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId/vuosiluokkakokonaisuudet/:vlkId', cache: useCache},
      getOppiaineVlkByVuosiluokka: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId/vuosiluokkakokonaisuudet/:vlkId/vuosiluokat/:vuosiId', cache: useCache},
      getTekstikappale: {method: 'GET', url: opsBase.OPS + '/tekstit/:viiteId', cache: useCache},
      getTekstikappaleWithChildren: {method: 'GET', url: opsBase.OPS + '/tekstit/:viiteId/kaikki', cache: useCache},
      getLaajaalaisetosaamiset: {method: 'GET', isArray: true, url: opsBase.OPS + '/laajaalaisetosaamiset', cache: useCache}
    }));
  })

  .factory('OpsLukioResource', function ($resource, opsBase) {
    return $resource(opsBase.LUKIO_OPS, {opsId: '@id'}, {
      getRakenne: {method: 'GET', url: opsBase.LUKIO_OPS + '/rakenne'},
      getTavoitteet: {method: 'GET', url: opsBase.LUKIO_OPS + '/opetuksenYleisetTavoitteet'},
      getAihekokonaisuudet: {method: 'GET', url: opsBase.LUKIO_OPS + '/aihekokonaisuudet'},
    })
  })

  .factory('opsPerusteResource', function ($resource, opsBase) {
    return $resource(opsBase.OPS, {opsId: '@id'}, {
      getVlkPeruste: {method: 'GET', url: opsBase.OPS + '/vuosiluokkakokonaisuudet/:vlkId/peruste', cache: true},
      getOppiainePeruste: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId/peruste', cache: true}
    })
  })

  .factory('OpsKuvat', function ($resource, opsBase) {
    return $resource(opsBase.OPS, { opsId: '@id'}, {
      get: {method: 'GET', url: opsBase.OPS + '/kuvat'}
    })
  })

  .factory('opsTermisto', function ($resource, opsBase) {
    return $resource(opsBase.OPS + '/termisto/:opsId', {
      opsId: '@id',
    }, {
      query: opsBase.CACHEDQUERY
    })
  });
