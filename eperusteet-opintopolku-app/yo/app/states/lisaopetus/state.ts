angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.lisaopetus', {
  url: '/lisaopetus/:perusteId',
  templateUrl: 'eperusteet-esitys/views/yksinkertainen.html',
  controller: Controllers.epYksinkertainenPerusteController,
  resolve: {
    perusteId: function (serviceConfig, $stateParams) {
      return $stateParams.perusteId;
    },
    peruste: function (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) {
      return !perusteId ? UusimmatPerusteetService.getLisaopetus() : Perusteet.get({perusteId: perusteId}).$promise;
    },
    sisalto: function (serviceConfig, peruste, $q, SuoritustapaSisalto) {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
      }
      var perusteId = peruste.id;
      return $q.all([
        peruste,
        perusteId ? SuoritustapaSisalto.get({perusteId: perusteId, suoritustapa: 'lisaopetus'}).$promise : {}
      ]);
    },
    koulutusalaService: function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    },
    opintoalaService: function (serviceConfig, Opintoalat) {
      return Opintoalat;
    }
  }
})
.state('root.lisaopetus.tiedot', {
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
})
.state('root.lisaopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
  controller: Controllers.epEsitysSisaltoController,
  resolve: {
    tekstikappaleId: function (serviceConfig, $stateParams) {
      return $stateParams.tekstikappaleId;
    },
    tekstikappale: function (serviceConfig, tekstikappaleId, PerusteenOsat) {
      return PerusteenOsat.getByViite({viiteId: tekstikappaleId}).$promise;
    },
    lapset: function (serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) {
      return epTekstikappaleChildResolver.get(sisalto[1], tekstikappaleId);
    }
  }
}));
