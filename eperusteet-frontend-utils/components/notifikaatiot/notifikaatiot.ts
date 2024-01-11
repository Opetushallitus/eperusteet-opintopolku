namespace NotifikaatioService {
    let
        _$uibModal,
        _$rootScope,
        _$state,
        _$timeout,
        _NOTIFICATION_DELAY_SUCCESS,
        _NOTIFICATION_DELAY_WARNING,
        _NOTIFICATION_DELAY_INFO;

    export const init = ($uibModal, $rootScope, $state, $timeout, NOTIFICATION_DELAY_SUCCESS, NOTIFICATION_DELAY_WARNING,  NOTIFICATION_DELAY_INFO) => {
        _$uibModal = $uibModal;
        _$rootScope = $rootScope;
        _$state = $state;
        _$timeout = $timeout;
        _NOTIFICATION_DELAY_SUCCESS = NOTIFICATION_DELAY_SUCCESS;
        _NOTIFICATION_DELAY_WARNING = NOTIFICATION_DELAY_WARNING;
        _NOTIFICATION_DELAY_INFO = NOTIFICATION_DELAY_INFO;
    };

    let _viestit = [];

    export const paivita = () => {
        const comp = (luotu, delay) => (new Date()).getTime() < luotu.getTime() + delay;

        _viestit = _.filter(_viestit, (viesti) => {
            if (viesti.tyyppi === 1) {
                return comp(viesti.luotu, _NOTIFICATION_DELAY_SUCCESS);
            }
            else if (viesti.tyyppi === 2) {
                return comp(viesti.luotu, _NOTIFICATION_DELAY_WARNING);
            }
            else {
                return comp(viesti.luotu, _NOTIFICATION_DELAY_INFO);
            }
        });
    };

    const refresh = () => _$timeout(() => {
        paivita();
        _$rootScope.$broadcast("update:notifikaatiot");
        if (!_.isEmpty(_viestit)) {
            refresh();
        }
    }, _NOTIFICATION_DELAY_SUCCESS);

    const uusiViesti = (tyyppi, viesti, ilmanKuvaa?) => {
        if (_.isObject(viesti) && viesti.data && viesti.data.syy) {
            viesti = viesti.data.syy;
        }
        else if (!viesti) {
            viesti = "";
        }

        if (!_.isEmpty(_viestit) && _.last(_viestit).tyyppi === tyyppi && _.last(_viestit).viesti === viesti) {
            return;
        }

        _viestit.push({
            viesti: viesti ? viesti : tyyppi === 1 ? "tallennus-onnistui" : "",
            ilmanKuvaa: ilmanKuvaa || false,
            tyyppi: tyyppi,
            luotu: new Date()
        });

        _$timeout(() => _$rootScope.$broadcast("update:notifikaatiot"));
        refresh();
    };

    export const poista = (idx) => {
        if (_.isObject(idx)) {
            _.remove(_viestit, idx);
            paivita();
            _$rootScope.$broadcast("update:notifikaatiot");
        }
        else {
            _viestit.splice(idx, 1);
        }
    };

    export const fataali = (viesti) => _$uibModal.open({
        resolve: {
            _viesti: _.constant(viesti)
        },
        templateUrl: "components/notifikaatiot/jarjestelmavirhe.jade",
        controller: ($scope, $state, $uibModalInstance, _viesti) => {
            $scope.viesti = _viesti;
            $scope.ok = $uibModalInstance.close;
        }
    }).result;

    export const serverCb = (response) => {
    };

    export const normaali = _.partial(uusiViesti, 0);
    export const onnistui = _.partial(uusiViesti, 1);
    export const varoitus = _.partial(uusiViesti, 2);
    export const viestit = () => _.clone(_viestit);
}



//     const serverLukitus = (response) => {
//       if (response && response.status === 409 && response.data && response.data.lukko) {
//         uusiViesti(2, Kaanna.kaanna("lukitus-kayttajalla", {user: response.data.lukko.haltijaNimi || response.data.lukko.haltijaOid}));
//       } else if (response && response.status !== 404) {
//         serverCb(response);
//       }
//     }
//
//     return {
//       fataali: fataali,
//       serverCb: serverCb,
//       serverLukitus: serverLukitus,
//     };
//
//   }
// }

angular.module("app")
.run(NotifikaatioService.init)
.constant("NOTIFICATION_DELAY_SUCCESS", 2000)
.constant("NOTIFICATION_DELAY_WARNING", 5000)
.constant("NOTIFICATION_DELAY_INFO", 8000)
.controller("NotifikaatioController", ($scope) => {
    $scope.viestit = [];
    $scope.poistaNotifikaatio = NotifikaatioService.poista;
    $scope.$on("update:notifikaatiot", () => {
        $scope.viestit = NotifikaatioService.viestit();
    });
});
