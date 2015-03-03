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
    template: '<div ui-view></div>',
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
    }
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

  .state('root.perusopetus', {
    url: '/perusopetus',
    templateUrl: 'views/perusopetus/perusopetus.html',
    controller: function () {}
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
    resolve: {'koulutusalaService': 'Koulutusalat'}
  })

  .state('root.selaus.ammatillinenaikuiskoulutus', {
    url: '/ammatillinenaikuiskoulutus',
    templateUrl: 'views/haku/haku.html',
    controller: 'HakuController',
    resolve: {'koulutusalaService': 'Koulutusalat'}
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
    templateUrl: 'views/esitys/rakenne.html',
    controller: 'EsitysRakenneController',
    resolve: {
      // FIXME: ui-router bug or some '$on'-callback manipulating $stateParams?
      // $stateParams changes between config and controller
      //
      // Got to live third-party libs
      realParams: function($stateParams) {
        return _.clone($stateParams);
      },
    }
  })

  .state('root.esitys.peruste.tutkinnonosat', {
    url: '/tutkinnonosat',
    templateUrl: 'views/esitys/tutkinnonosat.html',
    controller: 'EsitysTutkinnonOsatController'
  })

  .state('root.esitys.peruste.tutkinnonosa', {
    url: '/tutkinnonosat/:id',
    templateUrl: 'views/esitys/tutkinnonosa.html',
    controller: 'EsitysTutkinnonOsaController'
  })

  .state('root.esitys.peruste.tekstikappale', {
    url: '/sisalto/:osanId',
    templateUrl: 'views/esitys/sisalto.html',
    controller: 'EsitysSisaltoController'
  })

  .state('root.esitys.peruste.tiedot', {
    url: '/tiedot',
    templateUrl: 'views/esitys/tiedot.html',
    controller: 'EsitysTiedotController'
  });


});
