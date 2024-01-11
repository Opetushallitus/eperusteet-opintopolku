namespace Sticky {
    export const directive = () => {
        return {
            restrict: "A",
            link: (scope, element, attrs) => {
                const el: any = $(element);
                if (el && _.isFunction(el.sticky)) {
                    el.sticky({
                        topSpacing: attrs.topSpacing || 0,
                        className: attrs.classname
                    });
                }
            }
        }
    };
}

angular.module("app")
.directive("sticky", Sticky.directive);
