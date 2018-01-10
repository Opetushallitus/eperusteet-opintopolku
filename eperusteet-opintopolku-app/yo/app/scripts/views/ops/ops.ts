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

angular
    .module("app")
    .controller("OpsController", function($scope, $state, $location, $window, TermistoService, otsikot, ops) {
        $scope.ops = ops;
        $scope.otsikot = otsikot;
        TermistoService.setResource(ops, "OPS");
        const koulutustyyppi = $scope.ops.koulutustyyppi;
        const kltMap = {
            koulutustyyppi_2: ".lukioopetus",
            koulutustyyppi_6: ".lisaopetus",
            koulutustyyppi_15: ".esiopetus",
            koulutustyyppi_16: ".perusopetus",
            koulutustyyppi_17: ".aipe"
        };
        if ($state.is("root.ops")) {
            $state.go(kltMap[koulutustyyppi], { location: "replace" });
        }
        $scope.returnToYlops = () => {
            const isTestEnvironment = _.includes(_.words($location.absUrl()), "testi");
            $window.location.href = isTestEnvironment
                ? "https://testi.virkailija.opintopolku.fi/eperusteet-ylops-app/#/fi/opetussuunnitelmat/" +
                  $scope.ops.id +
                  "/tiedot"
                : "https://virkailija.opintopolku.fi/eperusteet-ylops-app/#/fi/opetussuunnitelmat/" +
                  $scope.ops.id +
                  "/tiedot";
        };
    });
