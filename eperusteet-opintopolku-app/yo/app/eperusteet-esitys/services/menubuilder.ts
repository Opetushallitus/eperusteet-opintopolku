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
    .module("eperusteet.esitys")
    .service("epMenuBuilder", function(Algoritmit, $state, Kieli, Utils, epEsitysSettings) {
        function oppiaineSort(aineet) {
            // Handle mixed jnro + no jnro situations
            function jnroSort(item) {
                return _.isNumber(item.jnro) ? item.jnro : Number.MAX_SAFE_INTEGER;
            }
            return _(aineet)
                .sortBy(jnroSort)
                .sortBy(Utils.nameSort)
                .sortBy(jnroSort)
                .value();
        }

        function filteredOppimaarat(oppiaine, vlks) {
            var ret = [];
            if (oppiaine.koosteinen) {
                ret = _(oppiaine.oppimaarat)
                    .filter(function(oppimaara) {
                        return (
                            oppimaara.nimi[Kieli.getSisaltokieli()] &&
                            _.some(oppimaara.vuosiluokkakokonaisuudet, function(omVlk: any) {
                                return _.some(vlks, function(oneVlk) {
                                    return "" + omVlk._vuosiluokkaKokonaisuus === "" + oneVlk;
                                });
                            })
                        );
                    })
                    .value();
            }
            return oppiaineSort(ret);
        }

        function buildOppiaineItem(arr, oppiaine, vlk, depth, isSisalto) {
            if (!oppiaine.nimi[Kieli.getSisaltokieli()]) {
                return;
            }
            arr.push({
                depth: depth,
                $hidden: depth > 0,
                $oppiaine: oppiaine,
                label: oppiaine.nimi,
                url: isSisalto
                    ? $state.href(epEsitysSettings.perusopetusState + ".sisallot", { oppiaineId: oppiaine.id })
                    : $state.href(epEsitysSettings.perusopetusState + ".vlkoppiaine", {
                          vlkId: vlk[0],
                          oppiaineId: oppiaine.id
                      })
            });
        }

        function createOppiaineItem(oppiaine, depth, idx = undefined) {
            return {
                $id: oppiaine.id,
                depth: depth,
                $jnro: oppiaine.jarjestys,
                $oppiaine: oppiaine,
                $hidden: false,
                idx: idx,
                label: oppiaine.nimi,
                url: $state.href("root.lukio.oppiaine", { oppiaineId: oppiaine.id })
            };
        }

        function createKurssiItem(kurssi, depth) {
            return {
                $id: kurssi.id,
                depth: depth,
                tyyppi: kurssi.tyyppi,
                $jnro: kurssi.jarjestys,
                $kurssi: kurssi,
                $hidden: true,
                label: kurssi.nimi,
                url: $state.href("root.lukio.oppiaine.kurssi", {
                    oppiaineId: kurssi.oppiaineId,
                    kurssiId: kurssi.id
                })
            };
        }

        function buildLukioOppiaineMenu(oppiaineet) {
            var idx = 0;
            return _.reduce(
                oppiaineet,
                function(menu, oppiaine: any) {
                    menu.push(createOppiaineItem(oppiaine, 0, idx));
                    idx++;
                    if (!_.isEmpty(oppiaine.oppimaarat)) {
                        _.each(oppiaine.oppimaarat, function(oppimaara: any) {
                            menu.push(createOppiaineItem(oppimaara, 1));
                            if (!_.isEmpty(oppimaara.kurssit)) {
                                _.each(oppimaara.kurssit, function(kurssi) {
                                    menu.push(createKurssiItem(kurssi, 2));
                                });
                            }
                        });
                    }
                    if (!_.isEmpty(oppiaine.kurssit)) {
                        _.each(oppiaine.kurssit, function(kurssi) {
                            menu.push(createKurssiItem(kurssi, 1));
                        });
                    }
                    return menu;
                },
                []
            );
        }

        function rakennaYksinkertainenMenu(otsikot) {
            var menu = [];
            Algoritmit.kaikilleLapsisolmuille(otsikot, "lapset", function(osa, depth) {
                menu.push({
                    $osa: osa,
                    label: osa.tekstiKappale ? osa.tekstiKappale.nimi : "",
                    depth: depth,
                    $hidden: depth > 0
                });
            });
            var levels = {};
            _.each(menu, function(item, index) {
                levels[item.depth] = index;
                item.$parent = levels[item.depth - 1] || null;
            });
            return menu;
        }

        function traverseOppiaineet(aineet, arr, vlk, startingDepth = 0) {
            const isSisalto = startingDepth === 0;
            const vlks = _.isArray(vlk) ? vlk : [vlk];
            const oaFiltered = _(aineet)
                .filter(function(oa) {
                    const oppiaineHasVlk = _.some(oa.vuosiluokkakokonaisuudet, function(oavkl: any) {
                        return _.some(vlks, function(oneVlk) {
                            return "" + oavkl._vuosiluokkaKokonaisuus === "" + oneVlk;
                        });
                    });
                    const oppimaaraVlkIds = _(oa.oppimaarat)
                        .map(oppimaara => _.map(oppimaara.vuosiluokkakokonaisuudet, "_vuosiluokkaKokonaisuus"))
                        .flatten()
                        .uniq()
                        .value();
                    const vlkIds = _.map(vlks, String);
                    return oppiaineHasVlk || !_.isEmpty(_.intersection(oppimaaraVlkIds, vlkIds));
                })
                .value();

            _.each(oppiaineSort(oaFiltered), function(oa) {
                buildOppiaineItem(arr, oa, vlks, startingDepth, isSisalto);
                _.each(filteredOppimaarat(oa, vlks), function(oppimaara) {
                    buildOppiaineItem(arr, oppimaara, vlks, startingDepth + 1, isSisalto);
                });
            });
        }

        function rakennaTekstisisalto(sisalto) {
            var suunnitelma = [];
            Algoritmit.kaikilleLapsisolmuille(sisalto, "lapset", function(osa, depth) {
                if (
                    osa.perusteenOsa != null &&
                    osa.perusteenOsa.tunniste != null &&
                    osa.perusteenOsa.tunniste === "laajaalainenosaaminen"
                ) {
                    suunnitelma.push({
                        id: "laajaalaiset",
                        $osa: null,
                        label: osa.perusteenOsa.nimi,
                        depth: depth,
                        $hidden: depth > 0,
                        link: ["root.aipe.laajaalaiset"]
                    });
                } else if (osa.perusteenOsa != null &&
                    osa.perusteenOsa.osanTyyppi != null &&
                    osa.perusteenOsa.osanTyyppi === "taiteenala") {

                    suunnitelma.push({
                        $osa: osa,
                        label: osa.perusteenOsa ? osa.perusteenOsa.nimi : "",
                        depth: depth,
                        $hidden: depth > 0,
                        tyyppi: "taiteenala"
                    });
                    suunnitelma.push({
                        id: "aikuistenOpetus",
                        $osa: osa,
                        label: osa.perusteenOsa.aikuistenOpetus ? osa.perusteenOsa.aikuistenOpetus.nimi : "",
                        depth: depth + 1,
                        $hidden: depth > 0,
                        tyyppi: "taiteenalaOsa"
                    });
                    suunnitelma.push({
                        id: "kasvatus",
                        $osa: osa,
                        label: osa.perusteenOsa.kasvatus ? osa.perusteenOsa.kasvatus.nimi : "",
                        depth: depth + 1,
                        $hidden: depth > 0,
                        tyyppi: "taiteenalaOsa"
                    });
                    suunnitelma.push({
                        id: "oppimisenArviointiOpetuksessa",
                        $osa: osa,
                        label: osa.perusteenOsa.oppimisenArviointiOpetuksessa ? osa.perusteenOsa.oppimisenArviointiOpetuksessa.nimi : "",
                        depth: depth + 1,
                        $hidden: depth > 0,
                        tyyppi: "taiteenalaOsa"
                    });
                    suunnitelma.push({
                        id: "teemaopinnot",
                        $osa: osa,
                        label: osa.perusteenOsa.teemaopinnot ? osa.perusteenOsa.teemaopinnot.nimi : "",
                        depth: depth + 1,
                        $hidden: depth > 0,
                        tyyppi: "taiteenalaOsa"
                    });
                    suunnitelma.push({
                        id: "tyotavatOpetuksessa",
                        $osa: osa,
                        label: osa.perusteenOsa.tyotavatOpetuksessa ? osa.perusteenOsa.tyotavatOpetuksessa.nimi : "",
                        depth: depth + 1,
                        $hidden: depth > 0,
                        tyyppi: "taiteenalaOsa"
                    });
                    suunnitelma.push({
                        id: "yhteisetOpinnot",
                        $osa: osa,
                        label: osa.perusteenOsa.yhteisetOpinnot ? osa.perusteenOsa.yhteisetOpinnot.nimi : "",
                        depth: depth + 1,
                        $hidden: depth > 0,
                        tyyppi: "taiteenalaOsa"
                    });
                } else {
                    suunnitelma.push({
                        $osa: osa,
                        label: osa.perusteenOsa ? osa.perusteenOsa.nimi : (osa.nimi ? osa.nimi : ""),
                        depth: depth,
                        $hidden: depth > 0
                    });
                }
            });
            var levels = {};
            _.each(suunnitelma, function(item, index) {
                levels[item.depth] = index;
                item.$parent = levels[item.depth - 1] || null;
            });
            return suunnitelma;
        }

        function rakennaVuosiluokkakokonaisuuksienSisalto(vlkt, aineet) {
            var arr = [];
            _.each(vlkt, function(vlk) {
                arr.push({
                    $vkl: vlk,
                    label: vlk.nimi,
                    depth: 0,
                    url: $state.href(epEsitysSettings.perusopetusState + ".vuosiluokkakokonaisuus", { vlkId: vlk.id })
                });
                traverseOppiaineet(aineet, arr, vlk.id, 1);
            });
            return arr;
        }

        function rakennaSisallotOppiaineet(aineet, sections, selected) {
            var navi: any = {};
            navi.oppiaineet = [];
            traverseOppiaineet(aineet, navi.oppiaineet, selected);
            _.each(sections, function(v) {
                if (navi[v.id]) {
                    v.items = navi[v.id];
                }
            });
        }

        function rakennaVaiheet(vaiheet) {
            const menu = [];
            _.each(vaiheet, vaihe => {
                menu.push({
                    $id: vaihe.id,
                    $vaihe: vaihe,
                    label: vaihe.nimi,
                    depth: 0
                });
            });
            return menu;
        }

        this.filteredOppimaarat = filteredOppimaarat;
        this.buildLukioOppiaineMenu = buildLukioOppiaineMenu;
        this.rakennaTekstisisalto = rakennaTekstisisalto;
        this.rakennaYksinkertainenMenu = rakennaYksinkertainenMenu;
        this.rakennaVuosiluokkakokonaisuuksienSisalto = rakennaVuosiluokkakokonaisuuksienSisalto;
        this.rakennaSisallotOppiaineet = rakennaSisallotOppiaineet;
        this.rakennaVaiheet = rakennaVaiheet;
    });
