angular.module("app").config($stateProvider =>
    $stateProvider.state("root.perusopetus.tekstikappale", {
        url: "/tekstikappale/:tekstikappaleId",
        templateUrl: "eperusteet-esitys/views/tekstikappale.html",
        controller: Controllers.epPerusopetusTekstikappaleController,
        resolve: {
            tekstikappaleId: function(serviceConfig, $stateParams) {
                return $stateParams.tekstikappaleId;
            },
            tekstikappale: function(serviceConfig, tekstikappaleId, PerusteenOsat) {
                return PerusteenOsat.getByViite({ viiteId: tekstikappaleId }).$promise;
            },
            lapset: function(serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) {
                return epTekstikappaleChildResolver.get(sisalto[4], tekstikappaleId);
            }
        }
    })
);
