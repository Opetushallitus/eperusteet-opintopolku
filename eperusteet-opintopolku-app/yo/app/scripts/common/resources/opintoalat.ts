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
.service('Opintoalat', function Opintoalat($resource, epResource) {
  var opintoalatResource = $resource(epResource.SERVICE + '/opintoalat/',
    {}, { 'query': { method: 'GET', isArray: true, cache: true } });
  this.opintoalatMap = {};
  this.opintoalat = [];
  var self = this;

  var opintoalaPromise = opintoalatResource.query().$promise;

  this.haeOpintoalat = function() {
    return self.opintoalat;
  };

  this.haeOpintoalaNimi = function(koodi) {
    return self.opintoalatMap[koodi];
  };

  return opintoalaPromise.then(function(vastaus) {
    self.opintoalatMap = _.zipObject(_.pluck(vastaus, 'koodi'), _.map(vastaus, function(e: any) {
      return {
        nimi: e.nimi
      };
    }));
    self.opintoalat = vastaus;
    return self;
  });
});
