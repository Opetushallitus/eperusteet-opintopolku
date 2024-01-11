namespace UtilService {
    let i;
    export const init = ($injector) => {
        i = inject($injector, ["$window"]);
    };

    export const scrollTo = (selector, offset) => {
        const element = angular.element(selector);
        if (element.length) {
            i.$window.scrollTo(0, element.eq(0).offset().top + (offset || 0));
        }
    };

    export const hasLocalizedText = (obj) => _.isObject(obj) && _(KieliService.SISALTOKIELET)
        .some((lang) => !_.isEmpty(obj[lang]));

    export const compareLocalizedText = (t1, t2) => {
        const langs = _.values(KieliService.SISALTOKIELET);
        return _.isEqual(_.pick(t1, langs), _.pick(t2, langs));
    };

    export const supportsFileReader = () => {
        return !_.isUndefined(i.$window.FormData);
    };

    export const sort = (item) => {
        return KaannaService.kaanna(item.nimi, false, true).toLowerCase();
    };

    export const nameSort = (item, key) => {
        return KaannaService.kaanna(key ? item[key] : item.nimi).toLowerCase();
    };

}

angular.module("app")
.run(UtilService.init);
