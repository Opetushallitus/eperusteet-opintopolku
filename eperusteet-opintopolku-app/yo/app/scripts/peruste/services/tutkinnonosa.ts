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
  .factory('TutkinnonOsanKoodiUniqueResource', function($resource, SERVICE_LOC) {
    return $resource(SERVICE_LOC + '/tutkinnonosat/koodi/uniikki/:tutkinnonosakoodi');
  })
  .service('TutkinnonosanTiedotService', function(PerusteenOsat, $q, TutkinnonOsanOsaAlue, Osaamistavoite) {
    var FIELD_ORDER = {
      tavoitteet: 3,
      ammattitaitovaatimukset: 4,
      ammattitaidonOsoittamistavat: 7,
      arviointi: 5,
      lisatiedot: 5,
      arvioinninKohdealueet: 6
    };

    var tutkinnonOsa;

    function noudaTutkinnonOsa(stateParams) {

      var deferred = $q.defer();

      PerusteenOsat.get({osanId: stateParams.perusteenOsaId}, function (vastaus) {
        tutkinnonOsa = vastaus;
        if (vastaus.tyyppi === 'tutke2') {
          TutkinnonOsanOsaAlue.list({osanId: stateParams.perusteenOsaId}, function (osaAlueet) {
            tutkinnonOsa.osaAlueet = osaAlueet;

            if (osaAlueet && osaAlueet.length > 0) {
              var promisesList = [];
              _.each(osaAlueet, function (osaAlue) {
                var valmis = Osaamistavoite.list({osanId: stateParams.perusteenOsaId, osaalueenId: osaAlue.id}, function (osaamistavoitteet) {
                  osaAlue.osaamistavoitteet = osaamistavoitteet;
                });
                promisesList.push(valmis.promise);
              });
              $q.all(promisesList).then( function() {
                deferred.resolve();
              }, function () {
                deferred.reject();
              });

            } else {
              deferred.resolve();
            }
          });
        } else {
          deferred.resolve();
        }

      });

      return deferred.promise;
    }

    function getTutkinnonOsa() {
      return _.clone(tutkinnonOsa);
    }

    return {
      noudaTutkinnonOsa: noudaTutkinnonOsa,
      getTutkinnonOsa: getTutkinnonOsa,
      order: function (key) {
        return FIELD_ORDER[key] || -1;
      },
      keys: function () {
        return _.keys(FIELD_ORDER);
      }
    };

  });
