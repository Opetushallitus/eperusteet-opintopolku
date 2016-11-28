angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.varhaiskasvatus', {
    url: '/varhaiskasvatus/:perusteId',
    templateUrl: 'eperusteet-esitys/views/yksinkertainen.html',
    controller: Controllers.epYksinkertainenPerusteController,
    resolve: {
        perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

        peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
            !perusteId ? UusimmatPerusteetService.getVarhaiskasvatus() : Perusteet.get({ perusteId: perusteId }).$promise,

        sisalto: (serviceConfig, peruste, $q, SuoritustapaSisalto) => {
            if (_.isArray(peruste.data)) {
                peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
            }

            return $q.all([
                peruste,
                peruste.id
                    ? SuoritustapaSisalto.get({perusteId: peruste.id, suoritustapa: 'esiopetus'}).$promise
                    : {}
            ]);
        },
        koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,
        opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
    }
}));
