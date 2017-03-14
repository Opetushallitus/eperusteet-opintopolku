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

angular.module("app")
.service("SpinnerService", function(SPINNER_WAIT, $rootScope, $timeout) {
    let pyynnot = 0;

    return {
        enable() {
            ++pyynnot;
            if (pyynnot > 0) {
                $rootScope.$emit("event:spinner_on");
            }
        },

        disable() {
            --pyynnot;
            if (pyynnot < 0) {
                pyynnot = 0;
            }

            if (pyynnot === 0) {
                $rootScope.$emit("event:spinner_off");
            }
        },

        isSpinning() {
            return pyynnot > 0;
        }
    };
})
.directive("spinner", function(usSpinnerService, $timeout) {
    // Väri on sama kuin $ylanavi-color
    return {
        template: '<div id="global-spinner" ng-show="isSpinning">' +
            '<span us-spinner="{color: \'#009FCF\', length: 12, trail: 100, corners: 1, width: 8, radius: 18, lines: 13, shadow: false}" spinner-key="globalspinner"></span>' +
            '</div>',
        restrict: "E",
        link: function(scope: any) {
            scope.isSpinning = false;

            function spin(state) {
                scope.isSpinning = state;
                if (state) {
                    usSpinnerService.spin("globalspinner");
                } else {
                    usSpinnerService.stop("globalspinner");
                }
            }

            scope.$on("event:spinner_on", function() {
                spin(true);
            });

            scope.$on("event:spinner_off", function() {
                $timeout(function () {
                    spin(false);
                }, 100);
            });
        }
    };
})
.directive("smallSpinner", function () {
    return {
        restrict: "EA",
        link: function(scope, element) {
            element.prepend('<img class="small-spinner" src="images/spinner-small.gif" alt="">');
        }
    };
});
