module Footer {
    export const FooterData = function ($http, $window, $q) {
        let data = null;
        let fetched = false;
        const pattern = /([^=]+)=([^=]+)(?:\n|$)/gi;
        this.fetch = function() {
            const deferred = $q.defer();
            if (fetched) {
                deferred.resolve(data);
            } else {
                fetched = true;
                $http
                    .get($window.location.pathname + "buildversion.txt")
                    .success(function(res) {
                        let result;
                        data = {};
                        while ((result = pattern.exec(res)) !== null) {
                            data[result[1]] =
                                result[1] === "vcsRevision" ? result[2].substr(0, 8) : result[2].replace(/\s\s*$/, "");
                        }
                        deferred.resolve(data);
                    })
                    .error(function() {
                        data = null;
                        deferred.resolve(data);
                    });
            }
            return deferred.promise;
        };
    };

    export const footer = (FooterData) => {
        return {
            restrict: "AE",
            templateUrl: "components/footer/footer.jade",
            scope: {},
            controller: function($scope) {
                $scope.active = true;
                if ($scope.active) {
                    FooterData.fetch().then(function(data) {
                        $scope.data = data;
                    });
                }
            }
        };
    }
}

angular.module("app")
    .service("FooterData", Footer.FooterData)
    .directive("footer", Footer.footer);
