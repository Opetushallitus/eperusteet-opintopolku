angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esiopetus.tiedot', {
    url: '/tiedot',
    templateUrl: 'eperusteet-esitys/views/tiedot.html',
    controller: Controllers.epEsitysTiedotController,
    resolve: {
        dokumenttiId: (PerusteApi, peruste, $stateParams) =>
            PerusteApi.all('dokumentit').customGET("peruste", {
                perusteId: peruste.id,
                kieli: $stateParams.lang
            })
    }
}));
