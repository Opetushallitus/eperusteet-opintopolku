angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root', {
  url: '/:lang',
  templateUrl: 'views/navisisalto.html',
  abstract: true,
  resolve: {
    serviceConfig: ['eperusteetConfig', function (eperusteetConfig) {
      return eperusteetConfig.init();
    }],
    configCheck: ['serviceConfig', function (serviceConfig) {
      if (_.isString(serviceConfig)) {
        console.error(serviceConfig);
      }
    }]
  },
  onEnter: ['Kieli', '$stateParams', function (Kieli, $stateParams) {
    var kielikoodi = $stateParams.lang;
    Kieli.setSisaltokieli(kielikoodi);
    Kieli.setUiKieli(kielikoodi);
  }]
}));
