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
  .controller('OpsOppiaineetController', function(
    $scope,
    $timeout,
    $stateParams,
    $state,
    Utils,
    ops,
    oppiaine,
    oppiainePeruste,
    MurupolkuData) {

    $scope.oppiaine = oppiaine;
    $scope.peruste = oppiainePeruste;

    const createTabs = () => {
      let tabs = [];
      _.each(ops.vuosiluokkakokonaisuudet, function (vlk) {
        var match = _.filter(oppiaine.vuosiluokkakokonaisuudet, function (v) {
          return vlk.vuosiluokkakokonaisuus._tunniste === v._vuosiluokkakokonaisuus;
        });
        if(match.length) {
          tabs.push({
            nimi: vlk.vuosiluokkakokonaisuus.nimi,
            id: match.pop().id
          })
        }
      });
      return _.sortBy(tabs, Utils.nameSort);
    }

    $scope.vlkTabit = createTabs();

    $scope.tabIsActive = function(tabId){
      return $stateParams.vuosiId + "" === tabId + "";
    };

    function setMurupolku() {

      $scope.item = _.reduce($scope.navi.sections[2].items, (result, item, index) => {
          if (item.$selected === true) {
        item.index = index;
        result = item;
      }
      return result;
    }, '');

      function findParents(set, index) {
        var slicedSet = _.take(set, parseInt(index));
        var found = _.findLast(slicedSet, function (item) {
          return item.depth === 1;
        });
        return found.$oppiaine;
      }
      var murupolkuParams = {};
      if ($scope.item && $scope.item.depth === 0) {
        murupolkuParams = {
          parents: null,
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi
        };
      }
      if ($scope.item.depth === 1) {
        murupolkuParams = {
          parents: [findParents($scope.navi.sections[2].items, $scope.item.index)],
          oppiaineId: oppiaine.id,
          oppiaineNimi: oppiaine.nimi
        };
      }

      MurupolkuData.set(murupolkuParams);

    }
    const presentVlk = () => {
      return _.filter($scope.vlkTabit, function(tab){
        return tab.id + '' === $state.params.vlkId + '';
      }).length;
    };

    const goToFirstVlk = () => {
      if ((_.endsWith($state.current.name, 'oppiaineet') && $scope.vlkTabit.length) ||
        (_.endsWith($state.current.name, 'vlk') && !presentVlk() && $scope.vlkTabit.length)) {
        $state.go('root.ops.perusopetus.oppiaineet.vlk', {
          opsId: $state.params.opsId,
          oppiaineId: $state.params.oppiaineId,
          vlkId: $scope.vlkTabit[0].id})
      }
    };

    $scope.$on('$stateChangeSuccess', setMurupolku);
    setMurupolku();

    $timeout(goToFirstVlk);

    $scope.addActiveClass = (id, bool) => {
      if(bool) {
        return id + '' === $state.params.vuosiId;
      }
      return id + '' === $state.params.vlkId + '';
    };

  })

  /*
   'root.ops.perusopetus.oppiaineet.vlk'
   */

  .controller('OpsOppiaineetVlkController', function(
    vuosiluokkakokonaisuus,
    $state,
    $rootScope,
    oppiainePeruste,
    MurupolkuData,
    $stateParams,
    $timeout,
    Utils,
    $scope){

    $scope.vuosiluokkakokonaisuus = vuosiluokkakokonaisuus;

    const perusteSisaltoMap = _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, '_vuosiluokkakokonaisuus');
    $scope.perusteOppiaine = oppiainePeruste;
    $scope.perusteOppiaineVlkMap = oppiainePeruste ?
      _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, '_vuosiluokkakokonaisuus') : {};


    const vuosiTabSort = (tab1) => {
      return tab1.vuosiluokka.replace(/\D/g, '').split('') || tab1.vuosiluokka;
    };

    $scope.vlk = _.sortBy(vuosiluokkakokonaisuus.vuosiluokat, vuosiTabSort);

    $scope.nameSort = Utils.nameSort;
    $scope.perusteOppiaine = oppiainePeruste;
    $scope.perusteOppiaineVlkMap = oppiainePeruste ?
      _.indexBy(oppiainePeruste.vuosiluokkakokonaisuudet, '_vuosiluokkakokonaisuus') : {};

    MurupolkuData.set({
      vlkId: $scope.vuosiluokkakokonaisuus.id,
      vlkLabel: 'vuosiluokkakokonaisuus'
    });

    const presentVuosi = () => {
      return _.filter($scope.vlk, function(tab){
        return tab.id + '' === $stateParams.vlkId + '';
      }).length;
    };

    const goToFirstVuosi = () => {
      if ((_.endsWith($state.current.name, 'vlk') && !presentVuosi() && $scope.vlk.length)
        || (_.endsWith($state.current.name, 'vuosiluokat') && !presentVuosi() && $scope.vlk.length)) {
        $state.go('root.ops.perusopetus.oppiaineet.vlk.vuosiluokat', {
          opsId: $stateParams.opsId,
          oppiaineId: $stateParams.oppiaineId,
          vlkId: vuosiluokkakokonaisuus.id,
          vuosiId: $scope.vlk[0].id
        })
      }
    };

    $timeout(goToFirstVuosi);

  })

  /*
   'root.ops.perusopetus.valinnaisetoppiaineet'
   */

  .controller('OpsVlnOppiaineController', function(
    $scope,
    $timeout,
    $state,
    Utils,
    oppiaineId,
    oppiaine,
    MurupolkuData){

    $scope.oppiaine = oppiaine;

    $scope.vuosiluokat = _($scope.oppiaine.vuosiluokkakokonaisuudet).map('vuosiluokat').reverse().flatten().value();

    $scope.currentVuosiluokka = $scope.vuosiluokat[0].vuosiluokka;
    $scope.currentVuosiId = $scope.vuosiluokat[0].id;

    $scope.showVuosi = (vuosiluokka) => {
      $scope.currentVuosiluokka = vuosiluokka;
    };

    $scope.vlkSisalto = _.filter($scope.oppiaine.vuosiluokkakokonaisuudet, (opVlk) => {
        return _.each(opVlk.vuosiluokat, function(v) {
          return v.vuosiluokka === $scope.vuosi;
        })
      }).pop();


    //tried to make oppiane as parent and vuosi as child in path but not working and probably not needed
    /*  const getCurrentVuosiId = () => {
     return _($scope.vuosiluokat).filter((vl) => {
     return vl.vuosiluokka === $scope.currentVuosiluokka;
     }).first().id;
     };
     */
    MurupolkuData.set({oppiaineId: $scope.oppiaine.id, oppiaineNimi: $scope.oppiaine.nimi});

    //MurupolkuData.set('parents', [$scope.oppiaine.nimi, $scope.oppiaine.id]);

  });



