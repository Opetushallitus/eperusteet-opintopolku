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

angular.module("app").factory("opsUtils", function(Algoritmit, $state, Kieli, Utils) {
    const sortVlk = vlk => {
        return _(vlk)
            .map("vuosiluokkakokonaisuus")
            .sortBy((vlk: any) => {
                return _.reduce(
                    vlk.nimi.fi.replace(/\D/g, "").split(""),
                    function(sum, num: any) {
                        return sum + parseInt(num, 10);
                    },
                    0
                );
            })
            .value();
    };

    const getVlkId = (vlkt, oppiaine) => {
        return _(oppiaine.vuosiluokkakokonaisuudet)
            .filter(v => {
                return vlkt._tunniste === v._vuosiluokkakokonaisuus;
            })
            .map("id")
            .first();
    };

    const getVuosiId = (vlk, vuosi) => {
        let year = "vuosiluokka_" + vuosi;
        return _(vlk.vuosiluokat)
            .filter(v => {
                return v.vuosiluokka === year;
            })
            .map("id")
            .first();
    };

    const makeSisalto = (perusteOpVlk, tavoitteet, perusteOppiaine, laajaalaiset, sortHelper) => {
        return _(tavoitteet)
            .each(function(item) {
                const perusteSisaltoAlueet = perusteOpVlk ? _.indexBy(perusteOpVlk.sisaltoalueet, "tunniste") : {};
                const perusteKohdealueet = perusteOppiaine ? _.indexBy(perusteOppiaine.kohdealueet, "id") : [];
                if (perusteOpVlk) {
                    let perusteTavoite: any = _.find(perusteOpVlk.tavoitteet, function(pTavoite: any) {
                        return pTavoite.tunniste === item.tunniste;
                    });
                    item.$tavoite = perusteTavoite.tavoite;
                    let alueet = _.map(perusteTavoite.sisaltoalueet, function(tunniste: any) {
                        return perusteSisaltoAlueet[tunniste] || {};
                    });
                    if (!_.isEmpty(alueet)) {
                        item.$sisaltoalueet = alueet.sort((a: any, b: any) => {
                            if (sortHelper.indexOf(a.nimi.fi) > sortHelper.indexOf(b.nimi.fi)) {
                                return 1;
                            }
                            if (sortHelper.indexOf(a.nimi.fi) < sortHelper.indexOf(b.nimi.fi)) {
                                return -1;
                            }
                            return 0;
                        });
                        item.sisaltoalueet = item.sisaltoalueet.sort((a, b) => {
                            if (
                                sortHelper.indexOf(a.sisaltoalueet.nimi.fi) >
                                sortHelper.indexOf(b.sisaltoalueet.nimi.fi)
                            ) {
                                return 1;
                            }
                            if (
                                sortHelper.indexOf(a.sisaltoalueet.nimi.fi) <
                                sortHelper.indexOf(b.sisaltoalueet.nimi.fi)
                            ) {
                                return -1;
                            }
                            return 0;
                        });
                    }
                    item.$kohdealue = perusteKohdealueet[<string>_.first(perusteTavoite.kohdealueet)];
                    item.$laajaalaiset = _.map(perusteTavoite.laajaalaisetosaamiset, function(tunniste: string) {
                        return laajaalaiset[tunniste];
                    });
                    item.$arvioinninkohteet = perusteTavoite.arvioinninkohteet;
                }
            })
            .sortBy("$tavoite")
            .value();
    };

    return {
        sortVlk: sortVlk,
        getVlkId: getVlkId,
        getVuosiId: getVuosiId,
        makeSisalto: makeSisalto
    };
});
