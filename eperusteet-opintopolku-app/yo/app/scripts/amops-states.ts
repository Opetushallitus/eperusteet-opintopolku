epOpintopolkuApp
  .config(function($stateProvider) {
    $stateProvider

  .state('root.amops', {
    url: '/amops',
    templateUrl: 'views/amops/amops.html',
    controller: 'AmopsController',
    resolve: {
      opsId: () => {
        return 20;
      },
      ops: (AmopsResource) => {
        return AmopsResource().getOps().$promise;
      },
      otsikot: (AmopsResource) => {
        return AmopsResource().getOtsikot().$promise;
      }
    }
  })
});
