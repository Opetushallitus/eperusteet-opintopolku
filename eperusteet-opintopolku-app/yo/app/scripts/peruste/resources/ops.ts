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
  .service('opsBase', function (eperusteetConfig, fakeData) {
    this.OPS2 = fakeData;
    this.OPS = '/eperusteet-ylops-service/api/opetussuunnitelmat/:opsId'
  })

  .factory('PerusopetusOPS', function ($resource, opsBase) {
    return $resource(opsBase.OPS, {opsId: '@id'}, {
      get: {method: 'GET', cache: true},
      getOtsikot: {method: 'GET', url: opsBase.OPS + '/otsikot', cache: true},
      getVlk: {method: 'GET', url: opsBase.OPS + '/vuosiluokkakokonaisuudet/:vlkId', cache: true},
      getOppiaine: {method: 'GET', url: opsBase.OPS + '/oppiaineet/:oppiaineId', cache: true},
      getTekstikappale: {method: 'GET', url: opsBase.OPS + '/tekstit/:viiteId', cache: true}
    })
  })

  .factory('EsiopetusOPS', function (opsBase) {
    return {
      'otsikot': opsBase.OPS2.otsikot,
      'ops': opsBase.OPS2.ops,
      'tekstikappale': opsBase.OPS2.tekstikappale,
      'perusOps': opsBase.OPS2.perusOps,
      'oppiaine': opsBase.OPS2.oppiaine,
      'vlk': opsBase.OPS2.vlk
    };
  });

///eperusteet-ylops-service/api/opetussuunnitelmat/58405/vuosiluokkakokonaisuudet/58845
