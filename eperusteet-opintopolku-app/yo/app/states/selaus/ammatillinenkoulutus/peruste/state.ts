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

angular.module("app")
.config(($stateProvider) => {
    $stateProvider
        .state("root.selaus.perusteinfo", {
            url: "/perusteinfo/:perusteId",
            template: "<div ui-view></div>",
            resolve: {
                peruste: (PerusteApi, $stateParams) => PerusteApi.one("perusteet", $stateParams.perusteId).get(),
                perusteenTiedotteet: (PerusteApi, $stateParams) => {
                    const MONTH_OFFSET = 12 * 30 * 24 * 60 * 60 * 1000;
                    const alkaen = (new Date()).getTime() - MONTH_OFFSET;
                    return PerusteApi.all("tiedotteet").getList({
                        perusteId: $stateParams.perusteId,
                        vainJulkiset: true,
                        alkaen
                    });
                },
                async opetussuunnitelmat(peruste, Api) {
                    try {
                        const opsit = await Api.all("julkinen/perusteenopetussuunnitelmat").getList({
                            perusteenDiaarinumero: peruste.diaarinumero
                        });
                        return opsit;
                    }
                    catch (ex) {
                        return [];
                    }
                }
            },
            views: {
                "": {
                    templateUrl: "views/states/koostenakyma/peruste/view.html",
                    controller: ($scope, $state, $stateParams, peruste, perusteenTiedotteet) => {
                        $scope.tiedoteMaara = 5;
                        $scope.peruste = peruste;
                        $scope.perusteenTiedotteet = perusteenTiedotteet;

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
                    },
                },
                "paikalliset@root.selaus.perusteinfo": {
                    templateUrl: "views/states/koostenakyma/peruste/paikalliset.html",
                    controller($scope, $state, peruste, opetussuunnitelmat) {
                        $scope.tutkintonimiketaulu = _.groupBy(peruste.tutkintonimikkeet, "tutkintonimikeUri");
                        $scope.opetussuunnitelmat = opetussuunnitelmat;
                    }
                },
            },
        });
});
