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
    perusData,
    peruste,
    lukioOppiaineet,
    lukioKurssit,
    epEsitysSettings,
    epMenuBuilder,
    MurupolkuData,
    epLukioStateService,
    Kieli,
    PerusteenOsat) {

    $scope.isNaviVisible = _.constant(true);
    $scope.perusteenSisalto = perusData;
    $scope.oppiaineet = lukioOppiaineet;
    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };
    $scope.lukioKurssit = lukioKurssit;

      $scope.tabs = [
        {
          title: "Oppimäärän sisalto",
          name: "sisalto",
          url: $state.href('root.lukio')
        },
        {
          title: "Opetuksen yleiset tavoitteet",
          name: "tavoitteet",
          url: $state.href('root.lukio.tavoitteet')
        },
        { title: "Aihekokonaisuudet",
          name: "aihekokonaisuudet",
          url: $state.href('root.lukio.aihekokonaisuudet')
        }
      ];

      $scope.tabClass = function(tabName) {
        var params = _.words($state.current.name);
        var className = null;
        switch(tabName) {
          case "tavoitteet":
            className = _.indexOf(params, tabName) > -1 ? true : null;
            break;
          case "aihekokonaisuudet":
            className = _.indexOf(params, tabName) > -1 ? true : null;
            break;
          case "sisalto":
            className =  (_.indexOf(params, "tavoitteet") === -1 && _.indexOf(params, "aihekokonaisuudet") === -1)
              ? true : null;
            break;
          default:
            className = null;
        }
        console.log("tabName", className, tabName, params);
        return className;
    };


    $scope.navClass = function (title) {
      return active;
    };
    
    //FIX
    MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});

    //CHANGE FOR LUKIO
    $scope.state = epLukioStateService.getState();

    $scope.$on('$stateChangeSuccess', function () {
      epLukioStateService.setState($scope.navi);
    });

    $scope.naviClasses = function (item) {
      var classes = ['depth' + item.depth];
      if (item.$selected) {
        classes.push('tekstisisalto-active');
      }
      if (item.$header) {
         classes.push('tekstisisalto-active-header');
      }
      return classes;
    };

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
        items: epMenuBuilder.buildLukioOppiaineMenu($scope.oppiaineet,$scope.lukioKurssit),
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
        scope.disableRajaus = !_.isEmpty(attrs.disableRajaus);

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

  .controller('epLukioTekstikappaleController', function($scope, $stateParams, tekstikappale, epLukioTekstikappaleChildResolver,
                                                               MurupolkuData) {
    $scope.tekstikappale = tekstikappale;
    MurupolkuData.set({tekstikappaleId: tekstikappale.id, tekstikappaleNimi: tekstikappale.nimi});
    $scope.lapset = epLukioTekstikappaleChildResolver.getSisalto();
    $scope.links = {
      prev: null,
      next: null
    };

    //FIXME or EVEN needed?
    //MurupolkuData.set('parents', epParentFinder.find($scope.tekstisisalto.lapset, tekstikappale.id, true));

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

  .controller('epLukioKurssiController', function($scope, Kieli, kurssi, $stateParams, Utils, MurupolkuData) {
    //$scope.vlk = $scope.vuosiluokkakokonaisuudetMap[$stateParams.vlkId];
    //MurupolkuData.set({vlkId: $scope.vlk.id, vlkNimi: $scope.vlk.nimi});

    $scope.tekstikappale = kurssi;

    var murupolkuParams = {
      parents: null,
      kurssiId: kurssi._id,
      kurssiNimi: kurssi.nimi[Kieli.getSisaltokieli()]
    }

    MurupolkuData.set(murupolkuParams);
  })

  .controller('epLukioTavoitteetController', function($scope, tavoitteet) {
    $scope.tavoitteet = tavoitteet;
  })

  .controller('epLukioAihekokonaisuudetController', function($scope, aihekokonaisuudet) {
    $scope.aihekokonaisuudet = aihekokonaisuudet;
  })

  .controller('epLukioOppiaineController', function($scope, oppiaine, Kieli, epLukioTekstikappaleChildResolver, $stateParams, $rootScope, MurupolkuData) {
    $scope.inSisallot = true;

    if (oppiaine) {
      var murupolkuParams = {
        parents: null,
        oppiaineId: oppiaine.id,
        oppiaineNimi: oppiaine.nimi[Kieli.getSisaltokieli()]
      };
      //MurupolkuData.set({tekstikappaleId: tekstikappale.id, tekstikappaleNimi: tekstikappale.nimi});
      MurupolkuData.set(murupolkuParams);
      $scope.tekstikappale = oppiaine;
      $scope.lapset = epLukioTekstikappaleChildResolver.getSisalto();
      console.log($scope.lapset);
      $scope.links = {
        prev: null,
        next: null
      };

      //FIXME
      //MurupolkuData.set('parents', epParentFinder.find($scope.tekstisisalto.lapset, tekstikappale.id, true));

      function checkPrevNext() {
        var items = $scope.navi.sections[1].items;
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
    }
/*
    function makeQueryArray(param, isNumber) {
      var arr = _.isArray(param) ? param : [param];
      return _.compact(isNumber ? _.map(arr, _.ary(parseInt, 1)) : arr);
    }

    var vlks = makeQueryArray($stateParams.vlk, true);

    $rootScope.$broadcast('navifilters:set', {
      vlk: vlks,
      sisalto: makeQueryArray($stateParams.sisalto),
      osaaminen: makeQueryArray($stateParams.osaaminen, true)
    });

    if (!oppiaine) {
      $scope.chooseFirstOppiaine();
    } else {
      $scope.processOppiaine(oppiaine, vlks, $stateParams.valittu || true);
    }
    */
  })

  .controller('epLukioSivuNaviController', function ($scope, $state, Algoritmit, Utils, epSivunaviUtils,
                                                epEsitysSettings) {
    $scope.menuCollapsed = true;
    $scope.onSectionChange = _.isFunction($scope.onSectionChange) ? $scope.onSectionChange : angular.noop;

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
          // hack for perusopetus sisallot
          if (section.model && _.isArray(section.model.sections) && section.model.sections.length > 1) {
            doRefresh(section.model.sections[1].items);
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
      if (toState.name !== epEsitysSettings.perusopetusState + '.sisallot') {
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
