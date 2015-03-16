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
.service('TekstikappaleChildResolver', function (Algoritmit, $q, PerusteenOsat) {
  var lapset = null;
  this.get = function (sisalto, viiteId) {
    var promises = [];
    var viite = null;
    Algoritmit.kaikilleLapsisolmuille(sisalto, 'lapset', function (item) {
      if ('' + item.id === '' + viiteId) {
        viite = item;
        return false;
      }
    });
    if (viite) {
      Algoritmit.kaikilleLapsisolmuille(viite, 'lapset', function (lapsi) {
        lapsi.$osa = PerusteenOsat.getByViite({viiteId: lapsi.id});
        promises.push(lapsi.$osa.$promise);
      });
      lapset = viite.lapset;
    }
    return $q.all(promises);
  };
  this.getSisalto = function () {
    return lapset;
  };
})

.controller('PerusopetusTekstikappaleController', function($scope, tekstikappale, TekstikappaleChildResolver, MurupolkuData) {
  $scope.tekstikappale = tekstikappale;
  MurupolkuData.set({tekstikappaleId: tekstikappale.id, tekstikappaleNimi: tekstikappale.nimi});
  $scope.lapset = TekstikappaleChildResolver.getSisalto();
  $scope.links = {
    prev: null,
    next: null
  };

  function matcher(node, id, accumulator) {
    if (node.perusteenOsa && node.perusteenOsa.id === id) {
      accumulator.push(node);
      return true;
    }
    var childMatch = _.some(node.lapset, function (lapsi) {
      return matcher(lapsi, id, accumulator);
    });
    if (childMatch) {
      accumulator.push(node);
      return true;
    }
  }

  function iterateFn(accumulator, value) {
    matcher(value, tekstikappale.id, accumulator);
    return accumulator;
  }

  var parents = _.reduce($scope.tekstisisalto.lapset, iterateFn, []);
  MurupolkuData.set('parents', _(parents).drop(1).value());

  function checkPrevNext() {
    var items = $scope.navi.sections[0].items;
    var me = _.findIndex(items, function (item) {
      return item.$osa && item.$osa.perusteenOsa && item.$osa.perusteenOsa.id === $scope.tekstikappale.id;
    });
    if (me === -1) {
      return;
    }
    var i = me + 1;
    var meDepth = items[me].depth;
    for (; i < items.length; ++i) {
      if (items[i].depth <= meDepth) {
        break;
      }
    }
    $scope.links.next = i < items.length ? items[i] : null;
    i = me - 1;
    for (; i >= 0; --i) {
      if (items[i].depth <= meDepth) {
        break;
      }
    }
    $scope.links.prev = i >= 0 && items[i].depth >= 0 ? items[i] : null;
  }

  $scope.$on('perusopetus:stateSet', checkPrevNext);
  checkPrevNext();
})

.controller('PerusopetusVlkController', function($scope, $stateParams, Utils, MurupolkuData) {
  $scope.vlk = $scope.vuosiluokkakokonaisuudetMap[$stateParams.vlkId];
  MurupolkuData.set({vlkId: $scope.vlk.id, vlkNimi: $scope.vlk.nimi});

  $scope.vlkOrder = function (item) {
    return Utils.nameSort($scope.osaamiset[item._laajaalainenOsaaminen]);
  };
})

.controller('PerusopetusVlkOppiaineController', function($scope, oppiaine, $stateParams, MurupolkuData) {
  $scope.vlkId = $stateParams.vlkId;
  $scope.processOppiaine(oppiaine, [$scope.vlkId]);
  var vlk = $scope.vuosiluokkakokonaisuudetMap[$scope.vlkId];
  var murupolkuParams = {
    parents: null,
    vlkId: vlk.id,
    vlkNimi: vlk.nimi,
    oppiaineId: oppiaine.id,
    oppiaineNimi: oppiaine.nimi
  };
  if (oppiaine._oppiaine) {
    murupolkuParams.parents = [$scope.oppiaineetMap[oppiaine._oppiaine]];
  }
  MurupolkuData.set(murupolkuParams);
})

.controller('PerusopetusSisallotController', function($scope, oppiaine, $stateParams, $rootScope, MurupolkuData) {
  $scope.inSisallot = true;

  if (oppiaine) {
    var murupolkuParams = {
      parents: null,
      oppiaineId: oppiaine.id,
      oppiaineNimi: oppiaine.nimi
    };
    if (oppiaine._oppiaine) {
      murupolkuParams.parents = [$scope.oppiaineetMap[oppiaine._oppiaine]];
    }
    MurupolkuData.set(murupolkuParams);
  }

  function makeQueryArray(param, isNumber) {
    var arr = _.isArray(param) ? param : [param];
    return _.compact(isNumber ? _.map(arr, _.ary(parseInt, 1)) : arr);
  }

  var vlks = makeQueryArray($stateParams.vlk, true);

  $rootScope.$broadcast('navifilters:set', {
    vlk: vlks,
    sisalto: makeQueryArray($stateParams.sisalto),
    osaaminen: makeQueryArray($stateParams.osaaminen, true)
  });

  if (!oppiaine) {
    $scope.chooseFirstOppiaine();
  } else {
    $scope.processOppiaine(oppiaine, vlks, $stateParams.valittu || true);
  }
});
