angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.esitys', {
  url: '/esitys',
  template: '<div ui-view></div>'
})
.state('root.esitys.peruste', {
  url: '/:perusteId/:suoritustapa',
  templateUrl: 'views/esitys/esitys.html',
  controller: 'EsitysController',
  resolve: {
    peruste: function (serviceConfig, $stateParams, Perusteet) {
      return Perusteet.get({perusteId: $stateParams.perusteId}).$promise;
    },
    sisalto: function (serviceConfig, $stateParams, SuoritustapaSisalto) {
      return SuoritustapaSisalto.get({
        perusteId: $stateParams.perusteId,
        suoritustapa: $stateParams.suoritustapa
      }).$promise;
    },
    arviointiasteikot: function (serviceConfig, Arviointiasteikot) {
      return Arviointiasteikot.list({}).$promise;
    },
    tutkinnonOsat: function (serviceConfig, $stateParams, PerusteTutkinnonosat) {
      return PerusteTutkinnonosat.query({
        perusteId: $stateParams.perusteId,
        suoritustapa: $stateParams.suoritustapa
      }).$promise;
    },
    koulutusalaService: function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    },
    opintoalaService: function (serviceConfig, Opintoalat) {
      return Opintoalat;
    }
  }
})
.state('root.esitys.peruste.rakenne', {
  url: '/rakenne',
  templateUrl: 'eperusteet-esitys/views/rakenne.html',
  controller: 'epEsitysRakenneController',
  resolve: {
    // FIXME: ui-router bug or some '$on'-callback manipulating $stateParams?
    // $stateParams changes between config and controller
    //
    // Got to live third-party libs
    realParams: function ($stateParams) {
      return _.clone($stateParams);
    }
  }
})
.state('root.esitys.peruste.tutkinnonosat', {
  url: '/tutkinnonosat',
  templateUrl: 'eperusteet-esitys/views/tutkinnonosat.html',
  controller: 'epEsitysTutkinnonOsatController'
})
.state('root.esitys.peruste.tutkinnonosa', {
  url: '/tutkinnonosat/:id',
  templateUrl: 'eperusteet-esitys/views/tutkinnonosa.html',
  controller: 'epEsitysTutkinnonOsaController'
})
.state('root.esitys.peruste.tekstikappale', {
  url: '/sisalto/:osanId',
  templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
  controller: Controllers.epEsitysSisaltoController,
  resolve: {
    tekstikappaleId: function (serviceConfig, $stateParams) {
      return $stateParams.osanId;
    },
    lapset: function (serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) {
      return epTekstikappaleChildResolver.get(sisalto, tekstikappaleId);
    }
  }
})
.state('root.esitys.peruste.tiedot', {
  url: '/tiedot',
  templateUrl: 'eperusteet-esitys/views/tiedot.html',
  controller: Controllers.epEsitysTiedotController,
  resolve: {
    dokumenttiId: (PerusteApi, peruste, $stateParams) => {
      return PerusteApi.all('dokumentit').customGET("peruste", {
        perusteId: peruste.id,
        kieli: $stateParams.lang
      })
    }
  }
}));
