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
  this.PERUSOPETUS = this.PERUSTEET + '/perusopetus';
  this.PERUSTEENOSAT = serviceLoc + '/perusteenosat/:osanId';
  this.PERUSTEENOSAVIITE = serviceLoc + '/perusteenosat/viite/:viiteId';
  this.SUORITUSTAPA = this.PERUSTEET + '/suoritustavat/:suoritustapa';
  this.SUORITUSTAPASISALTO = this.SUORITUSTAPA + '/sisalto';
  this.ARVIOINTIASTEIKOT = serviceLoc + '/arviointiasteikot/:asteikkoId';
  this.CACHEDGET = {method: 'GET', cache: true};
  this.CACHEDQUERY = {method: 'GET', isArray: true, cache: true};
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
    get: epResource.CACHEDGET,
    info: {method: 'GET', url: epResource.PERUSTEET_ROOT + '/info'},
    valittavatKielet: {method: 'GET', url: epResource.PERUSTEET_ROOT + '/valittavatkielet', isArray: true},
    diaari: {method: 'GET', url: epResource.PERUSTEET_ROOT + '/diaari', cache: true}
  });
})

.factory('PerusteRakenteet', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/rakenne', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  }, {
    get: epResource.CACHEDGET
  });
})

.factory('PerusteTutkinnonosat', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/tutkinnonosat', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  }, {
    get: epResource.CACHEDQUERY,
    query: epResource.CACHEDQUERY
  });
})

.factory('PerusteTutkinnonosa', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPA + '/tutkinnonosat/:osanId', {
    perusteId: '@id',
    suoritustapa: '@suoritustapa',
    osanId: '@id'
  }, {
    get: epResource.CACHEDGET
  });
})

.factory('PerusteTutkintonimikekoodit', function($resource, epResource) {
  return $resource(epResource.PERUSTEET + '/tutkintonimikekoodit/:nimikeId', {
    perusteId: '@id',
    nimikeId: '@id'
  }, {
    get: {method: 'GET', isArray: true, cache: true}
  });
})

.factory('PerusteenOsat', function($resource, epResource) {
  var loc = epResource.PERUSTEENOSAT;
  var viite = epResource.PERUSTEENOSAVIITE;
  return $resource(loc, {
    osanId: '@id'
  }, {
    get: epResource.CACHEDGET,
    byKoodiUri: {method: 'GET', isArray: true, params: {koodi: true}},
    versiot: {method: 'GET', isArray: true, url: loc + '/versiot'},
    getVersio: {method: 'GET', url: loc + '/versio/:versioId'},
    getByViite: {method: 'GET', url: viite, cache: true},
    versiotByViite: {method: 'GET', isArray: true, url: viite + '/versiot'},
    getVersioByViite: {method: 'GET', url: viite + '/versio/:versioId'}
  });
})

.factory('SuoritustapaSisalto', function($resource, epResource) {
  return $resource(epResource.SUORITUSTAPASISALTO, {
    perusteId: '@id',
    suoritustapa: '@suoritustapa'
  }, {
    get: epResource.CACHEDGET
  });
})

.factory('TermistoCRUD', function ($resource, epResource) {
  return $resource(epResource.PERUSTEET + '/termisto/:id', {
    id: '@id',
    perusteId: '@perusteId'
  }, {
    get: epResource.CACHEDGET,
    query: epResource.CACHEDQUERY
  });
})

.factory('TutkinnonOsanOsaAlue', function($resource, epResource) {
  return $resource(epResource.SERVICE + '/perusteenosat/:viiteId/osaalue/:osaalueenId', {
    osaalueenId: '@id'
  }, {
    list: {method: 'GET', isArray: true, url: epResource.PERUSTEENOSAT + '/osaalueet', cache: true},
    versioList: {method: 'GET', isArray: true, url: epResource.PERUSTEENOSAT + '/osaalueet/versio/:versioId'}
  });
})

.factory('Osaamistavoite', function($resource, epResource) {
  return $resource(epResource.PERUSTEENOSAT + '/osaalue/:osaalueenId/osaamistavoite/:osaamistavoiteId', {
    osaamistavoiteId: '@id'
  }, {
    list: {
      method: 'GET',
      isArray: true,
      url: epResource.PERUSTEENOSAT + '/osaalue/:osaalueenId/osaamistavoitteet',
      cache: true
    }
  });
})

.factory('LaajaalaisetOsaamiset', function($resource, epResource) {
  return $resource(epResource.PERUSOPETUS + '/laajaalaisetosaamiset/:osanId', {
    osanId: '@id'
  }, {
    query: epResource.CACHEDQUERY
  });
})

.factory('Vuosiluokkakokonaisuudet', function($resource, epResource) {
  return $resource(epResource.PERUSOPETUS + '/vuosiluokkakokonaisuudet/:osanId', {
    osanId: '@id'
  }, {
    query: epResource.CACHEDQUERY
  });
})

.factory('Oppiaineet', function($resource, epResource) {
  var baseUrl = epResource.PERUSOPETUS + '/oppiaineet/:osanId';
  return $resource(baseUrl, {osanId: '@id'}, {
    oppimaarat: {method: 'GET', isArray: true, url: baseUrl + '/oppimaarat', cache: true},
    kohdealueet: {method: 'GET', isArray: true, url: baseUrl + '/kohdealueet', cache: true},
    get: epResource.CACHEDGET,
    query: epResource.CACHEDQUERY
  });
})

.factory('OppiaineenVuosiluokkakokonaisuudet', function($resource, epResource) {
  return $resource(epResource.PERUSOPETUS + '/oppiaineet/:oppiaineId/vuosiluokkakokonaisuudet/:osanId', {
    osanId: '@id'
  }, {
    query: epResource.CACHEDQUERY
  });
})

.factory('LukioPerusteenOsat', function($resource) {
  return $resource('/eperusteet-service/api/perusteet/:perusteId/suoritustavat/lukiokoulutus/sisalto', {
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
    var baseUrl = '/eperusteet-service/api/perusteet/:perusteId/lukiokoulutus/oppiaineet';
    return $resource(baseUrl, {
      perusteId: '@id'
    }, {
      list: {method: 'GET', url: baseUrl, isArray: true, cache: true},
      getOppiaine: {method: 'GET', url: baseUrl + '/:oppiaineId', cache: true}
  });
})

  .factory('Oppiaineet', function($resource, epResource) {
    var baseUrl = epResource.PERUSOPETUS + '/oppiaineet/:osanId';
    return $resource(baseUrl, {osanId: '@id'}, {
      oppimaarat: {method: 'GET', isArray: true, url: baseUrl + '/oppimaarat', cache: true},
      kohdealueet: {method: 'GET', isArray: true, url: baseUrl + '/kohdealueet', cache: true},
      get: epResource.CACHEDGET,
      query: epResource.CACHEDQUERY
    });
  })

.factory('LukioKurssit', function($resource) {
    return $resource('/eperusteet-service/api/perusteet/:perusteId/lukiokoulutus/kurssit', {
      peruste: '@id'
    }, {
      list: {
      method: 'GET',
      isArray: true
    }
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
