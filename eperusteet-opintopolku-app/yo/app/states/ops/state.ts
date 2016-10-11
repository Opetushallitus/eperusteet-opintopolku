angular.module('app')
.config(($stateProvider) => $stateProvider
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
      }),
    dokumenttiId: (YlopsApi, ops, $stateParams) => {
      return YlopsApi.all('dokumentit').customGET("ops", {
        opsId: ops.id,
        kieli: $stateParams.lang
      })
    }
  }
})
.state('root.ops.esiopetus', {
  url: '/esiopetus',
  templateUrl: 'views/ops/yksinkertainen.html',
  controller: Controllers.OpsYksinkertainenController,
})
.state('root.ops.esiopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html',
  controller: Controllers.OpsYksinkertainenTiedotController,
})
.state('root.ops.esiopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: Controllers.OpsTekstikappaleController,
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
  controller: Controllers.OpsYksinkertainenController,
})
.state('root.ops.lisaopetus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html',
  controller: Controllers.OpsYksinkertainenTiedotController
})
.state('root.ops.lisaopetus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: Controllers.OpsTekstikappaleController,
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
  controller: Controllers.OpsYksinkertainenController,
})
.state('root.ops.varhaiskasvatus.tiedot', {
  url: '/tiedot',
  templateUrl: 'views/ops/tiedot.html',
  controller: Controllers.OpsYksinkertainenTiedotController
})
.state('root.ops.varhaiskasvatus.tekstikappale', {
  url: '/tekstikappale/:tekstikappaleId',
  templateUrl: 'views/ops/tekstikappale.html',
  controller: Controllers.OpsTekstikappaleController,
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
  templateUrl: 'views/ops/tiedot.html',
  controller: ($scope, dokumenttiId) => {
    if (dokumenttiId && dokumenttiId.toString().length > 0) {
      $scope.dokumenttiUrl = location.origin + '/eperusteet-ylops-service/api/dokumentit/' + dokumenttiId;
    }
  }
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
  templateUrl: 'views/ops/tiedot.html',
  controller: ($scope, dokumenttiId) => {
    if (dokumenttiId && dokumenttiId.toString().length > 0) {
      $scope.dokumenttiUrl = location.origin + '/eperusteet-ylops-service/api/dokumentit/' + dokumenttiId;
    }
  }
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
