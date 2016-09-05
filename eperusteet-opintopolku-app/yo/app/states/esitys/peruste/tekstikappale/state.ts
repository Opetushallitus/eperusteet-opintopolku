angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esitys.peruste.tekstikappale', {
    url: '/sisalto/:osanId',
    templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
    controller: Controllers.epEsitysSisaltoController,
    resolve: {
        tekstikappaleId: (serviceConfig, $stateParams) => $stateParams.osanId,

        lapset: (serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) =>
            epTekstikappaleChildResolver.get(sisalto, tekstikappaleId)
    }
}));
