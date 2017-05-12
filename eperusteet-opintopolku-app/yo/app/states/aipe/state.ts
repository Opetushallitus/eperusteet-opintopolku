angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.aipe', {
    url: '/aipe/:perusteId',
    templateUrl: 'eperusteet-esitys/views/aipe.html',
    controller: Controllers.epAipeController,
    resolve: {
        perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,
        perusteList: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
            !perusteId ? UusimmatPerusteetService.getAipe() : Perusteet.get({ perusteId: perusteId }).$promise,
        peruste: (perusteList) => {
            if (_.isArray(perusteList.data)) {
                return perusteList.data[0];
            } else {
                return perusteList;
            }
        },
        vaiheet: (Vaiheet, perusteId) => Vaiheet.query({ perusteId: perusteId }),
        sisalto: (serviceConfig, peruste, $q, SuoritustapaSisalto) => {
            if (_.isArray(peruste.data)) {
                peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
            }

            return $q.all([
                peruste,
                peruste.id ? SuoritustapaSisalto.get({
                    perusteId: peruste.id,
                    suoritustapa: 'aipe'
                }).$promise : {}
            ]);
        },
        koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,
        opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
    }
}));
