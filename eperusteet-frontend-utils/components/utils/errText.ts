namespace ErrText {
    export const directive = ($compile, $parse) => {
        return {
            restrict: "A",
            link: (scope, element, attrs) => {
                const paivitaKuva = () => element.bind("error", () => {
                    var e = $compile("<p>" + attrs.errText + "</p>")(scope);
                    if (element.parent().is("a")) {
                        element.parent().replaceWith(e);
                    } else {
                        element.replaceWith(e);
                    }
                });

                paivitaKuva();
            }
        }
    };
}

angular.module("app")
    .directive("errText", ErrText.directive);
