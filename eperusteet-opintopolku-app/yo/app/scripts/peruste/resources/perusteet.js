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
  this.PERUSTEENOSAT = serviceLoc + '/perusteenosat/:osanId';
  this.PERUSTEENOSAVIITE = serviceLoc + '/perusteenosat/viite/:viiteId';
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
    get: {method: 'GET', isArray: true}
  });
})

.factory('PerusteTutkinnonosa', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/tutkinnonosat/:osanId', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa',
    osanId: '@id'
  });
})

.factory('PerusteTutkintonimikekoodit', function($resource, epResource) {
  return $resource(epResource.PERUSTEET + '/tutkintonimikekoodit/:nimikeId', {
    perusteId: '@id',
    nimikeId: '@id'
  }, {
    get: {method: 'GET', isArray: true}
  });
})

.factory('PerusteenOsat', function($resource, epResource) {
  var loc = epResource.PERUSTEENOSAT;
  var viite = epResource.PERUSTEENOSAVIITE;
  return $resource(loc, {
    osanId: '@id'
  }, {
    byKoodiUri: {method: 'GET', isArray: true, params: {koodi: true}},
    versiot: {method: 'GET', isArray: true, url: loc + '/versiot'},
    getVersio: {method: 'GET', url: loc + '/versio/:versioId'},
    getByViite: {method: 'GET', url: viite},
    versiotByViite: {method: 'GET', isArray: true, url: viite + '/versiot'},
    getVersioByViite: {method: 'GET', url: viite + '/versio/:versioId'}
  });
})

.factory('SuoritustapaSisalto', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPASISALTO, {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  });
})

.factory('TermistoCRUD', function ($resource, epResource) {
  return $resource(epResource.PERUSTEET + '/termisto/:id', {
    id: '@id',
    perusteId: '@perusteId'
  });
})

.factory('TutkinnonOsanOsaAlue', function($resource, epResource) {
  return $resource(epResource.SERVICE + '/perusteenosat/:viiteId/osaalue/:osaalueenId', {
    osaalueenId: '@id'
  }, {
    list: {method: 'GET', isArray: true, url: epResource.PERUSTEENOSAT + '/osaalueet'},
    versioList: {method: 'GET', isArray: true, url: epResource.PERUSTEENOSAT + '/osaalueet/versio/:versioId'}
  });
})

.factory('Osaamistavoite', function($resource, epResource) {
  return $resource(epResource.PERUSTEENOSAT + '/osaalue/:osaalueenId/osaamistavoite/:osaamistavoiteId', {
    osaamistavoiteId: '@id'
  }, {
    list: {method: 'GET', isArray: true, url: epResource.PERUSTEENOSAT + '/osaalue/:osaalueenId/osaamistavoitteet'}
  });
})

.service('PerusteenTutkintonimikkeet', function(PerusteTutkintonimikekoodit, YleinenData) {
  this.perusteellaTutkintonimikkeet = function(peruste) {
    if (_.isObject(peruste)) {
      peruste = peruste.koulutustyyppi;
    }
    return _.isString(peruste) &&
      YleinenData.koulutustyyppiInfo[peruste] && YleinenData.koulutustyyppiInfo[peruste].hasTutkintonimikkeet;
  };

  this.get = function (perusteId, object) {
    PerusteTutkintonimikekoodit.get({ perusteId: perusteId }, function(res) {
      object.koodisto = _.map(res, function(osa) {
        function parsiNimi(kentta) {
          if (osa[kentta + 'Arvo']) {
            var nimi = osa.b[osa[kentta + 'Arvo']].metadata;
            osa['$' + kentta + 'Nimi'] = _.zipObject(_.map(nimi, 'kieli'), _.map(nimi, 'nimi'));
          }
        }

        parsiNimi('osaamisala');
        parsiNimi('tutkintonimike');
        parsiNimi('tutkinnonOsa');
        delete osa.b;
        return osa;
      });
      object.koodisto.$resolved = true;
    });
  };
});
