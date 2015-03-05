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
/*global _*/

epOpintopolkuApp
  .factory('treeTemplate', function () {
    function generoiOtsikko() {
      var tosa = '{{ tutkinnonOsaSolmunNimi(rakenne) | kaanna }}' +
      '<span ng-if="!rakenne.erikoisuus && apumuuttujat.suoritustapa !== \'naytto\' && tutkinnonOsaViitteet[rakenne._tutkinnonOsaViite].laajuus">,' +
      ' <strong>{{ + tutkinnonOsaViitteet[rakenne._tutkinnonOsaViite].laajuus || 0 }}</strong> {{ apumuuttujat.laajuusYksikko | kaanna }}</span>';
      var editointiIkoni =
      '<div ng-click="togglaaPakollisuus(rakenne)" class="osa-ikoni">' +
        '  <span ng-show="!rakenne.pakollinen"><img src="images/tutkinnonosa.png" alt=""></span> ' +
        '  <span ng-show="rakenne.pakollinen"><img src="images/tutkinnonosa_pakollinen.png" alt=""></span> ' +
        '</div>';
      return '' +
        '<span ng-if="onOsa(rakenne)">' +
           editointiIkoni +
        '  <a class="osa-nimi" ng-if="esitystilassa" ui-sref="root.esitys.peruste.tutkinnonosa({ id: rakenne._tutkinnonOsaViite, suoritustapa: apumuuttujat.suoritustapa })">' + tosa + '</a>' +
        '  <span class="osa-nimi" ng-if="!muokkaus && !esitystilassa">' +
        '    <a ng-if="rakenne._tutkinnonOsaViite" ui-sref="root.perusteprojekti.suoritustapa.tutkinnonosa({ tutkinnonOsaViiteId: tutkinnonOsaViitteet[rakenne._tutkinnonOsaViite].id, suoritustapa: apumuuttujat.suoritustapa })">' +
               tosa +
        '    </a>' +
        '    <span ng-if="!rakenne._tutkinnonOsaViite">' + tosa + '</span>' +
        '  </span>' +
        '</span>' +
        '<span ng-if="!onOsa(rakenne) && rakenne.nimi">' +
        '  <strong>{{ rakenne.nimi || "nimetön" | kaanna }}</strong>' +
        '</span>';
    }

    var varivalinta = 'ng-class="{vieras: rakenne.rooli === \'vieras\', maarittelematon: rakenne.rooli === \'määrittelemätön\', tyhja: rakenne.osat.length === 0, ' +
        'suljettu: rakenne.$collapsed, osaamisala: rakenne.rooli === \'osaamisala\'}"';

    var koonIlmaisu = '<span ng-show="rakenne.muodostumisSaanto.koko.minimi === rakenne.muodostumisSaanto.koko.maksimi">' +
                      '  {{ rakenne.muodostumisSaanto.koko.minimi || 0 }} {{ \'kpl\' | kaanna }}' +
                      '</span>' +
                      '<span ng-hide="rakenne.muodostumisSaanto.koko.minimi === rakenne.muodostumisSaanto.koko.maksimi">' +
                      '  {{ rakenne.muodostumisSaanto.koko.minimi || 0 }} - {{ rakenne.muodostumisSaanto.koko.maksimi || 0 }} {{ \'kpl\' | kaanna }}' +
                      '</span>';

    var laajuudenIlmaisu = '<span ng-show="rakenne.muodostumisSaanto.laajuus.minimi === rakenne.muodostumisSaanto.laajuus.maksimi">' +
                           '  {{ rakenne.muodostumisSaanto.laajuus.minimi || 0 }} {{ apumuuttujat.laajuusYksikko | kaanna }}' +
                           '</span>' +
                           '<span ng-hide="rakenne.muodostumisSaanto.laajuus.minimi === rakenne.muodostumisSaanto.laajuus.maksimi">' +
                           '  {{ rakenne.muodostumisSaanto.laajuus.minimi || 0 }} - {{ rakenne.muodostumisSaanto.laajuus.maksimi || 0 }} {{ apumuuttujat.laajuusYksikko | kaanna }}' +
                           '</span>';

    var optiot = '' +
      '<span ng-click="rakenne.$collapsed = rakenne.osat.length > 0 ? !rakenne.$collapsed : false" ng-if="!onOsa(rakenne)" class="colorbox" ' + varivalinta + '>' +
      '  <span ng-show="rakenne.rooli !== \'määrittelemätön\'">' +
      '    <span ng-hide="rakenne.$collapsed" class="glyphicon glyphicon-chevron-down"></span>' +
      '    <span ng-show="rakenne.$collapsed" class="glyphicon glyphicon-chevron-right"></span>' +
      '  </span>' +
      '</span>' +
      '<div class="right">' +
      '  <div class="pull-right" ng-if="!onOsa(rakenne)">' +
      '    <span class="right-item" ng-show="apumuuttujat.suoritustapa !== \'naytto\' && isNumber(rakenne.muodostumisSaanto.laajuus.minimi)">' +
      laajuudenIlmaisu +
      '    </span>' +
      '    <span class="right-item" ng-if="isNumber(rakenne.muodostumisSaanto.koko.minimi)">' +
      koonIlmaisu +
      '    </span>' +
      '  </div>' +
      '</div>' +
      '<div class="left">' +
      '  <span>' + generoiOtsikko() + '</span>' +
      '</div>';

    var kentta =
      '<div ng-class="osaLuokat(rakenne)">' + optiot + '</div>' +
      '<div ng-model="rakenne" ng-show="rakenne.osaamisala || (rakenne.kuvaus && rakenne.kuvaus[lang].length > 0)" class="kuvaus">' +
      '  <div class="kuvausteksti" ng-class="{ \'text-truncated\': !rakenne.$showKuvaus }">' +
      '    <div class="osaamisala" ng-show="rakenne.osaamisala"><b kaanna="osaamisala"></b>: {{ rakenne.osaamisala.nimi | kaanna }} ({{ rakenne.osaamisala.osaamisalakoodiArvo }})</div>' +
      '    <p ng-show="rakenne.kuvaus && rakenne.kuvaus[lang].length > 0">{{ rakenne.kuvaus | kaanna }}</p>' +
      '  </div>' +
      '  <div class="avausnappi" ng-click="rakenne.$showKuvaus = !rakenne.$showKuvaus" ng-attr-title="{{rakenne.$showKuvaus && (\'piilota-ryhman-kuvaus\'|kaanna) || (\'nayta-ryhman-kuvaus\'|kaanna)}}">' +
      '  <div class="avausnappi-painike">&hellip;</div></div>' +
      '</div>';

    var avaaKaikki = '' +
      '<div class="pull-right">' +
      '  <a ng-click="togglaaKuvaukset()" class="group-toggler action-link" ng-show="scanKuvaukset()">' +
      '    <span icon-role="ep-part">{{kuvauksetOpen && "piilota-kuvaukset" || "nayta-kuvaukset" | kaanna }}</span>' +
      '    ' +
      '  </a>' +
      '  <a ng-click="togglaaPolut()" class="group-toggler action-link">' +
      '    <span class="avaa-sulje" icon-role="ep-open-close">{{ "avaa-sulje-rakenne" | kaanna }}</span>' +
      '  </a>' +
      '</div>';

    return '' +
      '<div ng-if="!vanhempi">' +
      '  <div class="ylapainikkeet">' +
      '    <span class="rakenne-nimi">{{ apumuuttujat.peruste.nimi | kaanna }}' +
      '    <span ng-if="rakenne.muodostumisSaanto && rakenne.muodostumisSaanto.laajuus">' +
      '      <span ng-if="rakenne.$laajuus">{{ rakenne.$laajuus }} / </span>' +
      '      <span ng-if="isNumber(rakenne.muodostumisSaanto.laajuus.minimi)">' +
      '        {{ rakenne.muodostumisSaanto.laajuus.minimi }}' +
      '      </span>' +
      '      <span ng-if="rakenne.muodostumisSaanto.laajuus.maksimi && rakenne.muodostumisSaanto.laajuus.minimi !== rakenne.muodostumisSaanto.laajuus.maksimi">' +
      '        - {{ rakenne.muodostumisSaanto.laajuus.maksimi }}' +
      '      </span>' +
      '      {{ apumuuttujat.laajuusYksikko | kaanna }}' +
      '    </span></span>' +
      '    <a ng-if="zoomaus" icon-role="back" class="back action-link"></a>' +
      avaaKaikki +
      '  </div>' +
      '  <div><div class="tree-yliviiva"></div></div>' +
      '</div>' +
      '<div ng-if="vanhempi">' + kentta + '</div>' +
      '<div ng-if="rakenne.rooli !== \'määrittelemätön\'" class="collapser" ng-show="!rakenne.$collapsed">' +
      '  <ul ng-if="rakenne.osat !== undefined" id="tree-sortable" class="tree-group" ng-model="rakenne.osat">' +
      '    <li ng-repeat="osa in rakenne.osat" class="tree-list-item">' +
      '      <tree apumuuttujat="apumuuttujat" muokkaus="muokkaus" rakenne="osa" vanhempi="rakenne" tutkinnon-osa-viitteet="tutkinnonOsaViitteet" uusi-tutkinnon-osa="uusiTutkinnonOsa" ng-init="notfirst = true" callbacks="callbacks"></tree>' +
      '    </li>' +
      '  </ul>' +
      '</div>';
  })

  .directive('tree', function($compile, treeTemplate) {
    return {
      restrict: 'AE',
      transclude: false,
      terminal: true,
      scope: {
        rakenne: '=',
        tutkinnonOsaViitteet: '=',
        uusiTutkinnonOsa: '=',
        vanhempi: '=',
        apumuuttujat: '=',
        muokkaus: '=',
        callbacks: '='
      },
      controller: 'TreeController',
      link: function(scope, el) {
        var templateElement = angular.element(treeTemplate);
        $compile(templateElement)(scope);
        el.replaceWith(templateElement);
      }
    };
  })

  .controller('TreeController', function ($scope, $translate, $state, Muodostumissaannot, Algoritmit,
      Kaanna, Utils) {
    $scope.kuvauksetOpen = false;
    $scope.esitystilassa = $state.includes('**.esitys.**');
    $scope.lang = $translate.use() || $translate.preferredLanguage();
    $scope.isNumber = _.isNumber;

    $scope.lisaaLaajuusYksikko = function(obj) {
      return _.merge(obj, {
        laajuusYksikko: Kaanna.kaanna($scope.apumuuttujat.laajuusYksikko)
      });
    };

    $scope.onOsa = function(osa) {
      return osa._tutkinnonOsaViite || osa.erikoisuus;
    };

    $scope.tutkinnonOsaSolmunNimi = function(solmu) {
      if (solmu._tutkinnonOsaViite) {
        return $scope.tutkinnonOsaViitteet[solmu._tutkinnonOsaViite].nimi;
      }
      else if (solmu.erikoisuus) {
        return solmu.vieras && solmu.vieras.nimi || 'nimeton-vierastutkinto';
      }
      else {
        return 'nimetön';
      }
    };

    $scope.osaLuokat = function (osa) {
      var luokat = [];
      if ($scope.onOsa(osa)) {
        luokat.push('bubble-osa');
        var viite = $scope.tutkinnonOsaViitteet[osa._tutkinnonOsaViite];
        if (viite && (viite.$elevate || ($scope.apumuuttujat.haku && viite.$matched))) {
          luokat.push('huomio');
        }
      } else {
        luokat.push('bubble');
      }
      return luokat;
    };

    $scope.scanKuvaukset = function () {
      var hasKuvaukset = false;
      $scope.kuvauksetOpen = false;
      Algoritmit.kaikilleLapsisolmuille($scope.rakenne, 'osat', function(osa) {
        if (!$scope.kuvauksetOpen && osa.$showKuvaus) {
          $scope.kuvauksetOpen = true;
        }
        if (!hasKuvaukset && Utils.hasLocalizedText(osa.kuvaus)) {
          hasKuvaukset = true;
        }
      });
      return hasKuvaukset;
    };

    $scope.togglaaKuvaukset = function() {
      Algoritmit.kaikilleLapsisolmuille($scope.rakenne, 'osat', function(osa) {
        osa.$showKuvaus = !$scope.kuvauksetOpen;
      });
      $scope.kuvauksetOpen = !$scope.kuvauksetOpen;
    };

    $scope.togglaaPolut = function() {
      var avaamattomat = _($scope.rakenne.osat).reject(function(osa) {
        return osa._tutkinnonOsaViite || osa.$collapsed || osa.osat.length === 0;
      }).size();

      _.forEach($scope.rakenne.osat, function(r) {
        if (r.osat && _.size(r.osat) > 0) {
          r.$collapsed = avaamattomat !== 0;
        }
      });
    };
  })

  .directive('treeWrapper', function() {
    return {
      restrict: 'AE',
      transclude: true,
      terminal: true,
      templateUrl: 'views/esitys/directives/tree.html',
      scope: {
        rakenne: '=',
        voiLiikuttaa: '=',
        ajaKaikille: '=',
        muokkaus: '=',
        esitys: '=?'
      },
      controller: 'TreeWrapperController'
    };
  })

  .controller('TreeWrapperController', function ($scope, Kaanna, PerusteenRakenne, Muodostumissaannot,
      Algoritmit) {
    $scope.suljettuViimeksi = true;
    $scope.lisataanUuttaOsaa = false;
    $scope.uusiOsa = null;
    $scope.skratchpad = [];
    $scope.uniikit = [];
    $scope.kaytetytUniikit = {};
    $scope.kaikkiUniikit = [];
    $scope.topredicate = 'nimi.fi';
    $scope.tosarajaus = '';
    $scope.naytaKuvaus = function () {
      return !!Kaanna.kaanna($scope.rakenne.rakenne.kuvaus);
    };

    $scope.tutkinnonOsat = {
      perSivu: 8,
      rajaus: '',
      multiPage: false,
      sivu: 1
    };

    $scope.paivitaTekstiRajaus = function (value) {
      if (!_.isEmpty(value)) {
        PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
          // 1. Find matches
          item.$collapsed = true;
          var osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
          if (osa) {
            osa.$matched = Algoritmit.rajausVertailu(value, osa, 'nimi');
          }
        });
        PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
          // 2. Uncollapse parents of matched
          var osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
          if (osa && osa.$matched) {
            var parent = item.$parent;
            while (parent) {
              if (parent.$parent) {
                parent.$collapsed = false;
              }
              parent = parent.$parent;
            }
          }
        });
      } else {
        // Uncollapse all when search is cleared
        PerusteenRakenne.kaikilleRakenteille($scope.rakenne.rakenne, function(item) {
          item.$collapsed = false;
        });
      }
    };

    $scope.paivitaRajaus = function(input) {
      input = input === undefined ? $scope.tosarajaus : input;
      $scope.tosarajaus = input;
      var filtered = !_.isEmpty(input);
      $scope.uniikit = _.reject($scope.kaikkiUniikit, function(yksi) {
        var nimi = $scope.rakenne.tutkinnonOsaViitteet[yksi._tutkinnonOsaViite] ?
          (Kaanna.kaanna($scope.rakenne.tutkinnonOsaViitteet[yksi._tutkinnonOsaViite].nimi) || '').toLowerCase() : '';
        return !yksi.alwaysVisible && ((filtered && nimi.indexOf(input.toLowerCase()) === -1) ||
               ($scope.piilotaKaikki && $scope.kaytetytUniikit[yksi._tutkinnonOsaViite]));
      });
    };

    $scope.jarjestysSorter = function (item) {
      if (item.erikoisuus === 'vieras') {
        return -1;
      }
      if (item._tutkinnonOsaViite) {
        var osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
        if (osa && _.isNumber(osa.jarjestys)) {
          return osa.jarjestys;
        }
      }
      return Number.MAX_SAFE_INTEGER;
    };

    $scope.nimiSorter = function (item) {
      if (item._tutkinnonOsaViite) {
        var osa = $scope.rakenne.tutkinnonOsaViitteet[item._tutkinnonOsaViite];
        return Kaanna.kaanna(osa.nimi).toLowerCase();
      }
    };

    $scope.ryhmaSorter = function (item) {
      if (!item._tutkinnonOsaViite) {
        return Kaanna.kaanna(item.nimi).toLowerCase();
      }
    };

    $scope.$watch('rakenne.$suoritustapa', function() {
      var sts = null;
      if ($scope.rakenne.$peruste) {
        sts = _($scope.rakenne.$peruste.suoritustavat).filter(function(st) { return st.laajuusYksikko; }).value();
        sts = _.zipObject(_.map(sts, 'suoritustapakoodi'), sts)[$scope.rakenne.$suoritustapa];
      }

      $scope.apumuuttujat = {
        suoritustapa: $scope.rakenne.$suoritustapa,
        laajuusYksikko: sts ? sts.laajuusYksikko : null,
        vanhin: $scope.rakenne,
        piilotaVirheet: true,
        peruste: $scope.rakenne.$peruste
      };
    });

    $scope.$watch('apumuuttujat.haku', function (value) {
      $scope.paivitaTekstiRajaus(value);
    });
  })

  .config(function ($tooltipProvider) {
    $tooltipProvider.setTriggers({
        'mouseenter': 'mouseleave',
        'click': 'click',
        'focus': 'blur',
        'never': 'mouseleave',
        'show': 'hide'
    });
  });
