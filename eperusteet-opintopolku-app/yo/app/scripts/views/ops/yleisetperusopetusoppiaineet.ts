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
"use strict";
angular
    .module("app")
    .controller("OpsOppiaineetController", function(
        $scope,
        $timeout,
        $stateParams,
        $state,
        Utils,
        ops,
        oppiaine,
        oppiainePeruste,
        MurupolkuData
    ) {
        $scope.oppiaine = oppiaine;
        $scope.peruste = oppiainePeruste;

        const createTabs = () => {
            let tabs = [];
            _.each(ops.vuosiluokkakokonaisuudet, function(vlk) {
                const match = _.filter(oppiaine.vuosiluokkakokonaisuudet, function(v: any) {
                    return vlk.vuosiluokkakokonaisuus._tunniste === v._vuosiluokkakokonaisuus;
                });
                if (match.length) {
                    tabs.push({
                        nimi: vlk.vuosiluokkakokonaisuus.nimi,
                        vlkId: vlk.vuosiluokkakokonaisuus.id,
                        id: <any>match.pop().id
                    });
                }
            });
            return _.sortBy(tabs, Utils.nameSort);
        };

        $scope.vlkTabit = createTabs();

        $scope.tabIsActive = function(tabId) {
            return $stateParams.vuosiId + "" === tabId + "";
        };

        function setMurupolku() {
            let murupolkuParams = {
                parents: null,
                oppiaineId: oppiaine.id,
                oppiaineNimi: oppiaine.nimi
            };

            MurupolkuData.set(murupolkuParams);
        }
        const presentVlk = () => {
            return _.filter($scope.vlkTabit, function(tab: any) {
                return tab.id + "" === $state.params.vlkId + "";
            }).length;
        };

        const goToFirstVlk = () => {
            if (
                (_.endsWith($state.current.name, "oppiaineet") && $scope.vlkTabit.length) ||
                (_.endsWith($state.current.name, "vlk") && !presentVlk() && $scope.vlkTabit.length)
            ) {
                $state.go("root.ops.perusopetus.oppiaineet.vlk", {
                    opsId: $state.params.opsId,
                    oppiaineId: $state.params.oppiaineId,
                    vlkId: $scope.vlkTabit[0].id,
                    vluokkakokonaisuus: $scope.vlkTabit[0].vlkId
                });
            }
        };

        $scope.$on("$stateChangeSuccess", setMurupolku);

        $timeout(goToFirstVlk);

        $scope.addActiveClass = (id, bool) => {
            if (bool) {
                return id + "" === $state.params.vuosiId;
            }
            return id + "" === $state.params.vlkId + "";
        };
    })
    /*OpsVlkOppiaineController
   'root.ops.perusopetus.oppiaineet.vlk'
   */

    .controller("OpsOppiaineetVlkController", function(
        vuosiluokkakokonaisuus,
        vlksuudet,
        vlkPerusteet,
        baseLaajaalaiset,
        VuosiluokkakokonaisuusMapper,
        $state,
        $rootScope,
        oppiainePeruste,
        MurupolkuData,
        $stateParams,
        $timeout,
        Utils,
        $scope
    ) {
        const perusteSisaltoMap = _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus");
        $scope.perusteOppiaine = oppiainePeruste;
        $scope.perusteOppiaineVlkMap = oppiainePeruste
            ? _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus")
            : {};
        $scope.vuosiluokkakokonaisuus = vuosiluokkakokonaisuus;
        const laajaalaisetosaamiset = _.indexBy(baseLaajaalaiset, "tunniste");

        $scope.vlk = _.filter(vlksuudet, (v: any) => {
            return v._tunniste === $scope.vuosiluokkakokonaisuus._vuosiluokkakokonaisuus;
        })[0];

        const vlkPeruste = _.filter(vlkPerusteet, (v: any) => {
            return v.tunniste === $scope.vuosiluokkakokonaisuus._vuosiluokkakokonaisuus;
        })[0];

        VuosiluokkakokonaisuusMapper.init($scope, laajaalaisetosaamiset, vlkPeruste);

        const vuosiTabSort = tab1 => {
            return tab1.vuosiluokka.replace(/\D/g, "").split("") || tab1.vuosiluokka;
        };

        $scope.vlkst = _.sortBy(vuosiluokkakokonaisuus.vuosiluokat, vuosiTabSort);

        $scope.nameSort = Utils.nameSort;
        $scope.perusteOppiaineVlkMap = oppiainePeruste
            ? _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus")
            : {};

        MurupolkuData.set({
            vlkId: $scope.vuosiluokkakokonaisuus.id,
            vlkLabel: "vuosiluokkakokonaisuus"
        });

        const presentVuosi = () => {
            return _.filter($scope.vlkst, function(tab: any) {
                return tab.id + "" === $stateParams.vlkId + "";
            }).length;
        };

        const goToFirstVuosi = () => {
            if (
                (_.endsWith($state.current.name, "vlk") && !presentVuosi() && $scope.vlkst.length) ||
                (_.endsWith($state.current.name, "vuosiluokat") && !presentVuosi() && $scope.vlkst.length)
            ) {
                $state.go("root.ops.perusopetus.oppiaineet.vlk.vuosiluokat", {
                    opsId: $stateParams.opsId,
                    oppiaineId: $stateParams.oppiaineId,
                    vlkId: vuosiluokkakokonaisuus.id,
                    vuosiId: $scope.vlkst[0].id
                });
            }
        };

        $timeout(goToFirstVuosi);
    })
    .controller("OpsVlnOppiaineController", function(
        $scope,
        $timeout,
        $state,
        $stateParams,
        Utils,
        oppiaineId,
        oppiaine,
        MurupolkuData
    ) {
        $scope.oppiaine = oppiaine;
        $scope.vuosiluokat = <any>_($scope.oppiaine.vuosiluokkakokonaisuudet)
            .map("vuosiluokat")
            .reverse()
            .flatten()
            .reject((vl: any) => $stateParams.vuosi && "vuosiluokka_" + $stateParams.vuosi !== vl.vuosiluokka)
            .value();

        $scope.currentVuosiluokka = (<any>_.first(_.sortBy($scope.vuosiluokat, "vuosiluokka"))).vuosiluokka;
        $scope.currentVuosiId = (<any>_.first($scope.vuosiluokat)).id;

        $scope.showVuosi = vuosiluokka => {
            $scope.currentVuosiluokka = vuosiluokka;
        };

        $scope.vlkSisalto = _.filter($scope.oppiaine.vuosiluokkakokonaisuudet, (opVlk: any) => {
            return _.each(opVlk.vuosiluokat, function(v: any) {
                return v.vuosiluokka === $scope.vuosi;
            });
        }).pop();

        MurupolkuData.set({ oppiaineId: $scope.oppiaine.id, oppiaineNimi: $scope.oppiaine.nimi });
    });
