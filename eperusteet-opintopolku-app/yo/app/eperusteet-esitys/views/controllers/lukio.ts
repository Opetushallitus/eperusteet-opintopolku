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


// TODO: Siirrä muualle
angular.module('eperusteet.esitys')
.directive('epLukioSivunavigaatio', function ($compile) {
    return {
        templateUrl: 'eperusteet-esitys/directives/lukiosivunavi.html',
        restrict: 'AE',
        scope: {
            items: '=',
            header: '=',
            sections: '=',
            footer: '=',
            showOne: '=',
            onSectionChange: '=?'
        },
        controller: Controllers.epLukioSivuNaviController,
        transclude: true,
        link: function (scope: any, element) {
            var transcluded = element.find('#sivunavi-tc').contents();
            scope.hasTransclude = transcluded.length > 0;
            //scope.disableRajaus = !_.isEmpty(attrs.disableRajaus);

            function updateFooter() {
                scope.footerContent = scope.footer ? $compile(scope.footer)(scope) : '';
                var el = element.find('#sivunavi-footer-content');
                el.empty().removeClass('has-content');
                if (scope.footer) {
                    el.append(scope.footerContent).addClass('has-content');
                }
            }
            scope.$watch('footer', updateFooter);
        }
    };
})

namespace Controllers {
  export const epLukioController = (
    $q,
    $scope,
    $rootScope,
    $state,
    $document,
    $timeout,
    $stateParams,
    $location,
    perusData,
    peruste,
    epEsitysSettings,
    epMenuBuilder,
    TermistoService,
    MurupolkuData,
    epLukioStateService,
    oppiaineRakenne,
    epLukioUtils,
    Kieli) => {
        $scope.oppiaineRakenne = oppiaineRakenne;
        $scope.isNaviVisible = _.constant(true);
        $scope.perusteenSisalto = perusData;
        $scope.peruste = _.isArray(peruste.data) ? peruste.data[0] : peruste;
        $scope.oppiaineet = _.zipBy($scope.oppiaineRakenne.oppiaineet, 'id');
        $scope.oppiaineetJaOppimaarat = epLukioUtils.flattenAndZipOppiaineet($scope.oppiaineRakenne.oppiaineet);
        $scope.showPreviewNote = epEsitysSettings.showPreviewNote;
        TermistoService.setResource(peruste);

        $scope.scrollToHash = function(id){
        $state.go('root.lukio.tekstikappale');
        $location.hash(id + '');
        $rootScope.$broadcast('$locationChangeSuccess');
        };

        function clickHandler(event) {
            var ohjeEl = angular.element(event.target).closest('.popover, .popover-element');
            if (ohjeEl.length === 0) {
                $rootScope.$broadcast('ohje:closeAll');
            }
        }
        function installClickHandler() {
            $document.off('click', clickHandler);
            $timeout(function () {
                $document.on('click', clickHandler);
            });
        }
        $scope.$on('$destroy', function () {
            $document.off('click', clickHandler);
        });

        installClickHandler();

        $scope.addTekstiKappaleTitleClass = function(id) {
            var titleClasses = { 0: 'title-h1', 1: 'title-h2', 2: 'title-h3', 3: 'title-h4', 4: 'title-h5', 5: 'title-h5'};
            return titleClasses[id];
        };

        $scope.hasContent = function (obj) {
            return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
        };

        $timeout(function () {
        if ($state.current.name === epEsitysSettings.lukioState) {
            const first = _($scope.navi.sections[0].items)
                .filter((item) => item.depth === 0)
                .first();

            if (first) {
                $state.go('.tekstikappale', {tekstikappaleId: $scope.perusteenSisalto.lapset[0].id}, {location: 'replace'});
            }
        }
        });

        $scope.state = epLukioStateService.getState();

        $rootScope.$on('$locationChangeSuccess', function () {
            epLukioStateService.setState($scope.navi);
        });

        $scope.$on('$stateChangeSuccess', function () {
            epLukioStateService.setState($scope.navi);
        });

        $scope.currentState = function(){
            var parts = _.words($state.current.name);
            if (_.indexOf(parts, 'oppiaine') > -1){
                return 'oppiaine';
            }
            if (_.indexOf(parts, 'kurssi') > -1){
                return 'kurssi';
            }
            return null;
        };

        $scope.wrongState = function() {
            return _.intersection(_.words($state.current.name), ['tavoitteet', 'aihekokonaisuudet']).length;
        };

        $scope.getCurrentEndState = function() {
            return _.last(_.words($state.current.name));
        };

        $scope.tabConfig = {oppiaineUrl: 'root.lukio.oppiaine', kurssiUrl: 'root.lukio.oppiaine.kurssi'};

        MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});

        $scope.naviClasses = function (item) {
        var classes = ['depth' + item.depth];
        if (item.$selected) {
            classes.push('tekstisisalto-active');
        }
        if (item.$header) {
            classes.push('tekstisisalto-active-header');
        }
        if (item.$kurssi && item.$kurssi.tyyppi) {
            classes.push('kurssi');
        }
        if (item.$kurssi && item.$kurssi.tyyppi === 'PAKOLLINEN') {
            classes.push('kurssi-pakollinen');
        }
        if (item.$kurssi && item.$kurssi.tyyppi === 'VALTAKUNNALLINEN_SOVELTAVA') {
            classes.push('kurssi-soveltava');
        }
        if (item.$kurssi && item.$kurssi.tyyppi === 'VALTAKUNNALLINEN_SYVENTAVA') {
            classes.push('kurssi-syventava');
        }
        return classes;
        };

        $scope.navi = {
            header: 'perusteen-sisalto',
            showOne: true,
            sections: [{
                id: 'suunnitelma',
                include: 'eperusteet-esitys/views/lukionyhteisetosuudet.html',
                items: epMenuBuilder.rakennaTekstisisalto($scope.perusteenSisalto),
                naviClasses: $scope.naviClasses,
                title: 'yhteiset-osuudet'
            }, {
                title: 'opetuksen-sisallot',
                id: 'sisalto',
                include: 'eperusteet-esitys/views/oppiaineetsivunavi.html',
                items: epMenuBuilder.buildLukioOppiaineMenu($scope.oppiaineRakenne.oppiaineet),
                naviClasses: $scope.naviClasses
            }]
        };

        $scope.navi.sections[0].items.unshift({
            depth: 0,
            label: 'perusteen-tiedot',
            link: [epEsitysSettings.lukioState + '.tiedot']
        });

        $scope.$on('$stateChangeSuccess', function () {
            if ($state.current.name === epEsitysSettings.lukioState) {
                $state.go('.tiedot', {perusteId: $scope.peruste.id}, {location: 'replace'});
            }
        });

        $scope.chooseFirstOppiaine = function (section) {
            const oppiaine = '' + section.id === 'sisalto';
            const aine: any = _.find($scope.navi.sections[1].items, {depth: 0});
            if (aine && oppiaine) {
                $timeout(function () {
                    $state.go(epEsitysSettings.lukioState + '.oppiaine', {
                        perusteId: $scope.peruste.id,
                        oppiaineId: aine.$oppiaine.id
                    });
                });
            }
        };

        $scope.onSectionChange = (section) => !section.$open ? $scope.chooseFirstOppiaine(section) : null;
  };

  export const epLukioTekstikappaleController = ($scope, $rootScope, $stateParams, $location, epTekstikappaleChildResolver, $q, Kieli, epLukioUtils, tekstikappale, tekstikappaleId, MurupolkuData, epParentFinder) => {
      $scope.tekstikappale = tekstikappale;
      $scope.lapset = epTekstikappaleChildResolver.getSisalto();

      var lastenNimet = epLukioUtils.flattenNames($scope.lapset);

      function getName(names, id){
          return _(names).filter(function(name) { return name._id === id; }).value().pop();
      }

      $rootScope.$on('$locationChangeSuccess', function () {
          var hash = $location.hash();
          var lapsi = getName(lastenNimet, hash);
          if (lapsi) {
              MurupolkuData.set('parents', {tekstikappaleNimi: tekstikappale.nimi});
              MurupolkuData.set({
                  tekstikappaleId: hash,
                  tekstikappaleNimi: lapsi.name[Kieli.getSisaltokieli()]
              });
          }
          else {
              MurupolkuData.set('parents', epParentFinder.find($scope.perusteenSisalto.lapset, tekstikappale.id, true));
              MurupolkuData.set({tekstikappaleId: tekstikappale.id, tekstikappaleNimi: tekstikappale.nimi});
          }
      });

      $scope.lapset = epTekstikappaleChildResolver.getSisalto();
      $scope.links = {
          prev: null,
          next: null
      };

      function checkPrevNext() {
          var items = $scope.navi.sections[0].items;
          var me = _.findIndex(items, function (item: any) {
              return item.$osa && item.$osa.perusteenOsa && item.$osa.perusteenOsa.id === $scope.tekstikappale.id;
          });
          if (me === -1) {
              return;
          }
          var i = me + 1;
          var meDepth = items[me].depth;
          //Why not include children?
          for (; i < items.length; ++i) {
              if (items[i].depth <= meDepth) {
                  break;
              }
          }
          $scope.links.next = i < items.length && items[i].id !== 'laajaalaiset' ? items[i] : null;
          i = me - 1;
          for (; i >= 0; --i) {
              if (items[i].depth <= meDepth) {
                  break;
              }
          }
          $scope.links.prev = i >= 0 && items[i].depth >= 0 ? items[i] : null;
      }

      $scope.$on('lukio:stateSet', checkPrevNext);
      checkPrevNext();
  };

  export const epLukioKurssiController = ($scope, $stateParams, epLukioUtils, Kieli, Utils, MurupolkuData, oppiaine) => {
      $scope.oppiaine = oppiaine;
      var kurssit = epLukioUtils.reduceKurssit($scope.oppiaineRakenne.oppiaineet);

      const filterKurssit = (id) =>
          _.filter(kurssit, (kurssi: any) => '' + kurssi.id === '' + id);

      $scope.kurssi = filterKurssit($stateParams.kurssiId)[0];

      var murupolkuParams = {
          parents: null,
          kurssiId: $scope.kurssi.id,
          kurssiNimi: $scope.kurssi.nimi,
          oppiaineId: $scope.kurssi.oppiaineId,
          oppiaineNimi: $scope.kurssi.oppiaineNimi
      };

      MurupolkuData.set(murupolkuParams);
  };

  export const epLukioTavoitteetController = ($scope, tavoitteet, MurupolkuData) => {
      $scope.tavoitteet = tavoitteet;
      MurupolkuData.set({tekstiNimi: tavoitteet.otsikko, tekstiId: tavoitteet.id});
  };

  export const epLukioAihekokonaisuudetController = ($scope, MurupolkuData, yleiskuvaus, aihekokonaisuudet) => {
      $scope.yleiskuvaus = yleiskuvaus;
      $scope.aihekokonaisuudet = aihekokonaisuudet;
      MurupolkuData.set({
          tekstiNimi: aihekokonaisuudet.otsikko,
          tekstiId: aihekokonaisuudet.id
      });
  };

  export const epLukioTiedotController = ($scope) => {
    let currentTime = new Date().getTime();
    $scope.voimassaOleva = !!(!$scope.peruste.voimassaoloLoppuu
    || $scope.peruste.voimassaoloAlkaa
    && currentTime > $scope.peruste.voimassaoloAlkaa
    && currentTime < $scope.peruste.voimassaoloLoppuu);
  };

  export const epLukioOppiaineController = ($scope, $location, epLukioStateService, Utils, epEsitysSettings, oppiaine, $state, Kieli, epParentFinder, epTekstikappaleChildResolver, $stateParams, $rootScope, MurupolkuData, epSivunaviUtils) => {
      $scope.inSisallot = true;
      $scope.valittuOppiaine = oppiaine;
      $scope.oppimaarat = _.map($scope.valittuOppiaine, 'oppimaarat');
      $scope.kurssit = _.map($scope.valittuOppiaine, 'kurssit');

      const NameMap = {
          0: 'PAKOLLINEN',
          1: 'VALTAKUNNALLINEN_SYVENTAVA',
          2: 'VALTAKUNNALLINEN_SOVELTAVA'
      };

      $scope.filterKurssit = (kurssit, tyyppi) =>
          _.filter(kurssit || [], (kurssi: any) => kurssi && kurssi.tyyppi === NameMap[tyyppi]);

      var murupolkuParams = {
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi[Kieli.getSisaltokieli()]
      };

      MurupolkuData.set(murupolkuParams);

      $scope.tekstikappale = oppiaine;
      $scope.lapset = epTekstikappaleChildResolver.getSisalto();
      $scope.links = {
          prev: null,
          next: null
      };

      MurupolkuData.set('parents', epParentFinder.find($scope.oppiaineet.lapset, $scope.tekstikappale.id, true));

      var doRefresh = function (items) {
        var levels = {};
        if (items.length && !items[0].root) {
          items.unshift({root: true, depth: -1});
        }
        _.each(items, function (item, index) {
          item.depth = item.depth || 0;
          levels[item.depth] = index;
          if (_.isArray(item.link)) {
            item.href = $state.href.apply($state, item.link);
            if (item.link.length > 1) {
              // State is matched with string parameters
              _.each(item.link[1], function (value, key) {
                item.link[1][key] = value === null ? '' : ('' + value);
              });
            }
          }
          item.$parent = levels[item.depth - 1] || null;
          item.$hidden = item.depth > 0;
          item.$matched = true;
        });
        updateModel(items);
      };

      $scope.refresh = function () {
          if (_.isArray($scope.items)) {
              doRefresh($scope.items);
          }
          else {
              _.each($scope.sections, function (section) {
                  if (section.items) {
                      doRefresh(section.items);
                  }
              });
          }
      };

      function hideNodeOrphans(items, index) {
          // If the parent is hidden, then the child is implicitly hidden
          var item = items[index];
          for (index++; index < items.length &&
               items[index].depth > item.depth; ++index) {
              if (!items[index].$hidden) {
                  items[index].$impHidden = true;
              }
          }
      }

      function hideOrphans(items) {
          for (var i = 0; i < items.length; ++i) {
              if (items[i].$collapsed) {
                  hideNodeOrphans(items, i);
              }
          }
      }

      function updateModel(items, doUncollapse = true) {
          if (!items) {
              return;
          }
          _.each(items, function (item) {
              if (item.depth > 0) {
                  item.$hidden = true;
              }
              item.$collapsed = true;
              item.$header = false;
          });
          if (doUncollapse) {
              var active = _.find(items, function (item) {
                  return epSivunaviUtils.isActive(item);
              });
              if (active) {
                  epSivunaviUtils.unCollapse(items, active);
              }
          }
          epSivunaviUtils.traverse(items, 0);
          hideOrphans(items);
      }

      $scope.toggle = function (items, item, $event, state) {
          if ($event) {
              $event.preventDefault();
          }
          var index = _.indexOf(items, item);
          state = _.isUndefined(state) ? !item.$collapsed : state;
          if (index >= 0 && index < (items.length - 1)) {
              index = index + 1;
              while (index < items.length &&
                     items[index].depth > item.depth) {
                  if (items[index].depth === item.depth + 1) {
                      items[index].$hidden = state;
                  }
                  index++;
              }
          }
          updateModel(items, false);
      };

      $scope.toggleSideMenu = function () {
          $scope.menuCollapsed = !$scope.menuCollapsed;
      };

      $scope.orderFn = function (item) {
          return _.isNumber(item.order) ? item.order : Utils.nameSort(item, 'label');
      };

      $scope.$on('$stateChangeStart', function () {
          $scope.menuCollapsed = true;
      });

      $scope.$on('$stateChangeSuccess', function (event, toState) {
          if (toState.name !== epEsitysSettings.lukioState) {
              Utils.scrollTo('#ylasivuankkuri');
          }
      });
      updateModel($scope.items);
  };
}
