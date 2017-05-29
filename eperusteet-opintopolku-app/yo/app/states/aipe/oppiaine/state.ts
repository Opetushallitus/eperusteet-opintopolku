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

angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.aipe.vaihe.oppiaine', {
    url: '/oppiaineet/:oppiaineId',
    templateUrl: 'eperusteet-esitys/views/oppiaine.html',
    controller: (vaihe, $scope, $state, MurupolkuData, oppiaine, oppimaarat, kurssit, laajaalaiset) => {
        $scope.oppiaine = oppiaine;
        $scope.oppimaarat = oppimaarat;
        $scope.kurssit = kurssit;
        $scope.laajaalaiset = laajaalaiset;
        MurupolkuData.set({ oppiaineId: $scope.oppiaine.id, oppiaineNimi: $scope.oppiaine.nimi });
        $scope.isOppiaine = () => $state.is('root.aipe.vaihe.oppiaine');
    },
    resolve: {
        oppiaineId: $stateParams => $stateParams.oppiaineId,
        oppiaine: (oppiaineId, perusteId, vaiheId, AipeOppiaineet) => AipeOppiaineet.get({
            perusteId: perusteId,
            vaiheId: vaiheId,
            oppiaineId: oppiaineId
        }).$promise,
        oppimaarat: (oppiaineId, perusteId, vaiheId, AipeOppimaarat) => AipeOppimaarat.query({
            perusteId: perusteId,
            vaiheId: vaiheId,
            oppiaineId: oppiaineId
        }).$promise,
        kurssit: (oppiaineId, perusteId, vaiheId, AipeKurssit) => AipeKurssit.query({
            perusteId: perusteId,
            vaiheId: vaiheId,
            oppiaineId: oppiaineId,
        }).$promise
    }
}));
