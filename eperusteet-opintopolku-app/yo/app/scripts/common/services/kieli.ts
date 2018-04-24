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
    .service("Kieli", function($rootScope, $state, $stateParams, $translate) {
        var defaultLang = $stateParams.lang || "fi";
        var sisaltokieli = defaultLang;
        var uikieli = defaultLang;

        var SISALTOKIELET = ["fi", "sv", "se", "ru", "en"];

        this.kieliOrder = function(kielikoodi) {
            return _.indexOf(SISALTOKIELET, kielikoodi);
        };

        this.availableSisaltokielet = _.clone(SISALTOKIELET);

        var isValidKielikoodi = function(kielikoodi) {
            return _.indexOf(SISALTOKIELET, kielikoodi) > -1;
        };

        this.setAvailableSisaltokielet = function(kielet) {
            if (_.isArray(kielet) && !_.isEmpty(kielet)) {
                var isValid = _.every(_.map(kielet, isValidKielikoodi));
                if (isValid) {
                    this.availableSisaltokielet = kielet;
                    $rootScope.$broadcast("update:sisaltokielet", kielet);
                }
            }
        };

        this.resetSisaltokielet = function() {
            this.availableSisaltokielet = SISALTOKIELET;
            $rootScope.$broadcast("update:sisaltokielet", SISALTOKIELET);
        };

        this.setSisaltokieli = function(kielikoodi) {
            if (_.indexOf(this.availableSisaltokielet, kielikoodi) > -1) {
                var old = sisaltokieli;
                sisaltokieli = kielikoodi;
                if (old !== kielikoodi) {
                    $rootScope.$broadcast("changed:sisaltokieli", kielikoodi);
                }
            }
        };

        this.getSisaltokieli = function() {
            return sisaltokieli;
        };

        this.setUiKieli = async (kielikoodi) => {
            if (isValidKielikoodi(kielikoodi)) {
                var current = uikieli;
                if (current !== kielikoodi) {
                    uikieli = kielikoodi;
                    moment.locale(kielikoodi);
                    await $translate.use(kielikoodi);
                    $("html").attr("lang", kielikoodi);
                }
            }
        };

        this.getUiKieli = function() {
            return uikieli;
        };

        this.isValidKielikoodi = isValidKielikoodi;
        this.SISALTOKIELET = SISALTOKIELET;
    })
    .directive("kielenvaihto", function() {
        return {
            restrict: "AE",
            scope: {
                modal: "@modal"
            },
            controller: "KieliController",
            template: "<div></div>"
        };
    })
    .controller("KieliController", function($scope, $stateParams, $state, Kieli, $q) {
        $scope.isModal = $scope.modal === "true";
        $scope.sisaltokielet = Kieli.availableSisaltokielet;
        $scope.sisaltokieli = Kieli.getSisaltokieli();
        $scope.kieliOrder = Kieli.kieliOrder;
        $scope.uiLangChangeAllowed = false;
        $scope.kieli = "fi";
        var stateInit = $q.defer();

        $scope.$on("$stateChangeSuccess", function() {
            stateInit.resolve();
        });

        $q.all([stateInit.promise]).then(async () => {
            const lang = "fi"; // TODO default language based on host
            if (Kieli.isValidKielikoodi(lang)) {
                await Kieli.setUiKieli(lang);
                Kieli.setSisaltokieli(lang);
            }
        });

        $scope.$on("update:sisaltokielet", function(event, value) {
            $scope.sisaltokielet = value;
            if (_.indexOf($scope.sisaltokielet, $scope.sisaltokieli) === -1) {
                $scope.setSisaltokieli(_.first($scope.sisaltokielet));
            }
        });

        $scope.$on("changed:sisaltokieli", function(event, value) {
            $scope.sisaltokieli = value;
        });

        $scope.setSisaltokieli = function(kieli) {
            Kieli.setSisaltokieli(kieli);
        };

        $scope.koodit = [];

        $scope.vaihdaKieli = function(kielikoodi) {
            Kieli.setUiKieli(kielikoodi);
        };
    });
