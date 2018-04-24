namespace KieliService {
    let _$rootScope, _$state, _$stateParams, _$translate;

    export const init = ($rootScope, $state, $stateParams, $translate) => {
        _$rootScope = $rootScope;
        _$state = $state;
        _$stateParams = $stateParams;
        _$translate = $translate;
    };

    export let SISALTOKIELET = ["fi", "sv", "se", "ru", "en"];

    let sisaltokieli = "fi",
        uikieli = "fi",
        stateInited = false;

    export let SISALTOKIELETMAP = {};

    export const orderFn = kielikoodi => _.indexOf(SISALTOKIELET, kielikoodi);
    export const isValidKielikoodi = kielikoodi => _.indexOf(SISALTOKIELET, kielikoodi) > -1;
    export const getSisaltokieli = () => sisaltokieli;
    export const getSisaltokielet = () => SISALTOKIELET;
    export const getUiKieli = () => uikieli;
    export const UIKIELET = ["fi", "sv", "en"];

    export const setSisaltokielet = kielikoodit => {
        SISALTOKIELET = kielikoodit;
        SISALTOKIELETMAP = _.zipObject(kielikoodit, _.map(kielikoodit, _.constant(true)));
        _$rootScope.$broadcast("update:sisaltokielet");
    };

    export const setSisaltokieli = kielikoodi => {
        if (_.indexOf(SISALTOKIELET, kielikoodi) > -1) {
            const old = sisaltokieli;
            sisaltokieli = kielikoodi;
            if (old !== kielikoodi) {
                _$rootScope.$broadcast("changed:sisaltokieli", kielikoodi);
            }
        }
    };

    export const setUiKieli = async (kielikoodi, doStateChange?) => {
        if (
            isValidKielikoodi(kielikoodi) &&
            (kielikoodi !== uikieli || (stateInited && _$stateParams.lang !== kielikoodi))
        ) {
            if (_.isUndefined(doStateChange) || doStateChange === true) {
                _$state.go(_$state.current.name, _.merge(_$stateParams, { lang: kielikoodi }), { reload: true });
            }
            uikieli = kielikoodi;
            moment.locale(kielikoodi);
            await _$translate.use(kielikoodi);
            _$rootScope.$broadcast("changed:uikieli", kielikoodi);
        }
    };

    export const validoi = olio => {
        let errors = [];
        if (!olio) {
            errors.push("tekstikentalla-ei-lainkaan-sisaltoa");
        } else {
            _.each(SISALTOKIELET, kieli => {
                if (!olio[kieli]) {
                    errors.push("tekstikentalla-ei-sisaltoa-kielella-" + kieli);
                }
            });
        }
        return errors;
    };

    // _$rootScope.$on("$stateChangeSuccess", (self, toParams) => {
    //     stateInited = true;
    //     if (isValidKielikoodi(toParams.lang)) {
    //         uikieli = toParams.lang;
    //     }
    // });
}

angular
    .module("app")
    .run($injector => $injector.invoke(KieliService.init));
