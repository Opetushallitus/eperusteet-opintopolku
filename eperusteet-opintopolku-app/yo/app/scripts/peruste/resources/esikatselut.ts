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
  .service('epEsikatseluResource', function (eperusteetConfig) {
    var serviceLoc = eperusteetConfig.getServiceLocation();
    this.SERVICE = serviceLoc;
    this.PERUSTEET = '/eperusteet-service/api/perusteet/:perusteId';
  })
  .factory('LukioPerusteenOsat', function ($resource, epEsikatseluResource) {
    return $resource(epEsikatseluResource.PERUSTEET + '/suoritustavat/lukiokoulutus/sisalto', {
      perusteId: '@id'
    }, {
      query: {
        method: 'GET',
        cache: true
      }
    });
  })
  .factory('LukioTekstikappale', function ($resource) {
    return $resource('/eperusteet-service/api/perusteenosat/viite/:viiteId', {
      viiteId: '@id'
    }, {
      getByViite: {
        method: 'GET', cache: true
      },
    });
  })
  .factory('LukioOppiaineet', function ($resource, epEsikatseluResource) {
    var baseUrl = epEsikatseluResource.PERUSTEET + '/lukiokoulutus/oppiaineet';
    return $resource(baseUrl, {
      perusteId: '@id'
    }, {
      list: { method: 'GET', url: baseUrl, isArray: true, cache: true },
      getOppiaine: { method: 'GET', url: baseUrl + '/:oppiaineId' }
    });
  })
  .factory('LukioYleistiedot', function ($resource, epEsikatseluResource) {
    var baseUrl = epEsikatseluResource.PERUSTEET + '/lukiokoulutus';
    return $resource(baseUrl, {
      perusteId: '@id'
    }, {
      getTavoitteet: { method: 'GET', url: baseUrl + '/yleisettavoitteet', cache: true },
      getAihekokonaisuuksienYleinen: { method: 'GET', url: baseUrl + '/aihekokonaisuudet/yleiskuvaus', cache: true },
      getAihekokonaisuudet: { method: 'GET', isArray: true, url: baseUrl + '/aihekokonaisuudet', cache: true },
      getOppiaineRakenne: { method: 'GET', url: baseUrl + '/julkinen/oppiainerakenne', cache: true }
    });
  })
  .factory('LukioKurssit', function ($resource, epEsikatseluResource) {
    var baseUrl = epEsikatseluResource.PERUSTEET + '/lukiokoulutus/kurssit';
    return $resource(baseUrl, {
      perusteId: '@id'
    }, {
      list: { method: 'GET', isArray: true, cache: true },
      getKurssi: { method: 'GET', isArray: false, url: baseUrl + '/:kurssiId', cache: true }
    });
  })
  .factory('EsiopetusPerusteenOsat', function ($resource, epEsikatseluResource) {
    var baseUrl = epEsikatseluResource.PERUSTEET + '/suoritustavat/esiopetus/sisalto';
    return $resource(baseUrl, { perusteId: '@id' }, {
      query: { method: 'GET', cache: true }
    });
  });
