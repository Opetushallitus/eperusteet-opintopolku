angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.lukio.tiedot', {
    url: '/tiedot',
    templateUrl: 'eperusteet-esitys/views/tiedot.html',
    controller: Controllers.epLukioTiedotController
}));
