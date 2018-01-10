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

angular.module("eperusteet.esitys").factory("epLukioUtils", function() {
    return {
        flattenNames: function(lapset) {
            var flattenedLastenNimet = [];
            function eachName(lapset) {
                _.each(lapset, function(item) {
                    flattenedLastenNimet.push({ name: item.$osa.nimi, _id: item._perusteenOsa });
                    if (item.lapset && item.lapset.length > 0) {
                        return eachName(item.lapset);
                    }
                });
            }
            eachName(lapset);
            return flattenedLastenNimet;
        },
        flattenAndZipOppiaineet: function(oppiaineet) {
            return _.reduce(
                oppiaineet,
                function(all, oppiaine: any, index) {
                    if (!_.isEmpty(oppiaine.oppimaarat)) {
                        _.each(oppiaine.oppimaarat, function(oppimaara: any) {
                            all.push(oppimaara);
                        });
                    }
                    all.push(oppiaine);
                    if (oppiaineet.length - 1 === index) {
                        return _.zipBy(all, "id");
                    }
                    return all;
                },
                []
            );
        },
        reduceKurssit: function(kurssit) {
            return _.reduce(
                kurssit,
                function(kaikkiKurssit, oppiaine: any) {
                    if (!_.isEmpty(oppiaine.oppimaarat)) {
                        _.each(oppiaine.oppimaarat, function(oppimaara: any) {
                            if (!_.isEmpty(oppimaara.kurssit)) {
                                _(oppimaara.kurssit)
                                    .map(function(kurssi) {
                                        kurssi.oppiaineNimi = oppimaara.nimi;
                                        return kurssi;
                                    })
                                    .each(function(kurssi) {
                                        kaikkiKurssit.push(kurssi);
                                    })
                                    .value();
                            }
                        });
                    }
                    if (!_.isEmpty(oppiaine.kurssit)) {
                        _(oppiaine.kurssit)
                            .map(function(kurssi: any) {
                                kurssi.oppiaineNimi = oppiaine.nimi;
                                return kurssi;
                            })
                            .each(function(kurssi: any) {
                                kaikkiKurssit.push(kurssi);
                            })
                            .value();
                    }
                    return kaikkiKurssit;
                },
                []
            );
        }
    };
});
