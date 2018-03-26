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

namespace Controllers {
    export const epYksinkertainenPerusteController = (
        $q,
        $scope,
        $timeout,
        sisalto,
        PerusteenOsat,
        $state,
        $stateParams,
        epMenuBuilder,
        Algoritmit,
        Utils,
        MurupolkuData,
        Oppiaineet,
        TermistoService,
        Kieli,
        $document,
        $rootScope,
        epPerusopetusStateService,
        koulutusalaService,
        opintoalaService
    ) => {
        function getRootState(current) {
            return current.replace(/\.(esiopetus|lisaopetus|perusvalmistava|varhaiskasvatus|tpo|opas)(.*)/, ".$1");
        }

        $scope.Koulutusalat = koulutusalaService;
        $scope.Opintoalat = opintoalaService;
        const currentRootState = getRootState($state.current.name);
        $scope.isNaviVisible = _.constant(true);
        $scope.hasContent = function(obj) {
            return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
        };
        const peruste = sisalto[0];
        $scope.peruste = peruste;
        console.log(peruste);
        MurupolkuData.set({ perusteId: peruste.id, perusteNimi: peruste.nimi });
        $scope.sisallot = _.zipBy(sisalto[1], "id");
        $scope.tekstisisalto = sisalto[1];

        $scope.state = epPerusopetusStateService.getState();

        function mapSisalto(sisalto) {
            sisalto = _.clone(sisalto);
            let flattened = {};
            Algoritmit.kaikilleLapsisolmuille(sisalto, "lapset", lapsi => {
                flattened[lapsi.id] = lapsi.perusteenOsa;
            });
            return flattened;
        }

        $scope.sisalto = mapSisalto($scope.tekstisisalto);

        TermistoService.setResource(peruste);

        $scope.naviClasses = function(item) {
            let classes = ["depth" + item.depth];
            if (item.$selected) {
                classes.push("tekstisisalto-active");
            }
            if (item.$header) {
                classes.push("tekstisisalto-active-header");
            }
            return classes;
        };

        function clickHandler(event) {
            const ohjeEl = angular.element(event.target).closest(".popover, .popover-element");
            if (ohjeEl.length === 0) {
                $rootScope.$broadcast("ohje:closeAll");
            }
        }

        function installClickHandler() {
            $document.off("click", clickHandler);
            $timeout(function() {
                $document.on("click", clickHandler);
            });
        }

        $scope.$on("$destroy", function() {
            $document.off("click", clickHandler);
        });

        $scope.$on("$stateChangeSuccess", function() {
            epPerusopetusStateService.setState($scope.navi);
        });

        $scope.navi = {
            header: "perusteen-sisalto",
            sections: [
                {
                    id: "sisalto",
                    $open: true,
                    items: epMenuBuilder.rakennaTekstisisalto($scope.tekstisisalto)
                }
            ]
        };

        $scope.navi.sections[0].items.unshift({
            depth: 0,
            label: "perusteen-tiedot",
            link: [currentRootState + ".tiedot"]
        });

        _.each($scope.navi.sections[0].items, function(item) {
            const osa = item.$osa;
            if (osa) {
                if (item.tyyppi === "taiteenalaOsa") {
                    item.href = $state.href(currentRootState + ".taiteenalaOsa", {
                        perusteId: $scope.peruste.id,
                        tekstikappaleId: osa.id,
                        taiteenalaOsa: item.id
                    });
                } else if (item.tyyppi === "taiteenala") {
                    item.href = $state.href(currentRootState + ".taiteenala", {
                        perusteId: $scope.peruste.id,
                        tekstikappaleId: osa.id
                    });
                } else {
                    item.href = $state.href(currentRootState + ".tekstikappale", {
                        perusteId: $scope.peruste.id,
                        tekstikappaleId: osa.id
                    });
                }
            }
        });

        installClickHandler();

        $scope.$on("$stateChangeSuccess", function() {
            if (
                $state.current.name === currentRootState &&
                (!$state.includes("**.tiedot") || !$stateParams.perusteId)
            ) {
                $state.go(".tiedot", { perusteId: $scope.peruste.id }, { location: "replace" });
            }
        });
    };
}
