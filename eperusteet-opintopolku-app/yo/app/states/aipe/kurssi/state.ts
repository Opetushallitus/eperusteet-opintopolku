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

angular.module("app").config($stateProvider =>
    $stateProvider.state("root.aipe.vaihe.oppiaine.kurssi", {
        url: "/kurssit/:kurssiId",
        templateUrl: "eperusteet-esitys/views/kurssi.html",
        controller: ($scope, MurupolkuData, kurssi) => {
            $scope.kurssi = kurssi;
            MurupolkuData.set({ kurssiId: $scope.kurssi.id, kurssiNimi: $scope.kurssi.nimi });
            $scope.tavoitteetFilter = item => {
                return _.includes($scope.kurssi.tavoitteet, item.id + "");
            };
        },
        resolve: {
            oppiaineId: $stateParams => $stateParams.oppiaineId,
            kurssiId: $stateParams => $stateParams.kurssiId,
            kurssi: (oppiaineId, perusteId, vaiheId, kurssiId, AipeKurssit) =>
                AipeKurssit.get({
                    perusteId: perusteId,
                    vaiheId: vaiheId,
                    oppiaineId: oppiaineId,
                    kurssiId: kurssiId
                }).$promise
        }
    })
);
