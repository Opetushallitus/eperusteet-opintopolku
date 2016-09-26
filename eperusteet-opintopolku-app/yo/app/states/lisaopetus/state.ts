angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.lisaopetus', {
    url: '/lisaopetus/:perusteId',
    templateUrl: 'eperusteet-esitys/views/yksinkertainen.html',
    controller: Controllers.epYksinkertainenPerusteController,
    resolve: {
        perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

        peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
            !perusteId ? UusimmatPerusteetService.getLisaopetus() : Perusteet.get({perusteId: perusteId}).$promise,

        sisalto: (serviceConfig, peruste, $q, SuoritustapaSisalto) => {
            if (_.isArray(peruste.data)) {
                peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
            }
            const perusteId = peruste.id;
            return $q.all([
                peruste,
                perusteId ? SuoritustapaSisalto.get({perusteId: perusteId, suoritustapa: 'lisaopetus'}).$promise : {}
            ]);
        },

        koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,

        opintoalaService: (serviceConfig, Opintoalat) => Opintoalat,
    }
}));
