namespace LocalStorage {
    let supported = false;

    try {
        const key = "localstoragetester";
        window.localStorage.setItem(key, key);
        window.localStorage.removeItem(key);
        supported = true;
    }
    catch (ex) {
        supported = false;
    }

    export const setItem = (key: string, value: any) => {
        if (!supported) {
            return;
        }

        window.localStorage.setItem(key, JSON.stringify({
            state: i.$state.current.name,
            params: i.$stateParams,
            aikaleima: new Date(),
            value
        }));
    };

    export const getItem = (key: string) => {
        if (!supported) {
            return;
        }

        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }

        return {};
    };

    export const removeItem = (key: string) => {
        if (!supported) {
            return;
        }
        window.localStorage.removeItem(key);
    };

    const vanhaOsaKey = () => JSON.stringify([
        i.$state.current.name,
        i.$stateParams.opsId,
        i.$stateParams.osaId
    ]);

    export const addVanhaOsa = (osa) => setItem(vanhaOsaKey(), osa);
    export const getVanhaOsa = () => getItem(vanhaOsaKey());
    export const clearVanhaOsa = () => removeItem(vanhaOsaKey());

    export const setDefault = (key: string, value: any) => {
        const item = getItem(key);
        if (!item || _.isUndefined(item.value) || _.isNull(item.value)) {
            setItem(key, value);
        }
    };

    let i;
    export const init = ($injector) => {
        i = inject($injector, ["$stateParams", "$state"]);
        { // Defaults
            setDefault("$$showOhjeteksti", true);
            setDefault("$$showPerusteteksti", true);
            setDefault("$$showKaikkiOpetussuunnitelmat", false);
            setDefault("$$showArkistoidutOpetussuunnitelmat", false);
        }
    };
};


angular.module("app")
    .run(LocalStorage.init);
