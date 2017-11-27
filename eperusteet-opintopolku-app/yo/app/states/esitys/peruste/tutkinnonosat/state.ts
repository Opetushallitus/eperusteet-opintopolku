angular.module("app").config($stateProvider =>
    $stateProvider.state("root.esitys.peruste.tutkinnonosat", {
        url: "/tutkinnonosat",
        templateUrl: "eperusteet-esitys/views/tutkinnonosat.html",
        controller: Controllers.epEsitysTutkinnonOsatController
    })
    .state("root.esitys.peruste.koulutuksenosat", {
        url: "/koulutuksenosat",
        templateUrl: "eperusteet-esitys/views/koulutuksenosat.html",
        controller: Controllers.epEsitysTutkinnonOsatController
    })
);
