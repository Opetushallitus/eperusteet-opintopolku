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
    .service("UusimmatPerusteetService", function($q, Perusteet, $state, Kieli) {
        const uikieli = Kieli.getUiKieli();
        let perusteet = {};
        const paramMap = {
            koulutustyyppi_1x: {
                nimi: "",
                koulutusala: "",
                tyyppi: "koulutustyyppi_1,koulutustyyppi_11,koulutustyyppi_12",
                kieli: uikieli,
                opintoala: "",
                siirtyma: false,
                sivu: 0,
                sivukoko: 7,
                perusteTyyppi: "normaali",
                tila: "valmis",
                jarjestys: "muokattu",
                stateTila: ""
            },
            koulutustyyppi_1: {
                tyyppi: "koulutustyyppi_1",
                stateTila: "root.esitys.peruste"
            },
            koulutustyyppi_2: {
                tyyppi: "koulutustyyppi_2",
                tila: "valmis",
                stateTila: "root.lukio.tiedot"
            },
            koulutustyyppi_20: {
                tyyppi: "koulutustyyppi_20",
                tila: "valmis",
                stateTila: "root.varhaiskasvatus.tiedot"
            },
            koulutustyyppi_23: {
                tyyppi: "koulutustyyppi_23",
                tila: "valmis",
                stateTila: "root.lukio.tiedot"
            },
            koulutustyyppi_11: {
                tyyppi: "koulutustyyppi_11",
                stateTila: "root.esitys.peruste"
            },
            koulutustyyppi_12: {
                tyyppi: "koulutustyyppi_12",
                stateTila: "root.esitys.peruste"
            },
            koulutustyyppi_16: {
                tyyppi: "koulutustyyppi_16",
                tila: "valmis",
                stateTila: "root.perusopetus.tiedot"
            },
            koulutustyyppi_17: {
                tyyppi: "koulutustyyppi_17",
                tila: "valmis",
                stateTila: "root.aipe.tiedot"
            },
            koulutustyyppi_15: {
                tyyppi: "koulutustyyppi_15",
                tila: "valmis",
                stateTila: "root.esiopetus.tiedot"
            },
            koulutustyyppi_6: {
                tyyppi: "koulutustyyppi_6",
                tila: "valmis",
                stateTila: "root.lisaopetus.tiedot"
            },
            koulutustyyppi_5: {
                tyyppi: "koulutustyyppi_5",
                tila: "valmis",
                stateTila: ""
            },
            koulutustyyppi_18: {
                tyyppi: "koulutustyyppi_18",
                tila: "valmis",
                stateTila: ""
            },
            koulutustyyppi_22: {
                tyyppi: "koulutustyyppi_22",
                tila: "valmis",
                stateTila: "root.esiopetus.tiedot"
            },
            koulutustyyppi_14: {
                tyyppi: "koulutustyyppi_14",
                tila: "valmis",
                stateTila: "root.lukio.tiedot"
            },
            koulutustyyppi_999907: {
                tyyppi: "koulutustyyppi_999907",
                tila: "valmis",
                stateTila: "root.tpo.tiedot"
            }
        };

        const getGeneric = key => {
            const now = (new Date()).getTime();
            const params = paramMap[key];
            const voimaantuloFilter = (p: any) => p.voimassaoloAlkaa
                && p.voimassaoloAlkaa < now
                && (!p.voimassaoloLoppuu || p.voimassaoloLoppuu > now);
            return Perusteet.get(params, res => {
                const found = {};
                const kaikki = _(res.data)
                    .uniq("id")
                    .sortBy("voimassaoloAlkaa")
                    .reverse()
                    .value();
                const voimassaOlevat = _.filter(kaikki, voimaantuloFilter);
                perusteet[params.tyyppi] = _.isEmpty(voimassaOlevat)
                    ? kaikki
                    : voimassaOlevat;
            }).$promise;
        };

        const getPerusopetus = _.partial(getGeneric, "koulutustyyppi_16");
        const getAipe = _.partial(getGeneric, "koulutustyyppi_17");
        const getValmistavaPerusopetus = _.partial(getGeneric, "koulutustyyppi_22");
        const getLukioopetus = _.partial(getGeneric, "koulutustyyppi_2");
        const getValmistavaLukioopetus = _.partial(getGeneric, "koulutustyyppi_23");
        const getEsiopetus = _.partial(getGeneric, "koulutustyyppi_15");
        const getTpo = _.partial(getGeneric, "koulutustyyppi_999907");
        const getLisaopetus = _.partial(getGeneric, "koulutustyyppi_6");
        const getValma = _.partial(getGeneric, "koulutustyyppi_18");
        const getTelma = _.partial(getGeneric, "koulutustyyppi_5");
        const getVarhaiskasvatus = _.partial(getGeneric, "koulutustyyppi_20");
        const getAikuisLukio = _.partial(getGeneric, "koulutustyyppi_14");

        this.fetch = cb => {
            const key = "koulutustyyppi_1x";
            const params = paramMap[key];
            const amDeferred = Perusteet.get(params, res => {
                perusteet[key] = res.data;
                _.each(perusteet[key], peruste => {
                    peruste.url = $state.href("root.esitys.peruste", {
                        perusteId: peruste.id,
                        suoritustapa: peruste.koulutustyyppi === "koulutustyyppi_1" ? "ops" : "naytto"
                    });
                });
            }).$promise;
            $q
                .all([
                    amDeferred,
                    getPerusopetus(),
                    getAipe(),
                    getValmistavaPerusopetus(),
                    getEsiopetus(),
                    getTpo(),
                    getValmistavaLukioopetus(),
                    getLukioopetus(),
                    getLisaopetus(),
                    getVarhaiskasvatus(),
                    getValma(),
                    getAikuisLukio(),
                    getTelma()
                ])
                .then(() => {
                    cb(perusteet);
                });
        };

        const getStateTila = tyyppi => paramMap[tyyppi].stateTila;

        this.getPerusopetus = getPerusopetus;
        this.getAipe = getAipe;
        this.getValmistavaPerusopetus = getValmistavaPerusopetus;
        this.getValmistavaLukioopetus = getValmistavaLukioopetus;
        this.getLukioopetus = getLukioopetus;
        this.getEsiopetus = getEsiopetus;
        this.getTpo = getTpo;
        this.getLisaopetus = getLisaopetus;
        this.getVarhaiskasvatus = getVarhaiskasvatus;
        this.getValma = getValma;
        this.getTelma = getTelma;
        this.getAikuisLukio = getAikuisLukio;
        this.getStateTila = getStateTila;
    })
    .controller("EtusivuController", function(
        $scope,
        UusimmatPerusteetService,
        MurupolkuData,
        TiedotteetHaku,
        Utils,
        Kieli,
        Perusteet
    ) {
        MurupolkuData.setTitle(null);
        $scope.uusimmatLista = [];
        $scope.tiedotteet = [];
        $scope.naytto = { limit: 5, shown: 5 };
        $scope.kieli = Kieli.getSisaltokieli();
        $scope.UusimmatPerusteetService = UusimmatPerusteetService;
        $scope.currentYear = new Date().getFullYear();

        Perusteet.uusimmat(res => ($scope.uusimmatLista = res));
        UusimmatPerusteetService.fetch(res => {
            $scope.uusimmat = res;
        });

        TiedotteetHaku.get({
            sivukoko: 5,
            kieli: Kieli.getSisaltokieli(),
            julkinen: true,
            yleinen: true
        }, res => {
            $scope.tiedotteet = res.data;
        });
    })
    .controller("TiedoteViewController", function($scope, TiedotteetCRUD, $stateParams, MurupolkuData) {
        $scope.tiedote = null;

        TiedotteetCRUD.get({ tiedoteId: $stateParams.tiedoteId }, tiedote => {
            $scope.tiedote = tiedote;
            MurupolkuData.set("tiedoteNimi", tiedote.otsikko);
        });
    })
    .directive("limitToggler", function() {
        return {
            restrict: "AE",
            template:
                '<div class="show-toggler" ng-show="isVisible">' +
                '  <a ng-show="isToggled" class="action-link" ng-click="toggle()" kaanna="\'sivupalkki-piilota\'"></a>' +
                '  <a ng-hide="isToggled" class="action-link" ng-click="toggle()" kaanna="\'sivupalkki-nayta-kaikki\'"></a>' +
                '</div>',
            scope: {
                model: "=",
                limit: "=",
                limiter: "="
            },
            controller: $scope => {
                $scope.isVisible = false;
                $scope.isToggled = false;
                $scope.$watch("model", () => {
                    $scope.isVisible = $scope.model.length > $scope.limit;
                });
                $scope.toggle = () => {
                    if ($scope.limiter === $scope.limit) {
                        $scope.limiter = $scope.model.length;
                        $scope.isToggled = true;
                    } else {
                        $scope.limiter = $scope.limit;
                        $scope.isToggled = false;
                    }
                };
            }
        };
    });
