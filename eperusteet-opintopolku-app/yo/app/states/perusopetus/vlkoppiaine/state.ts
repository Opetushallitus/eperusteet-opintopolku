angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.perusopetus.vlkoppiaine', {
    url: '/vuosiluokkakokonaisuus/:vlkId/oppiaine/:oppiaineId',
    templateUrl: 'eperusteet-esitys/views/vlkoppiaine.html',
    controller: Controllers.epPerusopetusVlkOppiaineController,
    resolve: {
        oppiaineId: (serviceConfig, $stateParams) => $stateParams.oppiaineId,
        oppiaine: (serviceConfig, perusteId, Oppiaineet, oppiaineId) =>
            Oppiaineet.get({perusteId: perusteId, osanId: oppiaineId}).$promise
    }
}));
