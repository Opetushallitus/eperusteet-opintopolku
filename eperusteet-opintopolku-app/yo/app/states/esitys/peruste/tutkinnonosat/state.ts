angular.module("app").config($stateProvider =>
    $stateProvider.state("root.esitys.peruste.tutkinnonosat", {
        url: "/tutkinnonosat",
        templateUrl: "eperusteet-esitys/views/tutkinnonosat.html",
        controller: Controllers.epEsitysTutkinnonOsatController
    })
);
