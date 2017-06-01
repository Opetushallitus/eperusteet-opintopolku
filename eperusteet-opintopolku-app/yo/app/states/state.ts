angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root', {
  url: '/:lang',
  templateUrl: 'views/navisisalto.html',
  abstract: true,
  resolve: {
    serviceConfig: eperusteetConfig => eperusteetConfig.init(),
    configCheck: serviceConfig => {
      if (_.isString(serviceConfig)) {
        console.error(serviceConfig);
      }
    }
  },
  onEnter: (Kieli, $state, $stateParams) => {
    // Aseta kieli jos puuttuu
    const kielikoodi = $stateParams.lang;
    if (!(kielikoodi == 'fi' || kielikoodi == 'sv')) {
      $stateParams.lang = 'fi';
      $state.reload();
    }
    Kieli.setSisaltokieli(kielikoodi);
    Kieli.setUiKieli(kielikoodi);
  }
}));
