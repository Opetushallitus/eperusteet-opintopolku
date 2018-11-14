/*
 * Copyright (c) 2017 The Finnish Board of Education - Opetushallitus
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

angular.module("app").config($stateProvider => {
    $stateProvider.state("root.selaus.koostenakyma", {
        url: "/kooste/:perusteluokitus?hakutyyppi",
        params: {
            hakutyyppi: "perusteet"
        },
        resolve: {
            koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,
            koulutustoimijaHaku: Api => Api.one("julkinen/koulutustoimijat"),
            perustehaku: PerusteApi => PerusteApi.one("perusteet")
        },
        views: {
            "": {
                templateUrl: "views/states/koostenakyma/view.html",
                controller: ($scope, $timeout, $stateParams, $state) => {
                    // FIXME: :perusteluokitus virhehallinta
                    $scope.perusteluokitus = $stateParams.perusteluokitus;
                    $scope.tab = $stateParams.hakutyyppi;
                    $scope.changeTab = name => {
                        $scope.tab = name;
                        $stateParams.hakutyyppi = name;
                        $state.go($state.current.name, $stateParams);
                    };
                }
            },
            "tiedot@root.selaus.koostenakyma": {
                templateUrl: "views/states/koostenakyma/tiedot.html",
                controller($scope) {}
            },
            "perustelistaus@root.selaus.koostenakyma": {
                templateUrl: "views/states/koostenakyma/perustehaku.html",
                controller(
                    $q,
                    $scope,
                    $rootScope,
                    $state,
                    perustehaku,
                    Haku,
                    koulutusalaService,
                    SpinnerService,
                    Kieli,
                    YleinenData,
                    MurupolkuData,
                    Kaanna,
                    PerusteenTutkintonimikkeet,
                    PERUSTE_HAKU_TUORE_KESTO
                ) {
                    const uikieli = Kieli.getUiKieli();
                    let hakuPattern: RegExp;
                    const hakuViive = 300; // ms
                    const oletustyypit = _.map([1, 11, 5, 12, 18], n => "koulutustyyppi_" + n);

                    const hakuparametrit = () => ({
                        kieli: uikieli,
                        koulutusala: "",
                        nimi: "",
                        opintoala: "",
                        osaamisalat: true,
                        perusteTyyppi: "normaali",
                        poistunut: false,
                        siirtyma: false,
                        sivu: 0,
                        sivukoko: 5,
                        tyyppi: oletustyypit,
                        tila: "valmis",
                        tuleva: true,
                        tutkintonimikkeet: true,
                        voimassaolo: true,
                        jarjestys: "nimi"
                    });

                    {
                        // Muuttujat
                        $scope.isSearching = true;
                        $scope.hakuparametrit = hakuparametrit();
                        $scope.nykyinenSivu = 1;
                        $scope.sivuja = 1;
                        $scope.kokonaismaara = 0;
                        $scope.koulutusalat = koulutusalaService.haeKoulutusalat();
                        $scope.koulutusalat = _($scope.koulutusalat)
                            .sortBy(ala => {
                                return ala.nimi[Kieli.getSisaltokieli()];
                            })
                            .value();
                        $scope.koulutusalatMap = {};
                        $scope.opintoalatMap = {};
                        _.each($scope.koulutusalat, ala => {
                            $scope.koulutusalatMap[ala.koodi] = ala;
                        });
                        $scope.sisaltokielet = ["fi", "sv"];
                        $scope.jarjestysTyypit = ["nimi", "muokattu"];

                        $scope.kaanna = text => Kaanna.kaanna(text);
                        $scope.koulutustyypit = YleinenData.ammatillisetKoulutustyypit;
                    }

                    {
                        // Kontrollerin toiminnallisuus
                        // Kutsutaan uib-pagination eventistä
                        $scope.pageChanged = () => haePerusteista($scope.hakuparametrit, $scope.nykyinenSivu);
                        $scope.isArray = _.isArray;

                        $scope.tyhjenna = () => {
                            $scope.nykyinenSivu = 1;
                            $scope.hakuparametrit = hakuparametrit();
                            haePerusteista($scope.nykyinenSivu);
                        };

                        // Totuusarvoille
                        $scope.toggleHakuparametri = key => {
                            $scope.hakuparametrit[key] = !$scope.hakuparametrit[key];
                            $scope.hakuMuuttui();
                        };

                        $scope.muutaHakua = (key, value) => {
                            $scope.hakuparametrit[key] = key === "tyyppi" ? [value] : value;
                            $scope.hakuMuuttui();
                        };

                        $scope.poistaHakukriteeri = key => {
                            delete $scope.hakuparametrit[key];
                            if (key === "tyyppi") {
                                $scope.hakuparametrit.tyyppi = oletustyypit;
                            }
                            $scope.hakuMuuttui();
                        };

                        $scope.hakuMuuttui = _.debounce(_.bind(haePerusteista, $scope, 1), hakuViive, {
                            leading: false
                        });
                    }

                    function selvitaTila(peruste) {
                        let currentTime = new Date().getTime();
                        let voimassaoloAlkaa = peruste.voimassaoloAlkaa;
                        let voimassaoloLoppuu = peruste.voimassaoloLoppuu;
                        let siirtymaPaattyy = peruste.siirtymaPaattyy;

                        if (voimassaoloAlkaa && voimassaoloAlkaa > currentTime) {
                            peruste.$$tila = "tuleva";
                            return;
                        }

                        if (
                            voimassaoloAlkaa &&
                            currentTime > voimassaoloAlkaa &&
                            (!voimassaoloLoppuu || voimassaoloLoppuu > currentTime)
                        ) {
                            peruste.$$tila = "voimassa";
                            return;
                        }

                        if (siirtymaPaattyy) {
                            if (currentTime > siirtymaPaattyy) {
                                peruste.$$tila = "arkistoitu";
                                return;
                            } else {
                                peruste.$$tila = "siirtyma";
                                return;
                            }
                        } else {
                            if (voimassaoloLoppuu && currentTime > voimassaoloLoppuu) {
                                peruste.$$tila = "arkistoitu";
                                return;
                            }
                        }
                        return;
                    }

                    function rakennaKorvauslista(perusteet, avain = "korvattavat-perusteet") {
                        let result = "<div>";
                        result += "<h4>" + KaannaService.kaanna(avain) + "</h4>";
                        let perusteetMapped = [];

                        for (const peruste of perusteet) {
                            const link = $state.href("root.esitys.peruste", {
                                perusteId: peruste.id,
                                suoritustapa: peruste.suoritustavat[0].suoritustapakoodi || "naytto"
                            });
                            perusteetMapped.push(
                                '<a href="' +
                                    link +
                                    '">' +
                                    KaannaService.kaanna(peruste.nimi) +
                                    " (" +
                                    peruste.diaarinumero +
                                    ")</a>"
                            );
                        }

                        result += _(perusteetMapped)
                            .map(peruste => "<div>" + peruste + "</div>")
                            .value();
                        result += "</div>";
                        return result;
                    }

                    // Muokkaa haetut perusteet käyttöliittymälle kelpaavaan muotoon
                    function perusteParsinta(vastaus) {
                        $scope.perusteet = vastaus;
                        _.each(vastaus.data, peruste => {
                            selvitaTila(peruste);
                            peruste.$$tutkintonimikkeet = {};
                            if (!_.isEmpty(peruste.korvattavatPerusteet)) {
                                peruste.$$korvattavatPerusteet = rakennaKorvauslista(
                                    peruste.korvattavatPerusteet,
                                    "korvattavat-perusteet"
                                );
                            }
                            if (!_.isEmpty(peruste.korvaavatPerusteet)) {
                                peruste.$$korvaavatPerusteet = rakennaKorvauslista(
                                    peruste.korvaavatPerusteet,
                                    "korvaavat-perusteet"
                                );
                            }
                            if (peruste.globalVersion) {
                                const currentTime = new Date().getTime();
                                if (currentTime - peruste.globalVersion.aikaleima < PERUSTE_HAKU_TUORE_KESTO) {
                                    peruste.$$muokattuViimeAikoina = true;
                                } else {
                                    peruste.$$muokattuViimeAikoina = false;
                                }
                            }
                            PerusteenTutkintonimikkeet.parse(
                                peruste.tutkintonimikkeetKoodisto,
                                peruste.$$tutkintonimikkeet
                            );
                            peruste.$$koulutusalaNimet = _(peruste.koulutukset)
                                .sortBy("id")
                                .map("koulutusalakoodi")
                                .map(koulutusalaService.haeKoulutusalaNimi)
                                .filter(_.isObject)
                                .map("nimi")
                                .value();
                        });
                        $scope.nykyinenSivu = vastaus.sivu + 1;
                        $scope.hakuparametrit.sivukoko = vastaus.sivukoko;
                        $scope.sivuja = vastaus.sivuja;
                        $scope.kokonaismaara = vastaus.kokonaismäärä;
                        $scope.sivut = _.range(0, vastaus.sivuja);
                        hakuPattern = new RegExp("(" + $scope.hakuparametrit.nimi + ")", "i");
                    }

                    // Perusteiden haku
                    // Vanha haku perutaan uuden alkaessa
                    let canceler;
                    async function haePerusteista(hakuparametrit, sivu = 1) {
                        sivu = sivu - 1;
                        try {
                            $scope.isSearching = true;
                            if (canceler) {
                                await canceler.resolve();
                            }
                            SpinnerService.enable();
                            canceler = $q.defer();
                            $scope.isSearching = true;
                            perusteParsinta(
                                await perustehaku
                                    .withHttpConfig({ timeout: canceler.promise })
                                    .get({ ...$scope.hakuparametrit, sivu })
                            );

                            if ($scope.hakuparametrit.koulutusala) {
                                $scope.opintoalat = (<any>_.findWhere($scope.koulutusalat, {
                                    koodi: $scope.hakuparametrit.koulutusala
                                })).opintoalat;
                                _.each($scope.opintoalat, ala => {
                                    $scope.opintoalatMap[ala.koodi] = ala;
                                });
                            } else {
                                $scope.opintoalat = [];
                                delete $scope.hakuparametrit.opintoala;
                            }
                        } catch (ex) {
                        } finally {
                            canceler = undefined;
                            SpinnerService.disable();
                        }
                    }

                    haePerusteista($scope.hakuparametrit);

                    $scope.$on("changed:sisaltokieli", $scope.tyhjenna);
                }
            },
            "koulutusvienti@root.selaus.koostenakyma": {
                templateUrl: "views/states/koostenakyma/perustehaku.html",
                controller(
                    $q,
                    $scope,
                    $rootScope,
                    $state,
                    perustehaku,
                    Haku,
                    koulutusalaService,
                    SpinnerService,
                    Kieli,
                    YleinenData,
                    MurupolkuData,
                    Kaanna,
                    PerusteenTutkintonimikkeet,
                    PERUSTE_HAKU_TUORE_KESTO
                ) {
                    const uikieli = Kieli.getUiKieli();
                    let hakuPattern: RegExp;
                    const hakuViive = 300; // ms
                    const oletustyypit = _.map([1, 11, 5, 12, 18], n => "koulutustyyppi_" + n);

                    const hakuparametrit = () => ({
                        kieli: uikieli,
                        koulutusala: "",
                        nimi: "",
                        opintoala: "",
                        osaamisalat: false,
                        perusteTyyppi: "normaali",
                        poistunut: false,
                        siirtyma: true,
                        sivu: 0,
                        sivukoko: 5,
                        tyyppi: oletustyypit,
                        tila: "valmis",
                        tuleva: true,
                        tutkintonimikkeet: false,
                        voimassaolo: true,
                        koulutusvienti: true,
                        jarjestys: "nimi"
                    });

                    {
                        // Muuttujat
                        $scope.isSearching = true;
                        $scope.hakuparametrit = hakuparametrit();
                        $scope.nykyinenSivu = 1;
                        $scope.sivuja = 1;
                        $scope.kokonaismaara = 0;
                        $scope.koulutusalat = koulutusalaService.haeKoulutusalat();
                        $scope.koulutusalat = _($scope.koulutusalat)
                            .sortBy(ala => {
                                return ala.nimi[Kieli.getSisaltokieli()];
                            })
                            .value();
                        $scope.koulutusalatMap = {};
                        $scope.opintoalatMap = {};
                        _.each($scope.koulutusalat, ala => {
                            $scope.koulutusalatMap[ala.koodi] = ala;
                        });
                        $scope.sisaltokielet = ["fi", "sv"];
                        $scope.jarjestysTyypit = ["nimi", "muokattu"];

                        $scope.kaanna = text => Kaanna.kaanna(text);
                        $scope.koulutustyypit = YleinenData.ammatillisetKoulutustyypit;
                    }

                    {
                        // Kontrollerin toiminnallisuus
                        // Kutsutaan uib-pagination eventistä
                        $scope.pageChanged = () => haePerusteista($scope.hakuparametrit, $scope.nykyinenSivu);
                        $scope.isArray = _.isArray;

                        $scope.tyhjenna = () => {
                            $scope.nykyinenSivu = 1;
                            $scope.hakuparametrit = hakuparametrit();
                            haePerusteista($scope.nykyinenSivu);
                        };

                        // Totuusarvoille
                        $scope.toggleHakuparametri = key => {
                            $scope.hakuparametrit[key] = !$scope.hakuparametrit[key];
                            $scope.hakuMuuttui();
                        };

                        $scope.muutaHakua = (key, value) => {
                            $scope.hakuparametrit[key] = key === "tyyppi" ? [value] : value;
                            $scope.hakuMuuttui();
                        };

                        $scope.poistaHakukriteeri = key => {
                            delete $scope.hakuparametrit[key];
                            if (key === "tyyppi") {
                                $scope.hakuparametrit.tyyppi = oletustyypit;
                            }
                            $scope.hakuMuuttui();
                        };

                        $scope.hakuMuuttui = _.debounce(_.bind(haePerusteista, $scope, 1), hakuViive, {
                            leading: false
                        });
                    }

                    function selvitaTila(peruste) {
                        let currentTime = new Date().getTime();
                        let voimassaoloAlkaa = peruste.voimassaoloAlkaa;
                        let voimassaoloLoppuu = peruste.voimassaoloLoppuu;
                        let siirtymaPaattyy = peruste.siirtymaPaattyy;

                        if (voimassaoloAlkaa && voimassaoloAlkaa > currentTime) {
                            peruste.$$tila = "tuleva";
                            return;
                        }

                        if (
                            voimassaoloAlkaa &&
                            currentTime > voimassaoloAlkaa &&
                            (!voimassaoloLoppuu || voimassaoloLoppuu > currentTime)
                        ) {
                            peruste.$$tila = "voimassa";
                            return;
                        }

                        if (siirtymaPaattyy) {
                            if (currentTime > siirtymaPaattyy) {
                                peruste.$$tila = "arkistoitu";
                                return;
                            } else {
                                peruste.$$tila = "siirtyma";
                                return;
                            }
                        } else {
                            if (voimassaoloLoppuu && currentTime > voimassaoloLoppuu) {
                                peruste.$$tila = "arkistoitu";
                                return;
                            }
                        }
                        return;
                    }

                    function rakennaKorvauslista(perusteet, avain = "korvattavat-perusteet") {
                        let result = "<div>";
                        result += "<h4>" + KaannaService.kaanna(avain) + "</h4>";
                        let perusteetMapped = [];

                        for (const peruste of perusteet) {
                            const link = $state.href("root.esitys.peruste", {
                                perusteId: peruste.id,
                                suoritustapa: peruste.suoritustavat[0].suoritustapakoodi || "naytto"
                            });
                            perusteetMapped.push(
                                '<a href="' +
                                link +
                                '">' +
                                KaannaService.kaanna(peruste.nimi) +
                                " (" +
                                peruste.diaarinumero +
                                ")</a>"
                            );
                        }

                        result += _(perusteetMapped)
                            .map(peruste => "<div>" + peruste + "</div>")
                            .value();
                        result += "</div>";
                        return result;
                    }

                    // Muokkaa haetut perusteet käyttöliittymälle kelpaavaan muotoon
                    function perusteParsinta(vastaus) {
                        $scope.perusteet = vastaus;
                        _.each(vastaus.data, peruste => {
                            selvitaTila(peruste);
                            peruste.$$tutkintonimikkeet = {};
                            if (!_.isEmpty(peruste.korvattavatPerusteet)) {
                                peruste.$$korvattavatPerusteet = rakennaKorvauslista(
                                    peruste.korvattavatPerusteet,
                                    "korvattavat-perusteet"
                                );
                            }
                            if (!_.isEmpty(peruste.korvaavatPerusteet)) {
                                peruste.$$korvaavatPerusteet = rakennaKorvauslista(
                                    peruste.korvaavatPerusteet,
                                    "korvaavat-perusteet"
                                );
                            }
                            if (peruste.globalVersion) {
                                const currentTime = new Date().getTime();
                                if (currentTime - peruste.globalVersion.aikaleima < PERUSTE_HAKU_TUORE_KESTO) {
                                    peruste.$$muokattuViimeAikoina = true;
                                } else {
                                    peruste.$$muokattuViimeAikoina = false;
                                }
                            }
                            PerusteenTutkintonimikkeet.parse(
                                peruste.tutkintonimikkeetKoodisto,
                                peruste.$$tutkintonimikkeet
                            );
                            peruste.$$koulutusalaNimet = _(peruste.koulutukset)
                                .sortBy("id")
                                .map("koulutusalakoodi")
                                .map(koulutusalaService.haeKoulutusalaNimi)
                                .filter(_.isObject)
                                .map("nimi")
                                .value();
                        });
                        $scope.nykyinenSivu = vastaus.sivu + 1;
                        $scope.hakuparametrit.sivukoko = vastaus.sivukoko;
                        $scope.sivuja = vastaus.sivuja;
                        $scope.kokonaismaara = vastaus.kokonaismäärä;
                        $scope.sivut = _.range(0, vastaus.sivuja);
                        hakuPattern = new RegExp("(" + $scope.hakuparametrit.nimi + ")", "i");
                    }

                    // Perusteiden haku
                    // Vanha haku perutaan uuden alkaessa
                    let canceler;
                    async function haePerusteista(hakuparametrit, sivu = 1) {
                        sivu = sivu - 1;
                        try {
                            $scope.isSearching = true;
                            if (canceler) {
                                await canceler.resolve();
                            }
                            SpinnerService.enable();
                            canceler = $q.defer();
                            $scope.isSearching = true;
                            perusteParsinta(
                                await perustehaku
                                    .withHttpConfig({ timeout: canceler.promise })
                                    .get({ ...$scope.hakuparametrit, sivu })
                            );

                            if ($scope.hakuparametrit.koulutusala) {
                                $scope.opintoalat = (<any>_.findWhere($scope.koulutusalat, {
                                    koodi: $scope.hakuparametrit.koulutusala
                                })).opintoalat;
                                _.each($scope.opintoalat, ala => {
                                    $scope.opintoalatMap[ala.koodi] = ala;
                                });
                            } else {
                                $scope.opintoalat = [];
                                delete $scope.hakuparametrit.opintoala;
                            }
                        } catch (ex) {
                        } finally {
                            canceler = undefined;
                            SpinnerService.disable();
                        }
                    }

                    haePerusteista($scope.hakuparametrit);

                    $scope.$on("changed:sisaltokieli", $scope.tyhjenna);
                }
            },
            "oppaat@root.selaus.koostenakyma": {
                templateUrl: "views/states/koostenakyma/oppaat.html",
                controller(
                    $q,
                    $scope,
                    $rootScope,
                    $state,
                    perustehaku,
                    Haku,
                    koulutusalaService,
                    SpinnerService,
                    Kieli,
                    YleinenData,
                    MurupolkuData,
                    Kaanna
                ) {
                    const uikieli = Kieli.getUiKieli();
                    let hakuPattern: RegExp;
                    const hakuViive = 300; // ms
                    const hakuparametrit = () => ({
                        kieli: uikieli,
                        nimi: "",
                        perusteTyyppi: "opas",
                        poistunut: false,
                        sivu: 0,
                        sivukoko: 5,
                        tila: "valmis",
                        tuleva: true,
                        voimassaolo: true,
                        jarjestys: "nimi"
                    });

                    {
                        // Muuttujat
                        $scope.isSearching = true;
                        $scope.hakuparametrit = hakuparametrit();
                        $scope.nykyinenSivu = 1;
                        $scope.sivuja = 1;
                        $scope.kokonaismaara = 0;
                        $scope.sisaltokielet = ["fi", "sv"];
                        $scope.jarjestysTyypit = ["nimi", "muokattu"];
                        $scope.kaanna = text => Kaanna.kaanna(text);
                    }

                    {
                        // Kontrollerin toiminnallisuus
                        // Kutsutaan uib-pagination eventistä
                        $scope.pageChanged = () => haePerusteista($scope.hakuparametrit, $scope.nykyinenSivu);
                        $scope.isArray = _.isArray;

                        $scope.tyhjenna = () => {
                            $scope.nykyinenSivu = 1;
                            $scope.hakuparametrit = hakuparametrit();
                            haePerusteista($scope.nykyinenSivu);
                        };

                        // Totuusarvoille
                        $scope.toggleHakuparametri = key => {
                            $scope.hakuparametrit[key] = !$scope.hakuparametrit[key];
                            $scope.hakuMuuttui();
                        };

                        $scope.muutaHakua = (key, value) => {
                            $scope.hakuparametrit[key] = value;
                            $scope.hakuMuuttui();
                        };

                        $scope.poistaHakukriteeri = key => {
                            delete $scope.hakuparametrit[key];
                            $scope.hakuMuuttui();
                        };

                        $scope.hakuMuuttui = _.debounce(_.bind(haePerusteista, $scope, 1), hakuViive, {
                            leading: false
                        });
                    }

                    function selvitaTila(peruste) {
                        let currentTime = new Date().getTime();
                        let voimassaoloAlkaa = peruste.voimassaoloAlkaa;
                        let voimassaoloLoppuu = peruste.voimassaoloLoppuu;

                        if (voimassaoloAlkaa && voimassaoloAlkaa > currentTime) {
                            peruste.$$tila = "tuleva";
                            return;
                        }

                        if (
                            voimassaoloAlkaa &&
                            currentTime > voimassaoloAlkaa &&
                            (!voimassaoloLoppuu || voimassaoloLoppuu > currentTime)
                        ) {
                            peruste.$$tila = "voimassa";
                            return;
                        }

                        if (voimassaoloLoppuu && currentTime > voimassaoloLoppuu) {
                            peruste.$$tila = "arkistoitu";
                            return;
                        }

                        // Jos voimassaolon alkamista tai loppumista ei ole asetettu
                        if (!peruste.$$tila) {
                            peruste.$$tila = "voimassa";
                        }

                        return;
                    }

                    // Muokkaa haetut perusteet käyttöliittymälle kelpaavaan muotoon
                    function perusteParsinta(vastaus) {
                        $scope.perusteet = vastaus;
                        _.each(vastaus.data, peruste => {
                            selvitaTila(peruste);
                        });
                        $scope.nykyinenSivu = vastaus.sivu + 1;
                        $scope.hakuparametrit.sivukoko = vastaus.sivukoko;
                        $scope.sivuja = vastaus.sivuja;
                        $scope.kokonaismaara = vastaus.kokonaismäärä;
                        $scope.sivut = _.range(0, vastaus.sivuja);
                        hakuPattern = new RegExp("(" + $scope.hakuparametrit.nimi + ")", "i");
                    }

                    // Perusteiden haku
                    // Vanha haku perutaan uuden alkaessa
                    let canceler;
                    async function haePerusteista(hakuparametrit, sivu = 1) {
                        sivu = sivu - 1;
                        try {
                            $scope.isSearching = true;
                            if (canceler) {
                                await canceler.resolve();
                            }
                            SpinnerService.enable();
                            canceler = $q.defer();
                            $scope.isSearching = true;
                            perusteParsinta(
                                await perustehaku
                                    .withHttpConfig({ timeout: canceler.promise })
                                    .get({ ...$scope.hakuparametrit, sivu })
                            );
                        } catch (ex) {
                        } finally {
                            canceler = undefined;
                            SpinnerService.disable();
                        }
                    }

                    haePerusteista($scope.hakuparametrit);

                    $scope.$on("changed:sisaltokieli", $scope.tyhjenna);
                }
            },
            "laitoslistaus@root.selaus.koostenakyma": {
                templateUrl: "views/states/koostenakyma/laitoshaku.html",
                controller($scope, $timeout, $q, $state, koulutustoimijaHaku) {
                    $scope.haku = "";
                    $scope.isLoading = true;
                    $scope.koulutustoimijat = [];
                    $scope.sivu = 1;
                    $scope.sivukoko = 10;
                    let canceler = null;

                    async function haeKoulutustoimijoista() {
                        $scope.isLoading = true;
                        if (canceler) {
                            canceler.resolve();
                        }

                        $timeout(async () => {
                            try {
                                canceler = $q.defer();
                                const koulutustoimijat = await koulutustoimijaHaku
                                    .withHttpConfig({ timeout: canceler.promise })
                                    .get({
                                        nimi: $scope.haku,
                                        sivu: $scope.sivu - 1,
                                        sivukoko: $scope.sivukoko
                                    });

                                $scope.koulutustoimijat = koulutustoimijat.data;
                                $scope.sivu = koulutustoimijat.sivu + 1;
                                $scope.sivuja = koulutustoimijat.sivuja;
                                $scope.sivukoko = koulutustoimijat.sivukoko;
                                $scope.kokonaismaara = koulutustoimijat["kokonaismäärä"];
                                canceler = null;
                            } catch (ex) {
                                $scope.koulutustoimijat = [];
                            } finally {
                                $timeout(() => ($scope.isLoading = false));
                            }
                        }, 200);
                    }

                    $timeout(() => haeKoulutustoimijoista());
                    $scope.hakuMuuttui = () => haeKoulutustoimijoista();
                }
            }
        }
    });
});
