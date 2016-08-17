/*
 * Copyright (c) 2013 The Finnish Board of Education - Opetushallitus
 *
 * This program is free software: Licensed under the EUPL, Version 1.1 or - as
 * soon as they will be approved by the European Commission - subsequent versions
 * of the EUPL (the "Licence");
 *
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at: http://ec.europa.eu/idabc/eupl
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * European Union Public Licence for more details.
 */

'use strict';

angular.module('app')
.config(($stateProvider) => $stateProvider
.state('root', {
  url: '/:lang',
  templateUrl: 'views/navisisalto.html',
  abstract: true,
  resolve: {
    serviceConfig: ['eperusteetConfig', function (eperusteetConfig) {
      return eperusteetConfig.init();
    }],
    configCheck: ['serviceConfig', function (serviceConfig) {
      if (_.isString(serviceConfig)) {
        console.error(serviceConfig);
      }
    }]
  },
  onEnter: ['Kieli', '$stateParams', function (Kieli, $stateParams) {
    var kielikoodi = $stateParams.lang;
    Kieli.setSisaltokieli(kielikoodi);
    Kieli.setUiKieli(kielikoodi);
  }]
})
.state('root.virhe', {
  url: '/virhe',
  templateUrl: 'views/virhe.html',
  controller: 'VirheController'
})
.state('root.etusivu', {
  url: '',
  templateUrl: 'views/etusivu.html',
  controller: 'EtusivuController'
})
.state('root.uutiset', {
  url: '/uutiset',
  templateUrl: 'views/uutiset.html',
  controller: 'UutisetController'
})
.state('root.tiedote', {
  url: '/tiedote/:tiedoteId',
  templateUrl: 'views/tiedote.html',
  controller: 'TiedoteViewController'
})
/* HAKU */
.state('root.selaus', {
  url: '/selaus',
  template: '<div ui-view></div>'
})
.state('root.selaus.ammatillinenperuskoulutus', {
  url: '/ammatillinenperuskoulutus',
  templateUrl: 'views/haku/haku.html',
  controller: 'HakuController',
  resolve: {
    koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    }]
  }
})
.state('root.selaus.ammatillinenaikuiskoulutus', {
  url: '/ammatillinenaikuiskoulutus',
  templateUrl: 'views/haku/haku.html',
  controller: 'HakuController',
  resolve: {
    koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    }]
  }
})
.state('root.selaus.valmentavakoulutus', {
  url: '/valmentavakoulutus',
  templateUrl: 'views/haku/haku.html',
  controller: 'HakuController',
  resolve: {
    koulutusalaService: ['serviceConfig', 'Koulutusalat', function (serviceConfig, Koulutusalat) {
      return Koulutusalat;
    }]
  }
})
.state('root.selaus.ops', {
  url: '/ops',
  templateUrl: 'views/ops/listaus.html',
  controller: 'ListausController',
  resolve: {
    opsit: function (JulkisetOps) {
      return JulkisetOps.query({}).$promise;
    }
  }
})
/* ESITYS */
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
  controller: 'epEsitysSisaltoController',
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
  controller: 'epEsitysTiedotController',
  resolve: {
    dokumenttiId: (PerusteApi, peruste, $stateParams) => {
      return PerusteApi.all('dokumentit').customGET("peruste", {
        perusteId: peruste.id,
        kieli: $stateParams.lang
      })
    }
  }
})
/* PERUSOPETUS */
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
  controller: 'epEsitysTiedotController'
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
})
/* LUKIO */
.state('root.lukio', {
  url: '/lukio/:perusteId',
  templateUrl: 'eperusteet-esitys/views/lukio.html',
  controller: 'epLukioController',
  resolve: {
    perusteId: (serviceConfig, $stateParams) => $stateParams.perusteId,

    peruste: (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) =>
      !perusteId ? UusimmatPerusteetService.getLukioopetus() : Perusteet.get({perusteId: perusteId}).$promise,

    oppiaineRakenne: (LukioYleistiedot, peruste) => {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data[0];
      }
      var perusteId = peruste.id;
      return LukioYleistiedot.getOppiaineRakenne({
          perusteId: perusteId
        }).$promise;
    },
    perusData: (LukioPerusteenOsat, peruste) => {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data[0];
      }
      let perusteId = peruste.id;
      return LukioPerusteenOsat.query({perusteId: perusteId}).$promise
        .then(function (res) {
          var lapset = _.filter(res.lapset, (lapsi: any) => lapsi.perusteenOsa.osanTyyppi === 'tekstikappale');
          return {'lapset': lapset, 'id': perusteId};
        });
    },
    koulutusalaService: (serviceConfig, Koulutusalat) => Koulutusalat,
    opintoalaService: (serviceConfig, Opintoalat) => Opintoalat
  }
})
.state('root.lukio.tiedot', {
  url: '/tiedot',
  templateUrl: 'eperusteet-esitys/views/tiedot.html',
  controller: 'epLukioTiedotController'
})
.state('root.lukio.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'eperusteet-esitys/views/lukiotekstikappale.html',
  controller: 'epLukioTekstikappaleController',
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
  controller: 'epLukioOppiaineController',
  resolve: {
    oppiaineId: (serviceConfig, $stateParams) => $stateParams.oppiaineId,
    oppiaine: (serviceConfig, perusteId, LukioOppiaineet, oppiaineId) =>
      LukioOppiaineet.getOppiaine({ perusteId, oppiaineId }).$promise
  }
})
.state('root.lukio.oppiaine.tavoitteet', {
  url: '/yleiset-tavoitteet',
  templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
  controller: 'epLukioTavoitteetController',
  resolve: {
    tavoitteet: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getTavoitteet({perusteId: perusteId}).$promise
  }
})
// FIXME Yhdistä:
.state('root.lukio.oppiaine.aihekokonaisuudet', {
  url: '/aihekokonaisuudet',
  templateUrl: 'eperusteet-esitys/views/aihekokonaisuudet.html',
  controller: 'epLukioAihekokonaisuudetController',
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
  controller: 'epLukioAihekokonaisuudetController',
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
  controller: 'epLukioKurssiController'
})
.state('root.lukio.oppiaine.kurssi.tavoitteet', {
  url: '/yleiset-tavoitteet',
  templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
  controller: 'epLukioTavoitteetController',
  resolve: {
    tavoitteet: (LukioYleistiedot, perusteId) =>
      LukioYleistiedot.getTavoitteet({perusteId: perusteId}).$promise
  }
})
.state('root.esiopetus', {
  url: '/esiopetus/:perusteId',
  templateUrl: 'eperusteet-esitys/views/yksinkertainen.html',
  controller: 'epYksinkertainenPerusteController',
  resolve: {
    perusteId: function (serviceConfig, $stateParams) {
      return $stateParams.perusteId;
    },
    peruste: function (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) {
      return !perusteId ? UusimmatPerusteetService.getEsiopetus() : Perusteet.get({perusteId: perusteId}).$promise;
    },
    sisalto: function (serviceConfig, peruste, $q, SuoritustapaSisalto) {
      if (_.isArray(peruste.data)) {
        peruste = peruste.data && peruste.data.length > 0 ? peruste.data[0] : {};
      }
      var perusteId = peruste.id;
      return $q.all([
        peruste,
        perusteId ? SuoritustapaSisalto.get({perusteId: perusteId, suoritustapa: 'esiopetus'}).$promise : {}
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
.state('root.esiopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'eperusteet-esitys/views/tiedot.html',
  controller: 'epEsitysTiedotController'
})
.state('root.esiopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
  controller: 'epEsitysSisaltoController',
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
})
.state('root.lisaopetus', {
  url: '/lisaopetus/:perusteId',
  templateUrl: 'eperusteet-esitys/views/yksinkertainen.html',
  controller: 'epYksinkertainenPerusteController',
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
  controller: 'epEsitysTiedotController'
})
.state('root.lisaopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'eperusteet-esitys/views/tekstikappale.html',
  controller: 'epEsitysSisaltoController',
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
})
/* OPETUSSUUNNITELMAT */
.state('root.ops', {
  url: '/ops/:opsId',
  template: '<div ui-view></div>',
  controller: 'OpsController',
  resolve: {
    opsId: ($stateParams) => {
      return $stateParams.opsId;
    },
    ops: (OpsResource, opsId) => {
      return OpsResource().get({opsId})
        .$promise.then((res) => {
           return res;
        })
    },
    opsResource: (OpsResource, ops) => OpsResource(ops.tila === "julkaistu"),
    opsPerusteResource: (OpsPerusteResource, ops) => OpsPerusteResource(ops.tila === "julkaistu"),
    otsikot: (opsResource, opsId, ops) => opsResource.getOtsikot({opsId})
      .$promise.then((res) => {
        return res;
      })
   }
})
.state('root.ops.esiopetus', {
  url: '/esiopetus',
  templateUrl: 'views/ops/yksinkertainen.html',
  controller: 'OpsYksinkertainenController',
})
.state('root.ops.esiopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html',
  controller: 'OpsYksinkertainenTiedotController'
})
.state('root.ops.esiopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: 'OpsTekstikappaleController',
  resolve: {
    viiteId: function (serviceConfig, $stateParams) {
      return $stateParams.tekstikappaleId;
    },
    tekstikappaleWithChildren: function (opsResource, viiteId, opsId) {
      return opsResource.getTekstikappaleWithChildren({
        opsId: opsId,
        viiteId: viiteId
      }).$promise.then(function (res) {
        return res;
      })
    }
  }
})
.state('root.ops.lisaopetus', {
  url: '/lisaopetus',
  templateUrl: 'views/ops/yksinkertainen.html',
  controller: 'OpsYksinkertainenController',
})
.state('root.ops.lisaopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html',
  controller: 'OpsYksinkertainenTiedotController'
})
.state('root.ops.lisaopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: 'OpsTekstikappaleController',
  resolve: {
    viiteId: function (serviceConfig, $stateParams) {
      return $stateParams.tekstikappaleId;
    },
    tekstikappaleWithChildren: function (opsResource, viiteId, opsId) {
      return opsResource.getTekstikappaleWithChildren({
        opsId: opsId,
        viiteId: viiteId
      }).$promise.then(function (res) {
        return res;
      })
    }
  }
})
.state('root.ops.varhaiskasvatus', {
  url: '/varhaiskasvatus',
  templateUrl: 'views/ops/yksinkertainen.html',
  controller: 'OpsYksinkertainenController',
})
.state('root.ops.varhaiskasvatus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html',
  controller: 'OpsYksinkertainenTiedotController'
})
.state('root.ops.varhaiskasvatus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: 'OpsTekstikappaleController',
  resolve: {
    viiteId: function (serviceConfig, $stateParams) {
      return $stateParams.tekstikappaleId;
    },
    tekstikappaleWithChildren: function (opsResource, viiteId, opsId) {
      return opsResource.getTekstikappaleWithChildren({
        opsId: opsId,
        viiteId: viiteId
      }).$promise.then(function (res) {
        return res;
      })
    }
  }
})
/* PERUSOPETUS OPS */
.state('root.ops.perusopetus', {
  url: '/perusopetus',
  templateUrl: 'views/ops/perusopetus.html',
  controller: 'OpsPerusopetusController',
  resolve: {
    perusOps: function (opsResource, opsId) {
      return opsResource.get({opsId: opsId}).$promise.then(function (res) {
        return res;
      });
    },
    otsikot: function (opsResource, opsId) {
      return opsResource.getOtsikot({
        opsId: opsId
      }).$promise.then(function (res) {
        return res;
      });
    }
  }
})
.state('root.ops.perusopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: 'OpsPerusopetusTekstikappaleController',
  resolve: {
    viiteId: function (serviceConfig, $stateParams) {
      return $stateParams.tekstikappaleId;
    },
    tekstikappaleWithChildren: function (opsResource, viiteId, opsId) {
      return opsResource.getTekstikappaleWithChildren({
        opsId: opsId,
        viiteId: viiteId
      }).$promise.then(function (res) {
        return res;
      })
    }
  }
})
.state('root.ops.perusopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html'
})
.state('root.ops.perusopetus.vuosiluokkakokonaisuus', {
  url: '/vuosiluokkakokonaisuus/:vlkId',
  templateUrl: 'views/ops/vuosikuokkakokonaisuudet.html',
  controller: 'OpsVlkController',
  resolve: {
    vlkId: function ($stateParams) {
      return $stateParams.vlkId;
    },
    vlkt: function (opsId, vlkId, opsResource) {
      return opsResource.getVlk({
        opsId: opsId,
        vlkId: vlkId
      }).$promise.then(function (res) {
        return res;
      })
    },
    vlkPeruste: function(opsPerusteResource, opsId, vlkId) {
      return opsPerusteResource.getVlkPeruste({
        opsId: opsId,
        vlkId: vlkId
      }).$promise.then(function (res) {
        return res;
      })
    },
    baseLaajaalaiset: function (opsId, opsResource) {
      return opsResource.getLaajaalaisetosaamiset({
        opsId: opsId
      }).$promise.then(function (res) {
        return res
      })
    }
  }
})
.state('root.ops.perusopetus.oppiaineet', {
  url: '/oppiaineet/:oppiaineId',
  templateUrl: 'views/ops/oppiaineet.html',
  controller: 'OpsOppiaineetController',
  resolve: {
    opsId: ($stateParams) => $stateParams.opsId,
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,

    oppiaine: (opsResource, oppiaineId, opsId) =>
      opsResource.getOppiaine({ opsId, oppiaineId }).$promise,

    vlksuudet: (ops, opsResource, opsId, $q) =>
      $q.all(_.map(ops.vuosiluokkakokonaisuudet, (v: any) =>
        opsResource.getVlk({opsId: opsId, vlkId: v.vuosiluokkakokonaisuus.id}).$promise)),

    vlkPerusteet: (opsPerusteResource, opsId, vlksuudet, $q) =>
      $q.all(_.map(vlksuudet, (v:any) =>
        opsPerusteResource.getVlkPeruste({ opsId, vlkId: v.id }).$promise)),

    oppiainePeruste: (opsPerusteResource, opsId, oppiaineId) =>
      opsPerusteResource.getOppiainePeruste({ opsId, oppiaineId }).$promise,
  }
})
.state('root.ops.perusopetus.oppiaineet.vlk', {
  url: '/vlk/:vlkId',
  templateUrl: 'views/ops/vlkview.html',
  params: { vluokkakokonaisuus: null },
  controller: 'OpsOppiaineetVlkController',
  resolve: {
    opsId: ($stateParams) => $stateParams.opsId,
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,
    vlkId: ($stateParams) => $stateParams.vlkId,
    vuosiluokkakokonaisuus: (opsId, vlkId, oppiaineId, oppiaine, opsResource) =>
      opsResource.getOppiaineVlk({ opsId, oppiaineId, vlkId }).$promise,
    baseLaajaalaiset: (opsId, opsResource) =>
      opsResource.getLaajaalaisetosaamiset({ opsId }).$promise
  }
})
.state('root.ops.perusopetus.oppiaineet.vlk.vuosiluokat', {
  url: '/vuosi/:vuosiId',
  templateUrl: 'views/ops/op.html',
  controller: 'OpsOppiaineController',
  resolve: {
    vuosiluokkaId: ($stateParams) => $stateParams.vuosiId,
    vuosiluokkaSisalto: (opsResource, vlkId, opsId, oppiaineId, vuosiluokkaId) =>
      opsResource.getOppiaineVlkByVuosiluokka({ opsId, oppiaineId, vlkId, vuosiId: vuosiluokkaId }).$promise,
  }
})
.state('root.ops.perusopetus.valinnaisetoppiaineet', {
  url: '/valinnaisetoppiaineet/:oppiaineId',
  templateUrl: 'views/ops/vlnoppiaine.html',
  controller: 'OpsVlnOppiaineController',
  resolve: {
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,
    oppiaine: (opsResource, oppiaineId, opsId) =>
      opsResource.getOppiaine({ opsId, oppiaineId }).$promise
  }
})
.state('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka', {
  url: '/vuosiluokka/:vuosi',
  controller: 'OpsVuosiluokkaController',
  template: '<div ui-view></div>',
  resolve: {
    vuosi: function ($stateParams) {
      return $stateParams.vuosi;
    }
  }
})
.state('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.oppiaine', {
  url: '/oppiaine/:oppiaineId',
  templateUrl: 'views/ops/vlkoppiaine.html',
  controller: 'OpsVlkOppiaineController',
  resolve: {
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,

    vlkId: ($stateParams) => $stateParams.vlkId,

    oppiaine: (opsResource, oppiaineId, opsId) =>
      opsResource.getOppiaine({ opsId, oppiaineId }).$promise,

    oppiainePeruste: (opsPerusteResource, opsId, oppiaineId) =>
      opsPerusteResource.getOppiainePeruste({ opsId, oppiaineId }).$promise,

    baseLaajaalaiset: (opsId, opsResource) =>
      opsResource.getLaajaalaisetosaamiset({ opsId: opsId }).$promise,

    vuosiluokkakokonaisuus: function(vlkt, opsId, oppiaine, oppiaineId, opsResource, opsUtils) {
       let vId = opsUtils.getVlkId(vlkt, oppiaine);
       if(vId) {
         return opsResource.getOppiaineVlk({
           opsId: opsId,
           oppiaineId: oppiaineId,
           vlkId: vId
         }).$promise.then(function (res) {
           return res;
         });
       }
       return {};
    },
    vuosiluokkaSisalto: function(vlkt, oppiaine, vuosiluokkakokonaisuus, vuosi,
                                 opsId, oppiaineId, opsResource, opsUtils){
      let vuosiluokkaId = opsUtils.getVuosiId(vuosiluokkakokonaisuus, vuosi);
      let vId = opsUtils.getVlkId(vlkt, oppiaine);
      if (vuosiluokkaId) {
        return opsResource.getOppiaineVlkByVuosiluokka({
          opsId: opsId,
          oppiaineId: oppiaineId,
          vlkId: vId,
          vuosiId: vuosiluokkaId
        }).$promise.then(function (res) {
          return res;
        })
      }
      else {
        return null;
      }
    }
  }
})
.state('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.valinainenoppiaine', {
  url: '/valinainenoppiaine/:oppiaineId',
  templateUrl: 'views/ops/vlnoppiaine.html',
  controller: 'OpsVlnOppiaineController',
  resolve: {
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,
    oppiaine: (opsResource, oppiaineId, opsId) =>
      opsResource.getOppiaine({
        opsId: opsId,
        oppiaineId: oppiaineId
      }).$promise
  }
})
/* LUKIO OPS */
.state('root.ops.lukioopetus', {
  url: '/lukiokoulutus',
  templateUrl: 'views/ops/lukio/lukioopetus.html',
  controller: 'OpsLukioopetusController',
  resolve: {
    opsId: ($stateParams) => $stateParams.opsId,
    yleisetTavoitteet: (OpsLukioResource, opsId) =>
      OpsLukioResource.getTavoitteet({opsId}).$promise,
    rakenne: (OpsLukioResource, opsId) => OpsLukioResource.getRakenne({opsId}).$promise
  }
})
.state('root.ops.lukioopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html'
})
.state('root.ops.lukioopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: 'OpsLukioTekstikappaleController',
    resolve: {
      tekstikappaleId: (serviceConfig, $stateParams) => $stateParams.tekstikappaleId,
      tekstikappaleWithChildren: (opsResource, tekstikappaleId, opsId) =>
        opsResource.getTekstikappaleWithChildren({opsId: opsId, viiteId: tekstikappaleId}).$promise
   }
})
.state('root.ops.lukioopetus.oppiaine', {
  url: '/oppiaine/:oppiaineId',
  templateUrl: 'views/ops/lukio/oppiaineet.html',
  controller: 'OpsLukioOppiaineController',
  resolve: {
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,
    oppiaine: (OpsLukioResource, oppiaineId, opsId) =>
      OpsLukioResource.getOppiaine({opsId, oppiaineId}).$promise
  }
})
.state('root.ops.lukioopetus.oppiaine.aihekokonaisuudet', {
  url: '/aihekokonaisuudet',
  templateUrl: 'views/ops/lukio/tavoitteet.html',
  controller: 'OpsLukioAihekokonaisuudetController',
  resolve: {
    aihekokonaisuudet: (OpsLukioResource, opsId) => OpsLukioResource.getAihekokonaisuudet({opsId}).$promise
  }
})
.state('root.ops.lukioopetus.oppiaine.tavoitteet', {
  url: '/yleiset-tavoitteet',
  templateUrl: 'views/ops/lukio/tavoitteet.html',
  controller: 'OpsLukioTavoitteetController',
  resolve: {
    tavoitteet: (OpsLukioResource, opsId) =>
      OpsLukioResource.getTavoitteet({ opsId }).$promise
  }
})
.state('root.ops.lukioopetus.kurssi', {
  url: '/oppiaine/:oppiaineId/kurssi/:kurssiId',
  templateUrl: 'views/ops/lukio/lukiokurssi.html',
  controller: 'OpsLukioKurssiController',
  resolve: {
    oppiaineId: ($stateParams) => $stateParams.oppiaineId,
    oppiaine: (OpsLukioResource, oppiaineId, opsId) =>
      OpsLukioResource.getOppiaine({opsId, oppiaineId}).$promise
  }
})
.state('root.ops.lukioopetus.kurssi.aihekokonaisuudet', {
  url: '/aihekokonaisuudet',
  templateUrl: 'views/ops/lukio/tavoitteet.html',
  controller: 'OpsLukioAihekokonaisuudetController',
  resolve: {
    aihekokonaisuudet: (OpsLukioResource, opsId) =>
      OpsLukioResource.getAihekokonaisuudet({opsId}).$promise
  }
})
.state('root.ops.lukioopetus.kurssi.tavoitteet', {
  url: '/yleiset-tavoitteet',
  templateUrl: 'views/ops/lukio/tavoitteet.html',
  controller: 'OpsLukioTavoitteetController',
  resolve: {
    tavoitteet: (OpsLukioResource, opsId) =>
      OpsLukioResource.getTavoitteet({ opsId }).$promise
  }
})
);
