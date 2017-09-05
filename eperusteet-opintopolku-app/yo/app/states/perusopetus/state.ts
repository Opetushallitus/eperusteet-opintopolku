angular.module("app").config($stateProvider =>
    $stateProvider.state("root.perusopetus", {
        url: "/perusopetus/:perusteId",
        templateUrl: "eperusteet-esitys/views/perusopetus.html",
        controller: Controllers.epPerusopetusController,
        resolve: {
            perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

            peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
                !perusteId
                    ? UusimmatPerusteetService.getPerusopetus()
                    : Perusteet.get({ perusteId: perusteId }).$promise,

            sisalto: (
                serviceConfig,
                peruste,
                $q,
                LaajaalaisetOsaamiset,
                Oppiaineet,
                Vuosiluokkakokonaisuudet,
                SuoritustapaSisalto
            ) => {
                if (_.isArray(peruste.data)) {
                    peruste = peruste.data[0];
                }
                const perusteId = peruste.id;
                return $q.all([
                    peruste,
                    LaajaalaisetOsaamiset.query({ perusteId: perusteId }).$promise,
                    Oppiaineet.query({ perusteId: perusteId }).$promise,
                    Vuosiluokkakokonaisuudet.query({ perusteId: perusteId }).$promise,
                    SuoritustapaSisalto.get({ perusteId: perusteId, suoritustapa: "perusopetus" }).$promise
                ]);
            },

            koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,

            opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
        }
    })
);
