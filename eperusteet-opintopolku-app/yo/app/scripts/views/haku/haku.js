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
/*global _*/

epOpintopolkuApp
  .controller('HakuController', function($scope, $rootScope, $state, Perusteet, Haku,
    YleinenData, koulutusalaService, Kieli) {
    var pat = '';
    // Viive, joka odotetaan, ennen kuin haku nimi muutoksesta lähtee serverille.
    var hakuViive = 300; //ms
    // Huom! Sivu alkaa UI:lla ykkösestä, serverillä nollasta.
    $scope.nykyinenSivu = 1;
    $scope.sivuja = 1;
    $scope.kokonaismaara = 0;
    $scope.koulutusalat = koulutusalaService.haeKoulutusalat();

    function setHakuparametrit() {
      $scope.hakuparametrit = _.merge(Haku.getHakuparametrit($state.current.name), {
        kieli: Kieli.getSisaltokieli()
      });
    }
    setHakuparametrit();

    $scope.koulutustyypit = YleinenData.ammatillisetkoulutustyypit;

    $scope.tyhjenna = function() {
      $scope.nykyinenSivu = 1;
      $scope.hakuparametrit = Haku.resetHakuparametrit($state.current.name);
      setHakuparametrit();
      $scope.haePerusteet($scope.nykyinenSivu);
    };

    var hakuVastaus = function(vastaus) {
      $scope.perusteet = vastaus;
      $scope.nykyinenSivu = $scope.perusteet.sivu + 1;
      $scope.hakuparametrit.sivukoko = $scope.perusteet.sivukoko;
      $scope.sivuja = $scope.perusteet.sivuja;
      $scope.kokonaismaara = $scope.perusteet.kokonaismäärä;
      $scope.sivut = _.range(0, $scope.perusteet.sivuja);
      pat = new RegExp('(' + $scope.hakuparametrit.nimi + ')', 'i');
    };

    $scope.pageChanged = function() {
      $scope.haePerusteet($scope.nykyinenSivu);
    };

    /**
     * Hakee sivun serveriltä.
     * @param {number} sivu UI:n sivunumero, alkaa ykkösestä.
     */
    $scope.haePerusteet = function(sivu) {
      $scope.hakuparametrit.sivu = sivu - 1;
      Haku.setHakuparametrit($state.current.name, $scope.hakuparametrit);
      Perusteet.get($scope.hakuparametrit, hakuVastaus, function(virhe) {
        if (virhe.status === 404) {
          hakuVastaus(virhe.data);
        }
      });
    };

    $scope.sivujaYhteensa = function() {
      return Math.max($scope.sivuja, 1);
    };

    $scope.hakuMuuttui = _.debounce(_.bind($scope.haePerusteet, $scope, 1), hakuViive, {'leading': false});

    $scope.korosta = function(otsikko) {
      if ($scope.hakuparametrit.nimi === null || $scope.hakuparametrit.nimi.length < 3) {
        return otsikko;
      }
      return otsikko.replace(pat, '<b>$1</b>');
    };
    $scope.valitseKieli = function(nimi) {
      return YleinenData.valitseKieli(nimi);
    };

    $scope.koulutusalaMuuttui = function() {
      $scope.hakuparametrit.opintoala = '';
      if ($scope.hakuparametrit.koulutusala !== '') {
        $scope.opintoalat = _.findWhere($scope.koulutusalat, {koodi: $scope.hakuparametrit.koulutusala}).opintoalat;
      } else {
        $scope.opintoalat = [];
      }
      $scope.hakuMuuttui();
    };
    $scope.koulutusalaMuuttui();

    $scope.koulutusalaNimi = function(koodi) {
      return koulutusalaService.haeKoulutusalaNimi(koodi);
    };

    $scope.piilotaKoulutustyyppi = function() {
      return $state.current.name === 'root.selaus.ammatillinenperuskoulutus';
    };

    $scope.$on('changed:sisaltokieli', $scope.tyhjenna);
  });
