angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.selaus.ammatillinenperuskoulutus', {
    url: '/ammatillinenperuskoulutus',
    templateUrl: 'views/haku/haku.html',
    controller: Controllers.HakuController,
    resolve: {
        koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat
    }
}));
