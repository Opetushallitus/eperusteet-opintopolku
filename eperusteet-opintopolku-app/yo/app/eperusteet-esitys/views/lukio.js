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

angular.module('eperusteet.esitys')
  .controller('epLukioController', function(
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
    MurupolkuData,
    epLukioStateService,
    oppiaineRakenne,
    Kieli) {

    $scope.oppiaineRakenne = oppiaineRakenne;
    $scope.isNaviVisible = _.constant(true);
    $scope.perusteenSisalto = perusData;
    $scope.oppiaineet = _.zipBy($scope.oppiaineRakenne.oppiaineet, 'id');
    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };

    $timeout(function () {
      if ($state.current.name === epEsitysSettings.lukioState) {
        var first = _($scope.navi.sections[0].items).filter(function (item) {
          return item.depth === 0;
        }).first();
        if (first) {
          $state.go('.tekstikappale', {tekstikappaleId: $scope.perusteenSisalto.lapset[0].id}, {location: 'replace'});
        }
      }
    });

    $scope.state = epLukioStateService.getState();

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
    }

    $scope.wrongState = function(){
      return _.intersection(_.words($state.current.name), ['tavoitteet', 'aihekokonaisuudet']).length;
    }


    $scope.tabs = [
      {
        title: {
          oppiaine: 'oppiaine-sisalto',
          kurssi: 'kurssi-sisalto'
        },
        name: 'sisalto',
        url: function(name){
          if (name === 'kurssi') {
            return 'root.lukio.kurssi'
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine'
          }
        }
      },
      {
        title: {
          oppiaine: 'opetuksen-yleiset-tavoitteet',
          kurssi: 'opetuksen-yleiset-tavoitteet'
        },
        name: 'tavoitteet',
        url: function (name) {
          if (name === 'kurssi') {
            return 'root.lukio.kurssi.tavoitteet'
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine.tavoitteet'
          }
        }
      },
      {
        title:  {
          oppiaine: 'aihekokonaisuudet',
          kurssi: 'aihekokonaisuudet'
        },
        name: 'aihekokonaisuudet',
        url: function (name) {
          if (name === 'kurssi') {
            return 'root.lukio.kurssi.aihekokonaisuudet'
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine.aihekokonaisuudet'
          }
        }
      }
    ];

    $scope.kurssiTyypit = ['pakollinen', 'syventava', 'soveltava'];

    $scope.tabClass = function(tabName) {
      var className = null;
      switch(tabName) {
        case 'tavoitteet':
          className = _.endsWith($state.current.name, tabName) ? true : null;
          break;
        case 'aihekokonaisuudet':
          className = _.endsWith($state.current.name, tabName) ? true : null;
          break;
        case 'sisalto':
          className = !_.endsWith($state.current.name, 'tavoitteet') && !_.endsWith($state.current.name, 'aihekokonaisuudet') ? true : null;
          break;
        default:
          className = null;
      }
      return className;
    };

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

    var t = epMenuBuilder.buildLukioOppiaineMenu($scope.oppiaineRakenne.oppiaineet);

    $scope.navi = {
      header: 'perusteen-sisalto',
      showOne: true,
      sections: [{
        id: 'suunnitelma',
        include: 'eperusteet-esitys/views/yhteisetosuudet.html',
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

})

  .directive('epLukioSivunavigaatio', function ($window, $document, $timeout, $compile) {
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
      controller: 'epLukioSivuNaviController',
      transclude: true,
      link: function (scope, element, attrs) {
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

  .controller('epLukioTekstikappaleController', function($scope, $stateParams, tekstikappale, epTekstikappaleChildResolver,
                                                               MurupolkuData, epParentFinder) {

    $scope.tekstikappale = tekstikappale;
    MurupolkuData.set({tekstikappaleId: tekstikappale.id, tekstikappaleNimi: tekstikappale.nimi});
    $scope.lapset = epTekstikappaleChildResolver.getSisalto();
    $scope.links = {
      prev: null,
      next: null
    };

    MurupolkuData.set('parents', epParentFinder.find($scope.perusteenSisalto.lapset, tekstikappale.id, true));

    function checkPrevNext() {
      var items = $scope.navi.sections[0].items;
      var me = _.findIndex(items, function (item) {
        return item.$osa && item.$osa.perusteenOsa && item.$osa.perusteenOsa.id === $scope.tekstikappale.id;
      });
      if (me === -1) {
        return;
      }
      var i = me + 1;
      var meDepth = items[me].depth;
      //Why not include children?
      /*for (; i < items.length; ++i) {
        if (items[i].depth <= meDepth) {
          break;
        }
      }*/
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
  })

  .controller('epLukioKurssiController', function($scope, Kieli, $stateParams, Utils, MurupolkuData) {

    $scope.valittuOppiaine = $scope.oppiaineet[$stateParams.oppiaineId];

    function reduceKurssit() {
      return _.reduce($scope.oppiaineRakenne.oppiaineet, function(kaikkiKurssit, oppiaine){
        if(!_.isEmpty(oppiaine.oppimaarat)) {
          _.each(oppiaine.oppimaarat, function(oppimaara){
            if(!_.isEmpty(oppimaara.kurssit)) {
              _(oppimaara.kurssit)
                .map(function(kurssi){
                kurssi.oppiaineNimi = oppimaara.nimi;
                return kurssi;
                })
                .each(function(kurssi) {
                kaikkiKurssit.push(kurssi);
              }).value()
            }
          })
        }
        if(!_.isEmpty(oppiaine.kurssit)){
            _(oppiaine.kurssit)
              .map(function(kurssi) {
                kurssi.oppiaineNimi = oppiaine.nimi;
                return kurssi
              })
              .each(function(kurssi){
              kaikkiKurssit.push(kurssi);
              }).value()
        }
        return kaikkiKurssit;
      }, []);
    }
    var kurssit = reduceKurssit();
    function filterKurssit(id){
      return _.filter(kurssit, function(kurssi) {
        console.log(kurssi);
        return '' + kurssi.id === '' + id })
      }

    $scope.kurssi = filterKurssit($stateParams.kurssiId)[0];
    console.log($scope.kurssi);

    var murupolkuParams = {
      parents: null,
      kurssiId: $scope.kurssi.id,
      kurssiNimi: $scope.kurssi.nimi,
      oppiaineId: $scope.kurssi.oppiaineId,
      oppiaineNimi: $scope.kurssi.oppiaineNimi
    };

    MurupolkuData.set(murupolkuParams);

  })

  .controller('epLukioTavoitteetController', function($scope, tavoitteet, MurupolkuData) {
    $scope.tavoitteet = tavoitteet;

    MurupolkuData.set({tekstiNimi: tavoitteet.otsikko, tekstiId: tavoitteet.id});
  })

  .controller('epLukioAihekokonaisuudetController', function($scope, aihekokonaisuudet, MurupolkuData) {
    $scope.aihekokonaisuudet = aihekokonaisuudet;
    MurupolkuData.set({tekstiNimi: aihekokonaisuudet.otsikko, tekstiId: aihekokonaisuudet.id});
  })

  .controller('epLukioOppiaineController', function($scope, $location, epLukioStateService, oppiaine, $state, Kieli, epParentFinder, epTekstikappaleChildResolver, $stateParams, $rootScope, MurupolkuData) {
    $scope.inSisallot = true;

    $scope.valittuOppiaine = $scope.oppiaineet[$stateParams.oppiaineId];

    $scope.kurssit = _.pick($scope.valittuOppiaine, 'kurssit').kurssit;
    $scope.oppimaarat = _.pick($scope.valittuOppiaine, 'oppimaarat').oppimaarat;

    $scope.filterKurssit = function(kurssit, tyyppi){
      var list = [];
      switch(tyyppi) {
        case 0:
          list = _.filter(kurssit, function (kurssi) {
            return kurssi.tyyppi === 'PAKOLLINEN';
          });
          break;
        case 1:
          list = _.filter(kurssit, function (kurssi) {
            return kurssi.tyyppi === 'VALTAKUNNALLINEN_SYVENTAVA';
          });
          break;
        case 2:
          list = _.filter(kurssit, function (kurssi) {
            return kurssi.tyyppi === 'VALTAKUNNALLINEN_SOVELTAVA';
          });
          break;
        default:
          list = "undefined";
      }
      return list;
    };

   /* $scope.scrollToKurssi = function(id) {
      id ? $location.hash(id) : null;
      id ? anchorSmoothScroll.scrollTo(id) : null;
      id ? $rootScope.$broadcast('$locationChangeSuccess') : null;
    };*/

      var murupolkuParams = {
        //parents: null,
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

  })

  .controller('epLukioSivuNaviController', function ($rootScope, $scope, $location, $state, Algoritmit, Utils, epSivunaviUtils,
                                                epEsitysSettings) {
    $scope.menuCollapsed = true;
    $scope.onSectionChange = _.isFunction($scope.onSectionChange) ? $scope.onSectionChange : angular.noop;

    /*$scope.scrollToKurssi = function(id){
      id ? $location.hash(id) : null;
      id ? anchorSmoothScroll.scrollTo(id) : null;
      id ? $rootScope.$broadcast('$locationChangeSuccess') : null;
    };*/

    $scope.search = {
      term: '',
      update: function () {
        var matchCount = 0;
        var items = $scope.items;
        if (_.isUndefined(items)) {
          var section = _.find($scope.sections, '$open');
          if (section) {
            items = section.items;
          }
        }
        _.each(items, function (item) {
          item.$matched = _.isEmpty($scope.search.term) || _.isEmpty(item.label) ? true :
            Algoritmit.match($scope.search.term, item.label);
          if (item.$matched) {
            matchCount++;
            var parent = items[item.$parent];
            while (parent) {
              parent.$matched = true;
              parent = items[parent.$parent];
            }
          }
        });
        $scope.hasResults = matchCount > 1; // root matches always
        updateModel(items);
      }
    };

    $scope.$watch('search.term', _.debounce(function () {
      $scope.$apply(function () {
        $scope.search.update();
      });
    }, 100));


    $scope.itemClasses = function (item) {
      var classes = ['level' + item.depth];
      if (item.$matched && $scope.search.term) {
        classes.push('matched');
      }
      if (item.$active) {
        classes.push('active');
      }
      if (item.$header) {
        classes.push('tekstisisalto-active-header');
      }
      return classes;
    };

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
      } else {
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

    function updateModel(items, doUncollapse) {
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
      doUncollapse = _.isUndefined(doUncollapse) ? true : doUncollapse;
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
      updateModel($scope.items);
    });

    $scope.$watch('items', function () {
      $scope.refresh();
    }, true);
    $scope.$watch('sections', function () {
      $scope.refresh();
    }, true);
  });
