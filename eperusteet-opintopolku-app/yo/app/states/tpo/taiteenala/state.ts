angular.module("app").config($stateProvider =>
    $stateProvider.state("root.tpo.taiteenala", {
        url: "/taiteenala/:tekstikappaleId",
        templateUrl: "views/tpo/taiteenala.html",
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
