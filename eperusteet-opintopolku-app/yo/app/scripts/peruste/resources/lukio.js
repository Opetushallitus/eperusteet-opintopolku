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
  .service('epLukioResource', function (eperusteetConfig) {
    var serviceLoc = eperusteetConfig.getServiceLocation();
    this.SERVICE = serviceLoc;
    this.LUKIO_PERUSTEET = '/eperusteet-service/api/perusteet';
  })

  .factory('LukioPerusteenOsat', function($resource, epLukioResource) {
    return $resource(this.LUKIO_PERUSTEET + '/:perusteId/suoritustavat/lukiokoulutus/sisalto', {
      perusteId: '@id'
    }, {
      query: {
        method: 'GET',
        cache: true
      }
    });
  })

  .factory('LukioTekstikappale', function($resource) {
    return $resource('/eperusteet-service/api/perusteenosat/viite/:viiteId', {
      viiteId: '@id'
    }, {
      getByViite: {
        method: 'GET', cache: true
      },
    });
  })

  .factory('LukioOppiaineet', function($resource) {
    var baseUrl = this.LUKIO_PERUSTEET + '/:perusteId/lukiokoulutus/oppiaineet';
    return $resource(baseUrl, {
      perusteId: '@id'
    }, {
      list: {method: 'GET', url: baseUrl, isArray: true, cache: true},
      getOppiaine: {method: 'GET', url: baseUrl + '/:oppiaineId'}
    });
  })

  .factory('LukioKurssit', function($resource) {
    var baseUrl = this.LUKIO_PERUSTEET + '/:perusteId/lukiokoulutus/kurssit';
    return $resource(baseUrl, {
      peruste: '@id'
    }, {
      list: {method: 'GET', isArray: true, cache:true},
      getKurssi: {method: 'GET', isArray: false, url: baseUrl + '/:kurssiId', cache: true}
    });
  });
