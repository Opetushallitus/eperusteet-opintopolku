angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.perusopetus', {
  url: '/perusopetus/:perusteId',
  templateUrl: 'eperusteet-esitys/views/perusopetus.html',
  controller: 'epPerusopetusController',
  resolve: {
    perusteId: function (serviceConfig, $stateParams) {
      return $stateParams.perusteId;
    },
    peruste: function (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) {
      return !perusteId ? UusimmatPerusteetService.getPerusopetus() : Perusteet.get({perusteId: perusteId}).$promise;
    },
    sisalto: function (serviceConfig, peruste, $q, LaajaalaisetOsaamiset,
                       Oppiaineet, Vuosiluokkakokonaisuudet, SuoritustapaSisalto) {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data[0];
      }
      var perusteId = peruste.id;
      return $q.all([
        peruste,
        LaajaalaisetOsaamiset.query({perusteId: perusteId}).$promise,
        Oppiaineet.query({perusteId: perusteId}).$promise,
        Vuosiluokkakokonaisuudet.query({perusteId: perusteId}).$promise,
        SuoritustapaSisalto.get({perusteId: perusteId, suoritustapa: 'perusopetus'}).$promise
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
.state('root.perusopetus.tiedot', {
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
.state('root.perusopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
  controller: 'epPerusopetusTekstikappaleController',
  resolve: {
    tekstikappaleId: function (serviceConfig, $stateParams) {
      return $stateParams.tekstikappaleId;
    },
    tekstikappale: function (serviceConfig, tekstikappaleId, PerusteenOsat) {
      return PerusteenOsat.getByViite({viiteId: tekstikappaleId}).$promise;
    },
    lapset: function (serviceConfig, sisalto, tekstikappaleId, epTekstikappaleChildResolver) {
      return epTekstikappaleChildResolver.get(sisalto[4], tekstikappaleId);
    }
  }
})
.state('root.perusopetus.vuosiluokkakokonaisuus', {
  url: '/vuosiluokkakokonaisuus/:vlkId',
  templateUrl: 'eperusteet-esitys/views/vuosiluokkakokonaisuus.html',
  controller: 'epPerusopetusVlkController'
})
.state('root.perusopetus.laajaalaiset', {
  url: '/laajaalaisetosaamiset',
  templateUrl: 'eperusteet-esitys/views/laajaalaiset.html',
  controller: 'epLaajaalaisetOsaamisetController'
})
.state('root.perusopetus.vlkoppiaine', {
  url: '/vuosiluokkakokonaisuus/:vlkId/oppiaine/:oppiaineId',
  templateUrl: 'eperusteet-esitys/views/vlkoppiaine.html',
  controller: 'epPerusopetusVlkOppiaineController',
  resolve: {
    oppiaineId: function (serviceConfig, $stateParams) {
      return $stateParams.oppiaineId;
    },
    oppiaine: function (serviceConfig, perusteId, Oppiaineet, oppiaineId) {
      return Oppiaineet.get({perusteId: perusteId, osanId: oppiaineId}).$promise;
    }
  }
})
.state('root.perusopetus.sisallot', {
  url: '/sisallot/:oppiaineId?vlk&sisalto&osaaminen&valittu',
  templateUrl: 'eperusteet-esitys/views/vlkoppiaine.html',
  controller: 'epPerusopetusSisallotController',
  resolve: {
    oppiaineId: function (serviceConfig, $stateParams) {
      return $stateParams.oppiaineId;
    },
    oppiaine: function (serviceConfig, perusteId, Oppiaineet, oppiaineId) {
      return oppiaineId ? Oppiaineet.get({
        perusteId: perusteId, osanId: oppiaineId
      }).$promise : null;
    }
  }
}));
