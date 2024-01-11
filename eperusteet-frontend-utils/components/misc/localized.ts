angular.module("app")
.directive("slocalized", ($parse, $rootScope, $timeout) => ({
    priority: 5,
    restrict: "A",
    require: "ngModel",
    scope: false,
    link: (scope, element, attrs, ngModelCtrl: any) => {
        ngModelCtrl.$formatters.push(modelValue => {
            if (!modelValue) {
                return;
            }
            return modelValue[KieliService.getSisaltokieli()];
        });

        ngModelCtrl.$parsers.push((viewValue) => {
            let localizedModelValue = ngModelCtrl.$modelValue || {};
            localizedModelValue[KieliService.getSisaltokieli()] = viewValue;
            return localizedModelValue;
        });

        scope.$on("changed:sisaltokieli", (event, sisaltokieli) => {

            if(ngModelCtrl.$modelValue && !_.isEmpty(ngModelCtrl.$modelValue[sisaltokieli])) {
                ngModelCtrl.$setViewValue(ngModelCtrl.$modelValue[sisaltokieli]);
            } else {
                ngModelCtrl.$modelValue = {};
                ngModelCtrl.$modelValue[sisaltokieli] = " ";
                ngModelCtrl.$setViewValue(ngModelCtrl.$modelValue[sisaltokieli]);
            }
            ngModelCtrl.$render();
        });
    }
}));
