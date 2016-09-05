angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.tiedote', {
  url: '/tiedote/:tiedoteId',
  templateUrl: 'views/tiedote.html',
  controller: 'TiedoteViewController'
}));
