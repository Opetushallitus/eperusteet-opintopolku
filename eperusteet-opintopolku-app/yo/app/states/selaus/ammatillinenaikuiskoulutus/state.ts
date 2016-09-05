angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.selaus.ammatillinenaikuiskoulutus', {
    url: '/ammatillinenaikuiskoulutus',
    templateUrl: 'views/haku/haku.html',
    controller: Controllers.HakuController,
    resolve: {
        koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
            return Koulutusalat;
    }]
  }
}));
