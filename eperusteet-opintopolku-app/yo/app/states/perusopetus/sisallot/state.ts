angular.module("app").config($stateProvider =>
    $stateProvider.state("root.perusopetus.sisallot", {
        url: "/sisallot/:oppiaineId?vlk&sisalto&osaaminen&valittu",
        templateUrl: "eperusteet-esitys/views/vlkoppiaine.html",
        controller: Controllers.epPerusopetusSisallotController,
        resolve: {
            oppiaineId: (serviceConfig, $stateParams) => $stateParams.oppiaineId,
            oppiaine: (serviceConfig, perusteId, Oppiaineet, oppiaineId) =>
                oppiaineId
                    ? Oppiaineet.get({
                          perusteId: perusteId,
                          osanId: oppiaineId
                      }).$promise
                    : null
        }
    })
);
