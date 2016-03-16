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
  .factory('opsMenuBuilders', function (Algoritmit, $state, Kieli, Utils) {

    const createMenuByYear = (vlk) => {
      let menu = [];
      const createYears = (numbs, tunniste) => {
        let start = parseInt(numbs[0]);
        let stop = numbs[1] ? parseInt(numbs[1])+1 : start+1;
        for (let i = start; i < stop; i++) {
          menu.push({
            vuosi: "vuosiluokka_" + i,
            _tunniste: tunniste,
            vuosi_num : i
          });
        }
      };
      _.each(vlk, function(v){
        menu.push(v);
        let nimi = v.nimi.fi || v.nimi.sv;
        let numbs = nimi.replace(/\D/g, '').split('');
        createYears(numbs, v._tunniste);
      });
      return menu;
    };

    var vlkMap = {};

    const rakennaVuosiluokkakokonaisuuksienMenu = (vlkt, aineet) => {

      vlkMap = _.indexBy(vlkt, '_tunniste');
      let vlkWithYears = createMenuByYear(vlkt);
      let arr = [];
      let lastVlk = null;
      let currentVuosi = null;

      _.each(vlkWithYears, function (vlk) {
        let vlkId = vlkMap[vlk._tunniste]['id'];
        if (!vlk.vuosi) {
          lastVlk = vlk;
          arr.push({
            $vkl: vlk,
            label: vlk.nimi,
            depth: 0,
            url: $state.href('root.ops.perusopetus.vuosiluokkakokonaisuus', {vlkId: vlk.id})
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
          url: $state.href('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka', {vlkId: vlkId, vuosi: vlk.vuosi_num})
        });
        currentVuosi = vlk.vuosi;
        traverseOppiaineet(aineet, arr, vlk._tunniste, 2, currentVuosi, null);
      });
      return arr;
    };

    //create an array of labels for the current vuosiloukat
    const createEachYearLabel = (arr, currentYears) => {
      let currentVlkt = [];
      let start = parseInt(currentYears[0]);
      let stop = currentYears[1] ? parseInt(currentYears[1])+1 : start+1;
      for (let i = start; i < stop; i++) {
        currentVlkt.push("vuosiluokka_" + i);
      }
      return currentVlkt;
    };

    const oppiaineSort = (aineet, vlk=null) => {
      // Handle mixed jnro + no jnro situations
      const jnroSort= (item) => {
        let target = _(item.vuosiluokkakokonaisuudet).filter((v) => {
          return v._vuosiluokkakokonaisuus === vlk;
        }).map('jnro').first();
        return _.isNumber(target) ? target : 10000000;
      };
      return _(aineet).sortBy(jnroSort).sortBy(Utils.nameSort).sortBy(jnroSort).value();
    };

    function traverseOppiaineet(aineet, arr, vlk, startingDepth, currentVuosi, years) {
      let depth = startingDepth || 0;
      let currentYears = years
        || arr[arr.length-1].vlk.fi.replace(/\D/g, '').split('')
        || arr[arr.length-1].vlk.sv.replace(/\D/g, '').split('');

      let currentVlkt = createEachYearLabel(arr, currentYears);
      let isSisalto = depth === 0;

      /**
       * 1. include in a VLK, e.g. 'Vuosiluokat 1-2', if an oppiaine/oppimaara contains the TUNNISTE of that set of years
       * 2. then, include the oppiaine/maara in every year for that VLK if no vuosiluokat are specified for that VLK
       * 3. otherwise only include in the years specified in VUOSILUOKAT array on the oppiaine object
       */
      //NEW BUILDER
      let filteredAineet =
        _(aineet).filter( (oa) => {
          return _.reduce(oa.vuosiluokkakokonaisuudet, (col, item, index, all) => {
            if (item._vuosiluokkakokonaisuus === vlk) {
              _.isEmpty(item.vuosiluokat) ? col.unshift("all") : col.unshift(item.vuosiluokat);
            }
            if (all.length - 1 === index) {
              if(_.isEmpty(col)) return false;
              return !!_.filter(_.flatten(col), function(item){
                return (item === "all") ? true : item.vuosiluokka === currentVuosi;
              }).length;
            }
            return col;
          }, [])
        }).value();

      _.each(oppiaineSort(filteredAineet, vlk), function (oa) {
        buildOppiaineItem(arr, oa, vlk, depth, isSisalto, currentVuosi, {'menuType': 'vuosiluokittain'});
        if(oa.koosteinen && oa.oppimaarat.length > 0) {
          traverseOppiaineet(oa.oppimaarat, arr, vlk, 3, currentVuosi, currentYears)
        }
      });
    }

    function buildOppiaineItem(arr, oppiaine, vlk, depth, isSisalto, currentVuosi, opts) {
      if (!oppiaine.nimi[Kieli.getSisaltokieli()]) {
        return;
      }
      let vlkId = vlk ? vlkMap[vlk]['id'] : null;
      let currentYear = currentVuosi ? currentVuosi[currentVuosi.length-1] : null;
      let type = oppiaine.tyyppi === 'yhteinen';
      let oppiaineUrl;
      if (opts['menuType'] === 'vuosiluokittain') {
        oppiaineUrl = type ? $state.href('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.oppiaine', {
          vlkId: vlkId,
          vuosi: currentYear,
          oppiaineId: oppiaine.id
        })
          : $state.href('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka.valinainenoppiaine', {
          vlkId: vlkId,
          vuosi: currentYear,
          oppiaineId: oppiaine.id
        });
      }
      if (opts['menuType'] === 'oppiaineetMenu') {
        oppiaineUrl = type ? $state.href('root.ops.perusopetus.oppiaineet', {
          oppiaineId: oppiaine.id
        })
          : $state.href('root.ops.perusopetus.valinnaisetoppiaineet', {
          oppiaineId: oppiaine.id
        });
      }

      arr.push({
        depth: depth,
        $hidden: depth > 0,
        $oppiaine: oppiaine,
        label: oppiaine.nimi,
        $parent_vuosi: currentVuosi,
        $tyyppi: oppiaine.tyyppi,
        url: oppiaineUrl
      });
    }

    const rakennaOppiaineetMenu = (oppiaineet) => {
      let menu = [];
      _.each(oppiaineSort(oppiaineet), function (oa) {
        buildOppiaineItem(menu, oa, null, 0, null, null, {'menuType': 'oppiaineetMenu'});
        if(oa.koosteinen && oa.oppimaarat.length > 0) {
          _.each(oppiaineSort(oa.oppimaarat), function (om) {
            buildOppiaineItem(menu, om, null, 1, null, null, {'menuType': 'oppiaineetMenu'});
          });
        }
      });
      return menu;
    };

    const hasChild = (allChildren, id) => {
      return _.includes(allChildren, id);
    };

    const makeMenu = (current, depth, menu, map, otsikot, parent, isChild) => {
      if(!otsikot.length) return menu;
      let teksti = map[current.id];
      if (teksti.tekstiKappale) {
        menu.push({
          depth: depth,
          $hidden: depth > 0,
          parent: parent,
          $id: teksti.id,
          label: teksti.tekstiKappale.nimi,
          url: $state.href('root.amops.tekstikappale', {tekstikappaleId: teksti.id})
        });
      }
      if(current.lapset.length) {
        depth++;
        _.each(current.lapset, function(lapsiId) {
          otsikot.splice(_.indexOf(otsikot, map[lapsiId]),1);
          return makeMenu(map[lapsiId], depth, menu, map, otsikot, current.id, isChild)})
      }
      let next = otsikot.shift();
      if (next && isChild(next.id)) return makeMenu(next, depth, menu, map, otsikot, parent, isChild);
      else return makeMenu(next, -1, menu, map, otsikot, null, isChild)

    };

    const rakennaAmopsTekstikappaleMenu = (otsikot) => {
      let map = _.indexBy(otsikot, 'id');
      let children = _.reduce(otsikot, (allChildren, teksti) => {
        return allChildren.concat(teksti.lapset);
      },[]);
      return makeMenu(otsikot.shift(), -1, [], map, otsikot, null, _.partial(hasChild, children));
    };

    return {
      rakennaOppiaineetMenu: rakennaOppiaineetMenu,
      rakennaVuosiluokkakokonaisuuksienMenu: rakennaVuosiluokkakokonaisuuksienMenu,
      rakennaAmopsTekstikappaleMenu: rakennaAmopsTekstikappaleMenu
    }
  });
