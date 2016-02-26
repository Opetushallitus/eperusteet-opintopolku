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
.service('TermistoService', function (PerusteTermistoCRUD, OpsTermistoCRUD, $q, $timeout) {
  //resource is either the peruste or the ops
  var resources = [], cached = {};
  cached["number"] = 0;
  let loading = false;
  const cacheKasitteet = (items) => {
    console.log(items);
    _.each(items, (item) => {
      cached[item.avain] = item;
    });
    cached["number"]++;
  };
  const CRUD = {
    OPS: OpsTermistoCRUD.query,
    PERUSTE: PerusteTermistoCRUD.query
  };
  const mapResources = (resrcs) => {
    console.log(resrcs);
    return _.map(resrcs, (resource) => {
      CRUD[resource.type]({resourceId: resource.id})
      .$promise.then((res) => cacheKasitteet(res))
    })
  };
  this.preload = function () {
    if ((resources.length != cached["number"]) && !loading) {
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
    return $q.all(mapResources(resources));
  };

  this.setResource = (value, type = "PERUSTE") => {
    value.type = type.toUpperCase();
    resources.push(value);
  };

  function findTermi(avain) {
    return cached[avain]
  }

  this.getWithAvain = function (avain, cached) {
    if (cached) {
      return findTermi(avain)
    } else {
    var deferred = $q.defer();
      this.getAll().then(function () {
        deferred.resolve(findTermi(avain));
      });
    }
    return deferred.promise;
  };

});
