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
    .filter("mapFilter", function() {
        return function(input, f) {
            input = _.filter(input, function(v) {
                var bool = f(v);
                return bool;
            });
            return input;
        };
    })
    .filter("tyhja", function(Kaanna) {
        return function(input) {
            return _.isEmpty(input) ? Kaanna.kaanna("ei-asetettu") : input;
        };
    })
    .filter("reverse", function() {
        return function(input) {
            return input.reverse();
        };
    })
    .filter("unsafe", [
        "$sce",
        function($sce) {
            return function(val) {
                return $sce.trustAsHtml(val);
            };
        }
    ])
    .filter("paragraphsplit", function() {
        return function(text) {
            return text.split("\n");
        };
    })
    .filter("aikaleima", $filter => {
        const mapping = {
            date: "d.M.yyyy",
            default: "d.M.yyyy H:mm:ss",
            short: "d.M.yyyy H:mm",
            time: "H:mm"
        };

        return (input, format, defaultKey) => {
            if (!input) {
                return defaultKey ? KaannaService.kaanna(defaultKey) : "";
            } else {
                return $filter("date")(input, mapping[format] || mapping.default);
            }
        };
    })
    .filter("unique", function() {
        return function(array, field) {
            return _.uniq(array, function(el) {
                return el[field];
            });
        };
    })
    .directive("pvm", function(Kaanna, $filter, $timeout) {
        return {
            restrict: "A",
            link: function(scope: any, element, attrs: any) {
                scope.$watch(attrs.pvm, function(value) {
                    if (!value) {
                        // Jonkin takia kääntäminen ei toimi suoraan ilman timeoutia
                        $timeout(function() {
                            element.text(Kaanna.kaanna("ei-asetettu"));
                        });
                        return;
                    }
                    var date = new Date(value);
                    element.text($filter("date")(date, "d.M.yyyy"));
                });
            }
        };
    });
