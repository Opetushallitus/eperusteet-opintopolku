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

    function sortVlk(vlk){
      return _(vlk)
        .map('vuosiluokkakokonaisuus')
        .sortBy(function(vlk){
          return _.reduce(vlk.nimi.fi.replace(/\D/g, '').split(''), function(sum, num){
            return sum + parseInt(num);
          },0);
        })
        .value();
    }

    function createMenuByYear(vlk){
      let menu = [];

      function createYears(numbs, tunniste){
        let start = parseInt(numbs[0]);
        let stop = numbs[1] ? parseInt(numbs[1])+1 : start+1;
        for (let i = start; i < stop; i++) {
          menu.push({
            vuosi: "vuosiluokka_" + i,
            _tunniste: tunniste,
            vuosi_num : i
          });
        }
      }
      _.each(vlk, function(v){
        menu.push(v);
        let nimi = v.nimi.fi || v.nimi.sv;
        let numbs = nimi.replace(/\D/g, '').split('');
        createYears(numbs, v._tunniste);
      });

      return menu;
    }

    function rakennaVuosiluokkakokonaisuuksienMenu(vlkt, aineet) {

      let vlkWithYears = createMenuByYear(vlkt);

      var arr = [];
      var lastVlk = null;
      var currentVuosi = null;
      _.each(vlkWithYears, function (vlk) {
        if (!vlk.vuosi) {
          lastVlk = vlk;
          arr.push({
            $vkl: vlk,
            label: vlk.nimi,
            depth: 0,
            url: $state.href('root.ops.perus.vuosiluokkakokonaisuus', {vlkId: vlk.id})
          });
          return arr;
        }
        arr.push({
          $vuosi: vlk.vuosi,
          label: vlk.vuosi,
          $vuosi_num: vlk.vuosi_num,
          $hidden: true,
          vlk: lastVlk.nimi,
          depth: 1,
          url: $state.href('root.ops.perus.vuosiluokka', {vuosi: vlk.vuosi_num})
        });
        currentVuosi = vlk.vuosi;
        traverseOppiaineet(aineet, arr, vlk._tunniste, 2, currentVuosi);
      });
      return arr;
    }

    function traverseOppiaineet(aineet, arr, vlk, startingDepth, currentVuosi, years) {
      startingDepth = startingDepth || 0;
      let currentVlkt = [];
      let currentYears = years || arr[arr.length-1].vlk.fi.replace(/\D/g, '').split('')
                            || arr[arr.length-1].vlk.svreplace(/\D/g, '').split('');
      let start = parseInt(currentYears[0]);
      let stop = currentYears[1] ? parseInt(currentYears[1])+1 : start+1;
      for (let i = start; i < stop; i++) {
        currentVlkt.push("vuosiluokka_" + i);
      }
      let isSisalto = startingDepth === 0;
      let vlks = _.isArray(vlk) ? vlk : [vlk];
      let oaFiltered = _(aineet).filter(function(oa) {
        let oppiaineHasVlk = _.some(oa.vuosiluokkakokonaisuudet, function(oavkl) {
          return _.some(vlks, function (oneVlk) {
            return '' + oavkl._vuosiluokkakokonaisuus === '' + oneVlk;
          });
        });
        let oppimaaraVlkIds = _(oa.oppimaarat).map(function (oppimaara) {
          return _.map(oppimaara.vuosiluokkakokonaisuudet, '_vuosiluokkaKokonaisuus');
        }).flatten().uniq().value();
        let vlkIds = _.map(vlks, String);
        return oppiaineHasVlk || !_.isEmpty(_.intersection(oppimaaraVlkIds, vlkIds));
      }).value();

      function hasVuosiluoka(vuodet){
        return _.indexOf(vuodet, currentVuosi) > -1;
      }

      function hasNoVuosiluoka(vuodet){
        return _.isEmpty(_.intersection(currentVlkt, vuodet));
      }

      function oppimaaratHasVuosiLuoka(opmt){
        return _.filter(opmt, function(op){
          return _.indexOf(op.vuosiluokat, currentVuosi) > -1
        });
      }

      let belongsInCurrentYear = _(oaFiltered).filter(function(oa){
                                  return hasVuosiluoka(oa.vuosiluokat)
                                    || hasNoVuosiluoka(oa.vuosiluokat)
                                    || (oa.oppimaarat && oppimaaratHasVuosiLuoka(oa.oppimaarat));
                                  }).value();

      _.each(oppiaineSort(belongsInCurrentYear), function (oa) {
        buildOppiaineItem(arr, oa, vlks, startingDepth, isSisalto, currentVuosi);
        if(oa.koosteinen && oa.oppimaarat.length > 0) {
          traverseOppiaineet(oa.oppimaarat, arr, vlk, 3, currentVuosi, currentYears)
        }
        /*_.each(filteredOppimaarat(oa, vlks), function (oppimaara) {
          buildOppiaineItem(arr, oppimaara, vlks, startingDepth + 1, isSisalto);
        });*/
      });
    }

    /*function filteredOppimaarat(oppiaine, vlks) {
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
    }*/

    function buildOppiaineItem(arr, oppiaine, vlk, depth, isSisalto, currentVuosi) {
      if (!oppiaine.nimi[Kieli.getSisaltokieli()]) {
        return;
      }
      arr.push({
        depth: depth,
        $hidden: depth > 0,
        $oppiaine: oppiaine,
        label: oppiaine.nimi,
        $parent_vuosi: currentVuosi,
        url: isSisalto ? $state.href('root.ops.perus.sisallot', {oppiaineId: oppiaine.id}) :
          $state.href('root.ops.perus.vlkoppiaine', {vlkId: vlk[0], oppiaineId: oppiaine.id})
      });
    }

    function oppiaineSort(aineet) {
      // Handle mixed jnro + no jnro situations
      function jnroSort(item) {
        return _.isNumber(item.jnro) ? item.jnro : 10000000;
      }
      return _(aineet).sortBy(jnroSort).sortBy(Utils.nameSort).sortBy(jnroSort).value();
    }

    return {
      sortVlk: sortVlk,
      rakennaVuosiluokkakokonaisuuksienMenu: rakennaVuosiluokkakokonaisuuksienMenu
    }
  });
