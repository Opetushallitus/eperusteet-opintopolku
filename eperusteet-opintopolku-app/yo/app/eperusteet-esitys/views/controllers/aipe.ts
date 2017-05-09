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
    export const epAipeController = ($scope, perusteId, perusteList, $state, $stateParams, MurupolkuData, sisalto,
                                     epMenuBuilder, koulutusalaService, opintoalaService) => {
        const peruste = sisalto[0];
        $scope.peruste = peruste;
        $scope.Koulutusalat = koulutusalaService;
        $scope.Opintoalat = opintoalaService;
        console.log($scope.peruste);

        // Murupolun alustus
        MurupolkuData.set({
            perusteId: $scope.peruste.id,
            perusteNimi: $scope.peruste.nimi
        });

        // Sivunavin asetukset Aipea varten
        $scope.naviClasses = item => {
            var classes = ['depth' + item.depth];
            if (item.$selected) {
                classes.push('tekstisisalto-active');
            }
            if (item.$header) {
                classes.push('tekstisisalto-active-header');
            }
            return classes;
        };
        $scope.otsikot = {};
        $scope.navi = {
            header: 'perusteen-sisalto',
            showOne: true,
            sections: [{
                    id: 'suunnitelma',
                    include: 'eperusteet-esitys/views/tekstisisalto.html',
                    items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
                    naviClasses: $scope.naviClasses,
                    title: 'yhteiset-osuudet'
            }, {
                    title: 'vaiheet',
                    id: 'vaiheet',
                    items: [],
                    naviClasses: $scope.naviClasses,
                    include: 'eperusteet-esitys/views/vlk.html',
                    state: $scope.state
            }]
        };

        // Uudelleenohjaa Aipen root tilasta tiedot tilaan
        function getRootState(current) {
            return current.replace(/\.(aipe)(.*)/, '.$1');
        }
        const currentRootState = getRootState($state.current.name);
        $scope.$on('$stateChangeSuccess', () => {
            if ($state.current.name === currentRootState && (!$state.includes("**.tiedot") || !$stateParams.perusteId)) {
                $state.go('.tiedot', {
                    perusteId: $scope.peruste.id
                }, {
                    location: 'replace'
                });
            }
        });
    };
}
