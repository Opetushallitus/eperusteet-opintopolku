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

"use strict";

angular
    .module("app")
    .service("PerusteenRakenne", function(
        /*PerusteProjektiService, PerusteprojektiResource,
  PerusteTutkinnonosatVersio, */ PerusteRakenteet,
        PerusteTutkinnonosat,
        Perusteet,
        PerusteTutkinnonosa,
        Notifikaatiot,
        $state
    ) {
        function haeTutkinnonosatByPeruste(perusteId, suoritustapa, success) {
            PerusteTutkinnonosat.query(
                {
                    perusteId: perusteId,
                    suoritustapa: suoritustapa
                },
                success,
                Notifikaatiot.serverCb
            );
        }

        /*function haeTutkinnonosatVersioByPeruste(perusteId, suoritustapa, revisio, success) {
    PerusteTutkinnonosatVersio.query({
      perusteId: perusteId,
      suoritustapa: suoritustapa,
      versioId: revisio
    },
    success,
      Notifikaatiot.serverCb);
  }*/

        /*function haeTutkinnonosat(perusteProjektiId, suoritustapa, success) {
    PerusteprojektiResource.get({id: perusteProjektiId}, function(perusteprojekti) {
      haeTutkinnonosatByPeruste(perusteprojekti._peruste, suoritustapa, success);
    });
  }*/

        function pilkoTutkinnonOsat(tutkinnonOsat, response) {
            response = response || {};
            response.tutkinnonOsaViitteet = _(tutkinnonOsat)
                .pluck("id")
                .zipObject(tutkinnonOsat)
                .value();
            response.tutkinnonOsat = _.zipObject(_.map(tutkinnonOsat, "_tutkinnonOsa"), tutkinnonOsat);
            return response;
        }

        /*function haeByPerusteprojekti(id, suoritustapa, success) {
    PerusteprojektiResource.get({id: id}, function(vastaus) {
      hae(vastaus._peruste, suoritustapa, success);
    });
  }*/

        function rakennaPalaute(rakenne, peruste, tutkinnonOsat) {
            var response: any = {};
            rakenne.kuvaus = rakenne.kuvaus || {};
            response.rakenne = rakenne;
            response.$peruste = peruste;
            response.tutkinnonOsaViitteet = _(tutkinnonOsat)
                .pluck("id")
                .zipObject(tutkinnonOsat)
                .value();
            response.tutkinnonOsat = _.zipObject(_.map(tutkinnonOsat, "_tutkinnonOsa"), tutkinnonOsat);
            return response;
        }

        function hae(perusteId, suoritustapa, success) {
            Perusteet.get(
                {
                    perusteId: perusteId
                },
                function(peruste) {
                    suoritustapa = suoritustapa || peruste.suoritustavat[0].suoritustapakoodi;
                    PerusteRakenteet.get(
                        {
                            perusteId: peruste.id,
                            suoritustapa: suoritustapa
                        },
                        function(rakenne) {
                            PerusteTutkinnonosat.query(
                                {
                                    perusteId: peruste.id,
                                    suoritustapa: suoritustapa
                                },
                                function(tosat) {
                                    success(pilkoTutkinnonOsat(tosat, rakennaPalaute(rakenne, peruste, tosat)));
                                }
                            );
                        }
                    );
                }
            );
        }

        function kaikilleRakenteille(rakenne, f) {
            if (!rakenne || !f) {
                return;
            }
            _.forEach(rakenne.osat, function(r) {
                r.$parent = rakenne;
                kaikilleRakenteille(r, f);
                f(r);
            });
        }

        function tallennaRakenne(rakenne, id, suoritustapa, success, after) {
            success = success || angular.noop;
            after = after || angular.noop;
            PerusteRakenteet.save(
                {
                    perusteId: id,
                    suoritustapa: suoritustapa
                },
                rakenne.rakenne,
                function() {
                    after();
                    success();
                },
                function(err) {
                    after();
                    Notifikaatiot.serverCb(err);
                }
            );
        }

        function tallennaTutkinnonosat(rakenne, id, suoritustapa, success) {
            success = success || function() {};
            var after = _.after(_.size(rakenne.tutkinnonOsat), success);
            _.forEach(_.values(rakenne.tutkinnonOsat), function(osa: any) {
                PerusteTutkinnonosa.save(
                    {
                        perusteId: id,
                        suoritustapa: suoritustapa,
                        osanId: osa.id
                    },
                    osa,
                    after(),
                    Notifikaatiot.serverCb
                );
            });
        }

        function validoiRakennetta(rakenne, testi) {
            if (testi(rakenne)) {
                return true;
            } else if (rakenne.osat) {
                var loyty = false;
                _.forEach(rakenne.osat, function(osa) {
                    if (validoiRakennetta(osa, testi)) {
                        loyty = true;
                    }
                });
                return loyty;
            }
            return false;
        }

        function haePerusteita(haku, success) {
            Perusteet.info(
                {
                    nimi: haku,
                    sivukoko: 15
                },
                success,
                Notifikaatiot.serverCb
            );
        }

        function poistaTutkinnonOsaViite(osaId, _peruste, suoritustapa, success) {
            PerusteTutkinnonosa.remove(
                {
                    perusteId: _peruste,
                    suoritustapa: suoritustapa,
                    osanId: osaId
                },
                function(res) {
                    success(res);
                },
                Notifikaatiot.serverCb
            );
        }

        function puustaLoytyy(rakenne) {
            var set = {};
            kaikilleRakenteille(rakenne, function(osa) {
                set[osa._tutkinnonOsaViite] = osa._tutkinnonOsaViite ? true : false;
            });
            return set;
        }

        function isValmaTelma(koulutustyyppi) {
            return _.includes([
                "koulutustyyppi_18",
                "koulutustyyppi_5",
            ], koulutustyyppi);
        }

        function isAmmatillinen(koulutustyyppi) {
            return _.includes([
                "koulutustyyppi_1",
                "koulutustyyppi_11",
                "koulutustyyppi_12",
                "koulutustyyppi_18",
                "koulutustyyppi_5",
            ], koulutustyyppi);
        }

        const PerusteDefaults = {
            koulutustyyppi_1: {
                nimi: "perustutkinto",
                oletusSuoritustapa: "ops",
                hasLaajuus: true,
                hasTutkintonimikkeet: true,
                state: "root.esitys.peruste",
                sisaltoTunniste: "sisalto",
                hasPdfCreation: true
            },
            koulutustyyppi_2: {
                nimi: "lukiokoulutus",
                oletusSuoritustapa: "lukiokoulutus",
                hasTutkintonimikkeet: false,
                state: "root.lukio",
                hasLaajuus: false,
                sisaltoTunniste: "lukiosisalto",
                hasPdfCreation: false
            },
            koulutustyyppi_5: {
                nimi: "telma",
                hasLaajuus: true,
                oletusSuoritustapa: "ops",
                hasTutkintonimikkeet: true,
                state: "root.ammatillinenaikuiskoulutus",
                sisaltoTunniste: "sisalto",
                hasPdfCreation: true
            },
            koulutustyyppi_6: {
                nimi: "lisaopetus",
                oletusSuoritustapa: "lisaopetus",
                hasTutkintonimikkeet: false,
                state: "root.lisaopetus",
                hasLaajuus: false,
                sisaltoTunniste: "losisalto",
                hasPdfCreation: true
            },
            koulutustyyppi_11: {
                nimi: "ammattitutkinto",
                oletusSuoritustapa: "naytto",
                hasTutkintonimikkeet: true,
                hasLaajuus: true,
                state: "root.ammatillinenaikuiskoulutus",
                sisaltoTunniste: "sisalto",
                hasPdfCreation: true
            },
            koulutustyyppi_12: {
                nimi: "erikoisammattitutkinto",
                oletusSuoritustapa: "naytto",
                hasLaajuus: true,
                hasTutkintonimikkeet: true,
                state: "root.ammatillinenaikuiskoulutus",
                sisaltoTunniste: "sisalto",
                hasPdfCreation: true
            },
            koulutustyyppi_14: {
                nimi: "aikuistenlukiokoulutus",
                oletusSuoritustapa: "lukiokoulutus",
                hasTutkintonimikkeet: false,
                state: "root.lukio",
                hasLaajuus: false,
                sisaltoTunniste: "lukiosisalto",
                hasPdfCreation: false
            },
            koulutustyyppi_15: {
                nimi: "esiopetus",
                oletusSuoritustapa: "esiopetus",
                hasTutkintonimikkeet: false,
                state: "root.esiopetus",
                sisaltoTunniste: "eosisalto",
                hasLaajuus: false,
                hasPdfCreation: false
            },
            koulutustyyppi_16: {
                nimi: "perusopetus",
                oletusSuoritustapa: "perusopetus",
                hasTutkintonimikkeet: false,
                state: "root.perusopetus",
                hasLaajuus: false,
                sisaltoTunniste: "posisalto",
                hasPdfCreation: false
            },
            koulutustyyppi_17: {
                nimi: "aikuistenperusopetus",
                oletusSuoritustapa: "aipe",
                hasTutkintonimikkeet: false,
                state: "root.aikuisperusopetus",
                sisaltoTunniste: "aipesisalto",
                hasLaajuus: false,
                hasPdfCreation: true
            },
            koulutustyyppi_18: {
                nimi: "velma",
                hasLaajuus: true,
                oletusSuoritustapa: "ops",
                hasTutkintonimikkeet: true,
                state: "root.ammatillinenaikuiskoulutus",
                sisaltoTunniste: "sisalto",
                hasPdfCreation: true
            },
            koulutustyyppi_20: {
                nimi: "varhaiskasvatus",
                oletusSuoritustapa: "varhaiskasvatus",
                hasTutkintonimikkeet: false,
                state: "root.varhaiskasvatus",
                hasLaajuus: false,
                sisaltoTunniste: "vksisalto",
                hasPdfCreation: false
            },
            koulutustyyppi_22: {
                nimi: "perusopetusvalmistava",
                oletusSuoritustapa: "esiopetus",
                hasTutkintonimikkeet: false,
                state: "root.perusvalmistava",
                hasLaajuus: false,
                sisaltoTunniste: "eosisalto",
                hasPdfCreation: false
            },
            koulutustyyppi_23: {
                nimi: "lukiovalmistavakoulutus",
                oletusSuoritustapa: "lukiokoulutus",
                hasTutkintonimikkeet: false,
                state: "root.lukio",
                hasLaajuus: false,
                sisaltoTunniste: "lukiosisalto",
                hasPdfCreation: false
            },
            koulutustyyppi_999907: {
                nimi: "tpo",
                oletusSuoritustapa: "tpo",
                hasTutkintonimikkeet: false,
                hasLaajuus: false,
                state: "root.tpo",
                sisaltoTunniste: "tposisalto",
                hasPdfCreation: true
            }
        };

        function valitseSuoritustapa(peruste) {
            if (_.isArray(peruste.suoritustavat) && !_.isEmpty(peruste.suoritustavat)) {
                if (_.includes(peruste.suoritustavat, "reformi")) {
                    return "reformi";
                }
                else if (_.includes(peruste.suoritustavat, "naytto")) {
                    return "naytto";
                }
                else {
                    return peruste.suoritustavat[0];
                }
            }
            else if (_.isObject(PerusteDefaults[peruste.koulutustyyppi])) {
                return PerusteDefaults[peruste.koulutustyyppi].oletusSuoritustapa;
            }
        }

        function rakennaEsityslinkki(peruste) {
            const suoritustapa = valitseSuoritustapa(peruste);
            return $state.href(PerusteDefaults[peruste.koulutustyyppi].state, {
                perusteId: peruste.id,
                suoritustapa
            });
        }

        return {
            hae: hae,
            //haeByPerusteprojekti: haeByPerusteprojekti,
            haePerusteita: haePerusteita,
            pilkoTutkinnonOsat: pilkoTutkinnonOsat,
            //haeTutkinnonosat: haeTutkinnonosat,
            haeTutkinnonosatByPeruste: haeTutkinnonosatByPeruste,
            //haeTutkinnonosatVersioByPeruste: haeTutkinnonosatVersioByPeruste,
            kaikilleRakenteille: kaikilleRakenteille,
            poistaTutkinnonOsaViite: poistaTutkinnonOsaViite,
            puustaLoytyy: puustaLoytyy,
            tallennaRakenne: tallennaRakenne,
            tallennaTutkinnonosat: tallennaTutkinnonosat,
            validoiRakennetta: validoiRakennetta,
            isAmmatillinen,
            valitseSuoritustapa,
            rakennaEsityslinkki,
        };
    });
