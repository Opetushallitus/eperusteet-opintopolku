epOpintopolkuApp
  .config(function($stateProvider) {
    $stateProvider

    .state('root.amops', {
      url: '/amops/:opsId',
      templateUrl: 'views/amops/amops.html',
      controller: 'AmopsController',
      resolve: {
        opsId: ($stateParams) => {
          return $stateParams.opsId;
        },
        ops: (AmopsResource) => {
          return AmopsResource().getOps().$promise;
        },
        otsikot: (AmopsResource) => {
          return AmopsResource().getOtsikot().$promise;
        }
      }
    })

    .state('root.amops.tiedot', {
      url: '/tiedot',
      templateUrl: 'views/amops/tiedot.html'
    })

    .state('root.amops.tekstikappale', {
      url: '/tekstikappale/:tekstikappaleId',
      templateUrl: 'views/amops/tekstikappale.html',
      controller: 'AmopsTekstikappaleController',
      resolve: {
        tekstikappaleId: ($stateParams) => $stateParams.tekstikappaleId,
        tekstikappale: (AmopsResource, tekstikappaleId) =>
          AmopsResource(tekstikappaleId).getTekstikappale().$promise,
      }
    })
});
