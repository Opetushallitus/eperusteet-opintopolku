angular.module("app").config($stateProvider =>
    $stateProvider.state("root.lukio.oppiaine", {
        url: "/oppiaine/:oppiaineId",
        templateUrl: "eperusteet-esitys/views/lukiooppiaine.html",
        controller: Controllers.epLukioOppiaineController,
        resolve: {
            oppiaineId: (serviceConfig, $stateParams) => $stateParams.oppiaineId,
            oppiaine: (serviceConfig, perusteId, LukioOppiaineet, oppiaineId) =>
                LukioOppiaineet.getOppiaine({ perusteId, oppiaineId }).$promise
        }
    })
);
