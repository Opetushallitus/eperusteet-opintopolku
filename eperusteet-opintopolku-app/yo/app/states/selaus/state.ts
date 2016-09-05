angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.selaus', {
    url: '/selaus',
    template: '<div ui-view></div>'
}));
