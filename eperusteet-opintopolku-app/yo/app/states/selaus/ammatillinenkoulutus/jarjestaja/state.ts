/*
 * Copyright (c) 2017 The Finnish Board of Education - Opetushallitus
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

angular.module("app").config($stateProvider => {
    $stateProvider.state("root.selaus.jarjestajat", {
        url: "/jarjestajat/:ktId",
        template: "<div ui-view></div>",
        params: {
            hakutyyppi: "perusteet"
        },
        resolve: {
            koulutustoimija: (Api, $stateParams) => Api.one("julkinen/koulutustoimijat", $stateParams.ktId).get(),

            opsHaku: Api => Api.one("julkinen/opetussuunnitelmat"),

            async yhteiset(koulutustoimija, opsHaku, Kieli) {
                const yhteiset = await opsHaku.get({
                    tyyppi: "yhteinen",
                    organisaatio: koulutustoimija.organisaatio,
                    kieli: Kieli.getUiKieli()
                });
                return yhteiset.data;
            },

            tiedotteet: (koulutustoimija, Kieli) => koulutustoimija.all("tiedotteet").customGETLIST("", {
                kieli: Kieli.getUiKieli()
            })
        },
        views: {
            "": {
                templateUrl: "views/states/koostenakyma/koulutustoimija/view.html",
                controller: (
                    $scope,
                    $timeout,
                    $q,
                    $state,
                    $stateParams,
                    koulutustoimija,
                    yhteiset,
                    opsHaku,
                    PerusteApi,
                    tiedotteet,
                    Kieli
                ) => {
                    if (_.isArray(tiedotteet)) {
                        tiedotteet.reverse();
                    }

                    $scope.koulutustoimija = koulutustoimija;
                    $scope.yhteiset = yhteiset;

                    $scope.haku = "";
                    $scope.isLoading = true;
                    $scope.opetussuunnitelmat = [];
                    $scope.sivu = 1;
                    $scope.sivukoko = 5;
                    $scope.hakuvalinnat = ["ops", "yleinen"];
                    let canceler = null;

                    $scope.avattu = -1;
                    $scope.avaa = idx => ($scope.avattu = idx === $scope.avattu ? -1 : idx);
                    $scope.tiedotteet = tiedotteet;
                    $scope.tiedoteMaara = 5;
                    $scope.toggleTiedoteMaara = $scope.tiedoteMaara = $scope.tiedoteMaara === 5 ? 30 : 5;

                    $scope.hasTyyppi = tyyppi => _.includes($scope.hakuvalinnat, tyyppi);

                    $scope.toggle = field => {
                        if (_.includes($scope.hakuvalinnat, field)) {
                            if (_.size($scope.hakuvalinnat) === 1) {
                                return;
                            }
                            _.pull($scope.hakuvalinnat, field);
                        } else {
                            $scope.hakuvalinnat.push(field);
                        }
                        $scope.hakuMuuttui();
                    };

                    const perusteCache = {};
                    const tutkintonimikeCache = {};

                    async function haeOpetussuunnitelmista() {
                        $scope.isLoading = true;
                        if (canceler) {
                            canceler.resolve();
                        }

                        $timeout(async () => {
                            try {
                                canceler = $q.defer();
                                const opsit = await opsHaku
                                    .withHttpConfig(
                                        {
                                            // timeout: canceler.promise
                                        }
                                    )
                                    .get({
                                        organisaatio: koulutustoimija.organisaatio,
                                        tyyppi: $scope.hakuvalinnat,
                                        nimi: $scope.haku,
                                        sivu: $scope.sivu - 1,
                                        sivukoko: $scope.sivukoko,
                                        kieli: Kieli.getUiKieli()
                                    });

                                $scope.opetussuunnitelmat = opsit.data;
                                $scope.sivu = opsit.sivu + 1;
                                $scope.sivuja = opsit.sivuja;
                                $scope.sivukoko = opsit.sivukoko;
                                $scope.kokonaismaara = opsit["kokonaismäärä"];
                                canceler = null;

                                $timeout(() => {
                                    _.forEach($scope.opetussuunnitelmat, async ops => {
                                        if (!perusteCache[ops.peruste.perusteId]) {
                                            try {
                                                const peruste = await PerusteApi.one(
                                                    "perusteet",
                                                    ops.peruste.perusteId
                                                ).get();
                                                perusteCache[ops.peruste.perusteId] = peruste;
                                            } catch (ex) {}
                                        }

                                        if (!tutkintonimikeCache[ops.peruste.perusteId]) {
                                            try {
                                                const tutkintonimikekoodit = await PerusteApi.one(
                                                    "perusteet",
                                                    ops.peruste.perusteId
                                                )
                                                    .all("tutkintonimikekoodit")
                                                    .getList();
                                                tutkintonimikeCache[ops.peruste.perusteId] = _(tutkintonimikekoodit)
                                                    .map(tn =>
                                                        _.fromPairs(
                                                            _.map(
                                                                tn.b[tn.tutkintonimikeArvo].metadata,
                                                                ({ kieli, nimi }) => [kieli.toLowerCase(), nimi]
                                                            )
                                                        )
                                                    )
                                                    .value();
                                            } catch (ex) {}
                                        }

                                        $timeout(() => {
                                            $scope.$apply(() => {
                                                ops.$$osaamisalat = _.isObject(perusteCache[ops.peruste.perusteId])
                                                    ? perusteCache[ops.peruste.perusteId].osaamisalat || []
                                                    : [];
                                                ops.$$tutkintonimikkeet =
                                                    tutkintonimikeCache[ops.peruste.perusteId] || [];
                                            });
                                        });
                                    });
                                });
                            } catch (ex) {
                                $scope.opetussuunnitelmat = [];
                            } finally {
                                $timeout(() => ($scope.isLoading = false));
                            }
                        }, 200);
                    }

                    $timeout(() => haeOpetussuunnitelmista());
                    $scope.hakuMuuttui = () => haeOpetussuunnitelmista();
                }
            }
        }
    });
});
