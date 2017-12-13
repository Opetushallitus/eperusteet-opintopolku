angular.module("app").config($stateProvider =>
    $stateProvider.state("root", {
        url: "/:lang",
        templateUrl: "views/navisisalto.html",
        abstract: true,
        resolve: {
            serviceConfig: eperusteetConfig => eperusteetConfig.init(),
            configCheck: serviceConfig => {
                if (_.isString(serviceConfig)) {
                    console.error(serviceConfig);
                }
            }
        },
        onEnter: async (Kieli, $state, $stateParams) => {
            // Aseta kieli jos puuttuu
            const kielikoodi = $stateParams.lang;
            if (!(kielikoodi == "fi" || kielikoodi == "sv" || kielikoodi == "en")) {
                $stateParams.lang = "fi";
                $state.reload();
            }
            Kieli.setSisaltokieli(kielikoodi);
            await Kieli.setUiKieli(kielikoodi);
        }
    })
);
