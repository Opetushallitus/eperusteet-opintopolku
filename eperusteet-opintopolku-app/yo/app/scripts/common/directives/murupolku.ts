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
    .service("MurupolkuData", function($rootScope, $timeout, Kaanna) {
        this.noop = angular.noop;
        var data = {};
        var latest = null;
        this.set = function(key, value) {
            if (_.isObject(key)) {
                _.each(key, function(item, k) {
                    data[k] = item;
                });
            } else {
                data[key] = value;
            }
            $rootScope.$broadcast("murupolku:update");
        };

        this.get = function(key) {
            return data[key];
        };

        this.setTitle = function(crumbs) {
            latest = crumbs;
        };

        function afterLoadSetTitle(crumbs) {
            latest = crumbs;
            var titleEl = angular.element("head > title");
            var peruste = null;
            _.each(crumbs, function(crumb, index: Number) {
                if (crumb.peruste && index !== crumbs.length - 1) {
                    peruste = crumb.peruste;
                }
            });
            var leaf: any = _.last(crumbs);
            var last = leaf ? Kaanna.kaanna(leaf.label) : "";
            var titleText = last;
            if (peruste && last) {
                titleText += " / " + Kaanna.kaanna(peruste);
            }
            if (titleText) {
                titleText += " // ";
            }

            titleText += Kaanna.kaanna("eperusteet-otsikko");
            titleEl.html(titleText);
        };

        $rootScope.$on("LokalisointiLoader:update", () => {
            this.setTitle = afterLoadSetTitle;
            this.setTitle(latest);
        });
    })
    .directive("murupolku", function() {
        return {
            restrict: "AE",
            scope: {},
            templateUrl: "views/common/directives/murupolku.html",
            controller: "MurupolkuController"
        };
    })
    .controller("MurupolkuController", function($scope, $state, MurupolkuData) {
        var currentState = null;
        var STATE_ROOTS = {};

        var STATES = {
            "root.tiedotteet": {
                state: "root.uutiset",
                label: "etusivu.uutisia"
            },
            "root.tiedote": {
                useData: "tiedoteNimi",
                parent: "root.tiedotteet"
            },
            "root.perusopetus": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.perusopetus.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.perusopetus.tekstikappale": {
                parent: "root.perusopetus",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.perusopetus.vuosiluokkakokonaisuus": {
                parent: "root.perusopetus",
                useData: "vlkNimi",
                useId: "vlkId"
            },
            "root.perusopetus.laajaalaiset": {
                parent: "root.perusopetus",
                label: "laaja-alaiset-osaamiset"
            },
            "root.perusopetus.vlkoppiaine": {
                parent: "root.perusopetus.vuosiluokkakokonaisuus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.perusopetus.sisallot": {
                parent: "root.perusopetus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.aipe": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.aipe.tiedot": {
                parent: "root.aipe",
                label: "perusteen-tiedot"
            },
            "root.aipe.tekstikappale": {
                parent: "root.aipe",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId"
            },
            "root.aipe.vaihe": {
                parent: "root.aipe",
                useData: "vaiheNimi",
                useId: "vaiheId"
            },
            "root.aipe.vaihe.oppiaine": {
                parent: "root.aipe.vaihe",
                useData: "oppiaineNimi",
                useId: "oppiaineId"
            },
            "root.aipe.vaihe.oppiaine.kurssi": {
                parent: "root.aipe.vaihe.oppiaine",
                useData: "kurssiNimi",
                useId: "kurssiId"
            },
            "root.aipe.vaihe.oppiaine.laajaalaiset": {
                parent: "root.aipe",
                label: "laaja-alaiset-osaamiset"
            },
            "root.lukio": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.lukio.tiedot": {
                parent: "root.lukio",
                label: "perusteen-tiedot"
            },
            "root.lukio.tekstikappale": {
                parent: "root.lukio",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.lukio.oppiaine": {
                parent: "root.lukio",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.lukio.oppiaine.kurssi": {
                parent: "root.lukio.oppiaine",
                useData: "kurssiNimi",
                useId: "kurssiId",
                customParents: true
            },
            "root.lukio.oppiaine.kurssi.tavoitteet": {
                parent: "root.lukio.oppiaine.kurssi",
                useData: "tekstiNimi",
                useId: "tekstiId"
            },
            "root.lukio.oppiaine.kurssi.aihekokonaisuudet": {
                parent: "root.lukio.oppiaine.kurssi",
                useData: "tekstiNimi",
                useId: "tekstiId"
            },
            "root.lukio.oppiaine.tavoitteet": {
                parent: "root.lukio.oppiaine",
                useData: "tekstiNimi",
                useId: "tekstiId"
            },
            "root.lukio.oppiaine.aihekokonaisuudet": {
                parent: "root.lukio.oppiaine",
                useData: "tekstiNimi",
                useId: "tekstiId"
            },
            "root.varhaiskasvatus": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.varhaiskasvatus.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.varhaiskasvatus.tekstikappale": {
                parent: "root.varhaiskasvatus",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.esiopetus": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.esiopetus.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.esiopetus.tekstikappale": {
                parent: "root.esiopetus",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.tpo": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.tpo.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.tpo.tekstikappale": {
                parent: "root.tpo",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.tpo.taiteenala": {
                parent: "root.tpo",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.tpo.taiteenalaOsa": {
                parent: "root.tpo",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.opas": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.opas.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.opas.tekstikappale": {
                parent: "root.tpo",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.perusvalmistava": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.perusvalmistava.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.perusvalmistava.tekstikappale": {
                parent: "root.perusvalmistava",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.lisaopetus": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.lisaopetus.tiedot": {
                useData: "perusteNimi",
                useId: "perusteId"
            },
            "root.lisaopetus.tekstikappale": {
                parent: "root.lisaopetus",
                useData: "tekstikappaleNimi",
                useId: "tekstikappaleId",
                customParents: true
            },
            "root.esitys.peruste": {
                useId: "perusteId",
                useData: "perusteNimi"
            },
            "root.esitys.peruste.rakenne": {
                parent: "root.esitys.peruste",
                useData: "nimi",
            },
            "root.esitys.peruste.tiedot": {
                parent: "root.esitys.peruste",
                label: "perusteen-tiedot"
            },
            "root.esitys.peruste.tutkinnonosat": {
                parent: "root.esitys.peruste",
                label: "tutkinnonosat"
            },
            "root.esitys.peruste.koulutuksenosat": {
                parent: "root.esitys.peruste",
                label: "koulutuksenosat"
            },
            "root.esitys.peruste.tutkinnonosa": {
                parent: "root.esitys.peruste.tutkinnonosat",
                useId: "id",
                useData: "tutkinnonosaNimi"
            },
            "root.esitys.peruste.koulutuksenosa": {
                parent: "root.esitys.peruste.koulutuksenosat",
                useId: "id",
                useData: "tutkinnonosaNimi"
            },
            "root.esitys.peruste.tekstikappale": {
                parent: "root.esitys.peruste",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.tpo": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.tpo.tiedot": {
                parent: "root.ops.tpo",
                label: "opetussuunnitelman-tiedot"
            },
            "root.ops.tpo.tekstikappale": {
                parent: "root.ops.tpo",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.esiopetus": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.esiopetus.tiedot": {
                parent: "root.ops.esiopetus",
                label: "opetussuunnitelman-tiedot"
            },
            "root.ops.esiopetus.tekstikappale": {
                parent: "root.ops.esiopetus",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.lisaopetus": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.lisaopetus.tekstikappale": {
                parent: "root.ops.lisaopetus",
                useId: "osanId",
                useData: "tekstikappaleNimi"
            },
            "root.ops.aipe": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.aipe.tiedot": {
                parent: "root.ops.aipe",
                label: "opetussuunnitelman-tiedot"
            },
            "root.ops.aipe.tekstikappale": {
                parent: "root.ops.aipe",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.varhaiskasvatus": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.varhaiskasvatus.tekstikappale": {
                parent: "root.ops.lisaopetus",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.perusopetus": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.perusopetus.tiedot": {
                parent: "root.ops.perusopetus",
                label: "opetussuunnitelman-tiedot"
            },
            "root.ops.perusopetus.tekstikappale": {
                parent: "root.ops.perusopetus",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.perusopetus.vuosiluokkakokonaisuus": {
                parent: "root.ops.perusopetus",
                useData: "vlkNimi",
                useId: "vlkId"
            },
            "root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka": {
                parent: "root.ops.perusopetus.vuosiluokkakokonaisuus",
                useId: "vuosiId",
                useData: "vuosi"
            },
            "root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.oppiaine": {
                parent: "root.ops.perusopetus.vuosiluokkakokonaisuus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.valinainenoppiaine": {
                parent: "root.ops.perusopetus.vuosiluokkakokonaisuus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.ops.perusopetus.oppiaineet": {
                parent: "root.ops.perusopetus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.ops.perusopetus.valinnaisetoppiaineet": {
                parent: "root.ops.perusopetus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.ops.perusopetus.oppiaineet.vlk": {
                parent: "root.ops.perusopetus.oppiaineet",
                label: "vuosiluokkakokonaisuus",
                useId: "vlkId",
                customParents: true
            },
            "root.ops.perusopetus.oppiaineet.vlk.vuosiluokat": {
                parent: "root.ops.perusopetus.oppiaineet.vlk",
                useDate: "vuosiLabel",
                useId: "vlkId",
                customParents: true
            },
            "root.ops.lukioopetus": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.ops.lukioopetus.tiedot": {
                parent: "root.ops.lukioopetus",
                label: "opetussuunnitelman-tiedot"
            },
            "root.ops.lukioopetus.tekstikappale": {
                parent: "root.ops.lukioopetus",
                useId: "osanId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
            "root.ops.lukioopetus.oppiaine": {
                parent: "root.ops.lukioopetus",
                useData: "oppiaineNimi",
                useId: "oppiaineId",
                customParents: true
            },
            "root.ops.lukioopetus.kurssi": {
                parent: "root.ops.lukioopetus",
                useData: "kurssiNimi",
                useId: "kurssiId",
                customParents: true
            },
            "root.ops.lukioopetus.oppiaine.aihekokonaisuudet": {
                parent: "root.ops.lukioopetus.oppiaine",
                label: "aihekokonaisuudet"
            },
            "root.ops.lukioopetus.kurssi.aihekokonaisuudet": {
                parent: "root.ops.lukioopetus.kurssi",
                label: "aihekokonaisuudet"
            },
            "root.ops.lukioopetus.oppiaine.tavoitteet": {
                parent: "root.ops.lukioopetus.oppiaine",
                label: "yleiset-tavoitteet"
            },
            "root.ops.lukioopetus.kurssi.tavoitteet": {
                parent: "root.ops.lukioopetus.kurssi",
                label: "yleiset-tavoitteet"
            },
            "root.ops.amops": {
                useData: "opsNimi",
                useId: "opsId"
            },
            "root.amops.tiedot": {
                parent: "root.ops.amops",
                label: "opetussuunnitelman-tiedot"
            },
            "root.amops.tekstikappale": {
                parent: "root.ops.amops",
                useId: "tekstikappaleId",
                useData: "tekstikappaleNimi",
                customParents: true
            },
        };

        function perusTaiYksinkertainen(state) {
            return (
                _.contains(state, "perusopetus") ||
                _.contains(state, "esiopetus") ||
                _.contains(state, "tpo") ||
                _.contains(state, "lisaopetus") ||
                _.contains(state, "amops")
            );
        }

        function getPath(state) {
            var tree = [];
            if (!state) {
                return tree;
            }
            var current = STATES[state];
            if (!current) {
                return tree;
            } else {
                tree.push(_.extend({ state: state }, current));
                var parents = getPath(current.parent);
                if (current.customParents) {
                    _.each(MurupolkuData.get("parents"), function(parent) {
                        var treeItem: any = { state: state };
                        if (parent.perusteenOsa) {
                            treeItem.params = perusTaiYksinkertainen(state)
                                ? { tekstikappaleId: parent.id }
                                : { osanId: parent.id };
                            treeItem.label = parent.perusteenOsa.nimi;
                        } else {
                            treeItem.params = perusTaiYksinkertainen(state)
                                ? { tekstikappaleId: parent.id }
                                : { osanId: parent.id };
                            treeItem.label = parent.nimi;
                        }
                        tree.push(treeItem);
                    });
                }
                if (!_.isEmpty(parents)) {
                    tree = tree.concat(parents);
                }
            }
            return tree;
        }

        function update() {
            var toState = currentState;
            if (!toState) {
                return;
            }
            $scope.crumbs = [];

            _.each(STATE_ROOTS, function(root: any, key) {
                if (toState.name.indexOf(key) === 0 && toState.name !== key) {
                    $scope.crumbs.push({
                        url: $state.href(root.state),
                        label: root.label
                    });
                }
            });

            var path = getPath(toState.name);
            _(path)
                .reverse()
                .each(item => {
                    var params = item.params || {};
                    if (item.useId) {
                        params[item.useId] = MurupolkuData.get(item.useId);
                    }
                    var usedData = item.useData ? MurupolkuData.get(item.useData) : null;
                    $scope.crumbs.push({
                        url: $state.href(item.state, params),
                        label: usedData ? usedData : item.label ? item.label : _.last(item.state.split(".")),
                        peruste: item.useId && item.useId === "perusteId" ? usedData : null
                    });
                })
                .value();

            // MurupolkuData.setTitle($scope.crumbs);
        }

        $scope.$on("murupolku:update", update);

        $scope.$on("$stateChangeSuccess", function(event, toState) {
            currentState = toState;
            update();
        });
        currentState = $state.current;
        update();
    });
