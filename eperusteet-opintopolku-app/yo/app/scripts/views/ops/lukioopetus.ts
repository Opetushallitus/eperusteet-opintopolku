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
  .controller('OpsLukioopetusController', function(
    $scope,
    $timeout,
    $state,
    $stateParams,
    $rootScope,
    LukioOpsMenuBuilder,
    Utils,
    MurupolkuData,
    TermistoService,
    Kieli,
    $document,
    epLukioStateService,
    epEsitysSettings,
    opsUtils,
    lukioOps,
    otsikot,
    epMenuBuilder,
    epLukioTabService,
    rakenne) {

    $scope.ops = lukioOps;
    $scope.otsikot = otsikot;
    $scope.oppiaineet = rakenne.oppiaineet;
   /* $scope.tavoitteet = yleisetTavoitteet;
    $scope.aihekokonaisuudet = aihekokonaisuudet;*/
    console.log($scope.oppiaineet);

    $scope.state = epLukioStateService.getState();

    $rootScope.$on('$locationChangeSuccess', function () {
      epLukioStateService.setState($scope.navi);
    });

    $scope.isNaviVisible = _.constant(true);

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
      return classes;
    };

    $scope.addIconClass = (item) => {
      const convertToClassName = (item) => {
        var t = ["kurssi" + item.toLowerCase().replace("_", "-")];
        console.log(t);
        return t;
      };
      let kurssiWithTyyppi = item.$kurssi && item.$kurssi.tyyppi;
      console.log(item, kurssiWithTyyppi);
      return kurssiWithTyyppi ? convertToClassName(item) : null;
      };

    $scope.tabs = epLukioTabService.tabs;
    $scope.tabClass = epLukioTabService.tabClassSelector;

    $scope.navi = {
      header: 'opetussuunnitelma',
      showOne: true,
      sections: [{
        id: 'suunnitelma',
        include: 'eperusteet-esitys/views/lukionyhteisetosuudet.html',
        items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
        naviClasses: $scope.naviClasses,
        title: 'yhteiset-osuudet'
      }, {
        title: 'oppiaineet-ja-oppimaarat',
        id: 'sisalto',
        include: 'views/ops/lukio/oppiaineetsivunavi.html',
        items: LukioOpsMenuBuilder.buildLukioOppiaineMenu($scope.oppiaineet),
        naviClasses: $scope.naviClasses
      }]
    };

    $scope.navi.sections[0].items.unshift({
      depth: 0,
      label: 'opetussuunnitelman-tiedot',
      link: ['root.ops.lukioopetus.tiedot']
    });

    console.log($scope.navi.sections);

  })

  .controller('opsLukioTekstikappaleController', function(
    $scope,
    tekstikappale) {
    $scope.tekstikappale = tekstikappale;

    $scope.links = {
      prev: null,
      next: null
    };

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

  })

  .controller('OpsLukioAihekokonaisuudetController', function(
    $scope) {

  })

  .controller('OpsLukioOppiaineController', function(
    $scope) {

  })

  .service('LukioOpsMenuBuilder', function (Algoritmit, $state, Kieli, Utils, epEsitysSettings) {
    function oppiaineSort(aineet) {
      // Handle mixed jnro + no jnro situations
      function jnroSort(item) {
        return _.isNumber(item.jnro) ? item.jnro : 100000000;
      }
      return _(aineet).sortBy(jnroSort).sortBy(Utils.nameSort).sortBy(jnroSort).value();
    }

    function createOppiaineItem(oppiaine, depth, idx) {
      return {
        $id: oppiaine.id,
        depth: depth,
        $jnro: oppiaine.jarjestys,
        $oppiaine: oppiaine,
        $hidden: false,
        idx: idx,
        label: oppiaine.nimi,
        url: $state.href('root.ops.lukioopetus.oppiaine', {oppiaineId: oppiaine.id})
      };
    }

    function createKurssiItem(kurssi, depth) {
      return {
        $id: kurssi.id,
        depth: depth,
        tyyppi: kurssi.tyyppi,
        $jnro: kurssi.jarjestys,
        $kurssi: kurssi,
        $hidden: true,
        label: kurssi.nimi,
        url: $state.href('root.lukio.kurssi', {kurssiId: kurssi.id})
      };
    }

    function buildLukioOppiaineMenu(oppiaineet){
      var idx = 0;
      return _.reduce(oppiaineet, function(menu, oppiaine){
        menu.push(createOppiaineItem(oppiaine, 0, idx));
        idx++;
        if(!_.isEmpty(oppiaine.oppimaarat)) {
          _.each(oppiaine.oppimaarat, function(oppimaara){
            menu.push(createOppiaineItem(oppimaara, 1));
            if(!_.isEmpty(oppimaara.kurssit)) {
              _.each(oppimaara.kurssit, function(kurssi) {
                menu.push(createKurssiItem(kurssi, 2));
              });
            }
          });
        }
        if(!_.isEmpty(oppiaine.kurssit)){
          _.each(oppiaine.kurssit, function(kurssi){
            menu.push(createKurssiItem(kurssi, 1));
          });
        }
        return menu;
      }, []);
    }

    this.buildLukioOppiaineMenu = buildLukioOppiaineMenu;
    console.log()
  });
