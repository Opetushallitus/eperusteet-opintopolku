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

angular
    .module("app")
    .factory("LokalisointiResource", function(LOKALISOINTI_SERVICE_LOC, $resource) {
        return $resource(
            LOKALISOINTI_SERVICE_LOC,
            {},
            {
                get: {
                    method: "GET",
                    isArray: true,
                    cache: true
                }
            }
        );
    })
    .factory("LokalisointiLoader", function($q, $http, $window, $rootScope, $timeout, LokalisointiResource) {
        const
            PREFIX = "localisation/locale-",
            SUFFIX = ".json",
            BYPASS_REMOTE = false;

        return options => {
            const deferred = $q.defer();
            const translations = {};
            const afterLokalisointiLoad = (translations) => {
                deferred.resolve(translations);
                $rootScope.lokalisointiInited = true;
                $timeout(() => {
                    $rootScope.$broadcast("LokalisointiLoader:update");
                });
            };

            $http({
                url: PREFIX + options.key + SUFFIX,
                method: "GET",
                params: ""
            })
                .success(data => {
                    _.extend(translations, data);
                    if (BYPASS_REMOTE) {
                        afterLokalisointiLoad(translations);
                    }
                    else {
                        LokalisointiResource.get({
                            locale: options.key
                        }, res => {
                                _.extend(translations, _.zipObject(_.map(res, "key"), _.map(res, "value")));
                                afterLokalisointiLoad(translations);
                        }, () => {
                            // Ohita tyytyväisesti jos lokalisointipalvelua ei ole
                            afterLokalisointiLoad(translations);
                        });
                    }
                })
                .error(() => {
                    deferred.reject(options.key);
                });
            return deferred.promise;
        };
    });
