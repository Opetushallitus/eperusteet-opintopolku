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
    .service("epYlopsResource", function(eperusteetYlopsConfig) {
        this.SERVICE = eperusteetYlopsConfig.getServiceLocation();
        this.OPETUSSUUNNITELMAT_ROOT = this.SERVICE + "/opetussuunnitelmat";
        this.OPETUSSUUNNITELMAT = this.OPETUSSUUNNITELMAT_ROOT + "/:opsId";
    })
    .factory("YlopsOpetussuunnitelmat", function($resource, epYlopsResource) {
        return $resource(
            epYlopsResource.OPETUSSUUNNITELMAT,
            {
                opsId: "@id"
            },
            {
                list: { method: "GET", isArray: true, cache: true }
            }
        );
    });
