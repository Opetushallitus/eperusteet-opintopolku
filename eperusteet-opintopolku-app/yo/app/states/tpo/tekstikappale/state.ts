angular.module("app").config($stateProvider =>
    $stateProvider.state("root.tpo.tekstikappale", {
        url: "/tekstikappale/:tekstikappaleId",
        templateUrl: "views/tpo/tekstikappale.html",
        controller: Controllers.epEsitysSisaltoController,
        resolve: {
            tekstikappaleId: (serviceConfig, $stateParams) => $stateParams.tekstikappaleId,
            tekstikappale: (serviceConfig, tekstikappaleId, PerusteenOsat) =>
                PerusteenOsat.getByViite({ viiteId: tekstikappaleId }).$promise,
            lapset: (serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) =>
                epTekstikappaleChildResolver.get(sisalto[1], tekstikappaleId)
        }
    })
);
