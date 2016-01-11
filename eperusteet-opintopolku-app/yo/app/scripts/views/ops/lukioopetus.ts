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
    LukioOpsMenuBuilder,
    epMenuBuilder,
    Utils,
    MurupolkuData,
    TermistoService,
    Kieli,
    $document,
    OpsLukioStateService,
    opsUtils,
    rakenne) {

    $scope.oppiaineet = rakenne.oppiaineet;
    $scope.state = OpsLukioStateService.getState();

    $scope.getCurrentEndState = () => {
      return _.last(_.words($state.current.name));
    };

    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };


    $scope.addkurssityyppiIcon = function(item){
      var convertToClassName = function(item){
        return ["lg-kurssi-" + item.toLowerCase().replace("_", "-")];
      };
      return !!item.tyyppi ? convertToClassName(item.tyyppi) : null;
    };

    $scope.$on('$stateChangeSuccess', function () {
      OpsLukioStateService.setState($scope.navi);
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

    MurupolkuData.set({opsId: $scope.ops.id, opsNimi: $scope.ops.nimi});

    $scope.tabConfig = {oppiaineUrl: 'root.ops.lukioopetus.oppiaine', kurssiUrl: 'root.ops.lukioopetus.kurssi'};
    $scope.wrongState = function(){
      return _.intersection(_.words($state.current.name), ['tavoitteet', 'aihekokonaisuudet']).length;
    };

    $scope.navi = {
      header: 'opetussuunnitelma',
      showOne: true,
      sections: [{
        id: 'suunnitelma',
        include: 'views/ops/opstekstisisalto.html',
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

    $scope.$on('$stateChangeSuccess', function () {
      var id = _.intersection(_.keys($state.params), ['oppiaineId', 'kurssiId']);
      OpsLukioStateService.setState($scope.navi);
      if ($state.is('root.ops.lukioopetus') && !id.length) {
        $state.go('.tiedot', {location: 'replace'});
      }
    });

    $scope.chooseFirstOppiaine = function (section) {
      var oppiaine = '' + section.id === 'sisalto';
      var tiedot = '' + section.id === 'suunnitelma';
      var states = _.words($state.current.name);
      var suunnitelmaEndStates = ['tekstikappale', 'tiedot'];
      var aine = _.find($scope.navi.sections[1].items, {depth: 0});
      if (aine && oppiaine) {
        var params = {opsId: $scope.ops.id, oppiaineId: aine.$oppiaine.id};
        $timeout(function () {
          $state.go('root.ops.lukioopetus.oppiaine', params);
        });
      }
      if (tiedot && !_.intersection(states, suunnitelmaEndStates).length){
        $timeout(function () {
          $state.go('root.ops.lukioopetus.tiedot', {location: 'replace'});
        });
      }
    };

    $scope.onSectionChange = function (section) {
      return !section.$open ? $scope.chooseFirstOppiaine(section) : null;
    }

  })

  .controller('OpsLukioTekstikappaleController', function(
    $scope,
    tekstikappaleWithChildren,
    MurupolkuData) {
    $scope.tekstikappale = tekstikappaleWithChildren.tekstiKappale;
    $scope.lapset = tekstikappaleWithChildren.lapset;

    $scope.$on('$stateChangeSuccess', function () {
      setMurupolku();
    });

    function setMurupolku() {
      MurupolkuData.set({osanId: $scope.tekstikappale.id, tekstikappaleNimi: $scope.tekstikappale.nimi});

      $scope.sectionItem = _.reduce($scope.navi.sections[0].items, function (result, item, index) {
        if (item.$selected === true) {
          item.index = index;
          result = item;
        }
        return result;
      }, '');

      function findParent(set, child) {
        return set[child.$parent].$osa.tekstiKappale;
      }
      if ($scope.sectionItem && $scope.sectionItem.depth > 1) {
        MurupolkuData.set('parents', [findParent($scope.navi.sections[0].items, $scope.sectionItem)]);
      }
    }

  })

  .controller('OpsLukioTavoitteetController', function($scope, tavoitteet) {
    $scope.tavoitteet = tavoitteet;
  })

  .controller('OpsLukioAihekokonaisuudetController', function($scope, aihekokonaisuudet) {
    $scope.aihekokonaisuudet = aihekokonaisuudet.paikallinen.aihekokonaisuudet;
  })


  .controller('OpsLukioOppiaineController', function(
    $scope,
    $timeout,
    $stateParams,
    MurupolkuData,
    epLukioUtils) {
    const oppiaineetList = epLukioUtils.flattenAndZipOppiaineet($scope.oppiaineet);
    $scope.valittuOppiaine = oppiaineetList[$stateParams.oppiaineId];
    $scope.oppimaarat = $scope.valittuOppiaine.oppimaarat;
    $scope.filterKurssit = function(kurssit, tyyppi){
      var tyyppiList = [
        'VALTAKUNNALLINEN_PAKOLLINEN',
        "PAIKALLINEN_PAKOLLINEN",
        "VALTAKUNNALLINEN_SYVENTAVA",
        "PAIKALLINEN_SYVENTAVA",
        "VALTAKUNNALLINEN_SOVELTAVA",
        "PAIKALLINEN_SOVELTAVA"
      ];
      return _.filter(kurssit, (kurssi) => kurssi.tyyppi === tyyppiList[parseInt(tyyppi)])
    };
    MurupolkuData.set({oppiaineId: $stateParams.oppiaineId, oppiaineNimi: $scope.valittuOppiaine.nimi});
  })

  .controller('OpsLukioKurssiController', function(
    $scope,
    $timeout,
    $stateParams,
    MurupolkuData,
    epLukioUtils) {
    const oppiaineetList = epLukioUtils.flattenAndZipOppiaineet($scope.oppiaineet);
    const kurssit = _.indexBy(epLukioUtils.reduceKurssit($scope.oppiaineet), 'id');
    $scope.kurssi = kurssit[$stateParams.kurssiId];
    /*const createParentList = () => {
      return _.map(oppiaineetList, function(op, id){
        return {id: id, nimi: op.nimi, kurssit: _.pluck(op.kurssit, 'id')};
      })
    };
    const parentList = createParentList();
    const parent = _.filter(parentList, (op) => {
      return _.includes(op.kurssit, $scope.kurssi.id);
    });
    MurupolkuData.set('parents', parent);*/
    MurupolkuData.set({kurssiId: $stateParams.kurssiId, kurssiNimi: $scope.kurssi.nimi});
  })

  .service('LukioOpsMenuBuilder', function (Algoritmit, $state, Kieli, Utils) {
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
        url: $state.href('root.ops.lukioopetus.kurssi', {kurssiId: kurssi.id})
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
  });
