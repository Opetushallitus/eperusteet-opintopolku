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
    .directive("amosaaTermistoTeksti", () => {
        return {
            restrict: "EA",
            scope: {
                teksti: "=",
                ktId: "=kt"
            },
            transclude: true,
            template:
                '<div amosaa-termisto-viitteet="teksti" kt="ktId" ng-bind-html="teksti | kaanna | kuvalinkit:{ amosaa: { ktId } } | unsafe"></div>'
        };
    })
    .directive("amosaaTermistoViitteet", ($stateParams, $document, $timeout) => {
        var TERMI_MATCHER = "abbr[data-viite]";
        return {
            restrict: "A",
            scope: {
                model: "=amosaaTermistoViitteet",
                ktId: "=kt"
            },
            link: function(scope: any, element) {
                scope.popovers = [];

                function destroy() {
                    element.find(TERMI_MATCHER).each(function() {
                        var jqEl: any = angular.element(this);
                        if (jqEl.popover) {
                            jqEl.popover("destroy");
                        }
                    });
                    scope.popovers = [];
                }

                function setup() {
                    element.find(TERMI_MATCHER).each(function() {
                        const jqEl: any = angular.element(this);
                        const viiteId: any = jqEl.attr("data-viite");
                        TermistoData.getByAvain(viiteId, scope.ktId).then(res => {
                            const popover = jqEl.popover({
                                placement: "auto",
                                html: true,
                                title: KaannaService.kaanna("termin-selitys"),
                                trigger: "click"
                            });
                            popover.on("show.bs.popover", () => {
                                var content = res
                                    ? KaannaService.kaanna(res.selitys)
                                    : KaannaService.kaanna("termia-ei-loytynyt");
                                popover.attr("data-content", content);
                                if (res) {
                                    popover.attr("data-original-title", KaannaService.kaanna(res.termi));
                                }
                                _.each(scope.popovers, function(po) {
                                    if (po !== popover) {
                                        po.popover("hide");
                                    }
                                });
                                $timeout(function() {
                                    const thisPopover = popover.next(".popover");
                                    const title = thisPopover.find(".popover-title");
                                    const closer = angular.element('<span class="closer pull-right">&#x2715;</span>');
                                    title.append(closer);
                                    closer.on("click", function() {
                                        popover.popover("hide");
                                    });
                                }, 100);
                            });
                            scope.popovers.push(popover);
                        }).catch(err => console.error(err));
                    });
                }

                function clickHandler(event) {
                    if (element.find(event.target).length > 0) {
                        return;
                    }
                    _.each(scope.popovers, function(popover) {
                        popover.popover("hide");
                    });
                }

                // Click anywhere to close
                $document.on("click", clickHandler);

                function refresh() {
                    $timeout(function() {
                        destroy();
                        setup();
                    }, 500);
                }

                scope.$watch("model", refresh);
                scope.$on("termisto:update", refresh);
                scope.$on("$destroy", function() {
                    $document.off("click", clickHandler);
                    destroy();
                });
            }
        };
    });
