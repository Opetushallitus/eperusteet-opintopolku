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
.service('epResource', function (eperusteetConfig) {
  var serviceLoc = eperusteetConfig.getServiceLocation();
  this.SERVICE = serviceLoc;
  this.PERUSTEET_ROOT = serviceLoc + '/perusteet';
  this.PERUSTEET = this.PERUSTEET_ROOT + '/:perusteId';
  this.SUORITUSTAPA = this.PERUSTEET + '/suoritustavat/:suoritustapa';
  this.SUORITUSTAPASISALTO = this.SUORITUSTAPA + '/sisalto';
  this.ARVIOINTIASTEIKOT = serviceLoc + '/arviointiasteikot/:asteikkoId';
})

.factory('Arviointiasteikot', function($resource, epResource) {
  return $resource(epResource.ARVIOINTIASTEIKOT, {
    asteikkoId: '@id'
  }, {
    list: {method: 'GET', isArray: true, cache: true},
  });
})

.factory('Perusteet', function($resource, epResource) {
  return $resource(epResource.PERUSTEET, {
    perusteId: '@id'
  }, {
    info: {method: 'GET', url: epResource.PERUSTEET_ROOT + '/info'},
    valittavatKielet: {method: 'GET', url: epResource.PERUSTEET_ROOT + '/valittavatkielet', isArray: true},
    diaari: {method: 'GET', url: epResource.PERUSTEET_ROOT + '/diaari'}
  });
})

.factory('PerusteRakenteet', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/rakenne', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  });
})

.factory('PerusteTutkinnonosat', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/tutkinnonosat', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  }, {
    get: {method: 'GET', isArray: true},
    update: {method: 'PUT'}
  });
})

.factory('PerusteTutkinnonosa', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/tutkinnonosat/:osanId', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa',
    osanId: '@id'
  });
})

.factory('SuoritustapaSisalto', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPASISALTO, {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  }, {
    add: {method: 'PUT'},
    addChild: {
      method: 'POST',
      url: epResource.SUORITUSTAPASISALTO + '/:perusteenosaViiteId/lapsi/:childId'
    }
  });
})

.factory('TermistoCRUD', function ($resource, epResource) {
  return $resource(epResource.PERUSTEET + '/termisto/:id', {
    id: '@id',
    perusteId: '@perusteId'
  });
});
