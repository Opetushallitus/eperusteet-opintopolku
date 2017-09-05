angular.module("app").config($stateProvider =>
    $stateProvider.state("root.lukio.tekstikappale", {
        url: "/tekstikappale/:tekstikappaleId",
        templateUrl: "eperusteet-esitys/views/lukiotekstikappale.html",
        controller: Controllers.epLukioTekstikappaleController,
        resolve: {
            tekstikappaleId: (serviceConfig, $stateParams) => $stateParams.tekstikappaleId,

            tekstikappale: (serviceConfig, tekstikappaleId, LukioTekstikappale) =>
                LukioTekstikappale.getByViite({ viiteId: tekstikappaleId }).$promise,

            lapset: (serviceConfig, perusData, tekstikappaleId, epTekstikappaleChildResolver) =>
                epTekstikappaleChildResolver.get(perusData, tekstikappaleId, true)
        }
    })
);
