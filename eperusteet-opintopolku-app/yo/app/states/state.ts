angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root', {
  url: '/:lang',
  templateUrl: 'views/navisisalto.html',
  controller: ($scope, perusteetGroupByTyyppi) => {
    $scope.perusteetGroupByTyyppi = perusteetGroupByTyyppi;
  },
  abstract: true,
  resolve: {
    serviceConfig: eperusteetConfig => eperusteetConfig.init(),
    configCheck: serviceConfig => {
      if (_.isString(serviceConfig)) {
        console.error(serviceConfig);
      }
    },
    perusteetGroupByTyyppi: ($q, Perusteet) => {
      const deferred = $q.defer();

      Perusteet.get({
        tyyppi: [
          'koulutustyyppi_15',
          'koulutustyyppi_16',
          'koulutustyyppi_22',
          'koulutustyyppi_6',
          'koulutustyyppi_2'
        ]
      }, res => {
        const groupByTyyppi = _.groupBy(res.data, 'koulutustyyppi');
        deferred.resolve(groupByTyyppi);
      }, err => {
        deferred.reject(err);
      });

      return deferred.promise;
    }
  },
  onEnter: (Kieli, $state, $stateParams) => {
    var kielikoodi = $stateParams.lang;
    if (!(kielikoodi == 'fi' || kielikoodi == 'sv')) {
      $stateParams.lang = 'fi';
      $state.reload();
    }
    Kieli.setSisaltokieli(kielikoodi);
    Kieli.setUiKieli(kielikoodi);
  }
}));
