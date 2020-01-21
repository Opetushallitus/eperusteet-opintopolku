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

namespace Osat {
    export const isTutke2 = (osa) => {
        return _.isObject(osa) && (osa.tyyppi === "tutke2" || osa.tyyppi === "reformi_tutke2");
    };
}


angular.module("app").config($stateProvider =>
    $stateProvider.state("root.amops.osa", {
        url: "/osa/:osaId",
        onEnter: osa => Murupolku.register("root.amops.osa", osa.tekstiKappale.nimi),
        resolve: {
            osa: (ops, $stateParams) => {
                return ops.one("tekstit", $stateParams.osaId).get();
            },
            pTosat: (Api, osa, ops) =>
                (osa.tyyppi === "suorituspolku" || osa.tyyppi === "osasuorituspolku") && Api.all("perusteet/" + ops.peruste.id + "/tutkinnonosat").getList(),
            pTosa: (Api, osa, ops) => {
                if (osa.tyyppi === "tutkinnonosa") {
                    let perusteId = null;
                    let tosaId = null;
                    console.log(osa);
                    if (osa.tosa.tyyppi === "perusteesta") {
                        if (osa.peruste) {
                            // Tuotu toisesta perusteesta
                            perusteId = osa.peruste.id;
                        } else {
                            perusteId = ops.peruste.id;
                        }
                        tosaId = osa.tosa.perusteentutkinnonosa;
                    } else if (osa.tosa.tyyppi === "vieras") {
                        perusteId = osa.tosa.vierastutkinnonosa._cperuste;
                        tosaId = osa.tosa.vierastutkinnonosa.tosaId;
                    } else {
                        return;
                    }

                    return Api.one("perusteet/" + perusteId + "/tutkinnonosat/" + tosaId).get();
                }
            },
            pTosaViite: async (Api, osa, ops) => {
                if (osa.tyyppi === "tutkinnonosa") {
                    let perusteId = null;
                    let tosaId = null;
                    if (osa.tosa.tyyppi === "perusteesta") {
                        console.log(osa);
                        if (osa.peruste) {
                            // Tuotu toisesta perusteesta
                            perusteId = osa.peruste.id;
                        } else {
                            perusteId = ops.peruste.id;
                        }
                        tosaId = osa.tosa.perusteentutkinnonosa;
                    } else if (osa.tosa.tyyppi === "vieras") {
                        perusteId = osa.tosa.vierastutkinnonosa._cperuste;
                        tosaId = osa.tosa.vierastutkinnonosa.tosaId;
                    } else {
                        return;
                    }

                    const getSuoritustapaSisalto = async(suoritustavat) => {
                        if (!suoritustavat) {
                            return;
                        }
                        else if (!_.head(suoritustavat)) {
                            return await getSuoritustapaSisalto(_.tail(suoritustavat));
                        }
                        else {
                            const url = "perusteet/" + perusteId + "/suoritustavat/" + _.head(suoritustavat) + "/tutkinnonosat/" + tosaId;
                            try {
                                return await Api.one(url).get();
                            }
                            catch (err) {
                                return await getSuoritustapaSisalto(_.tail(suoritustavat));
                            }
                        }
                    };

                    return getSuoritustapaSisalto([ops.suoritustapa, "reformi", "ops", "naytto"]);
                }
            },
            pSuoritustavat: (Api, osa, ops) =>
                (osa.tyyppi === "suorituspolku" || osa.tyyppi === "osasuorituspolku") && Api.one("perusteet/" + ops.peruste.id + "/suoritustavat").get(),
            arviointiAsteikot: Api => Api.all("arviointiasteikot").getList()
        },
        views: {
            "": {
                templateUrl: "views/amops/osa/view.html",
                controller: ($scope, osa, pTosa, ktId) => {
                    $scope.osa = osa;
                    $scope.pTosa = pTosa;
                    if (pTosa) {
                        $scope.pTosa.$$isTutke2 = Osat.isTutke2(pTosa);
                    }
                    $scope.ktId = ktId;
                }
            },
            "suorituspolku@root.amops.osa": {
                templateUrl: "views/amops/osa/suorituspolku.html",
                controller: (
                    $q,
                    $rootScope,
                    $scope,
                    $state,
                    $stateParams,
                    osa,
                    peruste,
                    pSuoritustavat,
                    pTosat,
                    koodisto,
                    paikallisetTutkinnonosatEP,
                    koulutustoimija
                ) => {
                    const suoritustapa = Perusteet.getSuoritustapa(pSuoritustavat),
                        tosat = _.indexBy(pTosat, "id"),
                        tosaViitteet: any = _(_.cloneDeep(Perusteet.getTosaViitteet(suoritustapa)))
                            .each(viite => (viite.$$tosa = tosat[viite._tutkinnonOsa]))
                            .indexBy("id")
                            .value(),
                        paikallisetKoodit = koulutustoimija.all("koodi"),
                        update = () => {
                            const spRivit: any = _.indexBy($scope.osa.suorituspolku.rivit, "rakennemoduuli");
                            Algoritmit.traverse($scope.perusteRakenne, "osat", node => {
                                node.pakollinen = Suorituspolku.pakollinen(node);
                                node.$$poistettu = spRivit[node.tunniste] && spRivit[node.tunniste].piilotettu;
                            });
                            Suorituspolku.calculateRealAmount($scope.perusteRakenne, $scope.misc.tosat, spRivit);
                            $scope.misc.spRivit = spRivit;

                            const uniikitKoodit = _($scope.osa.suorituspolku.rivit)
                                    .map("koodit")
                                    .flatten()
                                    .filter((koodi: string) => !$scope.misc.koodinimet[koodi])
                                    .uniq()
                                    .value(),
                                pkoodit = _.filter(uniikitKoodit, (koodi: string) =>
                                    _.startsWith(koodi, Koodisto.paikallinenPrefix)
                                ),
                                kkoodit = _.reject(uniikitKoodit, (koodi: string) =>
                                    _.startsWith(koodi, Koodisto.paikallinenPrefix)
                                );

                            $q
                                .all(_.map(kkoodit, koodi => koodisto.one("uri/" + koodi).get()))
                                .then(Koodisto.parseRawKoodisto)
                                .then(res => {
                                    _.each(res, koodi => {
                                        $scope.misc.koodinimet[koodi.uri] = koodi;
                                    });
                                });
                            $q.all(_.map(pkoodit, koodi => paikallisetKoodit.one(koodi).get())).then(res => {
                                _.each(res, koodi => {
                                    $scope.misc.koodinimet[koodi.route] = {
                                        nimi: "tutkinnon-osaa-ei-olemassa",
                                        uri: koodi.route,
                                        arvo: _.last(koodi.route.split("_"))
                                    };

                                    if (_.size(koodi) === 1) {
                                        $scope.misc.koodinimet[koodi.route].nimi = koodi[0].tekstiKappale.nimi;
                                        $scope.misc.koodinimet[koodi.route].url = $state.href("root.amops.osa", {
                                            opsId: koodi[0].owner.id,
                                            osaId: koodi[0].id
                                        });
                                    } else if (_.size(koodi) > 1) {
                                        const opskohtaiset = _.filter(
                                            koodi,
                                            (arvo: any) => arvo.owner.id == $stateParams.opsId
                                        );
                                        if (_.size(opskohtaiset) === 1) {
                                            $scope.misc.koodinimet[koodi.route].nimi =
                                                opskohtaiset[0].tekstiKappale.nimi;
                                            $scope.misc.koodinimet[koodi.route].url = $state.href("root.amops.osa", {
                                                opsId: opskohtaiset[0].owner.id,
                                                osaId: opskohtaiset[0].id
                                            });
                                        } else {
                                            $scope.misc.koodinimet[koodi.route].nimi =
                                                "koodilla-liian-monta-toteutusta";
                                            $scope.misc.koodinimet[koodi.route].nimet = _.map(
                                                koodi,
                                                "tekstiKappale.nimi"
                                            );
                                            $scope.misc.koodinimet[koodi.route].rikki = true;
                                            $scope.misc.koodinimet[koodi.route].url = $state.href("root.amops.osa", {
                                                opsId: koodi[0].owner.id,
                                                osaId: koodi[0].id
                                            });
                                        }
                                    } else {
                                        $scope.misc.koodinimet[koodi.route].rikki = true;
                                    }
                                });
                            });
                        };

                    _.merge($scope, {
                        collapsed_dirty: false,
                        perusteRakenne: _.cloneDeep(Perusteet.getRakenne(suoritustapa)),
                        misc: {
                            collapsed_removed: false,
                            root: $rootScope,
                            suoritustapa: suoritustapa,
                            koodinimet: {},
                            tosat: tosaViitteet,
                            hasInput: false,
                            osa: $scope.osa,
                            toggle: model => {
                                model.$$collapsed = !model.$$collapsed;
                                $scope.collapsed_dirty = true;
                            },
                            siirry: obj => {
                                paikallisetKoodit
                                    .one(obj.$$tosa ? obj.$$tosa.koodiUri : obj)
                                    .get()
                                    .then(res => {
                                        const goToSisalto = osa =>
                                            $state.go("root.amops.osa", {
                                                opsId: osa.owner.id,
                                                osaId: osa.id
                                            });

                                        const opskohtaiset = _.filter(
                                            res,
                                            (arvo: any) => arvo.owner.id == $stateParams.opsId
                                        );
                                        goToSisalto(_.size(opskohtaiset) > 0 ? opskohtaiset[0] : res[0]);
                                    });
                            }
                        },
                        toggleAll: () => {
                            Algoritmit.traverse(
                                $scope.perusteRakenne,
                                "osat",
                                (node, depth) => (node.$$collapsed = $scope.collapsed_dirty ? depth > 0 : false)
                            );
                            $scope.collapsed_dirty = !$scope.collapsed_dirty;
                        },
                        suodata: input => {
                            $scope.misc.hasInput = !_.isEmpty(input);
                            if ($scope.misc.hasInput) {
                                Algoritmit.traverse($scope.perusteRakenne, "osat", node => {
                                    node.$$haettu = Algoritmit.match(
                                        input,
                                        node._tutkinnonOsaViite
                                            ? tosaViitteet[node._tutkinnonOsaViite].$$tosa.nimi
                                            : node.nimi
                                    );
                                    if (node.$$haettu) {
                                        Algoritmit.traverseUp(node, pnode => (pnode.$$haettu = true));
                                    }
                                });
                            } else {
                                Algoritmit.traverse($scope.perusteRakenne, "osat", node => (node.$$haettu = false));
                            }
                        }
                    });

                    {
                        // Initialize
                        update();
                        Algoritmit.traverse($scope.perusteRakenne, "osat", (node, depth) => {
                            node.$$collapsed = depth > 0;
                            node.pakollinen = Suorituspolku.pakollinen(node);
                        });
                        $scope.toggleAll();
                    }
                }
            },
            "tutkinnonosa@root.amops.osa": {
                templateUrl: "views/amops/osa/tutkinnonosa.html",
                controller: ($q, $scope, ops, peruste, arviointiAsteikot, koodisto, koulutustoimija, pTosaViite) => {
                    $scope.pTosaViite = pTosaViite;
                    $scope.st = _.find(peruste.suoritustavat, st => st.suoritustapakoodi === ops.suoritustapa);
                    const isPaikallinen = _.property("tosa.tyyppi")($scope.osa) === "oma",
                        osaamisalaKoodit = peruste.osaamisalat,
                        paikallisetKoodit = koulutustoimija.all("koodi"),
                        osaAlueKoodit = $scope.pTosa
                            ? _.map($scope.pTosa.osaAlueet, (oa: any) => ({
                                  nimi: oa.nimi,
                                  arvo: oa.koodiArvo,
                                  uri: oa.koodiUri
                              }))
                            : [],
                        koodit = _([])
                            .concat(osaAlueKoodit)
                            .concat(osaamisalaKoodit)
                            .indexBy("uri")
                            .value(),
                        haeKoodiTiedot = koodiUrit =>
                            $q
                                .all(_.map(koodiUrit, uri => koodisto.one("uri/" + uri).get()))
                                .then(Koodisto.parseRawKoodisto),
                        paivitaKoodistoTiedot = () => {
                            const toteutuksienKoodit = _($scope.osa.tosa.toteutukset)
                                .map("koodit")
                                .flatten()
                                .uniq()
                                .reject((koodi: string) => !!$scope.koodistoTiedot[koodi])
                                .value();

                            haeKoodiTiedot(toteutuksienKoodit).then(koodit => {
                                _.each(koodit, koodi => {
                                    $scope.koodistoTiedot[koodi.uri] = koodi;
                                });
                            });
                        };

                    $scope.paikallinenKoodiUpdate = pkoodi => {
                        if (pkoodi) {
                            const fullKoodi = Koodisto.paikallinenToFull(koulutustoimija, pkoodi);
                            paikallisetKoodit
                                .one(fullKoodi)
                                .getList()
                                .then(
                                    res =>
                                        ($scope.tormaavatKoodit = _.reject(
                                            res,
                                            (koodi: any) => koodi.id === $scope.osa.id
                                        ))
                                );
                        }
                    };

                    $scope.paikallinenKoodiUpdate(_.property("tosa.omatutkinnonosa.koodi")($scope.osa));

                    {
                        // Init block
                        $scope.koodistoTiedot = {};
                        $scope.$$showToteutus = true;
                        $scope.koodit = koodit;
                        $scope.peruste = peruste;
                        $scope.sortableOptions = {
                            handle: ".toteutus-handle",
                            cursor: "move",
                            delay: 100,
                            tolerance: "pointer",
                            placeholder: "toteutus-placeholder"
                        };

                        paivitaKoodistoTiedot();
                    }

                    $scope.pa = {
                        arviointiasteikko: x => x._arviointiasteikko || x._arviointiAsteikko
                    };

                    $scope.sortableOptionsArvioinninKohdealueet = Sorting.getSortableOptions(".arviointi-kohdealueet");
                    $scope.sortableOptionsArvioinninKohteet = Sorting.getSortableOptions(".arviointi-kohteet");
                    $scope.sortableOptionsOsaamistasonKriteerit = Sorting.getSortableOptions(".osaamistason-kriteerit");
                    $scope.sortableOptionsAmmattitaitovaatimukset = Sorting.getSortableOptions(
                        ".ammattitaitovaatimukset"
                    );
                    $scope.sortableOptionsVaatimuksenKohteet = Sorting.getSortableOptions(".vaatimuksen-kohteet");
                    $scope.sortableOptionsVaatimukset = Sorting.getSortableOptions(".vaatimukset");

                    $scope.arviointiAsteikot = arviointiAsteikot;
                }
            }
        }
    })
);
