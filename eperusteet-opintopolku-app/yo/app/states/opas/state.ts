angular.module("app").config($stateProvider =>
    $stateProvider.state("root.opas", {
        url: "/opas/:perusteId",
        templateUrl: "eperusteet-esitys/views/yksinkertainen.html",
        controller: Controllers.epYksinkertainenPerusteController,
        resolve: {
            perusteId: $stateParams => $stateParams.perusteId,
            peruste: (Perusteet, perusteId) => Perusteet.get({ perusteId: perusteId }).$promise,
            sisalto: (SuoritustapaSisalto, peruste, perusteId, $q) => {
                return $q.all([
                    peruste,
                    SuoritustapaSisalto.get({
                        perusteId: perusteId,
                        suoritustapa: "opas"
                    }).$promise
                ]);
            },
            koulutusalaService: (Koulutusalat) => Koulutusalat,
            opintoalaService: (Opintoalat) => Opintoalat
        }
    })
);
