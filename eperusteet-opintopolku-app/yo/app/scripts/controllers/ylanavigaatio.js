'use strict';


/*jshint maxcomplexity:false */
epOpintopolkuApp
  .controller('YlanavigaatioController', function ($scope, $state, Kieli, Haku, $stateParams) {
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

    $scope.valittuOsio = function () {
      if ($state.includes('root.etusivu.**')) {
        return 'navi.etusivu';
      } else if ($state.includes('root.esiopetus.**')) {
        return 'navi.esiopetus';
      } else if ($state.includes('root.perusopetus.**')) {
        return 'navi.perusopetus';
      } else if ($state.includes('root.lisaopetus.**')) {
        return 'navi.lisaopetus';
      } else if ($scope.isAmPerus()) {
        return 'navi.ammatillinenperuskoulutus';
      } else if ($scope.isAmAikuis()) {
        return 'navi.ammatillinenaikuiskoulutus';
      } else if ($state.includes('root.tiedote.**')) {
        return 'navi.tiedote';
      } else if ($state.includes('root.esitys.peruste.**')) {
        return 'navi.peruste';
      }
    };

    $scope.isPerusopetus = function () {
      if ($state.includes('**.perusopetus.**') || $state.includes('**.lisaopetus.**')) {
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
