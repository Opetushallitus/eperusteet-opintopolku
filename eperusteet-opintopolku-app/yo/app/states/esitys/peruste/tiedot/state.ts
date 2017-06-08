angular.module("app")
.config(($stateProvider) => $stateProvider
.state("root.esitys.peruste.tiedot", {
    url: "/tiedot",
    templateUrl: "eperusteet-esitys/views/tiedot.html",
    controller: Controllers.epEsitysTiedotController,
    resolve: {
    }
}));
