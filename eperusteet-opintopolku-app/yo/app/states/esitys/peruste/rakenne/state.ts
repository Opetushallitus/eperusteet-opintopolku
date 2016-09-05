angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esitys.peruste.rakenne', {
  url: '/rakenne',
  templateUrl: 'eperusteet-esitys/views/rakenne.html',
  controller: Controllers.epEsitysRakenneController,
  resolve: {
    // FIXME: ui-router bug or some '$on'-callback manipulating $stateParams?
    // $stateParams changes between config and controller
    //
    // Got to live third-party libs
    realParams: function ($stateParams) {
      return _.clone($stateParams);
    }
  }
}));
