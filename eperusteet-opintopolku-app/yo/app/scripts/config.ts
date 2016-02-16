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

/* global moment */

epOpintopolkuApp
.config(function($urlRouterProvider, $sceProvider) {
  $sceProvider.enabled(true);
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function($injector, $location) {
    $injector.get('virheService').setData({path: $location.path()});
    $injector.get('$state').go('root.virhe');
  });
})
.config(function (epEsitysSettingsProvider) {
  epEsitysSettingsProvider.setValue('perusopetusState', 'root.perusopetus');
})
.config(function($translateProvider, $urlRouterProvider) {
  var preferred = 'fi';
  $urlRouterProvider.when('/', '/' + preferred);
  $translateProvider.useLoader('LokalisointiLoader');
  $translateProvider.preferredLanguage(preferred);
  moment.lang(preferred);
})
.config(function($rootScopeProvider) {
  // workaround for infdig with recursive tree structures
  $rootScopeProvider.digestTtl(20);
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push(['$rootScope', '$q', 'SpinnerService', function($rootScope, $q, Spinner) {
      return {
        request: function(request) {
          Spinner.enable();
          return request;
        },
        response: function(response) {
          Spinner.disable();
          return response || $q.when(response);
        },
        responseError: function(error) {
          Spinner.disable();
          return $q.reject(error);
        }
      };
    }]);
})
// Uudelleenohjaus autentikointiin ja palvelinvirheiden ilmoitukset
.config(function($httpProvider) {
  // Asetetaan oma interceptor kuuntelemaan palvelinkutsuja
  $httpProvider.interceptors.push(['$rootScope', '$q', function($rootScope, $q) {
      return {
        'response': function(response) {
          var uudelleenohjausStatuskoodit = [401, 412, 500];
          var fail = _.indexOf(uudelleenohjausStatuskoodit, response.status) !== -1;

          if (fail) {
            $rootScope.$emit('event:uudelleenohjattava', response.status);
          }
          return response || $q.when(response);
        },
        'responseError': function(err) {
          return $q.reject(err);
        }
      };
    }]);
})
.run(function($rootScope, $modal, $location, $window, $state, $http, paginationConfig,
  Kaanna, virheService) {
  paginationConfig.firstText = '';
  paginationConfig.previousText = '';
  paginationConfig.nextText = '';
  paginationConfig.lastText = '';
  paginationConfig.maxSize = 5;
  paginationConfig.rotate = false;

  var onAvattuna = false;

  $rootScope.$on('event:uudelleenohjattava', function(event, status) {
    if (onAvattuna) {
      return;
    }
    onAvattuna = true;

    function getCasURL() {
      var host = $location.host();
      var port = $location.port();
      var protocol = $location.protocol();
      var cas = '/cas/login';
      var redirectURL = encodeURIComponent($location.absUrl());
      var url = protocol + '://' + host;

      if (port !== 443 && port !== 80) {
        url += ':' + port;
      }

      url += cas + '?service=' + redirectURL;
      return url;
    }

    var casurl = getCasURL();

    if (status === 401) {
      $window.location.href = casurl;
      return;
    }

    var uudelleenohjausModaali = $modal.open({
      templateUrl: 'views/modals/uudelleenohjaus.html',
      controller: 'UudelleenohjausModalCtrl',
      resolve: {
        status: function() {
          return status;
        },
        redirect: function() {
          return casurl;
        }
      }
    });

    uudelleenohjausModaali.result.then(angular.noop, angular.noop).finally(function() {
      onAvattuna = false;
      switch (status) {
        case 500:
          $location.path('/');
          break;
        case 412:
          $window.location.href = casurl;
          break;
      }
    });
  });

  $rootScope.$on('$stateChangeError', function(event, toState) {
    console.warn(event, toState);
    virheService.virhe({state: toState.name});
  });

  $rootScope.$on('$stateNotFound', function(event, toState) {
    virheService.virhe({state: toState.to});
  });

})

// Inject common scope utilities
.run(($rootScope, $state) => {
  $rootScope.stateIs = $state.is;
});
