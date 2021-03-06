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
    .controller("OpsPerusopetusController", function(
        $q,
        $scope,
        $timeout,
        $state,
        $stateParams,
        epMenuBuilder,
        Utils,
        MurupolkuData,
        Kieli,
        $document,
        $rootScope,
        opsStateService,
        opsUtils,
        opsMenuBuilders,
        otsikot,
        perusOps
    ) {
        $scope.isNaviVisible = _.constant(true);
        $scope.hasContent = function(obj) {
            return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
        };
        $scope.otsikot = otsikot;
        $scope.ops = perusOps;
        $scope.vlkMap = _.map($scope.ops.vuosiluokkakokonaisuudet, function(v: any) {
            return {
                nimi: v.vuosiluokkakokonaisuus.nimi,
                tunniste: v.vuosiluokkakokonaisuus._tunniste
            };
        });

        $scope.kaikkiOppiaineet = _.map($scope.ops.oppiaineet, "oppiaine");
        $scope.yhteisetOppiaineet = _.filter($scope.kaikkiOppiaineet, (oa: any) => oa.tyyppi == "yhteinen");
        $scope.valinnaisetOppiaineet = _.filter($scope.kaikkiOppiaineet, (oa: any) => oa.tyyppi != "yhteinen");

        $scope.vlkt = opsUtils.sortVlk($scope.ops.vuosiluokkakokonaisuudet);

        MurupolkuData.set({ opsId: $scope.ops.id, opsNimi: $scope.ops.nimi });

        $scope.naviClasses = item => {
            var classes = ["depth" + item.depth];
            if (item.$selected) {
                classes.push("tekstisisalto-active");
            }
            if (item.$header) {
                classes.push("tekstisisalto-active-header");
            }
            if (!item.$selected && item.$tyyppi && item.$tyyppi !== "yhteinen") {
                classes.push("perusopetus-paikallinen");
            }
            if (item.$selected && item.$tyyppi && item.$tyyppi !== "yhteinen") {
                classes.push("perusopetus-paikallinen-active");
            }
            return classes;
        };

        const clickHandler = event => {
            var ohjeEl = angular.element(event.target).closest(".popover, .popover-element");
            if (ohjeEl.length === 0) {
                $rootScope.$broadcast("ohje:closeAll");
            }
        };

        const installClickHandler = () => {
            $document.off("click", clickHandler);
            $timeout(() => {
                $document.on("click", clickHandler);
            });
        };

        $scope.$on("$destroy", function() {
            $document.off("click", clickHandler);
        });

        const getFirstOppiaine = vlk => {
            let dfd = $q.defer();
            dfd.resolve(_.find($scope.navi.sections[1].items, { $parent_vuosi: vlk }));
            return dfd.promise;
        };

        const moveToOppiaine = vuosi => {
            let vlk = "vuosiluokka_" + vuosi;
            return getFirstOppiaine(vlk).then(firstOppiaine => {
                if (_.isObject(firstOppiaine) && firstOppiaine.$tyyppi + "" === "yhteinen") {
                    return $state.go(
                        "root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.oppiaine",
                        {
                            vuosi: vuosi,
                            opsId: $state.params.opsId,
                            vlkId: $state.params.vlkId,
                            oppiaineId: firstOppiaine.$oppiaine.id
                        },
                        { location: "replace" }
                    );
                } else if (_.isObject(firstOppiaine) && firstOppiaine.$tyyppi + "" !== "yhteinen") {
                    return $state.go(
                        "root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.valinainenoppiaine",
                        {
                            vuosi: vuosi,
                            opsId: $state.params.opsId,
                            vlkId: $state.params.vlkId,
                            oppiaineId: firstOppiaine.$oppiaine.id
                        },
                        { location: "replace" }
                    );
                }
                return;
            });
        };

        $scope.navi = {
            header: "opetussuunnitelma",
            showOne: true,
            sections: [
                {
                    id: "tekstikappale",
                    include: "views/ops/opstekstisisalto.html",
                    items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
                    naviClasses: $scope.naviClasses,
                    title: "yhteiset-osuudet"
                },
                {
                    title: "vuosiluokkakokonaisuudet",
                    id: "vlkoppiaine",
                    items: opsMenuBuilders.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlkt, $scope.kaikkiOppiaineet),
                    naviClasses: $scope.naviClasses,
                    include: "views/ops/opsvlk.html",
                    state: $scope.state
                },
                {
                    title: "oppiaineet",
                    id: "oppiaineet",
                    items: opsMenuBuilders.rakennaOppiaineetMenu($scope.yhteisetOppiaineet),
                    naviClasses: $scope.naviClasses,
                    include: "views/ops/opsvlk.html"
                },
                {
                    title: "valinnaiset-oppiaineet",
                    id: "valinnaiset",
                    items: opsMenuBuilders.rakennaOppiaineetMenu($scope.valinnaisetOppiaineet),
                    naviClasses: $scope.naviClasses,
                    include: "views/ops/opsvlk.html"
                }
            ]
        };

        $scope.navi.sections[0].items.unshift({
            depth: 0,
            label: "opetussuunnitelman-tiedot",
            link: ["root.ops.perusopetus.tiedot"]
        });

        $scope.$on("$stateChangeSuccess", function() {
            var id = _.intersection(_.keys($state.params), ["oppiaineId", "vlkId"]);
            opsStateService.setState($scope.navi);
            if ($state.is("root.ops.perusopetus") && !id.length) {
                $state.go(".tiedot", { location: "replace" });
            } else if (_.contains(_.keys($stateParams), "vuosi")) {
                var vuosi = $state.params.vuosi;
                moveToOppiaine(vuosi);
            }
        });

        $scope.onSectionChange = function(section) {
            if (section.id === "vlkoppiaine" && !section.$open) {
                var vlkId = $scope.navi.sections[1].items[1].$vkl.id;
                $timeout(() => {
                    return $state.go("root.ops.perusopetus.vuosiluokkakokonaisuus", {
                        opsId: $scope.ops.id,
                        vlkId: vlkId
                    });
                }, 10);
            } else if (section.id === "oppiaineet" && !section.$open) {
                var oppiaineId = $scope.navi.sections[2].items[1].$oppiaine.id;
                var tyyppi = $scope.navi.sections[2].items[1].$tyyppi;
                if (tyyppi === "yhteinen") {
                    $timeout(() => {
                        return $state.go("root.ops.perusopetus.oppiaineet", {
                            opsId: $scope.ops.id,
                            oppiaineId: oppiaineId
                        });
                    }, 10);
                } else {
                    $timeout(() => {
                        return $state.go("root.ops.perusopetus.valinnaisetoppiaineet", {
                            opsId: $scope.ops.id,
                            oppiaineId: oppiaineId
                        });
                    }, 10);
                }
            }
        };

        installClickHandler();
    })
    .controller("OpsPerusopetusTekstikappaleController", function($scope, tekstikappaleWithChildren, MurupolkuData) {
        $scope.tekstikappale = tekstikappaleWithChildren.tekstiKappale;
        $scope.lapset = tekstikappaleWithChildren.lapset;

        $scope.$on("$stateChangeSuccess", function() {
            setMurupolku();
        });

        function setMurupolku() {
            MurupolkuData.set({ osanId: $scope.tekstikappale.id, tekstikappaleNimi: $scope.tekstikappale.nimi });

            $scope.sectionItem = _.reduce(
                $scope.navi.sections[0].items,
                function(result, item: any, index) {
                    if (item.$selected === true) {
                        item.index = index;
                        result = item;
                    }
                    return result;
                },
                ""
            );

            function findParent(set, child) {
                return set[child.$parent].$osa.tekstiKappale;
            }
            if ($scope.sectionItem && $scope.sectionItem.depth > 1) {
                MurupolkuData.set("parents", [findParent($scope.navi.sections[0].items, $scope.sectionItem)]);
            }
        }
    })
    /*
   root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka
   */

    .controller("OpsVuosiluokkaController", function($scope, vuosi, MurupolkuData) {
        MurupolkuData.set({ vuosiId: vuosi, vuosi: "Vuosiluokka" + " " + vuosi });
    })
    /*
   root.ops.perusopetus.vuosiluokkakokonaisuus
   */

    .controller("OpsVlkController", function(
        $scope,
        $state,
        vlkId,
        vlkt,
        baseLaajaalaiset,
        MurupolkuData,
        Utils,
        vlkPeruste,
        VuosiluokkakokonaisuusMapper
    ) {
        $scope.vlk = vlkt;
        $scope.peruste = vlkPeruste;
        const laajaalaisetosaamiset = _.indexBy(baseLaajaalaiset, "tunniste");
        const laajaalaisetOrder = _(baseLaajaalaiset)
            .sortBy(Utils.sort)
            .map("tunniste")
            .value();
        $scope.isVlkState = () => {
            return !_.contains(_.words($state.current.name), "vuosiluokka");
        };
        $scope.orderFn = function(tunniste) {
            return laajaalaisetOrder.indexOf(tunniste);
        };

        VuosiluokkakokonaisuusMapper.init($scope, laajaalaisetosaamiset, vlkPeruste);

        MurupolkuData.set({ vlkId: vlkId, vlkNimi: $scope.vlk.nimi });
    })
    /*
   'root.ops.perusopetus.oppiaineet'
   */

    .controller("OpsVlkOppiaineController", function(
        $scope,
        $timeout,
        $state,
        Utils,
        oppiaineId,
        oppiaine,
        oppiainePeruste,
        baseLaajaalaiset,
        vuosiluokkakokonaisuus,
        vuosiluokkaSisalto,
        MurupolkuData,
        opsUtils
    ) {
        $scope.oppiaine = oppiaine;
        $scope.vlk = vuosiluokkakokonaisuus;
        $scope.vapaaTeksti = vuosiluokkaSisalto ? vuosiluokkaSisalto.vapaaTeksti : {};
        const perusteSisaltoMap = _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus");
        $scope.perusteOppiaine = oppiainePeruste;
        $scope.perusteOppiaineVlkMap = oppiainePeruste
            ? _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus")
            : {};
        const laajaalaiset = _.indexBy(baseLaajaalaiset, "tunniste");
        const perusteSisalto = perusteSisaltoMap[$scope.vlk._vuosiluokkakokonaisuus]
            ? (<any>perusteSisaltoMap[$scope.vlk._vuosiluokkakokonaisuus]).sisaltoalueet
            : [];
        const sortMapHelper = _(perusteSisalto)
            .pluck("nimi")
            .map("fi")
            .value();
        $scope.perustenSisaltoMap = perusteSisalto ? _.indexBy(perusteSisalto, "tunniste") : {};
        const vlkSisalto = vuosiluokkaSisalto ? vuosiluokkaSisalto.sisaltoalueet : [];
        $scope.sisaltoAlueet = _.zip(perusteSisalto, vlkSisalto);
        const tavoitteet = vuosiluokkaSisalto ? _.indexBy(vuosiluokkaSisalto.tavoitteet, "tunniste") : [];

        //map model
        var perusteOpVlk = $scope.vlk._vuosiluokkakokonaisuus
            ? $scope.perusteOppiaineVlkMap[$scope.vlk._vuosiluokkakokonaisuus]
            : {};
        $scope.sisalto = opsUtils.makeSisalto(
            perusteOpVlk,
            tavoitteet,
            $scope.perusteOppiaine,
            laajaalaiset,
            sortMapHelper
        );
        $scope.nimiOrder = Utils.sort;
        $scope.vuosi = "vuosiluokka_" + $state.params.vuosi;
        $scope.arvioinninKohteenTeksti = (tavoite) =>  opsUtils.arvioinninKohteenTeksti(tavoite);

        $scope.osaamisenKuvauksetTyhjia = function(arvioinninKohteet: any[]) {
            return _.size(_.filter(arvioinninKohteet, kohde => kohde.arvosana !== null)) === 0;
        }

        function setMurupolku() {
            let item: any = _.reduce(
                $scope.navi.sections[1].items,
                (result, item: any, index) => {
                    if (item.$selected === true) {
                        item.index = index;
                        result = item;
                    }
                    return result;
                },
                ""
            );

            function findParents(set, index) {
                var slicedSet = _.take(set, parseInt(index));
                var found = _.findLast(slicedSet, function(item: any) {
                    return item.depth === 2;
                });
                return found.$oppiaine;
            }
            var murupolkuParams = {};
            if (item && item.depth === 2) {
                murupolkuParams = {
                    parents: null,
                    oppiaineId: $scope.oppiaine.id,
                    oppiaineNimi: $scope.oppiaine.nimi
                };
            }
            if (item.depth === 3) {
                murupolkuParams = {
                    parents: [findParents($scope.navi.sections[1].items, item.index)],
                    oppiaineId: $scope.oppiaine.id,
                    oppiaineNimi: $scope.oppiaine.nimi
                };
            }

            MurupolkuData.set(murupolkuParams);
        }

        setMurupolku();

        $scope.$on("$stateChangeSuccess", setMurupolku);

        const getCurrentVlk = vlk => {
            var vuodet = vlk.nimi.fi.replace(/\D/g, "").split("") || vlk.nimi.sv.replace(/\D/g, "").split("");
            vuodet = _.map(vuodet, function(v: any) {
                return parseInt(v);
            });
            return parseInt($state.params.vuosi) >= vuodet[0] && parseInt($state.params.vuosi) <= vuodet[1];
        };

        $scope.currentVlkCategory = _($scope.vlkMap)
            .filter(getCurrentVlk)
            .map("nimi")
            .first();

        $scope.valittuVlk = _.filter(oppiaine.vuosiluokkakokonaisuudet, (vlk: any) => {
            return vlk._vuosiluokkakokonaisuus == $scope.currentVlk;
        }).pop();

        $scope.missingVlk = () => {
            return _.isEmpty(tavoitteet) || _.isEmpty($scope.sisalto);
        };

        $scope.noYleistavoitteet = () => {
            if ($scope.vlk && $scope.vlk.yleistavoitteet) {
                return $scope.vlk.yleistavoitteet.teksti === null;
            }
            return true;
        };
    })
    /*
   'root.ops.perusopetus.oppiaineet.vlk.vuosiluokat'
   */

    .controller("OpsOppiaineController", function(
        $scope,
        $timeout,
        $state,
        Utils,
        oppiaineId,
        oppiaine,
        oppiainePeruste,
        baseLaajaalaiset,
        vuosiluokkakokonaisuus,
        vuosiluokkaSisalto,
        opsUtils,
        MurupolkuData
    ) {
        $scope.oppiaine = oppiaine;
        $scope.vlk = vuosiluokkakokonaisuus;
        $scope.vapaaTeksti = vuosiluokkaSisalto ? vuosiluokkaSisalto.vapaaTeksti : {};
        $scope.vuosiluokka = vuosiluokkaSisalto.vuosiluokka;
        const perusteSisaltoMap = _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus");
        $scope.perusteOppiaine = oppiainePeruste;
        $scope.perusteOppiaineVlkMap = oppiainePeruste
            ? _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, "_vuosiluokkakokonaisuus")
            : {};
        const laajaalaiset = _.indexBy(baseLaajaalaiset, "tunniste");

        //keskeiset sisaltoaluet
        const perusteSisalto = perusteSisaltoMap[$scope.vlk._vuosiluokkakokonaisuus]
            ? (<any>perusteSisaltoMap[$scope.vlk._vuosiluokkakokonaisuus]).sisaltoalueet
            : [];
        const sortMapHelper = _(perusteSisalto)
            .pluck("nimi")
            .map("fi")
            .value();
        $scope.perustenSisaltoMap = perusteSisalto ? _.indexBy(perusteSisalto, "tunniste") : {};
        const vlkSisalto = vuosiluokkaSisalto ? vuosiluokkaSisalto.sisaltoalueet : [];
        $scope.sisaltoAlueet = _.zip(perusteSisalto, vlkSisalto);

        const tavoitteet = vuosiluokkaSisalto ? _.indexBy(vuosiluokkaSisalto.tavoitteet, "tunniste") : [];

        //map model
        var perusteOpVlk = $scope.vlk._vuosiluokkakokonaisuus
            ? $scope.perusteOppiaineVlkMap[$scope.vlk._vuosiluokkakokonaisuus]
            : {};
        $scope.sisalto = opsUtils.makeSisalto(
            perusteOpVlk,
            tavoitteet,
            $scope.perusteOppiaine,
            laajaalaiset,
            sortMapHelper
        );
        $scope.nimiOrder = Utils.sort;

        MurupolkuData.set({
            vuosiId: $state.params.vuosiId,
            vuosiLabel: $scope.vuosiluokka
        });

        const getCurrentVlk = vlk => {
            var vuodet = vlk.nimi.fi.replace(/\D/g, "").split("") || vlk.nimi.sv.replace(/\D/g, "").split("");
            vuodet = _.map(vuodet, function(v: any) {
                return parseInt(v);
            });
            return parseInt($state.params.vuosi) >= vuodet[0] && parseInt($state.params.vuosi) <= vuodet[1];
        };

        $scope.currentVlkCategory = _($scope.vlkMap)
            .filter(getCurrentVlk)
            .map("nimi")
            .first();

        $scope.valittuVlk = _.filter(oppiaine.vuosiluokkakokonaisuudet, (vlk: any) => {
            return vlk._vuosiluokkakokonaisuus == $scope.currentVlk;
        }).pop();

        $scope.missingVlk = () => {
            return _.isEmpty(tavoitteet) || _.isEmpty($scope.sisalto);
        };

        $scope.noYleistavoitteet = () => {
            if ($scope.vlk && $scope.vlk.yleistavoitteet) {
                return $scope.vlk.yleistavoitteet.teksti === null;
            }
            return true;
        };

        $scope.activeClass = id => {
            return id + "" === $state.params.vuosiId + "";
        };

        $scope.arvioinninKohteenTeksti = (tavoite) =>  opsUtils.arvioinninKohteenTeksti(tavoite);

        $scope.osaamisenKuvauksetTyhjia = function(arvioinninKohteet: any[]) {
            return _.size(_.filter(arvioinninKohteet, kohde => kohde.arvosana !== null)) === 0;
        }
    });
