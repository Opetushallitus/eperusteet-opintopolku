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
            }
        },

        /*sisalto: (serviceConfig, $q, LaajaalaisetOsaamiset, Oppiaineet, Vuosiluokkakokonaisuudet, SuoritustapaSisalto) => {

            return $q.all([
                //LaajaalaisetOsaamiset.query({ perusteId: peruste.id }).$promise,
                //Oppiaineet.query({ perusteId: peruste.id }).$promise,
                //SuoritustapaSisalto.get({ perusteId: peruste.id, suoritustapa: 'aipe' }).$promise
            ]);
        },

        koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,

        opintoalaService: (serviceConfig, Opintoalat) => Opintoalat*/
    }
}));
