angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.aipe.tekstikappale', {
    url: '/tekstikappale/:tekstikappaleId',
    templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
    controller: Controllers.epPerusopetusTekstikappaleController,
    resolve: {
        tekstikappaleId: $stateParams => $stateParams.tekstikappaleId,
        tekstikappale: (tekstikappaleId, PerusteenOsat) => PerusteenOsat.getByViite({
            viiteId: tekstikappaleId
        }).$promise,
        lapset: (sisalto, tekstikappaleId, epTekstikappaleChildResolver) =>
            epTekstikappaleChildResolver.get(sisalto[1], tekstikappaleId)
    }
}));
