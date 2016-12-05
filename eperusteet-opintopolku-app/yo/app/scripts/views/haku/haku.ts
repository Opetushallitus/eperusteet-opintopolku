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

namespace Controllers {
  export const HakuController = ($scope, $rootScope, $state, Perusteet, Haku, koulutusalaService, Kieli,
                                 YleinenData, MurupolkuData, Kaanna, PerusteenTutkintonimikkeet) => {
    var pat: any = '';
    var osio = _.last($state.current.name.split('.'));
    Haku.osio = osio;
    var otsikko = 'navi.' + osio;

    MurupolkuData.setTitle([{label: otsikko}]);
    // Viive, joka odotetaan, ennen kuin haku nimi muutoksesta lähtee serverille.
    var hakuViive = 300; //ms
    // Huom! Sivu alkaa UI:lla ykkösestä, serverillä nollasta.
    $scope.nykyinenSivu = 1;
    $scope.sivuja = 1;
    $scope.kokonaismaara = 0;
    $scope.koulutusalat = koulutusalaService.haeKoulutusalat();
    $scope.koulutusalat = _($scope.koulutusalat)
      .sortBy(ala => {
        return ala.nimi[Kieli.getSisaltokieli()];
      })
      .value();
    $scope.koulutusalatMap = {};
    $scope.opintoalatMap = {};
    _.each($scope.koulutusalat, (ala) => {
      $scope.koulutusalatMap[ala.koodi] = ala;
    });
    $scope.sivu = {
      otsikko: otsikko
    };
    $scope.sisaltokielet = [
      'fi',
      'sv'
    ];

    $scope.kaanna = function (text) {
      return Kaanna.kaanna(text);
    };

    $scope.selvitaTila = (peruste) => {
      let currentTime = new Date().getTime();
      let voimassaoloAlkaa = peruste.voimassaoloAlkaa;
      let voimassaoloLoppuu = peruste.voimassaoloLoppuu;
      let siirtymaPaattyy = peruste.siirtymaPaattyy;

      if (siirtymaPaattyy) {
        if (currentTime > siirtymaPaattyy) {
          peruste.$$tila = "arkistoitu";
          return;
        } else {
          peruste.$$tila = "siirtyma";
          return;
        }
      } else {
        if (voimassaoloLoppuu && currentTime > voimassaoloLoppuu) {
          peruste.$$tila = "arkistoitu";
          return;
        }
      }

      if (voimassaoloAlkaa && currentTime > voimassaoloAlkaa) {
        peruste.$$tila = "voimassa";
        return;
      }

      peruste.$$tila = "tuleva";
      return;
    };

    function setHakuparametrit() {
      $scope.hakuparametrit = _.merge(Haku.getHakuparametrit($state.current.name), {
        kieli: Kieli.getSisaltokieli()
      });
    }

    setHakuparametrit();

    $scope.koulutustyypit = YleinenData.ammatillisetkoulutustyypit;

    $scope.tyhjenna = function () {
      $scope.nykyinenSivu = 1;
      $scope.hakuparametrit = Haku.resetHakuparametrit($state.current.name);
      setHakuparametrit();
      $scope.haePerusteet($scope.nykyinenSivu);
    };

    let hakuVastaus = function (vastaus) {
      $scope.perusteet = vastaus;
      _.each(vastaus.data, peruste => {
        $scope.selvitaTila(peruste);
        peruste.$$tutkintonimikkeet = {};
        PerusteenTutkintonimikkeet.parse(peruste.tutkintonimikkeetKoodisto, peruste.$$tutkintonimikkeet);
      });
      $scope.nykyinenSivu = vastaus.sivu + 1;
      $scope.hakuparametrit.sivukoko = vastaus.sivukoko;
      $scope.sivuja = vastaus.sivuja;
      $scope.kokonaismaara = vastaus.kokonaismäärä;
      $scope.sivut = _.range(0, vastaus.sivuja);
      pat = new RegExp('(' + $scope.hakuparametrit.nimi + ')', 'i');
    };

    $scope.pageChanged = function () {
      $scope.haePerusteet($scope.nykyinenSivu);
    };

    /**
     * Hakee sivun serveriltä.
     * @param {number} sivu UI:n sivunumero, alkaa ykkösestä.
     */
    $scope.haePerusteet = function (sivu) {
      $scope.hakuparametrit.sivu = sivu - 1;
      Haku.setHakuparametrit($state.current.name, $scope.hakuparametrit);
      Perusteet.get($scope.hakuparametrit, hakuVastaus, function (virhe) {
        if (virhe.status === 404) {
          hakuVastaus(virhe.data);
        }
      });
    };

    $scope.sivujaYhteensa = function () {
      return Math.max($scope.sivuja, 1);
    };

    $scope.switchHakua = (key) => {
      $scope.hakuparametrit[key] = !$scope.hakuparametrit[key] || false;
      $scope.hakuMuuttui();
    };

    $scope.muutaHakua = (key, value) => {
      $scope.hakuparametrit[key] = value;
      $scope.koulutusalaMuuttui();
      $scope.hakuMuuttui();
    };

    $scope.poistaHakukriteeri = (key) => {
      delete $scope.hakuparametrit[key];
      $scope.koulutusalaMuuttui();
      $scope.hakuMuuttui();
    };

    $scope.hakuMuuttui = _.debounce(_.bind($scope.haePerusteet, $scope, 1), hakuViive, {'leading': false});

    $scope.korosta = function (otsikko) {
      if ($scope.hakuparametrit.nimi === null || $scope.hakuparametrit.nimi.length < 3) {
        return otsikko;
      }
      return otsikko.replace(pat, '<strong>$1</strong>');
    };

    $scope.koulutusalaMuuttui = function () {
      if ($scope.hakuparametrit.koulutusala) {
        $scope.opintoalat = (<any>_.findWhere($scope.koulutusalat, {
          koodi: $scope.hakuparametrit.koulutusala
        })).opintoalat;
        _.each($scope.opintoalat, (ala) => {
          $scope.opintoalatMap[ala.koodi] = ala;
        });
      } else {
        $scope.opintoalat = [];
        delete $scope.hakuparametrit.opintoala;
      }
      $scope.hakuMuuttui();
    };

    $scope.koulutusalaMuuttui();

    $scope.koulutusalaNimi = function (koodi) {
      return koulutusalaService.haeKoulutusalaNimi(koodi);
    };

    $scope.piilotaKoulutustyyppi = function () {
      return $state.current.name === 'root.selaus.ammatillinenperuskoulutus' || $scope.isValma();
    };

    $scope.isValma = function () {
      return $state.current.name === 'root.selaus.valmentavakoulutus';
    };

    $scope.onkoHakuTyhja = function () {
      return $scope.hakuparametrit.nimi !== ''
        || $scope.hakuparametrit.koulutusala !== ''
        || ($scope.hakuparametrit.tyyppi !== '' && osio === 'ammatillinenaikuiskoulutus');
    };
    $scope.$on('changed:sisaltokieli', $scope.tyhjenna);
  }
}


// TODO: Refactor
angular.module('app')
  .service('Haku', function Haku(Kieli) {
    var uikieli = Kieli.getUiKieli();
    var DEFAULTS = {
      'root.selaus.ammatillinenperuskoulutus': {
        nimi: '',
        koulutusala: '',
        tyyppi: 'koulutustyyppi_1',
        kieli: uikieli,
        opintoala: '',
        sivu: 0,
        sivukoko: 5,
        suoritustapa: 'ops',
        perusteTyyppi: 'normaali',
        tila: 'valmis',
        tuleva: true,
        voimassaolo: true,
        siirtyma: true,
        poistunut: false,
        tutkintonimikkeet: true
      },
      'root.selaus.ammatillinenaikuiskoulutus': {
        nimi: '',
        koulutusala: '',
        tyyppi: '',
        kieli: uikieli,
        opintoala: '',
        sivu: 0,
        sivukoko: 5,
        suoritustapa: 'naytto',
        perusteTyyppi: 'normaali',
        tila: 'valmis',
        tuleva: true,
        voimassaolo: true,
        siirtyma: true,
        poistunut: false,
        tutkintonimikkeet: true
      },
      'root.selaus.valmentavakoulutus': {
        nimi: '',
        koulutusala: '',
        tyyppi: 'koulutustyyppi_18',
        kieli: uikieli,
        opintoala: '',
        sivu: 0,
        sivukoko: 20,
        suoritustapa: 'ops',
        perusteTyyppi: 'normaali',
        tila: 'valmis',
        tuleva: true,
        voimassaolo: true,
        siirtyma: true,
        poistunut: false,
        tutkintonimikkeet: true
      }
    };

    this.osio = null;
    this.hakuparametrit = _.clone(DEFAULTS);

    this.getHakuparametrit = function (stateName) {
      return _.clone(this.hakuparametrit[stateName]);
    };

    this.setHakuparametrit = function (stateName, hakuparametrit) {
      this.hakuparametrit[stateName] = _.merge(hakuparametrit);
    };

    this.resetHakuparametrit = function (stateName) {
      this.hakuparametrit[stateName] = _.clone(DEFAULTS[stateName]);
      return this.hakuparametrit[stateName];
    };
  });
