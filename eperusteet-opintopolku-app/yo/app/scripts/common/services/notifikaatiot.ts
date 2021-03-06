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
    .controller("JarjestelmaVirheModalController", function($scope, $uidModalInstance, $state, viesti) {
        $scope.viesti = viesti;
        $scope.ok = $uidModalInstance.close;
    })
    .service("Notifikaatiot", function(
        $rootScope,
        $timeout,
        NOTIFICATION_DELAY_SUCCESS,
        NOTIFICATION_DELAY_WARNING,
        $uibModal,
        $state,
        Kaanna
    ) {
        var viestit = [];

        function refresh() {
            $timeout(function() {
                paivita();
                $rootScope.$broadcast("update:notifikaatiot");
                if (!_.isEmpty(viestit)) {
                    refresh();
                }
            }, NOTIFICATION_DELAY_SUCCESS);
        }

        var uusiViesti = function(tyyppi, viesti, ilmanKuvaa = false) {
            if (_.isObject(viesti) && viesti.data && viesti.data.syy) {
                viesti = viesti.data.syy;
            } else if (!viesti) {
                viesti = "";
            }

            if (!_.isEmpty(viestit)) {
                var viimeinenViesti = viestit[_.size(viestit) - 1];
                if (viimeinenViesti.tyyppi === tyyppi && viimeinenViesti.viesti === viesti) {
                    return;
                }
            }

            viestit.push({
                viesti: viesti ? viesti : tyyppi === 1 ? "tallennus-onnistui" : "",
                ilmanKuvaa: ilmanKuvaa,
                tyyppi: tyyppi,
                luotu: new Date()
            });

            $rootScope.$broadcast("update:notifikaatiot");
            refresh();
        };

        function fataali(viesti, cb) {
            cb = _.isFunction(cb) ? cb : angular.noop;
            $uibModal
                .open({
                    templateUrl: "views/modals/jarjestelmavirhe.html",
                    controller: "JarjestelmaVirheModalController",
                    resolve: {
                        viesti: function() {
                            return viesti;
                        }
                    }
                })
                .result.then(function() {
                    cb();
                });
        }

        function paivita() {
            function comp(luotu, delay) {
                var nyt = new Date().getTime();
                var viesti = luotu.getTime() + delay;
                return nyt < viesti;
            }

            viestit = _.filter(viestit, function(viesti) {
                if (viesti.tyyppi === 1) {
                    return comp(viesti.luotu, NOTIFICATION_DELAY_SUCCESS);
                } else if (viesti.tyyppi === 2) {
                    return comp(viesti.luotu, NOTIFICATION_DELAY_WARNING);
                } else {
                    return true;
                }
            });
        }

        function poista(i) {
            if (_.isObject(i)) {
                _.remove(viestit, i);
                paivita();
                $rootScope.$broadcast("update:notifikaatiot");
            } else {
                viestit.splice(i, 1);
            }
        }

        function serverCb(response) {
            if (response) {
                if (response.status >= 500) {
                    fataali(
                        Kaanna.kaanna("järjestelmävirhe-alku") +
                            response.status +
                            Kaanna.kaanna("järjestelmävirhe-loppu"),
                        function() {
                            // TODO Ota käyttöön möyhemmin
                            // $state.go('root.aloitussivu');
                        }
                    );
                } else if (response.data && response.data.syy) {
                    var syy = response.data.syy;
                    uusiViesti(2, _.isArray(syy) ? syy[0] : syy);
                } else {
                    uusiViesti(2, Kaanna.kaanna("odottamaton-virhe"));
                }
            }
        }

        function serverLukitus(response) {
            if (response && response.status === 409 && response.data && response.data.lukko) {
                uusiViesti(
                    2,
                    Kaanna.kaanna("lukitus-kayttajalla", {
                        user: response.data.lukko.haltijaNimi || response.data.lukko.haltijaOid
                    })
                );
            } else if (response && response.status !== 404) {
                serverCb(response);
            }
        }

        return {
            normaali: _.partial(uusiViesti, 0),
            onnistui: _.partial(uusiViesti, 1),
            varoitus: _.partial(uusiViesti, 2),
            fataali: fataali,
            serverCb: serverCb,
            serverLukitus: serverLukitus,
            viestit: function() {
                return _.clone(viestit);
            },
            paivita: paivita,
            poista: poista
        };
    })
    .controller("NotifikaatioController", function($scope, Notifikaatiot) {
        $scope.viestit = [];

        $scope.poistaNotifikaatio = function(viesti) {
            Notifikaatiot.poista(viesti);
        };

        $scope.$on("update:notifikaatiot", function() {
            $scope.viestit = Notifikaatiot.viestit();
        });
    });
