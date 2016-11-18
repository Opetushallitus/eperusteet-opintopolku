angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root', {
    url: '/:lang',
    templateUrl: 'views/navisisalto.html',
    abstract: true,
    resolve: {
        serviceConfig: eperusteetConfig => {
            return eperusteetConfig.init();
        },
        configCheck: serviceConfig => {
            if (_.isString(serviceConfig)) {
                console.error(serviceConfig);
            }
        }
    },
    onEnter: (Kieli, $stateParams) => {
        const kielikoodi = $stateParams.lang;
        Kieli.setSisaltokieli(kielikoodi);
        Kieli.setUiKieli(kielikoodi);
    }
}));
