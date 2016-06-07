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
  .controller('EsitysController', function($scope, $stateParams, sisalto, peruste,
      YleinenData, $state, Algoritmit, tutkinnonOsat, Kaanna, arviointiasteikot,
      koulutusalaService, opintoalaService, Kieli, TermistoService, MurupolkuData) {

    TermistoService.setResource(peruste);
    MurupolkuData.set({perusteId: peruste.id, perusteNimi: peruste.nimi});
    $scope.Koulutusalat = koulutusalaService;
    $scope.Opintoalat = opintoalaService;
    var isTutkinnonosatActive = function () {
      return $state.is('root.esitys.peruste.tutkinnonosat') || $state.is('root.esitys.peruste.tutkinnonosa');
    };
    $scope.navi = {
      header: 'perusteen-sisalto',
      items: [
        {label: 'perusteen-tiedot', link: ['root.esitys.peruste.tiedot'], $glyph: 'list-alt'},
        {label: 'tutkinnonosat', link: ['root.esitys.peruste.tutkinnonosat'], isActive: isTutkinnonosatActive}
      ]
    };

    function mapSisalto(sisalto) {
      sisalto = _.clone(sisalto);
      var flattened = {};
      Algoritmit.kaikilleLapsisolmuille(sisalto, 'lapset', function(lapsi, depth) {
        flattened[lapsi.id] = _.clone(lapsi.perusteenOsa);
        $scope.navi.items.push({
          label: lapsi.perusteenOsa.nimi,
          link: lapsi.perusteenOsa.tunniste === 'rakenne' ? ['root.esitys.peruste.rakenne', { suoritustapa: $stateParams.suoritustapa }] : ['root.esitys.peruste.tekstikappale', { osanId: ''+lapsi.id }],
          depth: depth
        });
      });
      return flattened;
    }
    $scope.kaanna = function (val) {
      return Kaanna.kaanna(val);
    };

    $scope.peruste = peruste;
    Kieli.setAvailableSisaltokielet($scope.peruste.kielet);
    $scope.$on('$destroy', function () {
      Kieli.resetSisaltokielet();
    });
    $scope.backLink = $state.href(YleinenData.koulutustyyppiInfo[$scope.peruste.koulutustyyppi].hakuState);
    $scope.sisalto = mapSisalto(sisalto);
    $scope.originalSisalto = sisalto;

    $scope.arviointiasteikot = _.zipObject(_.map(arviointiasteikot, 'id'), _.map(arviointiasteikot, function(asteikko) {
      return _.zipObject(_.map(asteikko.osaamistasot, 'id'), asteikko.osaamistasot);
    }));
    $scope.tutkinnonOsat = _(tutkinnonOsat).sortBy(function(r) { return Kaanna.kaanna(r.nimi); })
                                           .value();

    $scope.valittu = {};
    $scope.suoritustavat = _.map(peruste.suoritustavat, 'suoritustapakoodi');
    $scope.suoritustapa = $stateParams.suoritustapa;

    $scope.yksikko = Algoritmit.perusteenSuoritustavanYksikko(peruste, $scope.suoritustapa);

    $scope.vaihdaSuoritustapa = function(suoritustapa) {
      // TODO debug this
      $state.go('root.esitys.peruste', {
        perusteId: $stateParams.perusteId,
        suoritustapa: suoritustapa
      }, { reload: true });
    };

    $scope.$on('$stateChangeSuccess', function () {
      if ($state.current.name === 'root.esitys.peruste') {
        var params = _.extend(_.clone($stateParams), {
          suoritustapa: YleinenData.validSuoritustapa($scope.peruste, $stateParams.suoritustapa)
        });
        $state.go('root.esitys.peruste.tiedot', params);
      }
    });

    $scope.rajaaSisaltoa = function() {
      _.forEach($scope.sisaltoRakenne, function(r) {
        r.$rejected = _.isEmpty($scope.rajaus) ? false : !Algoritmit.match($scope.rajaus, $scope.sisalto[r.id].nimi);
        if (!r.$rejected) {
          var parent = $scope.sisaltoRakenneMap[r.parent];
          while (parent) {
            parent.$rejected = false;
            parent = $scope.sisaltoRakenneMap[parent.parent];
          }
        }
      });
      $scope.extra.tutkinnonOsat = !Algoritmit.match($scope.rajaus, Kaanna.kaanna('tutkinnonosat'));
      $scope.extra.tutkinnonRakenne = !Algoritmit.match($scope.rajaus, Kaanna.kaanna('tutkinnon-rakenne'));
    };

  })

  .directive('esitysSivuOtsikko', function () {
    // dummy directive because we don't need action buttons in text titles
    return {
      restrict: 'A'
    };
  })

.directive('tekstiotsikko', function () {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      level: '@',
      linkVar: '='
    },
    template: '<span class="otsikko-wrap"><span ng-bind-html="model.$osa.nimi | kaanna | unsafe"></span>' +
    '  <span class="teksti-linkki">' +
    '    <a ng-if="amEsitys" ui-sref="^.tekstikappale({osanId: model.id})" icon-role="new-window"></a>' +
    '    <a ng-if="!amEsitys" ui-sref="^.tekstikappale({tekstikappaleId: model.id})" icon-role="new-window"></a>' +
    '  </span></span>',
    link: function (scope, element) {
      var headerEl = angular.element('<h' + scope.level + '>');
      element.find('.otsikko-wrap').wrap(headerEl);
      scope.amEsitys = scope.linkVar === 'osanId';
    }
  };
});
