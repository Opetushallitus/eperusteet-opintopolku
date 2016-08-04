module KaannaService {
    let _$translate;

    // export interface Kieliolio {
    //     fi: string
    //     sv: string
    //     en: string
    // }

    export const init = ($translate) => {
        _$translate = $translate;
    };

    export const translate = (obj, key, useFallback) => {
        const getTranslation = (input, lang) => {
            return input[lang] || input[lang.toUpperCase()] || input["kieli_" + lang + "#1"];
        };

        const primary = getTranslation(obj, key);
        if (primary) {
            return primary;
        }

        const secondary = getTranslation(obj, key === "fi" || key === "FI" ? "sv" : "fi");

        if (secondary) {
            return useFallback ? secondary : "[" + secondary + "]";
        }
        else if (useFallback) {
            return _(obj)
                .values()
                .first();
        }
        else {
            return secondary;
        }
    };

    export const hae = (obj, query: string = "") =>
        _.any(obj, (v: string = "") => {
            return v
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1;
        });

    export const kaannaSisalto = (input, useFallback?) => _.isEmpty(input)
        ? ""
        : translate(input, KieliService.getSisaltokieli(), useFallback);

    export const kaanna = (input, config?, useFallback?) => {
        if (_.isObject(input)) {
            return kaannaSisalto(input, useFallback);
        }
        else if (_.isString(input)) {
            return _$translate.instant(input, config);
        }
        else {
            return "";
        }
    };
}


angular.module("app")
// Nyt on direktiivit tuplana
// .directive("kaanna", ($compile) => {
//     const resolvePostfix = (attrs) => {
//         let postfix = attrs.kaannaPostfix || "";
//         if (postfix) {
//             postfix = " " + postfix;
//         }
//         if (!postfix && attrs.vaaditaan !== undefined) {
//             postfix = " *";
//         }
//         return postfix;
//     };

//     const getAttr = (attr, scope) => _.isString(attr)
//         && !_.isEmpty(attr)
//         && (scope.$eval(attr) || attr);

//     return {
//         restrict: "A",
//         link: (scope, el, attrs) => {
//             const kaannaValue = (value) => _.isObject(value)
//                 ? KaannaService.kaannaSisalto(value)
//                 : KaannaService.kaanna(value);
//             const original = getAttr(attrs["kaanna"], scope) || el.text();
//             const postfix = resolvePostfix(attrs);

//             if (_.isObject(original)) {
//                 el.text(KaannaService.kaannaSisalto(original));
//                 // if (attrs.iconRole) {
//                 //     IconMapping.addIcon(attrs.iconRole, el);
//                 // }
//                 scope.$watch(() => {
//                     return getAttr(attrs["kaanna"], scope);
//                 }, (value) => {
//                     el.text(kaannaValue(value));
//                 });
//                 scope.$on("changed:sisaltokieli", () => {
//                     el.text(kaannaValue(getAttr(attrs["kaanna"], scope)));
//                 });
//             }
//             else {
//                 const textEl = angular.element("<span>").attr("translate", original);
//                 if (attrs["kaannaValues"]) {
//                     textEl.attr("translate-values", attrs["kaannaValues"]);
//                 }
//                 el.html("").append(textEl).append(postfix);
//                 if (attrs["iconRole"]) {
//                     const iconEl = angular.element("<span>").attr("icon-role", attrs["iconRole"]);
//                     el.removeAttr("icon-role");
//                     el.prepend(iconEl);
//                 }
//                 el.removeAttr("kaanna");
//                 el.removeAttr("kaanna-values");
//                 $compile(el.contents())(scope);
//             }
//         }
//     };
// })
// .filter("kaanna", () => KaannaService.kaanna)
.run(($injector) => $injector.invoke(KaannaService.init));
