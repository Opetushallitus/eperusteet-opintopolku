"use strict";

/**
 * Number input field
 * can be of type:
 * "number" => integers and floats accepted (native HTML5 input type number)
 * "integer" => only integers accepted
 * "float" => integers and floats accepted (dot or comma separated)
 */
angular.module("app")
.directive("numberinput", function ($timeout, $compile) {
    return {
        templateUrl: "components/numberinput/numberinput.jade",
        restrict: "E",
        scope: {
            model: "=",
            min: "@?",
            max: "@?",
            luokka: "@",
            form: "=",
            labelId: "@",
            type: "@?",
            step: "@?"
        },
        replace: true,
        link: function (scope, element, attrs: any) {
            $timeout(function () {
                var input = element.find("input");
                if (attrs.labelId) {
                    input.attr("id", attrs.labelId);
                }
                else if ((scope.$parent as any).inputElId) {
                    input.attr("id", (scope.$parent as any).inputElId);
                }
                if (attrs.step && attrs.type === "float") {
                    input.attr("step-validate", attrs.step);
                    $compile(element.contents())(scope);
                }
            });
        }
    };
})

.directive("validateInteger", function() {
    var INTEGER_PATTERN = /^\-?\d+$/;
    function isValid(value) {
        return !value || INTEGER_PATTERN.test(value);
    }
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl: any) {
            ctrl.$parsers.unshift(function (viewValue) {
                var valid = isValid(viewValue);
                ctrl.$setValidity("integer", valid);
                return valid ? viewValue : undefined;
            });

            ctrl.$formatters.unshift(function(value) {
                ctrl.$setValidity("integer", isValid(value));
                return value;
            });
        }
    };
})

.directive("validateFloat", function() {
    var FLOAT_PATTERN = /^\-?\d+((\.|\,)\d+)?$/;
    function isValid(value) {
        return !value || FLOAT_PATTERN.test(value);
    }

    function validateMinMax(scope, value, attrs, ctrl) {
        if (typeof value === "number") {
            if (attrs.min) {
                ctrl.$setValidity("min", value >= parseFloat(scope.min));
            }
            if (attrs.max) {
                ctrl.$setValidity("max", value <= parseFloat(scope.max));
            }
        }
        if (value === undefined || value === "") {
            if (attrs.max) {
                ctrl.$setValidity("max", true);
            }
            if (attrs.min) {
                ctrl.$setValidity("min", true);
            }
        }
    }
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl: any) {
            ctrl.$parsers.unshift(function(viewValue) {
                var valid = isValid(viewValue);
                ctrl.$setValidity("float", valid);
                var value;
                if (valid) {
                    value = viewValue === "" ? viewValue : parseFloat(viewValue.replace(",", "."));
                }
                validateMinMax(scope, value, attrs, ctrl);
                return value;
            });

            ctrl.$formatters.unshift(function(value) {
                ctrl.$setValidity("float", isValid(value));
                return value;
            });
        }
    };
})

.directive("stepValidate", function() {
    function isValid(value, step) {
        return !value || (((value*100) % (step*100))/100) === 0;
    }
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl: any) {
            var stepValue = parseFloat(attrs.stepValidate);
            ctrl.$parsers.push(function(viewValue) {
                // Precondition: viewValue is either
                // undefined, empty string, or a valid float
                var valid = isValid(viewValue, stepValue);
                ctrl.$setValidity("step", valid);
                return valid ? viewValue : undefined;
            });

            ctrl.$formatters.push(function(value) {
                ctrl.$setValidity("step", isValid(value, stepValue));
                return value;
            });
        }
    };
});
