angular.module("app").config($stateProvider =>
    $stateProvider.state("root.lukio.oppiaine.kurssi.tavoitteet", {
        url: "/yleiset-tavoitteet",
        templateUrl: "eperusteet-esitys/views/tavoitteet.html",
        controller: Controllers.epLukioTavoitteetController,
        resolve: {
            tavoitteet: (LukioYleistiedot, perusteId) =>
                LukioYleistiedot.getTavoitteet({ perusteId: perusteId }).$promise
        }
    })
);
