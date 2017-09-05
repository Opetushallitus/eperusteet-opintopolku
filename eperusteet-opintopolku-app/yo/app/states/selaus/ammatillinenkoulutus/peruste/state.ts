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
    $stateProvider.state("root.selaus.perusteinfo", {
        url: "/perusteinfo/:perusteId",
        template: "<div ui-view></div>",
        resolve: {
            peruste: (PerusteApi, $stateParams) => PerusteApi.one("perusteet", $stateParams.perusteId).get(),

            tutkintonimikkeet: peruste => peruste.one("tutkintonimikekoodit").get(),

            perusteenTiedotteet: (PerusteApi, $stateParams) => {
                const MONTH_OFFSET = 12 * 30 * 24 * 60 * 60 * 1000;
                const alkaen = new Date().getTime() - MONTH_OFFSET;
                return PerusteApi.all("tiedotteet").getList({
                    perusteId: $stateParams.perusteId,
                    vainJulkiset: true,
                    alkaen
                });
            },

            paikallisetHaku: (peruste, Api) => Api.one("julkinen/opetussuunnitelmat")
        },
        views: {
            "": {
                templateUrl: "views/states/koostenakyma/peruste/view.html",
                controller: ($scope, $state, $stateParams, peruste, perusteenTiedotteet, tutkintonimikkeet) => {
                    $scope.tiedoteMaara = 5;
                    $scope.peruste = peruste;
                    $scope.perusteenTiedotteet = perusteenTiedotteet;
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

                    $scope.perusteUrl = $state.href("root.esitys.peruste", {
                        perusteId: peruste.id,
                        suoritustapa: peruste.suoritustavat[0].suoritustapakoodi
                    });

                    $scope.goToPeruste = () => {
                        $state.go("root.esitys.peruste", {
                            perusteId: peruste.id,
                            suoritustapa: peruste.suoritustavat[0].suoritustapakoodi
                        });
                    };
                }
            },
            "paikalliset@root.selaus.perusteinfo": {
                templateUrl: "views/states/koostenakyma/peruste/paikalliset.html",
                controller($scope, $state, $timeout, $q, peruste, paikallisetHaku) {
                    $scope.tutkintonimiketaulu = _.groupBy(peruste.tutkintonimikkeet, "tutkintonimikeUri");
                    $scope.haku = "";
                    $scope.isLoading = true;
                    $scope.opetussuunnitelmat = [];
                    $scope.sivu = 1;
                    $scope.sivukoko = 10;
                    let canceler = null;

                    async function haeOpetussuunnitelmista() {
                        $scope.isLoading = true;
                        if (canceler) {
                            canceler.resolve();
                        }

                        $timeout(async () => {
                            try {
                                canceler = $q.defer();
                                const opsit = await paikallisetHaku
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

                    $timeout(() => haeOpetussuunnitelmista());
                    $scope.hakuMuuttui = () => haeOpetussuunnitelmista();
                }
            }
        }
    });
});
