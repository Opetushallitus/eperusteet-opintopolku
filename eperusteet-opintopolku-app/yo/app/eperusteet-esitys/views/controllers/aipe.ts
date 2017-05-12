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
    export const epAipeController = ($scope, perusteId, $state, $stateParams, MurupolkuData, sisalto, epMenuBuilder,
                                     koulutusalaService, opintoalaService, epPerusopetusStateService, peruste,
                                     vaiheet, Kieli) => {
        $scope.peruste = sisalto[0];
        $scope.Koulutusalat = koulutusalaService;
        $scope.Opintoalat = opintoalaService;
        $scope.tekstisisalto = sisalto[1];
        $scope.vaiheet = vaiheet;

        $scope.$on('$stateChangeSuccess', () => {
            epPerusopetusStateService.setState($scope.navi);
        });

        $scope.hasContent = (obj) => _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];

        // Murupolun alustus
        MurupolkuData.set({
            perusteId: $scope.peruste.id,
            perusteNimi: $scope.peruste.nimi
        });

        // Aipen root tila
        function getRootState(current) {
            return current.replace(/\.(aipe)(.*)/, '.$1');
        }

        const currentRootState = getRootState($state.current.name);

        // Sivunavin asetukset Aipea varten
        $scope.naviClasses = item => {
            let classes = [];
            if (item.depth) {
                classes.push('depth' + item.depth);
            }
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
                $open: true,
                items: epMenuBuilder.rakennaTekstisisalto($scope.tekstisisalto),
                naviClasses: $scope.naviClasses,
                title: 'yhteiset-osuudet'
            }, {
                id: 'vaiheet',
                include: 'eperusteet-esitys/views/vaiheet.html',
                items: epMenuBuilder.rakennaVaiheet($scope.vaiheet),
                naviClasses: $scope.naviClasses,
                title: 'vaiheet'
            }]
        };

        $scope.navi.sections[0].items.unshift({
            depth: 0,
            label: 'perusteen-tiedot',
            link: [currentRootState + '.tiedot'],
        });

        // Uudelleenohjaa Aipen root tilasta tiedot tilaan
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
