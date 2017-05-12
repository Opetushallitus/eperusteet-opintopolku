// TODO: Toteuta Aipen haku
angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.selaus.aipe', {
    url: '/aipe',
    templateUrl: 'views/haku/haku.html',
    controller: () => {},
    resolve: {
    }
}));
