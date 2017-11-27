angular.module("app").config($stateProvider =>
    $stateProvider.state("root.esitys.peruste.tutkinnonosa", {
        url: "/tutkinnonosat/:id",
        templateUrl: "eperusteet-esitys/views/tutkinnonosa.html",
        controller: Controllers.epEsitysTutkinnonOsaController
    })
    .state("root.esitys.peruste.koulutuksenosa", {
        url: "/koulutuksenosat/:id",
        templateUrl: "eperusteet-esitys/views/tutkinnonosa.html",
        controller: Controllers.epEsitysTutkinnonOsaController
    })
);
