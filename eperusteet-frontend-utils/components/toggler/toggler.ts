module TogglerImpl {
    export const controller = ($scope) => {
        $scope.onToggle = $scope.onToggle || _.noop;
        $scope.yes = KaannaService.kaanna($scope.yes || "auki");
        $scope.no = KaannaService.kaanna($scope.no || "kiinni");

        $scope.click = () => {
            $scope.ngModel = !$scope.ngModel;
            $scope.onToggle($scope.ngModel);
        };
    };

    export const directive = () => {
        return {
            templateUrl: "components/toggler/toggler.jade",
            restrict: "E",
            scope: {
                ngModel: "=",
                onToggle: "=",
                yes: "@",
                no: "@"
            },
            controller: controller
        }
    };
}

angular.module("app")
    .directive("toggler", TogglerImpl.directive);
