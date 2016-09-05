angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.selaus.ops', {
    url: '/ops',
    templateUrl: 'views/ops/listaus.html',
    controller: Controllers.ListausController,
    resolve: {
        opsit: function (JulkisetOps) {
            return JulkisetOps.query({}).$promise;
        }
    }
}));
