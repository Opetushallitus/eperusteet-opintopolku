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
    $stateProvider.state("root.aipe.tekstikappale", {
        url: "/tekstikappale/:tekstikappaleId",
        templateUrl: "eperusteet-esitys/views/tekstikappale.html",
        controller: Controllers.epPerusopetusTekstikappaleController,
        resolve: {
            tekstikappaleId: $stateParams => $stateParams.tekstikappaleId,
            tekstikappale: (tekstikappaleId, PerusteenOsat) =>
                PerusteenOsat.getByViite({
                    viiteId: tekstikappaleId
                }).$promise,
            lapset: (sisalto, tekstikappaleId, epTekstikappaleChildResolver) =>
                epTekstikappaleChildResolver.get(sisalto[1], tekstikappaleId)
        }
    })
);
