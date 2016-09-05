angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.selaus', {
  url: '/selaus',
  template: '<div ui-view></div>'
})
.state('root.selaus.ammatillinenperuskoulutus', {
  url: '/ammatillinenperuskoulutus',
  templateUrl: 'views/haku/haku.html',
  controller: 'HakuController',
  resolve: {
    koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    }]
  }
})
.state('root.selaus.ammatillinenaikuiskoulutus', {
  url: '/ammatillinenaikuiskoulutus',
  templateUrl: 'views/haku/haku.html',
  controller: 'HakuController',
  resolve: {
    koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    }]
  }
})
.state('root.selaus.valmentavakoulutus', {
  url: '/valmentavakoulutus',
  templateUrl: 'views/haku/haku.html',
  controller: 'HakuController',
  resolve: {
    koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    }]
  }
})
.state('root.selaus.ops', {
  url: '/ops',
  templateUrl: 'views/ops/listaus.html',
  controller: 'ListausController',
  resolve: {
    opsit: function (JulkisetOps) {
      return JulkisetOps.query({}).$promise;
    }
  }
}));
