angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.virhe', {
    url: '/virhe',
    templateUrl: 'views/virhe.html',
    controller: ($scope, virheService) => {
        $scope.$watch(virheService.getData, (value) => {
            $scope.data = value;
        });

        $scope.hasData = () => !_.isEmpty($scope.data);
    }
}))
.service('virheService', ($state) => {
    var data = {};
    this.setData = (data) => { data = data; };
    this.getData = () => data;
    this.virhe = function(virhe) {
        data = _.isObject(virhe) ? virhe : { muu: virhe };
        $state.go('root.virhe');
    };
});
