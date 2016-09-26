angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.perusopetus.vuosiluokkakokonaisuus', {
    url: '/vuosiluokkakokonaisuus/:vlkId',
    templateUrl: 'eperusteet-esitys/views/vuosiluokkakokonaisuus.html',
    controller: Controllers.epPerusopetusVlkController
}));
