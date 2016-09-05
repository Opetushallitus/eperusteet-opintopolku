angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root.lukio', {
  url: '/lukio/:perusteId',
  templateUrl: 'eperusteet-esitys/views/lukio.html',
  controller: Controllers.epLukioController,
  resolve: {
    perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

    peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
      !perusteId ? UusimmatPerusteetService.getLukioopetus() : Perusteet.get({perusteId: perusteId}).$promise,

    oppiaineRakenne: (LukioYleistiedot, peruste) => {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data[0];
      }
      return LukioYleistiedot.getOppiaineRakenne({
          perusteId: peruste.id
        }).$promise;
    },
    perusData: (LukioPerusteenOsat, peruste) => {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data[0];
      }
      let perusteId = peruste.id;
      return LukioPerusteenOsat.query({perusteId: perusteId}).$promise
        .then((res) => ({
            lapset: _.filter(res.lapset, (lapsi: any) => lapsi.perusteenOsa.osanTyyppi === 'tekstikappale'),
            id: perusteId
        }));
    },
    koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,
    opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
  }
})
.state('root.lukio.tiedot', {
  url: '/tiedot',
  templateUrl: 'eperusteet-esitys/views/tiedot.html',
  controller: Controllers.epLukioTiedotController
})
.state('root.lukio.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'eperusteet-esitys/views/lukiotekstikappale.html',
  controller: Controllers.epLukioTekstikappaleController,
  resolve: {
    tekstikappaleId: (serviceConfig, $stateParams) => $stateParams.tekstikappaleId,

    tekstikappale: (serviceConfig, tekstikappaleId, LukioTekstikappale) =>
      LukioTekstikappale.getByViite({ viiteId: tekstikappaleId }).$promise,

    lapset: (serviceConfig, perusData, tekstikappaleId, epTekstikappaleChildResolver) =>
      epTekstikappaleChildResolver.get(perusData, tekstikappaleId, true)
  }
})
.state('root.lukio.oppiaine', {
  url: '/oppiaine/:oppiaineId',
  templateUrl: 'eperusteet-esitys/views/lukiooppiaine.html',
  controller: Controllers.epLukioOppiaineController,
  resolve: {
    oppiaineId: (serviceConfig, $stateParams) => $stateParams.oppiaineId,
    oppiaine: (serviceConfig, perusteId, LukioOppiaineet, oppiaineId) =>
      LukioOppiaineet.getOppiaine({ perusteId, oppiaineId }).$promise
  }
})
.state('root.lukio.oppiaine.tavoitteet', {
  url: '/yleiset-tavoitteet',
  templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
  controller: Controllers.epLukioTavoitteetController,
  resolve: {
    tavoitteet: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getTavoitteet({perusteId: perusteId}).$promise
  }
})
// FIXME Yhdistä:
.state('root.lukio.oppiaine.aihekokonaisuudet', {
  url: '/aihekokonaisuudet',
  templateUrl: 'eperusteet-esitys/views/aihekokonaisuudet.html',
  controller: Controllers.epLukioAihekokonaisuudetController,
  resolve: {
    yleiskuvaus: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getAihekokonaisuuksienYleinen({perusteId: perusteId}).$promise,
    aihekokonaisuudet: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getAihekokonaisuudet({perusteId: perusteId}).$promise,
  }
})
.state('root.lukio.oppiaine.kurssi.aihekokonaisuudet', {
  url: '/aihekokonaisuudet',
  templateUrl: 'eperusteet-esitys/views/aihekokonaisuudet.html',
  controller: Controllers.epLukioAihekokonaisuudetController,
  resolve: {
    yleiskuvaus: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getAihekokonaisuuksienYleinen({perusteId: perusteId}).$promise,
    aihekokonaisuudet: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getAihekokonaisuudet({perusteId: perusteId}).$promise,
  }
})
.state('root.lukio.oppiaine.kurssi', {
  url: '/kurssi/:kurssiId',
  templateUrl: 'eperusteet-esitys/views/lukiokurssi.html',
  controller: Controllers.epLukioKurssiController
})
.state('root.lukio.oppiaine.kurssi.tavoitteet', {
  url: '/yleiset-tavoitteet',
  templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
  controller: Controllers.epLukioTavoitteetController,
  resolve: {
    tavoitteet: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getTavoitteet({perusteId: perusteId}).$promise
  }
}));
