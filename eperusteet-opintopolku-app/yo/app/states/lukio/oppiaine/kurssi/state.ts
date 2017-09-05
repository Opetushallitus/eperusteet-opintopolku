angular.module("app").config($stateProvider =>
    $stateProvider.state("root.lukio.oppiaine.kurssi", {
        url: "/kurssi/:kurssiId",
        templateUrl: "eperusteet-esitys/views/lukiokurssi.html",
        controller: Controllers.epLukioKurssiController
    })
);
