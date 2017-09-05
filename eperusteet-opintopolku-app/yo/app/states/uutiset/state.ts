angular.module("app").config($stateProvider =>
    $stateProvider.state("root.uutiset", {
        url: "/uutiset",
        templateUrl: "views/uutiset.html",
        controller: "UutisetController"
    })
);
