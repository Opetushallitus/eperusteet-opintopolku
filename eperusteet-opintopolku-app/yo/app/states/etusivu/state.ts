angular.module("app").config($stateProvider =>
    $stateProvider.state("root.etusivu", {
        url: "",
        templateUrl: "views/etusivu.html",
        controller: "EtusivuController"
    })
);
