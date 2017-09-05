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
    $stateProvider.state("root.lisaopetus", {
        url: "/lisaopetus/:perusteId",
        templateUrl: "eperusteet-esitys/views/yksinkertainen.html",
        controller: Controllers.epYksinkertainenPerusteController,
        resolve: {
            perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

            peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
                !perusteId
                    ? UusimmatPerusteetService.getLisaopetus()
                    : Perusteet.get({ perusteId: perusteId }).$promise,

            sisalto: (serviceConfig, peruste, $q, SuoritustapaSisalto) => {
                if (_.isArray(peruste.data)) {
                    peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
                }
                const perusteId = peruste.id;
                return $q.all([
                    peruste,
                    perusteId
                        ? SuoritustapaSisalto.get({ perusteId: perusteId, suoritustapa: "lisaopetus" }).$promise
                        : {}
                ]);
            },

            koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,

            opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
        }
    })
);
