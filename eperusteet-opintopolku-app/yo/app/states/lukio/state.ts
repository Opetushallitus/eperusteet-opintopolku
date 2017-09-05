angular.module("app").config($stateProvider =>
    $stateProvider.state("root.lukio", {
        url: "/lukio/:perusteId",
        templateUrl: "eperusteet-esitys/views/lukio.html",
        controller: Controllers.epLukioController,
        resolve: {
            perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

            peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
                !perusteId
                    ? UusimmatPerusteetService.getLukioopetus()
                    : Perusteet.get({ perusteId: perusteId }).$promise,

            oppiaineRakenne: (LukioYleistiedot, peruste) => {
                if (_.isArray(peruste.data)) {
                    peruste = peruste.data[0];
                }
                return LukioYleistiedot.getOppiaineRakenne({
                    perusteId: peruste.id
                }).$promise;
            },

            perusData: (LukioPerusteenOsat, peruste) => {
                if (_.isArray(peruste.data)) {
                    peruste = peruste.data[0];
                }
                let perusteId = peruste.id;
                return LukioPerusteenOsat.query({ perusteId: perusteId }).$promise.then(res => ({
                    lapset: _.filter(res.lapset, (lapsi: any) => lapsi.perusteenOsa.osanTyyppi === "tekstikappale"),
                    id: perusteId
                }));
            },

            koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,

            opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
        }
    })
);
