namespace DynamicImpl {
    export const controller = ($scope) => {
    };

    export const directive = ($compile, $templateCache, $timeout, $animate) => {
        let renderAmount = 0;

        return {
            template: "<div></div>",
            restrict: "AE",
            scope: {
                template: "@",
                ngModel: "=",
                misc: "=",
                depth: "="
            },
            controller: controller,
            link: (scope, el) => {
                $animate.enabled(false, el);
                const renderer = () => el.replaceWith($compile($templateCache.get(scope.template))(scope));
                if (scope.ngModel) {
                    // Give angular a break with big trees
                    if (++renderAmount % 40 === 0) {
                        $timeout(renderer);
                    }
                    else {
                        renderer();
                    }
                }
            }
        }
    };
}

angular.module("app")
    .directive("dynamic", DynamicImpl.directive);
