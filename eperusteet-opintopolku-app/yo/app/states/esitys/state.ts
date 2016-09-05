angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esitys', {
  url: '/esitys',
  template: '<div ui-view></div>'
}));
