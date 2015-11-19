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
  .factory('epLukioUtils', function () {
    return {
      flattenNames: function (lapset){
        var flattenedLastenNimet = [];
        function eachName(lapset){
          _.each(lapset, function(item){
            flattenedLastenNimet.push({name: item.$osa.nimi, _id: item._perusteenOsa});
            if (item.lapset && item.lapset.length > 0){
              return eachName(item.lapset);
            }
          });
        }
        eachName(lapset);
        return flattenedLastenNimet;
      },
      flattenAndZipOppiaineet: function (oppiaineet) {
        return _.reduce(oppiaineet, function (all, oppiaine, index) {
          if (!_.isEmpty(oppiaine.oppimaarat)) {
            _.each(oppiaine.oppimaarat, function (oppimaara) {
              all.push(oppimaara);
            });
          }
          all.push(oppiaine);
          if (oppiaineet.length - 1 === index) {
            return _.zipBy(all, 'id');
          }
          return all;
        }, []);
      },
      reduceKurssit: function (kurssit) {
        return _.reduce(kurssit, function(kaikkiKurssit, oppiaine){
          if(!_.isEmpty(oppiaine.oppimaarat)) {
            _.each(oppiaine.oppimaarat, function(oppimaara){
              if(!_.isEmpty(oppimaara.kurssit)) {
                _(oppimaara.kurssit)
                  .map(function(kurssi){
                    kurssi.oppiaineNimi = oppimaara.nimi;
                    return kurssi;
                  })
                  .each(function(kurssi) {
                    kaikkiKurssit.push(kurssi);
                  }).value();
              }
            });
          }
          if(!_.isEmpty(oppiaine.kurssit)){
            _(oppiaine.kurssit)
              .map(function(kurssi) {
                kurssi.oppiaineNimi = oppiaine.nimi;
                return kurssi;
              })
              .each(function(kurssi){
                kaikkiKurssit.push(kurssi);
              }).value();
          }
          return kaikkiKurssit;
        }, []);
      }
    };
  })

  .factory('epLukioTabService', function ($state) {
    return {
      tabClassSelector: function(tabName) {
        var className = null;
        switch(tabName) {
          case 'tavoitteet':
            className = _.endsWith($state.current.name, tabName) ? true : null;
            break;
          case 'aihekokonaisuudet':
            className = _.endsWith($state.current.name, tabName) ? true : null;
            break;
          case 'sisalto':
            className = !_.endsWith($state.current.name, 'tavoitteet') && !_.endsWith($state.current.name, 'aihekokonaisuudet') ? true : null;
            break;
          default:
            className = null;
        }
        return className;
    },
      tabs: [
      {
        title: {
          oppiaine: 'oppiaineen-sisalto',
          kurssi: 'kurssin-sisalto'
        },
        name: 'sisalto',
        url: function(name){
          if (name === 'kurssi') {
            return 'root.lukio.kurssi';
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine';
          }
        }
      },
      {
        title: {
          oppiaine: 'opetuksen-yleiset-tavoitteet',
          kurssi: 'opetuksen-yleiset-tavoitteet'
        },
        name: 'tavoitteet',
        url: function (name) {
          if (name === 'kurssi') {
            return 'root.lukio.kurssi.tavoitteet';
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine.tavoitteet';
          }
        }
      },
      {
        title:  {
          oppiaine: 'aihekokonaisuudet',
          kurssi: 'aihekokonaisuudet'
        },
        name: 'aihekokonaisuudet',
        url: function (name) {
          if (name === 'kurssi') {
            return 'root.lukio.kurssi.aihekokonaisuudet';
          }
          if (name === 'oppiaine') {
            return 'root.lukio.oppiaine.aihekokonaisuudet';
          }
        }
      }
      ]
    };
  });
