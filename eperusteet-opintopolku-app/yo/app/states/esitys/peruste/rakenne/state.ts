angular.module("app").config($stateProvider =>
    $stateProvider.state("root.esitys.peruste.rakenne", {
        url: "/rakenne",
        templateUrl: "eperusteet-esitys/views/rakenne.html",
        controller: Controllers.epEsitysRakenneController
    })
);
