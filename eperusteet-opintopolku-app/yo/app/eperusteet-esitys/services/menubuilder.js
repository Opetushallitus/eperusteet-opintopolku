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

angular.module('eperusteet.esitys')
.service('epMenuBuilder', function (Algoritmit, $state, Kieli, Utils, epEsitysSettings) {
  function oppiaineSort(aineet) {
    // Handle mixed jnro + no jnro situations
    function jnroSort(item) {
      return _.isNumber(item.jnro) ? item.jnro : Number.MAX_SAFE_INTEGER;
    }
    return _(aineet).sortBy(jnroSort).sortBy(Utils.nameSort).sortBy(jnroSort).value();
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
      url: isSisalto ? $state.href(epEsitysSettings.perusopetusState + '.sisallot', {oppiaineId: oppiaine.id}) :
        $state.href(epEsitysSettings.perusopetusState + '.vlkoppiaine', {vlkId: vlk[0], oppiaineId: oppiaine.id})
    });
  }

  function buildLukioOppiaineMenu(oppiaineet, kurssit) {
    var opMenu = [];

    function addOppimaaraToMenu(oppimaarat) {
      _.each(oppimaarat, function(oppimaara) {
        opMenu.push({
          $id: oppimaara.id,
          depth: 1,
          $jnro: oppimaara.jnro,
          $hidden: true,
          $oppimaara: oppimaara,
          $oppiaine: oppimaara,
          label: oppimaara.nimi[Kieli.getSisaltokieli()],
          url: $state.href('root.lukio.oppiaine', {oppiaineId: oppimaara.id})
      });
    });
  }

    _.each(oppiaineet, function(oppiaine) {
      opMenu.push({
        $id: oppiaine.id,
        depth: 0,
        $jnro: oppiaine.jnro,
        $hidden: false,
        $oppiaine: oppiaine,
        label: oppiaine.nimi[Kieli.getSisaltokieli()],
        url: $state.href('root.lukio.oppiaine', {oppiaineId: oppiaine.id})
      });
      if (_.isArray(oppiaine.oppimaarat) && !_.isEmpty(oppiaine.oppimaarat)) {
        addOppimaaraToMenu(oppiaine.oppimaarat)
      }
    });

    var lastDepth = 2;
    var menuWithKurssit = _(opMenu).map(function(menuItem) {
        return [ menuItem,
            _(kurssit).filter(function(kurssi){
              var oppiaineTarget = _.pick(menuItem, '$id');
              var kursinOppiaineet = _.map(kurssi.oppiaineet, function(op) { return op.oppiaineId });
              return _.indexOf(kursinOppiaineet, oppiaineTarget.$id) > -1;
          })
          .sortBy('oppiaineet[0].jarjestys')
          .reverse()
          .value()
        ]
      })
      .filter(function(obj){
        return !_.isEmpty(obj);
      })
      .flatten()
      .flatten()
      .map(function(obj){
        if(obj.label){
          lastDepth = obj.depth;
          return obj
        }
        return {
          $id: obj.id,
          $hidden: true,
          depth: lastDepth + 1,
          label: obj.nimi,
          $kurssi: obj,
          url: $state.href('root.lukio.kurssi', {kurssiId: obj.id})
        };
      })
      .value();

    console.log(menuWithKurssit);
    return menuWithKurssit;
  }

  function traverseOppiaineet(aineet, arr, vlk, startingDepth) {
    startingDepth = startingDepth || 0;
    var isSisalto = startingDepth === 0;
    var vlks = _.isArray(vlk) ? vlk : [vlk];
    var oaFiltered = _(aineet).filter(function(oa) {
      var oppiaineHasVlk = _.some(oa.vuosiluokkakokonaisuudet, function(oavkl) {
        return _.some(vlks, function (oneVlk) {
          return '' + oavkl._vuosiluokkaKokonaisuus === '' + oneVlk;
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

  function rakennaTekstisisalto(sisalto) {
    var suunnitelma = [];
    Algoritmit.kaikilleLapsisolmuille(sisalto, 'lapset', function(osa, depth) {
      suunnitelma.push({
        $osa: osa,
        label: osa.perusteenOsa ? osa.perusteenOsa.nimi : '',
        depth: depth,
        $hidden: depth > 0
      });
    });
    var levels = {};
    _.each(suunnitelma, function (item, index) {
      levels[item.depth] = index;
      item.$parent = levels[item.depth - 1] || null;
    });
    return suunnitelma;
  }

  function rakennaVuosiluokkakokonaisuuksienSisalto(vlkt, aineet) {
    var arr = [];
    _.each(vlkt, function (vlk) {
      arr.push({
        $vkl: vlk,
        label: vlk.nimi,
        depth: 0,
        url: $state.href(epEsitysSettings.perusopetusState + '.vuosiluokkakokonaisuus', {vlkId: vlk.id})
      });
      traverseOppiaineet(aineet, arr, vlk.id, 1);
    });
    return arr;
  }

  function rakennaSisallotOppiaineet(aineet, sections, selected) {
    var navi = {};
    navi.oppiaineet = [];
    traverseOppiaineet(aineet, navi.oppiaineet, selected);
    _.each(sections, function(v) {
      if (navi[v.id]) {
        v.items = navi[v.id];
      }
    });
  }

  this.filteredOppimaarat = filteredOppimaarat;
  this.buildLukioOppiaineMenu = buildLukioOppiaineMenu;
  this.rakennaTekstisisalto = rakennaTekstisisalto;
  this.rakennaVuosiluokkakokonaisuuksienSisalto = rakennaVuosiluokkakokonaisuuksienSisalto;
  this.rakennaSisallotOppiaineet = rakennaSisallotOppiaineet;
});
