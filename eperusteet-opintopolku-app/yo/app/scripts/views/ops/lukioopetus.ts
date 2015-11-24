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
    epLukioTabService) {

    $scope.isNaviVisible = _.constant(true);
    $scope.tabs = epLukioTabService.tabs;
    $scope.tabClass = epLukioTabService.tabClassSelector;
    $scope.currentState = function() { return 'a' };

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

    $scope.navi = {
      header: 'perusteen-sisalto',
      showOne: true,
      sections: [{
        id: 'suunnitelma',
        include: 'eperusteet-esitys/views/lukionyhteisetosuudet.html',
        items: [], //epMenuBuilder.rakennaTekstisisalto($scope.perusteenSisalto),
        naviClasses: $scope.naviClasses,
        title: 'yhteiset-osuudet'
      }, {
        title: 'opetuksen-sisallot',
        id: 'sisalto',
        include: 'eperusteet-esitys/views/oppiaineetsivunavi.html',
        items: [],// epMenuBuilder.buildLukioOppiaineMenu($scope.oppiaineRakenne.oppiaineet),
        naviClasses: $scope.naviClasses
      }]
    };

  });
