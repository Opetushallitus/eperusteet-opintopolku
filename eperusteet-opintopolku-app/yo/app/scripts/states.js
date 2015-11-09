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

epOpintopolkuApp
  .config(function($stateProvider) {
    $stateProvider

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
          peruste: function(serviceConfig, $stateParams, Perusteet) {
            return Perusteet.get({ perusteId: $stateParams.perusteId }).$promise;
          },
          sisalto: function(serviceConfig, $stateParams, SuoritustapaSisalto) {
            return SuoritustapaSisalto.get({ perusteId: $stateParams.perusteId, suoritustapa: $stateParams.suoritustapa }).$promise;
          },
          arviointiasteikot: function(serviceConfig, Arviointiasteikot) {
            return Arviointiasteikot.list({}).$promise;
          },
          tutkinnonOsat: function(serviceConfig, $stateParams, PerusteTutkinnonosat) {
            return PerusteTutkinnonosat.query({ perusteId: $stateParams.perusteId, suoritustapa: $stateParams.suoritustapa }).$promise;
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
          realParams: function($stateParams) {
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
        controller: 'epEsitysTiedotController'
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
          sisalto: function(serviceConfig, peruste, $q, LaajaalaisetOsaamiset,
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
            return Oppiaineet.get({ perusteId: perusteId, osanId: oppiaineId }).$promise;
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
            return oppiaineId ? Oppiaineet.get({ perusteId: perusteId, osanId: oppiaineId }).$promise : null;
          }
        }
      })

      /* LUKIO */

      .state('root.lukio', {
        url: '/lukio/:perusteId',
        templateUrl: 'eperusteet-esitys/views/lukio.html',
        controller: 'epLukioController',
        resolve: {
          perusteId: function (serviceConfig, $stateParams) {
            return $stateParams.perusteId;
          },
          peruste: function (serviceConfig, perusteId, UusimmatPerusteetService, Perusteet) {
            return !perusteId ? UusimmatPerusteetService.getPerusopetus() : Perusteet.get({perusteId: perusteId}).$promise
              .then(function(res){
                return res;
              });
          },
          oppiaineRakenne: function(LukioYleistiedot, perusteId){
            return LukioYleistiedot.getOppiaineRakenne({perusteId: perusteId}).$promise
              .then(function(res){
                return res;
              });
          },
          perusData: function (LukioPerusteenOsat, perusteId) {
            return LukioPerusteenOsat.query({perusteId: perusteId}).$promise
              .then(function (res) {
                var lapset = _.filter(res.lapset, function (lapsi) {
                  return lapsi.perusteenOsa.osanTyyppi === 'tekstikappale';
                });
                console.log({'lapset': lapset, 'id': perusteId});
                return {'lapset': lapset, 'id': perusteId};
              });
          }
        }
      })

      .state('root.lukio.tekstikappale', {
        url: '/tekstikappale/:tekstikappaleId',
        templateUrl: 'eperusteet-esitys/views/lukiotekstikappale.html',
        controller: 'epLukioTekstikappaleController',
        resolve: {
          tekstikappaleId: function (serviceConfig, $stateParams) {
            return $stateParams.tekstikappaleId;
          },
          tekstikappale: function (serviceConfig, tekstikappaleId, LukioTekstikappale) {
            return LukioTekstikappale.getByViite({viiteId: tekstikappaleId}).$promise
              .then(function(res){
                return res;
              });
          },
          lapset: function (serviceConfig, perusData, tekstikappaleId, epTekstikappaleChildResolver) {
            return epTekstikappaleChildResolver.get(perusData, tekstikappaleId, true);
          }
        }
      })

      .state('root.lukio.oppiaine', {
        url: '/oppiaine/:oppiaineId',
        templateUrl: 'eperusteet-esitys/views/lukioOppiaine.html',
        controller: 'epLukioOppiaineController',
        resolve: {
          oppiaineId: function (serviceConfig, $stateParams) {
            return $stateParams.oppiaineId;
          },
          oppiaine: function (serviceConfig, perusteId, LukioOppiaineet, oppiaineId) {
            return LukioOppiaineet.getOppiaine({ perusteId: perusteId, oppiaineId: oppiaineId }).$promise
              .then(function(res){
                return res;
              });
          }
        }
      })

      .state('root.lukio.oppiaine.tavoitteet', {
        url: '/yleiset-tavoitteet',
        templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
        controller: 'epLukioTavoitteetController',
        resolve: {
          tavoitteet: function (LukioYleistiedot, perusteId) {
            return LukioYleistiedot.getTavoitteet({perusteId: perusteId}).$promise
              .then(function (res) {
                return res;
              });
          }
        }
      })

      .state('root.lukio.oppiaine.aihekokonaisuudet', {
        url: '/aihekokonaisuudet',
        templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
        controller: 'epLukioAihekokonaisuudetController',
        resolve: {
          aihekokonaisuudet: function (LukioYleistiedot, perusteId) {
            return LukioYleistiedot.getAihekokonaisuudet({perusteId: perusteId}).$promise
              .then(function (res) {
                return res;
              });
          }
        }
      })

      .state('root.lukio.kurssi', {
        url: '/kurssi/:kurssiId',
        templateUrl: 'eperusteet-esitys/views/lukiokurssi.html',
        controller: 'epLukioKurssiController'
      })

      .state('root.lukio.kurssi.tavoitteet', {
        url: '/yleiset-tavoitteet',
        templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
        controller: 'epLukioTavoitteetController',
        resolve: {
          tavoitteet: function (LukioYleistiedot, perusteId) {
            return LukioYleistiedot.getTavoitteet({perusteId: perusteId}).$promise
              .then(function (res) {
                return res;
              });
          }
        }
      })

      .state('root.lukio.kurssi.aihekokonaisuudet', {
        url: '/aihekokonaisuudet',
        templateUrl: 'eperusteet-esitys/views/tavoitteet.html',
        controller: 'epLukioAihekokonaisuudetController',
        resolve: {
          aihekokonaisuudet: function (LukioYleistiedot, perusteId) {
            return LukioYleistiedot.getAihekokonaisuudet({perusteId: perusteId}).$promise
              .then(function (res) {
                return res;
              });
          }
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
          sisalto: function(serviceConfig, peruste, $q, SuoritustapaSisalto) {
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
          sisalto: function(serviceConfig, peruste, $q, SuoritustapaSisalto) {
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
      });

  });
