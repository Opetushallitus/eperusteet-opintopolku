declare const Chart: any;

namespace Charts {
    export const directive = ($compile): angular.IDirective => {
        return {
            template: "<div></div>",
            require: "ngModel",
            restrict: "E",
            scope: {
                ngModel: "="
            },
            controller: () => _.noop,
            link: (scope: any, el, attrs) => {
                const chartId = _.uniqueId("a-chart-");
                el.replaceWith($compile("<canvas id='" + chartId + "'></canvas>")(scope));
                new Chart(document.getElementById(chartId), scope.ngModel);
            }
        }
    };
}
angular.module("app")
.directive("charts", Charts.directive);
