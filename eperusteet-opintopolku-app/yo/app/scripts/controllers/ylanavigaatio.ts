'use strict';


epOpintopolkuApp
  .controller('YlanavigaatioController', function ($rootScope, $scope, $state, Kieli, Haku, $stateParams, Kaanna) {
    $scope.kieli = Kieli.getUiKieli();
    $scope.nykyinenTila = $state;
    $scope.navCollapsed = true;
    $scope.state = $state;

    $scope.navCollapse = function () {
      $scope.navCollapsed = !$scope.navCollapsed;
    };

    $scope.urls = {
      eperusteet: {
        fi: 'https://eperusteet.opintopolku.fi/',
        sv: 'https://egrunder.studieinfo.fi/'
      },
      opintopolku: {
        fi: 'https://opintopolku.fi/',
        sv: 'https://studieinfo.fi/'
      }
    };

    $scope.isPerusopetus = function () {
      if (($state.includes('**.perusopetus.**') || $state.includes('**.lisaopetus.**')) && !$state.includes('**.ops.**')) {
        return true;
      }
    };

    $scope.isLukioopetus = function () {
      if ($state.includes('**.lukio.**') && !$state.includes('**.ops.**')) {
        return true;
      }
    };

    $scope.isAmPerus = function () {
      if ($state.includes('**.esitys.**') && amOsio === 'ammatillinenperuskoulutus' ||
        $state.includes('root.selaus.ammatillinenperuskoulutus')) {
        return true;
      }
    };

    $scope.isAmAikuis = function () {
      if ($state.includes('**.esitys.**') && amOsio === 'ammatillinenaikuiskoulutus' ||
        $state.includes('root.selaus.ammatillinenaikuiskoulutus')) {
        return true;
      }
    };

    $scope.isOps = function () {
      if ($state.includes('root.ops.**') || $state.includes('root.selaus.ops.**')) {
        return true;
      }
    };

    $scope.valittuOsio = function () {
      if ($state.includes('root.etusivu.**')) {
        return 'navi.etusivu';
      } else if ($state.includes('root.esiopetus.**')) {
        return 'navi.esiopetus';
      } else if ($state.includes('root.perusopetus.**')) {
        return 'navi.perusopetus';
      } else if ($state.includes('root.lisaopetus.**')) {
        return 'navi.lisaopetus';
      } else if ($state.includes('root.lukio.**')) {
        return 'navi.lukio';
      } else if ($scope.isAmPerus()) {
        return 'navi.ammatillinenperuskoulutus';
      } else if ($scope.isAmAikuis()) {
        return 'navi.ammatillinenperuskoulutus';
      } else if ($scope.isOps()) {
        return 'navi.opetussuunnitelmat';
      } else if ($state.includes('root.tiedote.**')) {
        return 'navi.tiedote';
      } else if ($state.includes('root.esitys.peruste.**')) {
        return 'navi.peruste';
      } else if ($state.includes('root.lukio.**')) {
        return 'navi.lukio';
      } else {
        return '';
      }
    };

    $scope.valittuOsioNimi = Kaanna.kaanna($scope.valittuOsio());

    $rootScope.$on('$stateChangeSuccess', function () {
      $scope.valittuOsioNimi = Kaanna.kaanna($scope.valittuOsio());
    });

    var amOsio = null;
    $scope.$watch(function () {
      return Haku.osio;
    }, function (value) {
      amOsio = value;
    });

    $scope.vaihdaKieli = function (uusiKieli) {
      if (uusiKieli !== Kieli.getUiKieli()) {
        Kieli.setUiKieli(uusiKieli);
        Kieli.setSisaltokieli(uusiKieli);
        $scope.kieli = uusiKieli;

        $state.go($state.current.name, _.merge($stateParams, {lang: uusiKieli}), {});
      }
    };

  });
