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
  .controller('EsitysRakenneController', function($scope, $state, $stateParams, PerusteenRakenne, realParams) {
    $scope.$parent.valittu.sisalto = 'rakenne';
    $scope.muodostumisOtsikko = _.find($scope.$parent.sisalto, function (item) {
      return item.tunniste === 'rakenne';
    });
    PerusteenRakenne.hae(realParams.perusteId, realParams.suoritustapa, function(rakenne) {
      $scope.rakenne = rakenne;
      $scope.rakenne.$suoritustapa = realParams.suoritustapa;
      $scope.rakenne.$resolved = true;
    });
  })

  .controller('EsitysTutkinnonOsaController', function($scope, $state, $stateParams, PerusteenOsat, TutkinnonosanTiedotService,
      Tutke2Osa) {
    $scope.tutkinnonOsaViite = _.find($scope.$parent.tutkinnonOsat, function(tosa) {
      return tosa.id === parseInt($stateParams.id, 10);
    });
    $scope.osaAlueet = {};
    TutkinnonosanTiedotService.noudaTutkinnonOsa({perusteenOsaId: $scope.tutkinnonOsaViite._tutkinnonOsa}).then(function () {
      $scope.tutkinnonOsa = TutkinnonosanTiedotService.getTutkinnonOsa();
      $scope.fieldKeys = _.intersection(_.keys($scope.tutkinnonOsa), TutkinnonosanTiedotService.keys());
      if ($scope.tutkinnonOsa.tyyppi === 'tutke2') {
        Tutke2Osa.kasitteleOsaAlueet($scope.tutkinnonOsa);
      }
    });

    $scope.fieldOrder = function (item) {
      return TutkinnonosanTiedotService.order(item);
    };
    $scope.hasArviointi = function (osaamistavoite) {
      return osaamistavoite.arviointi &&
        osaamistavoite.arviointi.arvioinninKohdealueet &&
        osaamistavoite.arviointi.arvioinninKohdealueet.length > 0 &&
        osaamistavoite.arviointi.arvioinninKohdealueet[0].arvioinninKohteet &&
        osaamistavoite.arviointi.arvioinninKohdealueet[0].arvioinninKohteet.length > 0;
    };
  })

  .controller('EsitysTutkinnonOsatController', function($scope, $state, $stateParams, Algoritmit) {
    $scope.$parent.valittu.sisalto = 'tutkinnonosat';
    $scope.tosarajaus = '';
    $scope.rajaaTutkinnonOsia = function(haku) { return Algoritmit.rajausVertailu($scope.tosarajaus, haku, 'nimi'); };
  })

  .controller('EsitysTiedotController', function($scope, $q, $state, YleinenData, PerusteenTutkintonimikkeet, Perusteet) {
    $scope.showKoulutukset = _.constant(YleinenData.showKoulutukset($scope.peruste));
    $scope.koulutusalaNimi = $scope.Koulutusalat.haeKoulutusalaNimi;
    $scope.opintoalaNimi = $scope.Opintoalat.haeOpintoalaNimi;

    PerusteenTutkintonimikkeet.get($scope.peruste.id, $scope);

    $q.all(_.map($scope.peruste.korvattavatDiaarinumerot, function(diaari) {
      return Perusteet.diaari({ diaarinumero: diaari }).$promise;
    })).then(function(korvattavatPerusteet) {
      $scope.korvattavatPerusteet = korvattavatPerusteet;
    });
  })

  .controller('EsitysSisaltoController', function($scope, $state, $stateParams, PerusteenOsat, YleinenData) {
    $scope.$parent.valittu.sisalto = $stateParams.osanId;
    $scope.valittuSisalto = $scope.$parent.sisalto[$stateParams.osanId];
    if (!$scope.valittuSisalto) {
      var params = _.extend(_.clone($stateParams), {
        suoritustapa: YleinenData.validSuoritustapa($scope.peruste, $stateParams.suoritustapa)
      });
      $state.go('root.esitys.peruste.rakenne', params);
    } else {
      PerusteenOsat.get({ osanId: $scope.valittuSisalto.id }, _.setWithCallback($scope, 'valittuSisalto'));
    }
  })

  .controller('EsitysController', function($scope, $stateParams, sisalto, peruste,
      YleinenData, $state, Algoritmit, tutkinnonOsat, Kaanna, arviointiasteikot,
      koulutusalaService, opintoalaService, Kieli, TermistoService) {

    TermistoService.setPeruste(peruste);
    $scope.Koulutusalat = koulutusalaService;
    $scope.Opintoalat = opintoalaService;
    var isTutkinnonosatActive = function () {
      return $state.is('root.esitys.peruste.tutkinnonosat') || $state.is('root.esitys.peruste.tutkinnonosa');
    };
    $scope.navi = {
      items: [
        {label: 'perusteen-tiedot', link: ['root.esitys.peruste.tiedot'], $glyph: 'list-alt'},
        {label: 'tutkinnonosat', link: ['root.esitys.peruste.tutkinnonosat'], isActive: isTutkinnonosatActive}
      ],
      header: 'perusteen-sisalto'
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

    if ($state.current.name === 'root.esitys.peruste') {
      var params = _.extend(_.clone($stateParams), {
        suoritustapa: YleinenData.validSuoritustapa($scope.peruste, $stateParams.suoritustapa)
      });
      $state.go('root.esitys.peruste.rakenne', params);
    }

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

  .directive('esitysSivuOtsikko', function ($compile) {
    var TEMPLATE = '<div class="painikkeet pull-right">' +
      '<a class="action-link left-space" ng-click="printSisalto()" icon-role="print" kaanna="\'tulosta-sivu\'"></a>' +
      '</div>';
    return {
      restrict: 'AE',
      link: function (scope, element) {
        var compiled = $compile(TEMPLATE)(scope);
        element.append(compiled);
      }
    };
  });
