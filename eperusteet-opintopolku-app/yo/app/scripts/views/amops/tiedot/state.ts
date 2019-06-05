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
    $stateProvider.state("root.amops.tiedot", {
        url: "/tiedot",
        templateUrl: "views/amops/tiedot/view.html",
        controller: ($scope, $stateParams, ops) => {
            const dokumenttiUrlLataaja = async (kieli) => {
                try {
                    const doc = await ops.customGET("dokumentti/tila", {
                        kieli
                    });

                    if (doc.tila === "valmis") {
                        return ops.getRequestedUrl() + "/dokumentti?kieli=" + kieli;
                    } else {
                        return null;
                    }
                } catch (e) {
                    // Ei pitäisi tapahtua
                    return null;
                }
            };

            $scope.$$ladataanDokumenttia = true;

            dokumenttiUrlLataaja($stateParams.lang).then(res => {
                $scope.dokumenttiUrl = res;
                $scope.$$ladataanDokumenttia = false;
            });
        }
    })
);
