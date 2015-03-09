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

.controller('PerusopetusTekstikappaleController', function($scope, tekstikappale, TekstikappaleChildResolver) {
  $scope.tekstikappale = tekstikappale;
  $scope.lapset = TekstikappaleChildResolver.getSisalto();
  $scope.links = {
    prev: null,
    next: null
  };

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
});
