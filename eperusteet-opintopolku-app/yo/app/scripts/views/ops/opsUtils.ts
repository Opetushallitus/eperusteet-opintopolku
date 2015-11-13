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
  .factory('opsUtils', function (Algoritmit, $state, Kieli, Utils, epEsitysSettings) {
    function rakennaVuosiluokkakokonaisuuksienMenu(vlkt, aineet) {
      var arr = [];
      _.each(vlkt, function (vlk) {
        arr.push({
          $vkl: vlk,
          label: vlk.nimi,
          depth: 0
          url: $state.href('root.ops.perus.vuosiluokkakokonaisuus', {vlkId: vlk.id})
        });
        traverseOppiaineet(aineet, arr, vlk._tunniste, 1);
      });
      return arr;
    }

    function traverseOppiaineet(aineet, arr, vlk, startingDepth) {
      startingDepth = startingDepth || 0;
      var isSisalto = startingDepth === 0;
      var vlks = _.isArray(vlk) ? vlk : [vlk];
      var oaFiltered = _(aineet).filter(function(oa) {
        var oppiaineHasVlk = _.some(oa.vuosiluokkakokonaisuudet, function(oavkl) {
          return _.some(vlks, function (oneVlk) {
            return '' + oavkl._vuosiluokkakokonaisuus === '' + oneVlk;
          });
        });
        var oppimaaraVlkIds = _(oa.oppimaarat).map(function (oppimaara) {
          return _.map(oppimaara.vuosiluokkakokonaisuudet, '_vuosiluokkaKokonaisuus');
        }).flatten().uniq().value();
        var vlkIds = _.map(vlks, String);
        return oppiaineHasVlk || !_.isEmpty(_.intersection(oppimaaraVlkIds, vlkIds));
      }).value();
      _.each(oppiaineSort(oaFiltered), function (oa) {
        buildOppiaineItem(arr, oa, vlks, startingDepth, isSisalto);
        _.each(filteredOppimaarat(oa, vlks), function (oppimaara) {
          buildOppiaineItem(arr, oppimaara, vlks, startingDepth + 1, isSisalto);
        });
      });
    }

    function filteredOppimaarat(oppiaine, vlks) {
      var ret = [];
      if (oppiaine.koosteinen) {
        ret = _(oppiaine.oppimaarat).filter(function (oppimaara) {
          return oppimaara.nimi[Kieli.getSisaltokieli()] &&
            _.some(oppimaara.vuosiluokkakokonaisuudet, function (omVlk) {
              return _.some(vlks, function (oneVlk) {
                return '' + omVlk._vuosiluokkaKokonaisuus === '' + oneVlk;
              });
            });
        }).value();
      }
      return oppiaineSort(ret);
    }

    function buildOppiaineItem(arr, oppiaine, vlk, depth, isSisalto) {
      if (!oppiaine.nimi[Kieli.getSisaltokieli()]) {
        return;
      }
      arr.push({
        depth: depth,
        $hidden: depth > 0,
        $oppiaine: oppiaine,
        label: oppiaine.nimi,
        url: isSisalto ? $state.href('root.ops.perus.sisallot', {oppiaineId: oppiaine.id}) :
          $state.href('root.ops.perus.vlkoppiaine', {vlkId: vlk[0], oppiaineId: oppiaine.id})
      });
    }

    function oppiaineSort(aineet) {
      // Handle mixed jnro + no jnro situations
      function jnroSort(item) {
        return _.isNumber(item.jnro) ? item.jnro : Number.MAX_SAFE_INTEGER;
      }
      return _(aineet).sortBy(jnroSort).sortBy(Utils.nameSort).sortBy(jnroSort).value();
    }

    return {
      rakennaVuosiluokkakokonaisuuksienMenu: rakennaVuosiluokkakokonaisuuksienMenu
    }
  });
