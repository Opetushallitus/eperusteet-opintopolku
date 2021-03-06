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

angular.module("app").service("YleinenData", function YleinenData($rootScope, Arviointiasteikot, Notifikaatiot) {
    this.rakenneRyhmaRoolit = ["määritelty", "määrittelemätön", "vieras"];

    this.osaamisalaRooli = "osaamisala";

    this.yksikot = ["OSAAMISPISTE", "OPINTOVIIKKO"];
    this.yksikotMap = {
        osp: "OSAAMISPISTE",
        ov: "OPINTOVIIKKO"
    };

    this.suoritustavat = ["ops", "naytto"];

    this.koulutustyyppiInfo = {
        koulutustyyppi_1: {
            nimi: "perustutkinto",
            oletusSuoritustapa: "ops",
            hasTutkintonimikkeet: true,
            hakuState: "root.selaus.ammatillinenperuskoulutus",
            sisaltoTunniste: "sisalto",
            hasPdfCreation: true
        },
        koulutustyyppi_11: {
            nimi: "ammattitutkinto",
            oletusSuoritustapa: "naytto",
            hasTutkintonimikkeet: true,
            hakuState: "root.selaus.ammatillinenaikuiskoulutus",
            sisaltoTunniste: "sisalto",
            hasPdfCreation: true
        },
        koulutustyyppi_12: {
            nimi: "erikoisammattitutkinto",
            oletusSuoritustapa: "naytto",
            hasTutkintonimikkeet: true,
            hakuState: "root.selaus.ammatillinenaikuiskoulutus",
            sisaltoTunniste: "sisalto",
            hasPdfCreation: true
        },
        koulutustyyppi_20: {
            nimi: "varhaiskasvatus",
            oletusSuoritustapa: "esiopetus",
            hasTutkintonimikkeet: false,
            hakuState: "root.selaus.esiopetuslista",
            sisaltoTunniste: "eosisalto",
            hasPdfCreation: false
        },
        koulutustyyppi_15: {
            nimi: "esiopetus",
            oletusSuoritustapa: "esiopetus",
            hasTutkintonimikkeet: false,
            hakuState: "root.selaus.esiopetuslista",
            sisaltoTunniste: "eosisalto",
            hasPdfCreation: false
        },
        koulutustyyppi_16: {
            nimi: "perusopetus",
            oletusSuoritustapa: "perusopetus",
            hasTutkintonimikkeet: false,
            hakuState: "root.selaus.perusopetuslista",
            sisaltoTunniste: "posisalto",
            hasPdfCreation: false
        },
        koulutustyyppi_17: {
            nimi: "aipe",
            oletusSuoritustapa: "aipe",
            hasTutkintonimikkeet: false,
            hakuState: "root.selaus.aipelista",
            sisaltoTunniste: "aipesisalto",
            hasPdfCreation: false
        },
        koulutustyyppi_6: {
            nimi: "lisaopetus",
            oletusSuoritustapa: "lisaopetus",
            hasTutkintonimikkeet: false,
            hakuState: "root.selaus.lisaopetuslista",
            sisaltoTunniste: "losisalto",
            hasPdfCreation: true
        },
        /*'koulutustyyppi_2': {
        nimi: 'lukioopetus',
        oletusSuoritustapa: 'lukioaopetus',
        hasTutkintonimikkeet: false,
        hakuState: 'root.selaus.lukioopetuslista',
        sisaltoTunniste: 'luksisalto',
        hasPdfCreation: false
      },*/
        koulutustyyppi_5: {
            nimi: "telma",
            //oletusSuoritustapa: 'naytto',
            //hasTutkintonimikkeet: false
            //hakuState: 'root.selaus.lisaopetuslista',
            //sisaltoTunniste: 'losisalto',
            //hasPdfCreation: true
            //oletusSuoritustapa: 'naytto',
            //hasTutkintonimikkeet: false,
            //hakuState: 'root.selaus.ammatillinenaikuiskoulutus',
            //sisaltoTunniste: 'sisalto'
            oletusSuoritustapa: "ops",
            hasTutkintonimikkeet: true,
            hakuState: "root.selaus.valmentavakoulutus",
            sisaltoTunniste: "sisalto",
            hasPdfCreation: true
        },
        koulutustyyppi_18: {
            nimi: "valmentavakoulutus",
            //oletusSuoritustapa: 'naytto',
            //hasTutkintonimikkeet: false
            //hakuState: 'root.selaus.lisaopetuslista',
            //sisaltoTunniste: 'losisalto',
            //hasPdfCreation: true
            //oletusSuoritustapa: 'naytto',
            //hasTutkintonimikkeet: false,
            //hakuState: 'root.selaus.ammatillinenaikuiskoulutus',
            //sisaltoTunniste: 'sisalto'
            oletusSuoritustapa: "ops",
            hasTutkintonimikkeet: true,
            hakuState: "root.selaus.valmentavakoulutus",
            sisaltoTunniste: "sisalto",
            hasPdfCreation: true
        },
        koulutustyyppi_999907: {
            nimi: "tpo",
            oletusSuoritustapa: "tpo",
            hasTutkintonimikkeet: false,
            sisaltoTunniste: "sisalto",
            hasPdfCreation: false
        }
    };

    this.koulutustyypit = _.keys(this.koulutustyyppiInfo);
    this.ammatillisetKoulutustyypit = ["koulutustyyppi_1", "koulutustyyppi_11", "koulutustyyppi_12"];
    this.perusopetusKoulutustyypit = ["koulutustyyppi_6", "koulutustyyppi_16", "koulutustyyppi_17", "koulutustyyppi_22"];
    this.lukioKoulutustyypit = ["koulutustyyppi_2", "koulutustyyppi_14", "koulutustyyppi_23"];

    this.arviointiasteikot = undefined;

    /*this.isLukioopetus = function (peruste) {
      return peruste.koulutustyyppi === 'koulutustyyppi_2';
    };*/

    this.isPerusopetus = function(peruste) {
        return peruste.koulutustyyppi === "koulutustyyppi_16";
    };

    this.isLisaopetus = function(peruste) {
        return peruste.koulutustyyppi === "koulutustyyppi_6";
    };

    this.isEsiopetus = function(peruste) {
        return peruste.koulutustyyppi === "koulutustyyppi_15";
    };

    this.isValmatelma = function(peruste) {
        return peruste.koulutustyyppi === "koulutustyyppi_18";
    };

    this.isSimple = function(peruste) {
        return this.isEsiopetus(peruste) || this.isLisaopetus(peruste);
    };

    this.validSuoritustapa = function(peruste, suoritustapa) {
        return suoritustapa || "naytto";
    };

    this.valitseSuoritustapaKoulutustyypille = function(koulutustyyppi) {
        if (this.koulutustyyppiInfo[koulutustyyppi]) {
            return this.koulutustyyppiInfo[koulutustyyppi].oletusSuoritustapa;
        }
        return "ops";
    };

    this.showKoulutukset = function(peruste) {
        // Näytetäänkö perusteelle koulutukset (koulutuskoodit) perusteen tiedoissa
        return peruste.koulutustyyppi !== "koulutustyyppi_16";
    };

    this.haeArviointiasteikot = function() {
        if (this.arviointiasteikot === undefined) {
            var self = this;
            Arviointiasteikot.list(
                {},
                function(tulos) {
                    self.arviointiasteikot = _.indexBy(tulos, "id");
                    $rootScope.$broadcast("arviointiasteikot");
                },
                Notifikaatiot.serverCb
            );
        } else {
            $rootScope.$broadcast("arviointiasteikot");
        }
    };
});
