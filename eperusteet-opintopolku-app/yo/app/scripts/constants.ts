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
    .constant("LOKALISOINTI_SERVICE_LOC", "/eperusteet-service/api/lokalisointi/eperusteet-opintopolku")
    .constant("REQUEST_TIMEOUT", 10000)
    .constant("SPINNER_WAIT", 100)
    .constant("NOTIFICATION_DELAY_SUCCESS", 4000)
    .constant("NOTIFICATION_DELAY_WARNING", 10000)
    .constant("PERUSTE_HAKU_TUORE_KESTO", moment.duration(2, 'weeks').asMilliseconds());
