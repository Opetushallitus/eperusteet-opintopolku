// TODO: Refaktoroi
angular
    .module("app")
    .constant("LOKALISOINTI_SERVICE_LOC", "/lokalisointi/cxf/rest/v1/localisation?category=eperusteet-amosaa")
    .service("Lokalisointi", ($http, $q) => {
        const PREFIX = "localisation/locale-",
            SUFFIX = ".json";
        let translations = {};

        this.init = () => {
            let deferred = [];
            _.each(["fi", "sv"], key => {
                deferred.push(
                    $http({
                        url: PREFIX + key + SUFFIX,
                        method: "GET",
                        params: ""
                    }).success(data => {
                        translations[key] = data;
                    })
                );
            });
            return $q.all(deferred);
        };
    })
    .factory("LokalisointiResource", (LOKALISOINTI_SERVICE_LOC, $resource) => {
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
    .factory("LokalisointiLoader", ($http, $q, $rootScope, $window, LokalisointiResource) => {
        const PREFIX = "localisation/locale-",
            SUFFIX = ".json",
            // BYPASS_REMOTE = $window.location.host.indexOf("localhost") === 0;
            BYPASS_REMOTE = true;

        return options => {
            let deferred = $q.defer();
            let translations = {};
            $http({
                url: PREFIX + options.key + SUFFIX,
                method: "GET",
                params: ""
            })
                .success(data => {
                    _.extend(translations, data);
                    if (BYPASS_REMOTE) {
                        deferred.resolve(translations);
                        $rootScope.lokalisointiInited = true;
                    } else {
                        LokalisointiResource.get(
                            {
                                locale: options.key
                            },
                            res => {
                                _.extend(translations, _.zipObject(_.map(res, "key"), _.map(res, "value")));
                                deferred.resolve(translations);
                                $rootScope.lokalisointiInited = true;
                            },
                            () => {
                                deferred.reject(options.key);
                            }
                        );
                    }
                })
                .error(() => {
                    deferred.reject(options.key);
                });
            return deferred.promise;
        };
    });
