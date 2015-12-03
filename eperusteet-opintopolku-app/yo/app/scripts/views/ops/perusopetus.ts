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
  .controller('OpsPerusopetusController', function(
    $q,
    $scope,
    $timeout,
    $state,
    $stateParams,
    epMenuBuilder,
    Utils,
    MurupolkuData,
    TermistoService,
    Kieli,
    $document,
    $rootScope,
    opsStateService,
    epEsitysSettings,
    opsUtils,
    otsikot,
    perusOps) {

    $scope.isNaviVisible = _.constant(true);
    $scope.hasContent = function (obj) {
      return _.isObject(obj) && obj.teksti && obj.teksti[Kieli.getSisaltokieli()];
    };
    $scope.otsikot = otsikot;
    $scope.ops = perusOps;
    $scope.vlkMap = _.map($scope.ops.vuosiluokkakokonaisuudet, function(v){
      return {
        nimi: v.vuosiluokkakokonaisuus.nimi,
        tunniste: v.vuosiluokkakokonaisuus._tunniste
      };
    });

    $scope.oppiaineet = _.map($scope.ops.oppiaineet, 'oppiaine');
    $scope.vlkt = opsUtils.sortVlk($scope.ops.vuosiluokkakokonaisuudet);

    $scope.$on('$stateChangeSuccess', function () {
      opsStateService.setState($scope.navi);
      if ($state.current.name === 'root.ops.perusopetus') {
        $state.go('.tiedot', {location: 'replace'});
      }
      if (_.endsWith(_.keys($state.params), 'vuosi')){
        var vuosi = $state.params.vuosi;
        moveToOppiaine(vuosi);
      }
    });

    MurupolkuData.set({opsId: $scope.ops.id, opsNimi: $scope.ops.nimi});

    TermistoService.setPeruste(perusOps, true);

    $scope.naviClasses = function (item) {
      var classes = ['depth' + item.depth];
      if (item.$selected) {
        classes.push('tekstisisalto-active');
      }
      if (item.$header) {
        classes.push('tekstisisalto-active-header');
      }
      if (!item.$selected && item.$tyyppi && (item.$tyyppi !== 'yhteinen')) {
        classes.push('perusopetus-paikallinen')
      }
      if (item.$selected && item.$tyyppi && (item.$tyyppi !== 'yhteinen')) {
        classes.push('perusopetus-paikallinen-active')
      }
      return classes;
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

    function moveToOppiaine(vuosi) {
      var vlk = 'vuosiluokka_' + vuosi;
      var firstOppiaine = _.find($scope.navi.sections[1].items, {$parent_vuosi: vlk});
      if (firstOppiaine.$tyyppi === "yhteinen") {
        return firstOppiaine ? $state.go('root.ops.perusopetus.vuosiluokka.oppiaine',
          {opsId: $state.params.opsId, oppiaineId: firstOppiaine.$oppiaine.id}) : null;
      } else {
        return firstOppiaine ? $state.go('root.ops.perusopetus.vuosiluokka.valinainenoppiaine',
          {opsId: $state.params.opsId, oppiaineId: firstOppiaine.$oppiaine.id}) : null;
      }
    }

    $scope.onSectionChange = function (section) {
      if (section.id === 'vlkoppiaine' && !section.$open) {
        moveToOppiaine(section);
      }
    };

    $scope.navi = {
      header: 'opetussuunnitelma',
      showOne: true,
      sections: [
        {
          id: 'tekstikappale',
          include: 'views/ops/opstekstisisalto.html',
          items: epMenuBuilder.rakennaYksinkertainenMenu($scope.otsikot),
          naviClasses: $scope.naviClasses,
          title: 'yhteiset-osuudet'
        }, {
          title: 'vuosiluokkakokonaisuudet',
          id: 'vlkoppiaine',
          items: opsUtils.rakennaVuosiluokkakokonaisuuksienMenu($scope.vlkt, $scope.oppiaineet),
          naviClasses: $scope.naviClasses,
          include: 'views/ops/opsvlk.html',
          state: $scope.state
        }
      ]
    };

    $scope.navi.sections[0].items.unshift({
      depth: 0,
      label: 'opetussuunnitelman-tiedot',
      link: ['root.ops.perusopetus.tiedot']
    });

    installClickHandler();

  })

  .controller('OpsPerusopetusTekstikappaleController', function(
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

  .controller('OpsPerusopetusTiedotController', function($scope) {
  })

  .controller('OpsVuosiluokkaController', function($scope, $state, $timeout, Kieli, vuosi, MurupolkuData){
    $timeout(function () {
      if ($state.current.name === 'root.ops.perusopetus.vuosiluokka') {
        var index = null;
        var selectedIndex = _.reduce($scope.navi.sections[1].items, function (result, item, index) {
          return result += item.$selected === true ? index : '';
        }, '');
        if (selectedIndex) {
          $state.go('root.ops.perusopetus.vuosiluokka.oppiaine', {oppiaineId: $scope.navi.sections[1].items[parseInt(selectedIndex) + 1].$oppiaine.id}, {location: 'replace'});
        }
      }
    });

    MurupolkuData.set({vuosiId: vuosi, vuosi: 'Vuosiluokka' + " " + vuosi});
  })

  .controller('OpsVlkController', function(
    $scope,
    vlkId,
    vlkt,
    baseLaajaalaiset,
    MurupolkuData,
    Utils,
    vlkPeruste,
    VuosiluokkakokonaisuusMapper) {

    $scope.vlk = vlkt;
    $scope.peruste = vlkPeruste;
    //$scope.osaamiset = _.zipBy(baseLaajaalaiset, 'tunniste');

    var laajaalaisetosaamiset = _.indexBy(baseLaajaalaiset, 'tunniste');
    var laajaalaisetOrder = _(baseLaajaalaiset).sortBy(Utils.sort).map('tunniste').value();

    $scope.orderFn = function (tunniste) {
      return laajaalaisetOrder.indexOf(tunniste);
    };

    VuosiluokkakokonaisuusMapper.init($scope, laajaalaisetosaamiset, vlkPeruste);

    MurupolkuData.set({vlkId: vlkId, vlkNimi: $scope.vlk.nimi});

  })


  .controller('OpsVlkOppiaineController', function(
    $scope,
    $timeout,
    $state,
    Utils,
    oppiaineId,
    oppiaine,
    oppiainePeruste,
    baseLaajaalaiset,
    MurupolkuData,
    VuosiluokkaMapper) {

    $scope.oppiaine = oppiaine;
    $scope.perusteOppiaine = oppiainePeruste;
    $scope.perusteOppiaineVlkMap = _.indexBy($scope.perusteOppiaine.vuosiluokkakokonaisuudet, '_vuosiluokkakokonaisuus');
    $scope.laajaalaiset = _.indexBy(baseLaajaalaiset, 'tunniste');
    $scope.nimiOrder = Utils.sort;
    $scope.vuosi = 'vuosiluokka_' + $state.params.vuosi;
   /* $scope.vlkMap = _.indexBy($scope.vuosiluokkakokonaisuudet, (vlk) => {
      return vlk.vuosiluokkakokonaisuus._tunniste;
    });*/

    $scope.item = _.reduce($scope.navi.sections[1].items, (result, item, index) => {
      if (item.$selected === true) {
        item.index = index;
        result = item;
      }
      return result;
    }, '');

    function setMurupolku() {
      function findParents(set, index) {
        var slicedSet = _.take(set, parseInt(index));
        var found = _.findLast(slicedSet, function (item) {
          return item.depth === 2;
        });
        return found.$oppiaine;
      }
      var murupolkuParams = {};
      if ($scope.item && $scope.item.depth === 2) {
        murupolkuParams = {
          parents: null,
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi
        };
      }
      if ($scope.item.depth === 3) {
        murupolkuParams = {
          parents: [findParents($scope.navi.sections[1].items, $scope.item.index)],
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi
        };
      }

      MurupolkuData.set(murupolkuParams);
    }

    $scope.$on('$stateChangeSuccess', setMurupolku);


    const getCurrentVlk = (vlk) => {
      var vuodet = vlk.nimi.fi.replace(/\D/g, '').split('') || vlk.nimi.sv.replace(/\D/g, '').split('');
      vuodet = _.map(vuodet, function(v) { return parseInt(v); });
      return parseInt($state.params.vuosi) >= vuodet[0] && parseInt($state.params.vuosi) <= vuodet[1]
    };

    $scope.currentVlk = _($scope.vlkMap)
      .filter(getCurrentVlk)
      .map('tunniste')
      .value()
      .pop();

    $scope.currentVlkCategory = _($scope.vlkMap)
      .filter(getCurrentVlk)
      .map('nimi')
      .value()
      .pop();


    const getVuosiluokat = () => {
      var vuosiluokat = {};
      _.each($scope.oppiaine.vuosiluokkakokonaisuudet, function (opVlk) {
        _.each(opVlk.vuosiluokat, function (vl) {
          vuosiluokat[vl.vuosiluokka] = vl;
        });
      });
      return _.values(vuosiluokat);
    };

    $scope.valittuVlk = _.filter(oppiaine.vuosiluokkakokonaisuudet, (vlk) => {
      return vlk._vuosiluokkakokonaisuus == $scope.currentVlk;
    }).pop();

    $scope.vuosiluokat = getVuosiluokat();

    $scope.perusteOppiaineVlkMap = $scope.perusteOppiaine ?
      _.indexBy($scope.perusteOppiaine.vuosiluokkakokonaisuudet, '_vuosiluokkakokonaisuus') : {};

    const vuosiLuokaNums = (vuosiluokkaEnum) => {
      if (!vuosiluokkaEnum) {
        return undefined;
      }
      return parseInt(_.last(vuosiluokkaEnum.split('_')), 10);
    };

    $scope.vuosiluokkaSisallot = {};

    _.each($scope.oppiaine.vuosiluokkakokonaisuudet, function (opVlk) {
      $scope.vuosiluokkaSisallot[opVlk._vuosiluokkakokonaisuus] = {};
      _.each(opVlk.vuosiluokat, function (vuosiluokka) {
        vuosiluokka.$numero = vuosiLuokaNums(vuosiluokka.vuosiluokka);
        var perusteOpVlk = $scope.perusteOppiaineVlkMap[opVlk._vuosiluokkakokonaisuus];
        $scope.vuosiluokkaSisallot[opVlk._vuosiluokkakokonaisuus][vuosiluokka.vuosiluokka] = {
          vuosiluokka: vuosiluokka,
          perusteOpVlk: perusteOpVlk,
          perusteSisaltoalueet: perusteOpVlk ? _.indexBy(perusteOpVlk.sisaltoalueet, 'tunniste') : [],
          laajaalaiset: $scope.laajaalaiset,
          sisaltoalueet: vuosiluokka.sisaltoalueet,
          onValinnaiselle: $scope.oppiaine.tyyppi !== 'yhteinen'
        };
        VuosiluokkaMapper.mapModel($scope.vuosiluokkaSisallot[opVlk._vuosiluokkakokonaisuus][vuosiluokka.vuosiluokka]);
        VuosiluokkaMapper.mapSisaltoalueet($scope.vuosiluokkaSisallot[opVlk._vuosiluokkakokonaisuus][vuosiluokka.vuosiluokka],
          'sisaltoaluetunnisteet', 'sisaltoaluemuokattavat');
      });
    });
    //TODO
    $scope.missingVlk = () => {};

  })

  .controller('OpsValinainenoppiaineController', function(
    $scope,
    $timeout,
    $state,
    Utils,
    oppiaineId,
    oppiaine,
    MurupolkuData) {

    $scope.oppiaine = oppiaine;
    $scope.vuosi = 'vuosiluokka_' + $state.params.vuosi;
    $scope.sisalto = _($scope.oppiaine.vuosiluokkakokonaisuudet)
      .filter((opVlk) => {
        return _.each(opVlk.vuosiluokat, function(v) {
          return v.vuosiluokka === $scope.vuosi;
        })
      })
      .map('vuosiluokat')
      .flatten()
      .filter((vl) => {
        return vl.vuosiluokka === $scope.vuosi;
      })
      .value()
      .pop();

  })

  .service('VuosiluokkaMapper', function ($state, $stateParams, Utils) {
    function processTavoitteet(scope) {
      var perusteKohdealueet = scope.perusteOppiaine ? _.indexBy(scope.perusteOppiaine.kohdealueet, 'id') : [];
      _.each(scope.tavoitteet, function (item) {
        if (scope.perusteOpVlk) {
          var perusteTavoite = _.find(scope.perusteOpVlk.tavoitteet, function (pTavoite) {
            return pTavoite.tunniste === item.tunniste;
          });
          item.$tavoite = perusteTavoite.tavoite;
          item.$sisaltoalueet = _.map(perusteTavoite.sisaltoalueet, function (tunniste) {
            var sisaltoalue = scope.perusteSisaltoalueet[tunniste] || {};
            //sisaltoalue.$url = $state.href('^.sisaltoalueet') + '#' + tunniste;
            return sisaltoalue;
          });
          item.$kohdealue = perusteKohdealueet[_.first(perusteTavoite.kohdealueet)];
          item.$laajaalaiset = _.map(perusteTavoite.laajaalaisetosaamiset, function (tunniste) {
            var laajaalainen = scope.laajaalaiset[tunniste];
            /*laajaalainen.$url = $state.href('root.opetussuunnitelmat.yksi.opetus.vuosiluokkakokonaisuus',
                {vlkId: $stateParams.vlkId}) + '#' + tunniste;*/
            return laajaalainen;
          });
          item.$arvioinninkohteet = perusteTavoite.arvioinninkohteet;
        }
      });
      scope.tavoiteMap = _.indexBy(scope.tavoitteet, 'tunniste');

      if (scope.onValinnaiselle) {
        const otsikot = _.map(scope.tavoitteet, 'tavoite');
        const tekstit = _(scope.tavoitteet)
          .map('sisaltoalueet')
          .flatten()
          .map(_.property('sisaltoalueet.id'))
          .map((id) => {
            return scope.sisaltoAlueetMap[id].kuvaus;
          })
          .value();
        scope.valinnaisenTekstiosat = _.map(_.zip(otsikot, tekstit), function(values) {
          return _.zipObject(['otsikko', 'teksti'], values);
        });
      }

      scope.tunnisteet = _.keys(scope.tavoiteMap);
      _.each(scope.tunnisteet, function (tunniste) {
        var paikallinen = _.find(scope.tavoitteet, function (tavoite) {
          return tavoite.tunniste === tunniste;
        });
        scope.muokattavat[tunniste] = (paikallinen && _.isObject(paikallinen.tavoite)) ?
        { teksti: paikallinen.tavoite,
          sisaltoalue: scope.sisaltoAlueetMap[paikallinen.sisaltoalueet[0]] } :
        { teksti: {}, sisaltoalue: {} };
      });

      scope.valinnaisenTavoitteet = _.map(scope.muokattavat, function(tavoite) {
        return {
          otsikko: tavoite.teksti,
          teksti: tavoite.sisaltoalue ? tavoite.sisaltoalue.kuvaus : {}
        };
      });
    }


    this.mapModel = function (scope) {
      scope.muokattavat = {};
      scope.tavoitteet = scope.vuosiluokka.tavoitteet;
      scope.sisaltoAlueetMap = _.indexBy(scope.vuosiluokka.sisaltoalueet, 'id');
      processTavoitteet(scope);
    };

    this.mapSisaltoalueet = function (scope, tunnisteVar, muokattavaVar) {
      scope[tunnisteVar] = _(scope.sisaltoalueet)
        .sortBy(Utils.sort)
        .map('tunniste')
        .value();

      _.each(scope[tunnisteVar], function (tunniste) {
        var paikallinen = _.find(scope.sisaltoalueet, function (alue) {
          return alue.tunniste === tunniste;
        });
        if (!scope[muokattavaVar]) {
          scope[muokattavaVar] = {};
        }
        scope[muokattavaVar][tunniste] = (paikallinen && _.isObject(paikallinen.kuvaus)) ? {teksti: paikallinen.kuvaus} : {teksti: {}};
      });
    };
  });

