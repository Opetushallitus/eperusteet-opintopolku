angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.virhe', {
  url: '/virhe',
  templateUrl: 'views/virhe.html',
  controller: 'VirheController'
}));
