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
    .service("treeTemplate", function() {
        function generoiOtsikko() {
            const tosa =
                '{{ tutkinnonOsaSolmunNimi(rakenne) | kaanna }}' +
                '<span ng-if="naytaLaajuus">' +
                ', <strong>{{ laajuus }}</strong> {{ apumuuttujat.laajuusYksikko | kaanna }}' +
                '</span>';
            const editointiIkoni =
                '<div ng-click="togglaaPakollisuus(rakenne)" class="osa-ikoni">' +
                '  <span ng-if="!rakenne.pakollinen"><img src="images/tutkinnonosa.png" alt=""></span> ' +
                '  <span ng-if="rakenne.pakollinen"><img src="images/tutkinnonosa_pakollinen.png" alt=""></span> ' +
                "</div>";
            return (
                "" +
                '<span ng-if="onOsa(rakenne)">' +
                editointiIkoni +
                '  <a class="osa-nimi" ng-if="esitystilassa" ui-sref="root.esitys.peruste.tutkinnonosa({ id: rakenne._tutkinnonOsaViite, suoritustapa: apumuuttujat.suoritustapa })">' +
                tosa +
                "</a>" +
                '  <span class="osa-nimi" ng-if="!muokkaus && !esitystilassa">' +
                '    <a ng-if="rakenne._tutkinnonOsaViite" ui-sref="root.perusteprojekti.suoritustapa.tutkinnonosa({ tutkinnonOsaViiteId: tutkinnonOsaViitteet[rakenne._tutkinnonOsaViite].id, suoritustapa: apumuuttujat.suoritustapa })">' +
                tosa +
                "    </a>" +
                '    <span ng-if="!rakenne._tutkinnonOsaViite">' +
                tosa +
                "</span>" +
                "  </span>" +
                "</span>" +
                '<span ng-if="!onOsa(rakenne) && rakenne.nimi">' +
                '  <strong ng-attr-title="{{rakenne.nimi | kaanna}}">{{ rakenne.nimi || "nimetön" | kaanna }}</strong>' +
                "</span>"
            );
        }

        const varivalinta =
            "ng-class=\"{vieras: rakenne.rooli === 'vieras', maarittelematon: rakenne.rooli === 'määrittelemätön', tyhja: rakenne.osat.length === 0, " +
            "suljettu: rakenne.$collapsed, osaamisala: rakenne.rooli === 'osaamisala'}\"";

        const koonIlmaisu =
            '<span ng-if="rakenne.muodostumisSaanto.koko.minimi === rakenne.muodostumisSaanto.koko.maksimi">' +
            "  {{ rakenne.muodostumisSaanto.koko.minimi || 0 }} {{ 'kpl' | kaanna }}" +
            "</span>" +
            '<span ng-if="rakenne.muodostumisSaanto.koko.minimi !== rakenne.muodostumisSaanto.koko.maksimi">' +
            "  {{ rakenne.muodostumisSaanto.koko.minimi || 0 }} - {{ rakenne.muodostumisSaanto.koko.maksimi || 0 }} {{ 'kpl' | kaanna }}" +
            "</span>";

        const laajuudenIlmaisu =
            '<span ng-if="rakenne.muodostumisSaanto.laajuus.minimi === rakenne.muodostumisSaanto.laajuus.maksimi">' +
            "  {{ rakenne.muodostumisSaanto.laajuus.minimi || 0 }} {{ apumuuttujat.laajuusYksikko | kaanna }}" +
            "</span>" +
            '<span ng-if="rakenne.muodostumisSaanto.laajuus.minimi !== rakenne.muodostumisSaanto.laajuus.maksimi">' +
            "  {{ rakenne.muodostumisSaanto.laajuus.minimi || 0 }} - {{ rakenne.muodostumisSaanto.laajuus.maksimi || 0 }} {{ apumuuttujat.laajuusYksikko | kaanna }}" +
            "</span>";

        const avaaKaikki =
            "" +
            '<div class="pull-right">' +
            '  <a ng-click="togglaaKuvaukset()" class="group-toggler action-link" ng-show="scanKuvaukset()">' +
            '    <span icon-role="ep-part">{{kuvauksetOpen && "piilota-kuvaukset" || "nayta-kuvaukset" | kaanna }}</span>' +
            "    " +
            "  </a>" +
            '  <a ng-click="togglaaPolut()" class="group-toggler action-link">' +
            '    <span class="avaa-sulje" icon-role="ep-open-close">{{ "avaa-sulje-rakenne" | kaanna }}</span>' +
            "  </a>" +
            "</div>";

        this.root = function() {
            return (
                "" +
                "<div>" +
                '  <div class="ylapainikkeet">' +
                '    <span class="rakenne-nimi">{{ apumuuttujat.peruste.nimi | kaanna }}' +
                '    <span ng-if="rakenne.muodostumisSaanto && rakenne.muodostumisSaanto.laajuus">' +
                '      <span ng-if="rakenne.$laajuus">{{ rakenne.$laajuus }} / </span>' +
                '      <span ng-if="isNumber(rakenne.muodostumisSaanto.laajuus.minimi)">' +
                "        {{ rakenne.muodostumisSaanto.laajuus.minimi }}" +
                "      </span>" +
                '      <span ng-if="rakenne.muodostumisSaanto.laajuus.maksimi && rakenne.muodostumisSaanto.laajuus.minimi !== rakenne.muodostumisSaanto.laajuus.maksimi">' +
                "        - {{ rakenne.muodostumisSaanto.laajuus.maksimi }}" +
                "      </span>" +
                "      {{ apumuuttujat.laajuusYksikko | kaanna }}" +
                "    </span></span>" +
                '    <a class="action-link" ng-if="muokkaus" ng-click="ryhmaModaali(apumuuttujat.suoritustapa, rakenne, vanhempi)" kaanna>muokkaa-muodostumissääntöjä</button>' +
                '    <a ng-if="zoomaus" icon-role="back" class="back action-link"></a>' +
                avaaKaikki +
                "  </div>" +
                '  <div><div class="tree-yliviiva"></div></div>' +
                "</div>" +
                '<div ng-if="rakenne.rooli !== \'määrittelemätön\'" class="collapser" ng-show="!rakenne.$collapsed">' +
                '  <ul ng-if="rakenne.osat !== undefined" ui-sortable="sortableOptions" id="tree-sortable" class="tree-group" ng-model="rakenne.osat">' +
                '    <li ng-repeat="osa in rakenne.osat" class="tree-list-item">' +
                '      <tree apumuuttujat="apumuuttujat" muokkaus="muokkaus" rakenne="osa" vanhempi="rakenne" tutkinnon-osa-viitteet="tutkinnonOsaViitteet" uusi-tutkinnon-osa="uusiTutkinnonOsa" ng-init="notfirst = true" callbacks="callbacks"></tree>' +
                "    </li>" +
                '    <li class="ui-state-disabled tree-list-item" ng-if="muokkaus && rakenne.osat.length > 0">' +
                '      <span class="tree-anchor"></span>' +
                "    </li>" +
                "  </ul>" +
                "</div>"
            );
        };

        const optiot =
            "" +
            '<span ng-click="rakenne.$collapsed = rakenne.osat.length > 0 ? (!rakenne.$collapsed || rakenne.$searchitem) : false" ng-if="!onOsa(rakenne)" class="colorbox" ' +
            varivalinta +
            ">" +
            "  <span ng-if=\"rakenne.rooli !== 'määrittelemätön'\">" +
            '    <span ng-hide="rakenne.$collapsed" class="glyphicon glyphicon-chevron-down"></span>' +
            '    <span ng-show="rakenne.$collapsed" class="glyphicon glyphicon-chevron-right"></span>' +
            "  </span>" +
            "</span>" +
            '<div class="right">' +
            '  <div class="pull-right" ng-if="!onOsa(rakenne)">' +
            '    <span class="right-item" ng-if="isNumber(rakenne.muodostumisSaanto.laajuus.minimi)">' +
            laajuudenIlmaisu +
            "    </span>" +
            '    <span class="right-item" ng-if="isNumber(rakenne.muodostumisSaanto.koko.minimi)">' +
            koonIlmaisu +
            "    </span>" +
            "  </div>" +
            "</div>" +
            '<div class="left">' +
            "  <span>" +
            generoiOtsikko() +
            "</span>" +
            "</div>";

        const kentta =
            '<div ng-class="osaLuokat(rakenne)">' +
            optiot +
            "</div>" +
            '<div ng-if="rakenne.osaamisala || (rakenne.kuvaus && rakenne.kuvaus[lang].length > 0)" class="kuvaus">' +
            '  <div class="kuvausteksti" ng-class="{ \'text-truncated\': !rakenne.$showKuvaus }">' +
            '    <div class="osaamisala" ng-if="rakenne.osaamisala"><b kaanna="\'osaamisala\'"></b>: {{ rakenne.osaamisala.nimi || "koodin-nimea-ei-onnistuttu-hakemaan" | kaanna }} ({{ rakenne.osaamisala.osaamisalakoodiArvo || rakenne.osaamisala.osaamisalakoodiUri.split("_")[1] }})</div>' +
            '    <p ng-if="rakenne.kuvaus && rakenne.kuvaus[lang].length > 0">{{ rakenne.kuvaus | kaanna }}</p>' +
            "  </div>" +
            '  <div class="avausnappi" ng-click="rakenne.$showKuvaus = !rakenne.$showKuvaus" ng-attr-title="{{rakenne.$showKuvaus && (\'piilota-ryhman-kuvaus\'|kaanna) || (\'nayta-ryhman-kuvaus\'|kaanna)}}">' +
            '  <div class="avausnappi-painike">&hellip;</div></div>' +
            "</div>";

        this.leaf = function() {
            return "<div>" + kentta + "</div>";
        };

        this.leafChildren = function() {
            return (
                '<div ng-if="rakenne.rooli !== \'määrittelemätön\'" class="collapser" ng-show="!rakenne.$collapsed || rakenne.$searchitem">' +
                '  <ul ng-if="rakenne.osat !== undefined" ui-sortable="sortableOptions" class="tree-group" ng-model="rakenne.osat" id="tree-sortable">' +
                '    <li ng-repeat="osa in rakenne.osat track by trackingFunction(osa, $index)" class="tree-list-item">' +
                '      <tree apumuuttujat="apumuuttujat" muokkaus="muokkaus" rakenne="osa" vanhempi="rakenne" tutkinnon-osa-viitteet="tutkinnonOsaViitteet" uusi-tutkinnon-osa="uusiTutkinnonOsa" ng-init="notfirst = true" callbacks="callbacks"></tree>' +
                "    </li>" +
                "  </ul>" +
                "</div>"
            );
        };

        return (
            "" +
            '<div ng-if="!vanhempi">' +
            '  <div class="ylapainikkeet">' +
            '    <span class="rakenne-nimi">{{ apumuuttujat.peruste.nimi | kaanna }}' +
            '    <span ng-if="rakenne.muodostumisSaanto && rakenne.muodostumisSaanto.laajuus">' +
            '      <span ng-if="rakenne.$laajuus">{{ rakenne.$laajuus }} / </span>' +
            '      <span ng-if="isNumber(rakenne.muodostumisSaanto.laajuus.minimi)">' +
            "        {{ rakenne.muodostumisSaanto.laajuus.minimi }}" +
            "      </span>" +
            '      <span ng-if="rakenne.muodostumisSaanto.laajuus.maksimi && rakenne.muodostumisSaanto.laajuus.minimi !== rakenne.muodostumisSaanto.laajuus.maksimi">' +
            "        - {{ rakenne.muodostumisSaanto.laajuus.maksimi }}" +
            "      </span>" +
            "      {{ apumuuttujat.laajuusYksikko | kaanna }}" +
            "    </span></span>" +
            '    <a ng-if="zoomaus" icon-role="back" class="back action-link"></a>' +
            avaaKaikki +
            "  </div>" +
            '  <div><div class="tree-yliviiva"></div></div>' +
            "</div>" +
            '<div ng-if="vanhempi">' +
            kentta +
            "</div>" +
            '<div ng-if="rakenne.rooli !== \'määrittelemätön\'" class="collapser" ng-show="!rakenne.$collapsed || !rakenne.$searchitem">' +
            '  <ul ng-if="rakenne.osat !== undefined" id="tree-sortable" class="tree-group" ng-model="rakenne.osat">' +
            '    <li ng-repeat="osa in rakenne.osat" class="tree-list-item">' +
            '      <tree apumuuttujat="apumuuttujat" muokkaus="muokkaus" rakenne="osa" vanhempi="rakenne" tutkinnon-osa-viitteet="tutkinnonOsaViitteet" uusi-tutkinnon-osa="uusiTutkinnonOsa" ng-init="notfirst = true" callbacks="callbacks"></tree>' +
            "    </li>" +
            "  </ul>" +
            "</div>"
        );
    })
    .directive("tree", function($compile, treeTemplate, $timeout, $animate) {
        return {
            restrict: "E",
            template: treeTemplate.leaf(),
            scope: {
                rakenne: "=",
                tutkinnonOsaViitteet: "=",
                uusiTutkinnonOsa: "=",
                vanhempi: "=",
                apumuuttujat: "=",
                muokkaus: "=",
                callbacks: "="
            },
            controller: "TreeController",
            link: function(scope: any, el) {
                $animate.enabled(false, el);
                if (!scope.vanhempi) {
                    const templateElement = angular.element(treeTemplate.root());
                    $compile(templateElement)(scope);
                    el.replaceWith(templateElement);
                }
                function renderChildren() {
                    $compile(treeTemplate.leafChildren())(scope, function(cloned) {
                        el.append(cloned);
                    });
                }
                if (_.isArray(scope.rakenne.osat) && scope.rakenne.osat.length > 0) {
                    // Give the browser a breather once in a while to retain responsiveness
                    if (_.random() > 0.8) {
                        $timeout(function() {
                            renderChildren();
                        });
                    } else {
                        renderChildren();
                    }
                }
            }
        };
    })
    .controller("TreeController", function($scope, $translate, $state, Muodostumissaannot, Algoritmit, Kaanna, Utils) {
        $scope.kuvauksetOpen = false;
        $scope.esitystilassa = $state.includes("**.esitys.**");
        $scope.lang = $translate.use() || $translate.preferredLanguage();
        $scope.isNumber = _.isNumber;

        const tosa = $scope.tutkinnonOsaViitteet[$scope.rakenne._tutkinnonOsaViite];
        if (tosa) {
            $scope.naytaLaajuus = !$scope.rakenne.erikoisuus && (tosa.laajuus || tosa.laajuusMaksimi);
            if (!tosa.laajuusMaksimi || tosa.laajuus >= tosa.laajuusMaksimi) {
                $scope.laajuus = tosa.laajuus;
            }
            else {
                $scope.laajuus = tosa.laajuus + "-" + tosa.laajuusMaksimi;
            }
        }

        $scope.trackingFunction = function(osa, index) {
            return osa.nimi && osa.nimi._id ? osa.nimi._id : index;
        };

        $scope.lisaaLaajuusYksikko = function(obj) {
            return _.merge(obj, {
                laajuusYksikko: Kaanna.kaanna($scope.apumuuttujat.laajuusYksikko)
            });
        };

        $scope.onOsa = function(osa) {
            return osa._tutkinnonOsaViite || osa.erikoisuus;
        };

        $scope.tutkinnonOsaSolmunNimi = function(solmu) {
            if (solmu._tutkinnonOsaViite) {
                return $scope.tutkinnonOsaViitteet[solmu._tutkinnonOsaViite].nimi;
            } else if (solmu.erikoisuus) {
                return (solmu.vieras && solmu.vieras.nimi) || "nimeton-vierastutkinto";
            } else {
                return "nimetön";
            }
        };

        $scope.osaLuokat = function(osa) {
            let luokat = [];
            if ($scope.onOsa(osa)) {
                luokat.push("bubble-osa");
                const viite = $scope.tutkinnonOsaViitteet[osa._tutkinnonOsaViite];
                if (viite && (viite.$elevate || ($scope.apumuuttujat.haku && viite.$matched))) {
                    luokat.push("huomio");
                }
            } else {
                luokat.push("bubble");
            }
            return luokat;
        };

        $scope.scanKuvaukset = function() {
            let hasKuvaukset = false;
            $scope.kuvauksetOpen = false;
            Algoritmit.kaikilleLapsisolmuille($scope.rakenne, "osat", function(osa) {
                if (!$scope.kuvauksetOpen && osa.$showKuvaus) {
                    $scope.kuvauksetOpen = true;
                }
                if (!hasKuvaukset && Utils.hasLocalizedText(osa.kuvaus)) {
                    hasKuvaukset = true;
                }
            });
            return hasKuvaukset;
        };

        $scope.togglaaKuvaukset = function() {
            Algoritmit.kaikilleLapsisolmuille($scope.rakenne, "osat", function(osa) {
                osa.$showKuvaus = !$scope.kuvauksetOpen;
            });
            $scope.kuvauksetOpen = !$scope.kuvauksetOpen;
        };

        $scope.togglaaPolut = function() {
            const avaamattomat = _($scope.rakenne.osat)
                .reject(function(osa) {
                    return osa._tutkinnonOsaViite || osa.$collapsed || osa.osat.length === 1;
                })
                .size();

            _.forEach($scope.rakenne.osat, function(r) {
                if (r.osat && _.size(r.osat) > 0) {
                    r.$collapsed = avaamattomat !== 0;
                }
            });
        };
    })
    .directive("treeWrapper", function() {
        return {
            restrict: "AE",
            transclude: true,
            terminal: true,
            templateUrl: "views/esitys/directives/tree.html",
            scope: {
                rakenne: "=",
                voiLiikuttaa: "=",
                ajaKaikille: "=",
                muokkaus: "=",
                esitys: "=?"
            },
            controller: "TreeWrapperController"
        };
    })
    .controller("TreeWrapperController", function($scope, Kaanna, PerusteenRakenne, Muodostumissaannot, Algoritmit) {
        $scope.suljettuViimeksi = true;
        $scope.lisataanUuttaOsaa = false;
        $scope.uusiOsa = null;
        $scope.skratchpad = [];
        $scope.uniikit = [];
        $scope.kaytetytUniikit = {};
        $scope.kaikkiUniikit = [];
        $scope.topredicate = "nimi.fi";
        $scope.tosarajaus = "";
        $scope.naytaKuvaus = function() {
            return !!Kaanna.kaanna($scope.rakenne.rakenne.kuvaus);
        };

        $scope.tutkinnonOsat = {
            perSivu: 8,
            rajaus: "",
            multiPage: false,
            sivu: 1
        };

        // Alkutilanteessa puun solmut suljetuiksi
        PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
            item.$collapsed = true;
            item.$searchitem = false;
        });

        $scope.paivitaTekstiRajaus = function(value) {
            if (!_.isEmpty(value)) {
                PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
                    // 1. Find matches
                    item.$searchitem = false;
                    let osa: any = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
                    if (osa) {
                        osa.$matched = Algoritmit.rajausVertailu(value, osa, "nimi");
                    }
                });
                PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
                    // 2. Uncollapse parents of matched
                    const osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
                    if (osa && osa.$matched) {
                        let parent = item.$parent;
                        while (parent) {
                            if (parent.$parent) {
                                parent.$searchitem = true;
                            }
                            parent = parent.$parent;
                        }
                    }
                });
            } else {
                // Uncollapse all when search is cleared
                PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
                    item.$searchitem = false;
                });
            }
        };

        $scope.paivitaRajaus = function(input) {
            input = input === undefined ? $scope.tosarajaus : input;
            $scope.tosarajaus = input;
            const filtered = !_.isEmpty(input);
            $scope.uniikit = _.reject($scope.kaikkiUniikit, function(yksi: any) {
                const nimi = $scope.rakenne.tutkinnonOsaViitteet[yksi._tutkinnonOsaViite]
                    ? (Kaanna.kaanna($scope.rakenne.tutkinnonOsaViitteet[yksi._tutkinnonOsaViite].nimi) || "")
                          .toLowerCase()
                    : "";
                return (
                    !yksi.alwaysVisible &&
                    ((filtered && nimi.indexOf(input.toLowerCase()) === -1) ||
                        ($scope.piilotaKaikki && $scope.kaytetytUniikit[yksi._tutkinnonOsaViite]))
                );
            });
        };

        $scope.jarjestysSorter = function(item) {
            if (item.erikoisuus === "vieras") {
                return -1;
            }
            if (item._tutkinnonOsaViite) {
                const osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
                if (osa && _.isNumber(osa.jarjestys)) {
                    return osa.jarjestys;
                }
            }
            return Number.MAX_SAFE_INTEGER;
        };

        $scope.nimiSorter = function(item) {
            if (item._tutkinnonOsaViite) {
                const osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
                return Kaanna.kaanna(osa.nimi).toLowerCase();
            }
        };

        $scope.ryhmaSorter = function(item) {
            if (!item._tutkinnonOsaViite) {
                return Kaanna.kaanna(item.nimi).toLowerCase();
            }
        };

        $scope.$watch("rakenne.$suoritustapa", function() {
            let sts = null;
            if ($scope.rakenne.$peruste) {
                sts = _($scope.rakenne.$peruste.suoritustavat)
                    .filter(function(st) {
                        return st.laajuusYksikko;
                    })
                    .value();
                sts = _.zipObject(_.map(sts, "suoritustapakoodi"), sts)[$scope.rakenne.$suoritustapa];
            }

            $scope.apumuuttujat = {
                suoritustapa: $scope.rakenne.$suoritustapa,
                laajuusYksikko: sts ? sts.laajuusYksikko : null,
                vanhin: $scope.rakenne,
                piilotaVirheet: true,
                peruste: $scope.rakenne.$peruste
            };
        });

        $scope.$watch("apumuuttujat.haku", function(value) {
            $scope.paivitaTekstiRajaus(value);
        });
    })
    .config(function($uibTooltipProvider) {
        $uibTooltipProvider.setTriggers({
            mouseenter: "mouseleave",
            click: "click",
            focus: "blur",
            never: "mouseleave",
            show: "hide"
        });
    });
