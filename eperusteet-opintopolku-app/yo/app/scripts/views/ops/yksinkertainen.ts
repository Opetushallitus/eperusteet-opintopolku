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
    export const OpsYksinkertainenController = (
        $q,
        $scope,
        $document,
        $state,
        ops,
        TermistoService,
        otsikot,
        epMenuBuilder,
        $timeout,
        $rootScope,
        epPerusopetusStateService,
        opsId,
        Kieli,
        epEsitysSettings,
        MurupolkuData,
        $stateParams
    ) => {
        $scope.isNaviVisible = _.constant(true);
        $scope.otsikot = otsikot;
        $scope.ops = ops;

        $scope.hasContent = obj => {
            return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
        };

        const getRootState = current => {
            return current.replace(/\.(esiopetus|varhaiskasvatus|lisaopetus|aipe)(.*)/, ".$1");
        };

        TermistoService.setResource(ops, "OPS");

        const clickHandler = event => {
            const ohjeEl = angular.element(event.target).closest(".popover, .popover-element");
            if (ohjeEl.length === 0) {
                $rootScope.$broadcast("ohje:closeAll");
            }
        };

        const installClickHandler = () => {
            $document.off("click", clickHandler);
            $timeout(() => {
                $document.on("click", clickHandler);
            });
        };

        $scope.$on("$destroy", function() {
            $document.off("click", clickHandler);
        });

        installClickHandler();

        MurupolkuData.set({ opsId: ops.id, opsNimi: ops.nimi });

        $scope.naviClasses = function(item) {
            const classes = ["depth" + item.depth];
            if (item.$selected) {
                classes.push("tekstisisalto-active");
            }
            if (item.$header) {
                classes.push("tekstisisalto-active-header");
            }
            return classes;
        };

        $scope.$on("$stateChangeSuccess", function() {
            epPerusopetusStateService.setState($scope.navi);
        });

        $scope.$on("$stateChangeSuccess", function() {
            if (
                $state.current.name ===
                ("root.ops.esiopetus" || "root.ops.varhaiskasvatus" || "root.ops.lisaopetus" || "root.ops.aipe")
            ) {
                $state.go(".tiedot", { location: "replace" });
            }
        });

        $scope.navi = {
            header: "opetussuunnitelma",
            sections: [
                {
                    id: "tekstikappale",
                    $open: true,
                    items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
                    include: "views/ops/opsVlk.html"
                }
            ]
        };

        const currentRootState = getRootState($state.current.name);

        _.each($scope.navi.sections[0].items, function(item) {
            if (item.$osa) {
                item.href = $state.href(currentRootState + ".tekstikappale", {
                    perusteId: $stateParams.perusteId,
                    tekstikappaleId: item.$osa.id
                });
            }
        });

        $scope.navi.sections[0].items.unshift({
            depth: 0,
            label: "opetussuunnitelman-tiedot",
            link: [currentRootState + ".tiedot"]
        });
    };

    export const OpsYksinkertainenTiedotController = ($scope, dokumenttiId) => {
        if (dokumenttiId && dokumenttiId.toString().length > 0) {
            $scope.dokumenttiUrl = location.origin + "/eperusteet-ylops-service/api/dokumentit/" + dokumenttiId;
        }
    };

    export const OpsTekstikappaleController = (
        $scope,
        $state,
        $stateParams,
        tekstikappaleWithChildren,
        MurupolkuData
    ) => {
        $scope.tekstikappale = tekstikappaleWithChildren.tekstiKappale;
        $scope.lapset = tekstikappaleWithChildren.lapset;
        MurupolkuData.set({ tekstikappaleId: $scope.tekstikappale.id, tekstikappaleNimi: $scope.tekstikappale.nimi });
    };
}
