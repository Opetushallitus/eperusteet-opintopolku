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
.config(($urlRouterProvider, $sceProvider) => {
  $sceProvider.enabled(true);
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(($injector, $location) => {
    $injector.get('virheService').setData({path: $location.path()});
    $injector.get('$state').go('root.virhe');
  });
})
.config((epEsitysSettingsProvider) => {
  epEsitysSettingsProvider.setValue('perusopetusState', 'root.perusopetus');
})
.config(($translateProvider, $urlRouterProvider) => {
  const preferred = 'fi';
  $urlRouterProvider.when('/', '/' + preferred);
  $translateProvider.useLoader('LokalisointiLoader');
  $translateProvider.preferredLanguage(preferred);
  $translateProvider.useSanitizeValueStrategy(null);
  moment.locale(preferred);
})
.config(($rootScopeProvider) => {
  // workaround for infdig with recursive tree structures
  $rootScopeProvider.digestTtl(20);
})
.config(($httpProvider) => {
  $httpProvider.interceptors.push(['$rootScope', '$q', 'SpinnerService', ($rootScope, $q, Spinner) => {
    return {
      request: (request) => {
        Spinner.enable();
        return request;
      },
      response: (response) => {
        Spinner.disable();
        return response || $q.when(response);
      },
      responseError: (error) => {
        Spinner.disable();
        return $q.reject(error);
      }
    };
  }]);
})
// Uudelleenohjaus autentikointiin ja palvelinvirheiden ilmoitukset
.config(($httpProvider) => {
  // Asetetaan oma interceptor kuuntelemaan palvelinkutsuja
  $httpProvider.interceptors.push(['$rootScope', '$q', ($rootScope, $q) => {
    return {
      'response': (response) => {
        var uudelleenohjausStatuskoodit = [401, 412, 500];
        var fail = _.indexOf(uudelleenohjausStatuskoodit, response.status) !== -1;

        if (fail) {
          $rootScope.$emit('event:uudelleenohjattava', response.status);
        }
        return response || $q.when(response);
      },
      'responseError': (err) => {
        return $q.reject(err);
      }
    };
  }]);
})
.run(($rootScope, $uibModal, $location, $window, $state, $http, uibPaginationConfig, Kaanna, virheService) => {
  uibPaginationConfig.firstText = '';
  uibPaginationConfig.previousText = '';
  uibPaginationConfig.nextText = '';
  uibPaginationConfig.lastText = '';
  uibPaginationConfig.maxSize = 5;
  uibPaginationConfig.rotate = false;

  var onAvattuna = false;

  $rootScope.$on('event:uudelleenohjattava', (event, status) => {
    if (onAvattuna) {
      return;
    }
    onAvattuna = true;

    var getCasURL = () => {
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
    };

    var casurl = getCasURL();

    if (status === 401) {
      $window.location.href = casurl;
      return;
    }

    var uudelleenohjausModaali = $uibModal.open({
      templateUrl: 'views/modals/uudelleenohjaus.html',
      controller: 'UudelleenohjausModalCtrl',
      resolve: {
        status: () => {
          return status;
        },
        redirect: () => {
          return casurl;
        }
      }
    });

    uudelleenohjausModaali.result.then(angular.noop, angular.noop).finally(() => {
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

  $rootScope.$on('$stateChangeError', (event, toState) => {
    console.warn(event, toState);
    virheService.virhe({state: toState.name});
  });

  $rootScope.$on('$stateNotFound', (event, toState) => {
    console.warn(toState);
    virheService.virhe({state: toState.to});
  });

  $rootScope.$on('$stateChangeStart', (evt, to, params) => {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params, { location: 'replace' })
    }
  });
})
// Inject common scope utilities
.run(($rootScope, $state) => {
  $rootScope.stateIs = $state.is;
});
