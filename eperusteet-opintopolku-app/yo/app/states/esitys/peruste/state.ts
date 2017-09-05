angular.module("app").config($stateProvider =>
    $stateProvider.state("root.esitys.peruste", {
        url: "/:perusteId/:suoritustapa",
        templateUrl: "views/esitys/esitys.html",
        controller: Controllers.EsitysController,
        resolve: {
            peruste: (serviceConfig, $stateParams, Perusteet) =>
                Perusteet.get({ perusteId: $stateParams.perusteId }).$promise,

            sisalto: (serviceConfig, $stateParams, SuoritustapaSisalto) =>
                SuoritustapaSisalto.get({
                    perusteId: $stateParams.perusteId,
                    suoritustapa: $stateParams.suoritustapa
                }).$promise,

            arviointiasteikot: (serviceConfig, Arviointiasteikot) => Arviointiasteikot.list({}).$promise,

            tutkinnonOsat: (serviceConfig, $stateParams, PerusteTutkinnonosat) =>
                PerusteTutkinnonosat.query({
                    perusteId: $stateParams.perusteId,
                    suoritustapa: $stateParams.suoritustapa
                }).$promise,

            koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,

            opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
        }
    })
);
