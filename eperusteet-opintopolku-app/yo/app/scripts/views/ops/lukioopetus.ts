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
    opsLukioTabService) {

    $scope.stuff = "STUFF";

    $scope.tabs = opsLukioTabService.tabs;
    $scope.tabClass = opsLukioTabService.tabClassSelector;

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
        items: "",//epMenuBuilder.rakennaTekstisisalto($scope.perusteenSisalto),
        naviClasses: $scope.naviClasses,
        title: 'yhteiset-osuudet'
      }, {
        title: 'opetuksen-sisallot',
        id: 'sisalto',
        include: 'eperusteet-esitys/views/oppiaineetsivunavi.html',
        items: "",//epMenuBuilder.buildLukioOppiaineMenu($scope.oppiaineRakenne.oppiaineet),
        naviClasses: $scope.naviClasses
      }]
    };


  })

.factory('opsLukioTabService', function ($state) {
  return {
    tabClassSelector: function(tabName) {
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
    },
    tabs: [
      {
        title: {
          oppiaine: 'oppiainen-sisalto',
          kurssi: 'kurssin-sisalto'
        },
        name: 'sisalto',
        url: function(name){
          if (name === 'kurssi') {
            return 'root.lukio.kurssi';
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine';
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
            return 'root.lukio.kurssi.tavoitteet';
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine.tavoitteet';
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
            return 'root.lukio.kurssi.aihekokonaisuudet';
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine.aihekokonaisuudet';
          }
        }
      }
    ]
  };
});
