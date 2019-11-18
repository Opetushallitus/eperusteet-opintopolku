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
    .service("epResource", function(eperusteetConfig) {
        var serviceLoc = eperusteetConfig.getServiceLocation();
        this.SERVICE = serviceLoc;
        this.PERUSTEET_ROOT = serviceLoc + "/perusteet";
        this.PERUSTEET = this.PERUSTEET_ROOT + "/:perusteId";
        this.PERUSOPETUS = this.PERUSTEET + "/perusopetus";
        this.AIPEOPETUS = this.PERUSTEET + "/aipeopetus";
        this.VAIHEET = this.AIPEOPETUS + "/vaiheet/:vaiheId";
        this.PERUSTEENOSAT = serviceLoc + "/perusteenosat/:osanId";
        this.PERUSTEENOSAVIITE = serviceLoc + "/perusteenosat/viite/:viiteId";
        this.SUORITUSTAPA = this.PERUSTEET + "/suoritustavat/:suoritustapa";
        this.SUORITUSTAPASISALTO = this.SUORITUSTAPA + "/sisalto";
        this.ARVIOINTIASTEIKOT = serviceLoc + "/arviointiasteikot/:asteikkoId";
        this.CACHEDGET = { method: "GET", cache: true };
        this.CACHEDQUERY = { method: "GET", isArray: true, cache: true };
        this.GENEERINENARVIOINTI = serviceLoc + "/geneerinenarviointi/:geneerinenarviointiId";
    })
    .factory("Arviointiasteikot", function($resource, epResource) {
        return $resource(
            epResource.ARVIOINTIASTEIKOT,
            {
                asteikkoId: "@id"
            },
            {
                list: { method: "GET", isArray: true, cache: true }
            }
        );
    })
    .factory("Perusteet", function($resource, epResource) {
        return $resource(
            epResource.PERUSTEET,
            {
                perusteId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                uusimmat: { method: "GET", url: epResource.PERUSTEET_ROOT + "/uusimmat", isArray: true },
                info: { method: "GET", url: epResource.PERUSTEET_ROOT + "/info" },
                valittavatKielet: {
                    method: "GET",
                    url: epResource.PERUSTEET_ROOT + "/valittavatkielet",
                    isArray: true
                },
                diaari: { method: "GET", url: epResource.PERUSTEET_ROOT + "/diaari", cache: true }
            },
            {
                cancellable: true
            }
        );
    })
    .factory("PerusteRakenteet", function($resource, epResource) {
        return $resource(
            epResource.SUORITUSTAPA + "/rakenne",
            {
                perusteId: "@id",
                suoritustapa: "@suoritustapa"
            },
            {
                get: epResource.CACHEDGET
            }
        );
    })
    .factory("PerusteTutkinnonosat", function($resource, epResource) {
        return $resource(
            epResource.SUORITUSTAPA + "/tutkinnonosat",
            {
                perusteId: "@id",
                suoritustapa: "@suoritustapa"
            },
            {
                get: epResource.CACHEDQUERY,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("PerusteTutkinnonosa", function($resource, epResource) {
        return $resource(
            epResource.SUORITUSTAPA + "/tutkinnonosat/:osanId",
            {
                perusteId: "@id",
                suoritustapa: "@suoritustapa",
                osanId: "@id"
            },
            {
                get: epResource.CACHEDGET
            }
        );
    })
    .factory("PerusteTutkintonimikekoodit", function($resource, epResource) {
        return $resource(
            epResource.PERUSTEET + "/tutkintonimikekoodit/:nimikeId",
            {
                perusteId: "@id",
                nimikeId: "@id"
            },
            {
                get: { method: "GET", isArray: true, cache: true }
            }
        );
    })
    .factory("PerusteenOsat", function($resource, epResource) {
        var loc = epResource.PERUSTEENOSAT;
        var viite = epResource.PERUSTEENOSAVIITE;
        return $resource(
            loc,
            {
                osanId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                byKoodiUri: { method: "GET", isArray: true, params: { koodi: true } },
                versiot: { method: "GET", isArray: true, url: loc + "/versiot" },
                getVersio: { method: "GET", url: loc + "/versio/:versioId" },
                getByViite: { method: "GET", url: viite, cache: true },
                versiotByViite: { method: "GET", isArray: true, url: viite + "/versiot" },
                getVersioByViite: { method: "GET", url: viite + "/versio/:versioId" }
            }
        );
    })
    .factory("SuoritustapaSisalto", function($resource, epResource) {
        return $resource(
            epResource.SUORITUSTAPASISALTO,
            {
                perusteId: "@id",
                suoritustapa: "@suoritustapa"
            },
            {
                get: epResource.CACHEDGET
            }
        );
    })
    .factory("OpsTermistoCRUD", function($resource, $state, epResource) {
        var baseURL = "/eperusteet-ylops-service/api/opetussuunnitelmat/:resourceId";
        return $resource(
            baseURL + "/termisto/:id",
            {
                id: "@id",
                resourceId: "@resourceId"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("PerusteTermistoCRUD", function($resource, $state, epResource) {
        return $resource(
            epResource.PERUSTEET + "/:resourceId/termisto/:id",
            {
                id: "@id",
                resourceId: "@resourceId"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("TutkinnonOsanOsaAlue", function($resource, epResource) {
        return $resource(
            epResource.SERVICE + "/perusteenosat/:viiteId/osaalue/:osaalueenId",
            {
                osaalueenId: "@id"
            },
            {
                list: { method: "GET", isArray: true, url: epResource.PERUSTEENOSAT + "/osaalueet", cache: true },
                versioList: {
                    method: "GET",
                    isArray: true,
                    url: epResource.PERUSTEENOSAT + "/osaalueet/versio/:versioId"
                }
            }
        );
    })
    .factory("Osaamistavoite", function($resource, epResource) {
        return $resource(
            epResource.PERUSTEENOSAT + "/osaalue/:osaalueenId/osaamistavoite/:osaamistavoiteId",
            {
                osaamistavoiteId: "@id"
            },
            {
                list: {
                    method: "GET",
                    isArray: true,
                    url: epResource.PERUSTEENOSAT + "/osaalue/:osaalueenId/osaamistavoitteet",
                    cache: true
                }
            }
        );
    })
    .factory("LaajaalaisetOsaamiset", function($resource, epResource) {
        return $resource(
            epResource.PERUSOPETUS + "/laajaalaisetosaamiset/:osanId",
            {
                osanId: "@id"
            },
            {
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("Vuosiluokkakokonaisuudet", function($resource, epResource) {
        return $resource(
            epResource.PERUSOPETUS + "/vuosiluokkakokonaisuudet/:osanId",
            {
                osanId: "@id"
            },
            {
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("Oppiaineet", function($resource, epResource) {
        var baseUrl = epResource.PERUSOPETUS + "/oppiaineet/:osanId";
        return $resource(
            baseUrl,
            { osanId: "@id" },
            {
                oppimaarat: { method: "GET", isArray: true, url: baseUrl + "/oppimaarat", cache: true },
                kohdealueet: { method: "GET", isArray: true, url: baseUrl + "/kohdealueet", cache: true },
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("OppiaineenVuosiluokkakokonaisuudet", function($resource, epResource) {
        return $resource(
            epResource.PERUSOPETUS + "/oppiaineet/:oppiaineId/vuosiluokkakokonaisuudet/:osanId",
            {
                osanId: "@id"
            },
            {
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("Vaiheet", function($resource, epResource) {
        return $resource(
            epResource.VAIHEET,
            {
                vaiheId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("AipeOppiaineet", function($resource, epResource) {
        return $resource(
            epResource.VAIHEET + "/oppiaineet/:oppiaineId",
            {
                vaiheId: "@id",
                oppiaineId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("AipeOppimaarat", function($resource, epResource) {
        return $resource(
            epResource.VAIHEET + "/oppiaineet/:oppiaineId/oppimaarat",
            {
                vaiheId: "@id",
                oppiaineId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("AipeKurssit", function($resource, epResource) {
        return $resource(
            epResource.VAIHEET + "/oppiaineet/:oppiaineId/kurssit/:kurssiId",
            {
                vaiheId: "@id",
                oppiaineId: "@id",
                kurssiId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("AipeLaajaalaisetOsaamiset", function($resource, epResource) {
        return $resource(
            epResource.AIPEOPETUS + "/laajaalaiset/:osanId",
            {
                osanId: "@id"
            },
            {
                get: epResource.CACHEDGET,
                query: epResource.CACHEDQUERY
            }
        );
    })
    .factory("Geneerinenarviointi", function($resource, epResource) {
        return $resource(
            epResource.SERVICE + "/geneerinenarviointi/:geneerinenarviointiId",
            {
                geneerinenarviointiId: "@id"
            },
            {
                query: epResource.GENEERINENARVIOINTI
            }
        );
    })
    .service("PerusteenTutkintonimikkeet", function(PerusteTutkintonimikekoodit, YleinenData) {
        this.perusteellaTutkintonimikkeet = function(peruste) {
            if (_.isObject(peruste)) {
                peruste = peruste.koulutustyyppi;
            }
            return (
                _.isString(peruste) &&
                YleinenData.koulutustyyppiInfo[peruste] &&
                YleinenData.koulutustyyppiInfo[peruste].hasTutkintonimikkeet
            );
        };

        const parse = function(res, object) {
            object.koodisto = _.map(res, function(osa: any) {
                function parsiNimi(kentta) {
                    if (osa[kentta + "Arvo"]) {
                        let nimi = osa.b[osa[kentta + "Arvo"]].metadata;
                        osa["$" + kentta + "Nimi"] = _.zipObject(_.map(nimi, "kieli"), _.map(nimi, "nimi"));
                    }
                }

                parsiNimi("osaamisala");
                parsiNimi("tutkintonimike");
                parsiNimi("tutkinnonOsa");
                delete osa.b;
                return osa;
            });
            object.koodisto.$resolved = true;
            return object;
        };

        this.get = function(perusteId, object) {
            PerusteTutkintonimikekoodit.get({ perusteId: perusteId }).$promise.then(res => {
                parse(res, object);
            });
        };

        this.parse = parse;
    });
