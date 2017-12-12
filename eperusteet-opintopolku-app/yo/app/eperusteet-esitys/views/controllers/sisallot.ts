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

// TODO: Siirrä muualle
angular.module("eperusteet.esitys").service("JarjestysService", function() {
    this.options = [{ value: "jarjestys", label: "tutkinnonosa-jarjestysnumero" }, { value: "nimi", label: "nimi" }];
    this.selection = {};
});

namespace Controllers {
    export const epEsitysSisaltoController = (
        $scope,
        $state,
        $stateParams,
        PerusteenOsat,
        YleinenData,
        MurupolkuData,
        epParentFinder,
        epTekstikappaleChildResolver
    ) => {
        $scope.linkVar = $stateParams.osanId ? "osanId" : "tekstikappaleId";
        $scope.valittuSisalto = $scope.$parent.sisalto[$stateParams[$scope.linkVar]];
        $scope.tekstikappale = $scope.valittuSisalto;
        $scope.lapset = epTekstikappaleChildResolver.getSisalto();

        const parentNode = $scope.$parent.originalSisalto ? $scope.$parent.originalSisalto : $scope.tekstisisalto;
        MurupolkuData.set({
            osanId: $scope.valittuSisalto.id,
            tekstikappaleNimi: $scope.valittuSisalto.nimi,
            parents: epParentFinder.find(
                parentNode ? parentNode.lapset : null,
                parseInt($stateParams[$scope.linkVar], 10)
            )
        });

        if (!$scope.valittuSisalto) {
            const params = _.extend(_.clone($stateParams), {
                suoritustapa: YleinenData.validSuoritustapa($scope.peruste, $stateParams.suoritustapa)
            });
            $state.go("root.esitys.peruste.tiedot", params);
        } else {
            PerusteenOsat.get({ osanId: $scope.valittuSisalto.id }, res => {
                $scope.valittuSisalto = res;
                $scope.tekstikappale = res;
                $scope.taiteenalaFields = [
                    "aikuistenOpetus",
                    "kasvatus",
                    "oppimisenArviointiOpetuksessa",
                    "teemaopinnot",
                    "tyotavatOpetuksessa",
                    "yhteisetOpinnot"
                ];
            });
        }
    };

    export const epEsitysTiedotController = (
        $scope,
        $q,
        $state,
        YleinenData,
        PerusteenTutkintonimikkeet,
        Perusteet,
        Dokumentit,
        PerusteApi
    ) => {
        $scope.showKoulutukset = _.constant(YleinenData.showKoulutukset($scope.peruste));
        $scope.showOsaamisalat = $scope.showKoulutukset;
        $scope.koulutusalaNimi = $scope.Koulutusalat.haeKoulutusalaNimi;
        $scope.opintoalaNimi = $scope.Opintoalat.haeOpintoalaNimi;
        Dokumentit.dokumenttiUrlLataaja(PerusteApi, $scope.peruste.id, "peruste")($scope);
        Dokumentit.dokumenttiUrlLataaja(PerusteApi, $scope.peruste.id, "kvliite", "fi")($scope, "kvliiteUrlFi");
        Dokumentit.dokumenttiUrlLataaja(PerusteApi, $scope.peruste.id, "kvliite", "sv")($scope, "kvliiteUrlSv");
        Dokumentit.dokumenttiUrlLataaja(PerusteApi, $scope.peruste.id, "kvliite", "en")($scope, "kvliiteUrlEn");

        let currentTime = new Date().getTime();
        $scope.voimassaOleva = !!(
            !$scope.peruste.voimassaoloLoppuu ||
            ($scope.peruste.voimassaoloAlkaa &&
                currentTime > $scope.peruste.voimassaoloAlkaa &&
                currentTime < $scope.peruste.voimassaoloLoppuu)
        );

        PerusteenTutkintonimikkeet.get($scope.peruste.id, $scope);
    };

    export const epEsitysTutkinnonOsaController = (
        $scope,
        $state,
        $stateParams,
        PerusteenOsat,
        TutkinnonosanTiedotService,
        $anchorScroll,
        $location,
        Tutke2Osa,
        Kieli,
        MurupolkuData
    ) => {
        $scope.tutkinnonOsaViite = _.find(
            $scope.$parent.tutkinnonOsat,
            (tosa: any) => tosa.id === parseInt($stateParams.id, 10)
        );
        MurupolkuData.set({ id: $scope.tutkinnonOsaViite.id, tutkinnonosaNimi: $scope.tutkinnonOsaViite.nimi });
        $scope.osaAlueet = {};

        TutkinnonosanTiedotService.noudaTutkinnonOsa({
            perusteenOsaId: $scope.tutkinnonOsaViite._tutkinnonOsa
        }).then(() => {
            $scope.tutkinnonOsa = TutkinnonosanTiedotService.getTutkinnonOsa();
            $scope.fieldKeys = _.intersection(_.keys($scope.tutkinnonOsa), TutkinnonosanTiedotService.keys());
            if ($scope.tutkinnonOsa.tyyppi === "tutke2" || $scope.tutkinnonOsa.tyyppi === "reformi_tutke2") {
                Tutke2Osa.kasitteleOsaAlueet($scope.tutkinnonOsa);
            }
            if ($scope.tutkinnonOsa.tyyppi === "reformi_tutke2") {
                $scope.reformiTutke2 = true;
            }
        });

        $scope.goToAnchor = (pre, id) => {
            if ($location.hash() !== pre + id) {
                $location.hash(pre + id);
            } else {
                $anchorScroll();
            }
        };
        $scope.fieldOrder = item => TutkinnonosanTiedotService.order(item);

        $scope.hasArviointi = osaamistavoite =>
            osaamistavoite.arviointi &&
            osaamistavoite.arviointi.arvioinninKohdealueet &&
            osaamistavoite.arviointi.arvioinninKohdealueet.length > 0 &&
            osaamistavoite.arviointi.arvioinninKohdealueet[0].arvioinninKohteet &&
            osaamistavoite.arviointi.arvioinninKohdealueet[0].arvioinninKohteet.length > 0;

        $scope.osaAlueFilter = item => _.contains(item.$kielet, Kieli.getSisaltokieli());
    };

    export const epEsitysTutkinnonOsatController = (
        $scope,
        $state,
        $stateParams,
        Algoritmit,
        JarjestysService,
        Kaanna
    ) => {
        $scope.jarjestysOrder = _.isBoolean(JarjestysService.selection.order)
            ? JarjestysService.selection.order
            : false;
        $scope.jarjestysOptions = JarjestysService.options;
        $scope.jarjestysTapa = JarjestysService.selection.value || (<any>_.first($scope.jarjestysOptions)).value;

        $scope.jarjestysFn = data => {
            switch ($scope.jarjestysTapa) {
                case "jarjestys":
                    return data.jarjestys;
                default:
                    return Kaanna.kaanna(data.nimi);
            }
        };

        $scope.$watch("jarjestysOrder", value => {
            if (_.isBoolean(value)) {
                JarjestysService.selection.order = value;
            }
        });

        $scope.$watch("jarjestysTapa", value => {
            if (value) {
                JarjestysService.selection.value = value;
            }
        });

        $scope.$parent.valittu.sisalto = "tutkinnonosat";
        $scope.tosarajaus = "";
        $scope.rajaaTutkinnonOsia = haku => Algoritmit.rajausVertailu($scope.tosarajaus, haku, "nimi");
    };

    export const epEsitysRakenneController = ($scope, $state, $stateParams, PerusteenRakenne, peruste, MurupolkuData) => {
        $scope.$parent.valittu.sisalto = "rakenne";
        $scope.muodostumisOtsikko = _.find($scope.$parent.sisalto, (item: any) => item.tunniste === "rakenne");

        PerusteenRakenne.hae($stateParams.perusteId, $stateParams.suoritustapa, rakenne => {
            $scope.rakenne = rakenne;
            $scope.rakenne.$suoritustapa = $stateParams.suoritustapa;
            $scope.rakenne.$resolved = true;
        });

        if (peruste.koulutustyyppi === "koulutustyyppi_18" || peruste.koulutustyyppi === "koulutustyyppi_5") {
            MurupolkuData.set({ nimi: "Koulutuksen muodostuminen" });
        } else {
            MurupolkuData.set({ nimi: "Tutkinnon muodostuminen" });
        }
    };
}
