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
    const paikallisetView = {
        templateUrl: "views/states/koostenakyma/peruste/paikalliset.html",
        controller($scope, $state, $timeout, $q, peruste, PerusteenRakenne, Api, YlopsApi, Algoritmit) {
            $scope.tutkintonimiketaulu = _.groupBy(peruste.tutkintonimikkeet, "tutkintonimikeUri");
            $scope.haku = "";
            $scope.isLoading = true;
            $scope.opetussuunnitelmat = [];
            $scope.sivu = 1;
            $scope.sivukoko = 10;
            let canceler = null;
            let ylopsPaikalliset = null;
            const isAmmatillinen = PerusteenRakenne.isAmmatillinen(peruste.koulutustyyppi);
            $scope.isAmmatillinen = isAmmatillinen;

            const koulutustyypitLinkit = {
                koulutustyyppi_15: "esiopetus",
                koulutustyyppi_16: "perusopetus",
                koulutustyyppi_20: "esiopetus",
                koulutustyyppi_22: "perusopetus",
                koulutustyyppi_23: "lukioopetus",
                koulutustyyppi_2: "lukioopetus",
                koulutustyyppi_6: "esiopetus",
                koulutustyyppi_999907: "tpo"
            };

            const getKtLinkki = ops => $state.href("root.ops." + koulutustyypitLinkit[ops.koulutustyyppi] + ".tiedot", {
                opsId: ops.id
            });

            if (!isAmmatillinen) {
                $scope.isLoading = true;
                ylopsPaikalliset = YlopsApi.one("opetussuunnitelmat/julkiset").getList()
                    .then(res => _.map(res, (ops: any) => ({
                        ...ops.plain(),
                        $$href: getKtLinkki(ops),
                        $$kunnat: ops.kunnat,
                        $$organisaatiot: _.filter(ops.organisaatiot, (org: any) => _.includes(org.tyypit, "Koulutustoimija")),
                        $$oppilaitokset: _.filter(ops.organisaatiot, (org: any) => _.includes(org.tyypit, "Oppilaitos")),
                    })));
            }

            async function haeOpetussuunnitelmista() {
                if (isAmmatillinen) {
                    $scope.isLoading = true;
                    if (canceler) {
                        canceler.resolve();
                    }

                    $timeout(async () => {
                        try {
                            canceler = $q.defer();
                            const opsit = await Api.one("julkinen/opetussuunnitelmat")
                                .withHttpConfig(
                                    {
                                        // timeout: canceler.promise
                                    }
                                )
                                .get({
                                    perusteenDiaarinumero: peruste.diaarinumero,
                                    nimi: $scope.haku,
                                    sivu: $scope.sivu - 1,
                                    sivukoko: $scope.sivukoko
                                });

                            $scope.opetussuunnitelmat = opsit.data;
                            $scope.sivu = opsit.sivu + 1;
                            $scope.sivuja = opsit.sivuja;
                            $scope.sivukoko = opsit.sivukoko;
                            $scope.kokonaismaara = opsit["kokonaismäärä"];
                            canceler = null;
                        } catch (ex) {
                            $scope.opetussuunnitelmat = [];
                        } finally {
                            $timeout(() => ($scope.isLoading = false));
                        }
                    }, 200);
                }
                else {
                    ylopsPaikalliset.then((data) => {
                        const matching = _(data)
                            .filter((ops: any) => ops.koulutustyyppi === peruste.koulutustyyppi)
                            .filter((ops: any) => Algoritmit.match($scope.haku, ops.nimi))
                            .sortBy("nimi." + KieliService.getUiKieli())
                            .value();
                        $scope.sivuja = Math.ceil(_.size(matching) / $scope.sivukoko);
                        $scope.kokonaismaara = _.size(matching);
                        $scope.opetussuunnitelmat = _(matching)
                            .drop(($scope.sivu - 1) * $scope.sivukoko)
                            .take($scope.sivukoko)
                            .value();
                    })
                    .finally(() => {
                        $scope.isLoading = false;
                    });
                }
            }

            $timeout(() => haeOpetussuunnitelmista());
            $scope.hakuMuuttui = () => haeOpetussuunnitelmista();
        }
    };

    const impl = {
        url: "/perusteinfo/:perusteId",
        template: "<div ui-view></div>",
        resolve: {
            peruste(PerusteApi, $stateParams) {
                return PerusteApi.one("perusteet", $stateParams.perusteId).get();
            },

            tutkintonimikkeet(peruste) {
                return peruste.one("tutkintonimikekoodit").get();
            },

            perusteenTiedotteet: (PerusteApi, $stateParams) => {
                const MONTH_OFFSET = 12 * 30 * 24 * 60 * 60 * 1000;
                const alkaen = new Date().getTime() - MONTH_OFFSET;
                return PerusteApi.all("tiedotteet").getList({
                    perusteId: $stateParams.perusteId,
                    vainJulkiset: true,
                    alkaen
                });
            },
        },
        views: {
            "": {
                templateUrl: "views/states/koostenakyma/peruste/view.html",
                controller: ($scope, $state, $stateParams, peruste, perusteenTiedotteet, tutkintonimikkeet, PerusteenRakenne) => {
                    $scope.tiedoteMaara = 5;
                    $scope.peruste = peruste;
                    $scope.perusteenTiedotteet = perusteenTiedotteet;
                    $scope.isAmmatillinen = PerusteenRakenne.isAmmatillinen(peruste.koulutustyyppi);

                    $scope.tutkintonimikkeet = _(tutkintonimikkeet)
                        .map(tn =>
                            _.fromPairs(
                                _.map(tn.b[tn.tutkintonimikeArvo].metadata, ({ kieli, nimi }) => [
                                    kieli.toLowerCase(),
                                    nimi
                                ])
                            )
                        )
                        .value();

                    $scope.toggleTiedoteMaara = () => {
                        $scope.tiedoteMaara = $scope.tiedoteMaara === 5 ? 30 : 5;
                    };

                    const suoritustapa = PerusteenRakenne.valitseSuoritustapa(peruste);
                    $scope.perusteUrl = PerusteenRakenne.rakennaEsityslinkki(peruste);
                }
            },
            // FIXME: Poistetaan root.selaus.perusteinfo tulevaisuudessa
            "paikalliset@root.selaus.perusteinfo": paikallisetView,
            "paikalliset@root.kooste": paikallisetView,
        }
    };

    $stateProvider.state("root.selaus.perusteinfo", impl); // deprekoitu
    $stateProvider.state("root.kooste", {
        ...impl,
        url: "/kooste/:perusteId",
    });
});
