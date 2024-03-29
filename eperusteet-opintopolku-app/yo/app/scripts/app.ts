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
    .module("app", [
        "ngSanitize",
        "ngStorage",
        "ngResource",
        "ngAnimate",
        "ui.router",
        "ui.bootstrap",
        "pascalprecht.translate",
        "monospaced.elastic",
        "angular-cache",
        "angularSpinner",
        "angulartics",
        "angulartics.piwik",
        "eperusteet.esitys",
        "restangular",
        "angular-timeline",
    ])
    .constant("DEBUG_UI_ROUTER", false)
    .run(($rootScope, DEBUG_UI_ROUTER, $anchorScroll, $location) => {
        if (DEBUG_UI_ROUTER) {
            $rootScope.$on("$stateChangeSuccess", (event, state, params) => {
                console.info(
                    "%c" + state.name,
                    "color: #ffb05b; background: #333; font-weight: bold",
                    state.url,
                    state.templateUrl,
                    params
                );
            });
        }
        $rootScope.gotoAnchor = loc => {
            $location.hash(loc);
            $anchorScroll();
        };
    })
    .config($httpProvider => {
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        $httpProvider.defaults.headers.common["Caller-Id"] = "1.2.246.562.10.00000000001.eperusteet-opintopolku";
        $httpProvider.defaults.xsrfHeaderName = "CSRF";
        $httpProvider.defaults.xsrfCookieName = "CSRF";
    });
