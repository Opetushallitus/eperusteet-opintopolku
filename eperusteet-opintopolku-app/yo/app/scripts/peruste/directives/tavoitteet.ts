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

angular.module('app')
  .directive('tavoitteet', function() {
    return {
      templateUrl: 'views/perusopetus/directives/tavoitteet.html',
      restrict: 'A',
      scope: {
        model: '=tavoitteet',
        editable: '@?',
        providedVuosiluokka: '=?vuosiluokka',
        providedOsaamiset: '=?osaamiset',
        providedOppiaine: '=?oppiaine'
      },
      controller: 'TavoitteetController',
      link: function(scope: any) {
        // TODO call on model update
        scope.mapModel();
      }
    };
  })
  .controller('TavoitteetController', function($scope, $state, $rootScope, $timeout,
    $stateParams, Oppiaineet, Kaanna) {
    $scope.osaamiset = $scope.providedOsaamiset;
    if (_.isEmpty($scope.osaamiset)) {
      // käytetään vain lukutilan kanssa
      /*PerusopetusService.getOsat(PerusopetusService.OSAAMINEN, true).then(function (res) {
        $scope.osaamiset = res;
        $scope.mapModel();
      });*/
    }
    $scope.vuosiluokka = $scope.providedVuosiluokka;
    $scope.oppiaine = $scope.providedOppiaine;
    $scope.editMode = false;
    $scope.currentEditable = null;

    $scope.kohdealueet = $scope.oppiaine.oppiaine ? $scope.oppiaine.oppiaine.kohdealueet : $scope.oppiaine.kohdealueet;

    $scope.$watch('editable', function(value) {
      $scope.editMode = !!value;
    });

    $scope.treeOptions = {
      dropped: function() {
        $scope.mapModel(true);
      }
    };

    $scope.$watch('providedVuosiluokka', function () {
      $scope.vuosiluokka = $scope.providedVuosiluokka;
      $scope.mapModel();
    });

    function generateArraySetter(findFrom, manipulator = _.noop) {
      return function(item) {
        var found = _.find(findFrom, function(findItem: any) { return parseInt(findItem, 10) === item.id; });
        item = _.clone(item);
        item.$hidden = !found;
        item.teksti = item.kuvaus;
        return manipulator(item) || item;
      };
    }

    $scope.kaannaKohdealue = function(ka) {
      return Kaanna.kaanna(ka.nimi);
    };

    $scope.poistaValittuKohdealue = function(tavoite) {
      tavoite.$valittuKohdealue = undefined;
    };

    $scope.asetaKohdealue = function(tavoite) {
      tavoite.$kohdealueet = tavoite.$valittuKohdealue ? [tavoite.$valittuKohdealue] : [];
    };

    $scope.mapModel = function(update) {
      _.each($scope.model.tavoitteet, function(tavoite) {
        if (!update) {
          tavoite.$accordionOpen = true;
        }

        var kohdealueId: any = !_.isEmpty(tavoite.kohdealueet) ? _.first(tavoite.kohdealueet) : null;
        if (kohdealueId) {
          tavoite.$valittuKohdealue = _.find($scope.kohdealueet, function(ka: any) {
            return ka.id === parseInt(kohdealueId, 10);
          });
        }

        tavoite.$sisaltoalueet = _.map($scope.model.sisaltoalueet, generateArraySetter(tavoite.sisaltoalueet));
        tavoite.$osaaminen = _.map($scope.osaamiset, generateArraySetter(tavoite.laajattavoitteet, function(osaaminen) {
          const vuosiluokkakuvaus = _.find($scope.vuosiluokka.laajaalaisetOsaamiset, function(item: any) {
            return '' + item._laajaalainenOsaaminen === '' + osaaminen.id;
          });
          osaaminen.teksti = vuosiluokkakuvaus ? vuosiluokkakuvaus.kuvaus : 'ei-kuvausta';
          osaaminen.extra = '<div class="clearfix"><a class="pull-right" href="' +
            $state.href('root.perusopetus.vuosiluokkakokonaisuus', {
              perusteId: $stateParams.perusteId,
              vlkId: $stateParams.vlkId || $scope.vuosiluokka.id,
            }) + '#vlk-laajaalaisetosaamiset" kaanna="\'vuosiluokkakokonaisuuden-osaamisalueet\'"></a></div>';
        }));
      });
    };

    function setAccordion(mode) {
      var obj = $scope.model.tavoitteet;
      _.each(obj, function(tavoite) {
        tavoite.$accordionOpen = mode;
      });
    }

    function accordionState() {
      var obj: any = _.first($scope.model.tavoitteet);
      return obj && obj.$accordionOpen;
    }

    $scope.toggleAll = function() {
      setAccordion(!accordionState());
    };

    $scope.hasArviointi = function(tavoite) {
      return !!tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0;
    };

    $scope.addArviointi = function(tavoite) {
      tavoite.arvioinninkohteet = [{arvioinninKohde: {}, hyvanOsaamisenKuvaus: {}}];
    };

    //var cloner = CloneHelper.init(['tavoite', 'sisaltoalueet', 'laajattavoitteet', 'arvioinninkohteet']);
    //var idFn = function(item) { return item.id; };
    //var filterFn = function(item) { return !item.$hidden; };

    $scope.tavoiteFn = {
      edit: function() {
      },
      remove: function() {
      },
      ok: function() {
      },
      cancel: function() {
      },
      add: function() {
      },
      toggle: function(tavoite) {
        tavoite.$accordionOpen = !tavoite.$accordionOpen;
      }
    };
  })

  .directive('perusopetuksenArviointi', function() {
    return {
      templateUrl: 'views/perusopetus/directives/arviointi.html',
      restrict: 'A',
      scope: {
        model: '=perusopetuksenArviointi',
        editMode: '=',
        atavoite: '=atavoite'
      }
    };
  });
