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
    .controller("UutisetController", ($scope, TiedotteetHaku, Kieli) => {
        $scope.sivu = 1;
        $scope.sivukoko = 10;

        function haeTiedotteet() {
            TiedotteetHaku.get({
                sivu: $scope.sivu - 1,
                sivukoko: $scope.sivukoko,
                kieli: Kieli.getSisaltokieli(),
                julkinen: true,
                yleinen: true
            }, res => {
                $scope.tiedotteet = res.data;
                $scope.kokonaismaara = res.kokonaismäärä;
                $scope.sivu = res.sivu + 1;
            });
        }
        haeTiedotteet();

        let hakuViive = 300; // ms
        $scope.hakuMuuttui = _.debounce(_.bind(haeTiedotteet, $scope, 1), hakuViive, {
            leading: false
        });
    });
