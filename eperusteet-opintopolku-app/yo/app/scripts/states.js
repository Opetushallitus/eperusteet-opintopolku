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
    abstract: true
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
  });


});
