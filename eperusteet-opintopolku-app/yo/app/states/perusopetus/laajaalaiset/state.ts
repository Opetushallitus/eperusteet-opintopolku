angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.perusopetus.laajaalaiset', {
    url: '/laajaalaisetosaamiset',
    templateUrl: 'eperusteet-esitys/views/laajaalaiset.html',
    controller: Controllers.epLaajaalaisetOsaamisetController
}));
