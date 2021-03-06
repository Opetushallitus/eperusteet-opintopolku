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
    .service("OpsImageService", function($state, $stateParams, opsBase) {
        this.getOpsId = function() {
            return $stateParams.opsId;
        };
        this.getPerusteId = function() {
            return $stateParams.perusteId;
        };
        this.getUrl = function(image, params) {
            if (this.getOpsId()) {
                if ($state.includes("root.amops")) {
                    const opsId = (params && params.amosaa && params.amosaa.opsId) || $stateParams.opsId;
                    const ktId = (params && params.amosaa && params.amosaa.ktId);
                    let url = (opsBase.AMOSAA_OPS + "/kuvat").replace(":opsId", "" + opsId || this.getOpsId()) + "/" + image.id;

                    if (ktId) {
                        url = url.replace(':ktId', ktId);
                    }

                    return url;
                }  else {
                    return (opsBase.OPS + "/kuvat").replace(":opsId", "" + this.getOpsId()) + "/" + image.id;
                }
            } else {
                return (
                    "eperusteet-service/api/perusteet/:perusteId/kuvat".replace(
                        ":perusteId",
                        "" + this.getPerusteId()
                    ) +
                    "/" +
                    image.id
                );
            }
        };
    })
    .filter("kuvalinkit", function(OpsImageService) {
        return function(text, params) {
            var modified = false;
            var tmp = angular.element("<div>" + text + "</div>");
            tmp.find("img[data-uid]").each(function() {
                var el = angular.element(this);
                var url = OpsImageService.getUrl({ id: el.attr("data-uid") }, params);
                if (el.attr("src") !== url) {
                    modified = true;
                    el.attr("src", OpsImageService.getUrl({ id: el.attr("data-uid") }, params));
                    el.addClass("kuvalinkki-img");
                }
            });
            if (modified) {
                return tmp.html();
            }
            return text;
        };
    });
