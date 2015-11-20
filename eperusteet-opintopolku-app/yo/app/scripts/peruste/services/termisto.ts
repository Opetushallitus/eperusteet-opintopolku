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
.service('TermistoService', function (TermistoCRUD, $q, $timeout, opsTermisto) {
  var peruste = null;
  var cached = {};
  var loading = false;
  var Resource = {
    CRUD: TermistoCRUD,
    params: null
  };
  this.preload = function () {
    if (!cached[peruste.id] && !loading) {
      loading = true;
      var self = this;
      $timeout(function () {
        self.getAll().then(function () {
          loading = false;
        });
      });
    }
  };
  this.getAll = function () {
    return Resource.CRUD.query(Resource.params, function (res) {
      cached[peruste.id] = res;
    }).$promise;
  };
  this.setPeruste = function (value, isOps = false) {
    peruste = value;
    if (!isOps) {
      Resource.params = {perusteId: peruste.id};
    }
    if (isOps) {
      Resource.CRUD = opsTermisto;
      Resource.params = {opsId: peruste.id};
    }
  };

  function findTermi(avain) {
    return _.find(cached[peruste.id], function (item) {
      return item.avain === avain;
    });
  }

  this.getWithAvain = function (avain, cached) {
    if (cached) {
      return findTermi(avain);
    }
    var deferred = $q.defer();
    if (cached[peruste.id]) {
      deferred.resolve(findTermi(avain));
    } else {
      this.getAll().then(function () {
        deferred.resolve(findTermi(avain));
      });
    }
    return deferred.promise;
  };
});
