angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.virhe', {
  url: '/virhe',
  templateUrl: 'views/virhe.html',
  controller: ($scope, VirheService) => {
    $scope.data = VirheService.getData();
    $scope.hasData = !_.isEmpty($scope.data);
    $scope.isCollapsed = true;
  }
}));
