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
angular.module('app')
    .factory('opsUtils', function (Algoritmit, $state, Kieli, Utils) {
    var sortVlk = function (vlk) {
        return _(vlk)
            .map('vuosiluokkakokonaisuus')
            .sortBy(function (vlk) {
            return _.reduce(vlk.nimi.fi.replace(/\D/g, '').split(''), function (sum, num) {
                return sum + parseInt(num);
            }, 0);
        })
            .value();
    };
    var createMenuByYear = function (vlk) {
        var menu = [];
        var createYears = function (numbs, tunniste) {
            var start = parseInt(numbs[0]);
            var stop = numbs[1] ? parseInt(numbs[1]) + 1 : start + 1;
            for (var i = start; i < stop; i++) {
                menu.push({
                    vuosi: "vuosiluokka_" + i,
                    _tunniste: tunniste,
                    vuosi_num: i
                });
            }
        };
        _.each(vlk, function (v) {
            menu.push(v);
            var nimi = v.nimi.fi || v.nimi.sv;
            var numbs = nimi.replace(/\D/g, '').split('');
            createYears(numbs, v._tunniste);
        });
        return menu;
    };
    var vlkMap = {};
    var rakennaVuosiluokkakokonaisuuksienMenu = function (vlkt, aineet) {
        vlkMap = _.indexBy(vlkt, '_tunniste');
        var vlkWithYears = createMenuByYear(vlkt);
        var arr = [];
        var lastVlk = null;
        var currentVuosi = null;
        _.each(vlkWithYears, function (vlk) {
            var vlkId = vlkMap[vlk._tunniste]['id'];
            if (!vlk.vuosi) {
                lastVlk = vlk;
                arr.push({
                    $vkl: vlk,
                    label: vlk.nimi,
                    depth: 0,
                    url: $state.href('root.ops.perusopetus.vuosiluokkakokonaisuus', { vlkId: vlk.id })
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
                url: $state.href('root.ops.perusopetus.vuosiluokkakokonaisuus.vuosiluokka', { vlkId: vlkId, vuosi: vlk.vuosi_num })
            });
            currentVuosi = vlk.vuosi;
            traverseOppiaineet(aineet, arr, vlk._tunniste, 2, currentVuosi, null);
        });
        return arr;
    };
    var createEachYearLabel = function (arr, currentYears) {
        var currentVlkt = [];
        var start = parseInt(currentYears[0]);
        var stop = currentYears[1] ? parseInt(currentYears[1]) + 1 : start + 1;
        for (var i = start; i < stop; i++) {
            currentVlkt.push("vuosiluokka_" + i);
        }
        return currentVlkt;
    };
    var oppiaineSort = function (aineet) {
        var jnroSort = function (item) {
            return _.isNumber(item.jnro) ? item.jnro : 10000000;
        };
        return _(aineet).sortBy(jnroSort).sortBy(Utils.nameSort).sortBy(jnroSort).value();
    };
    function traverseOppiaineet(aineet, arr, vlk, startingDepth, currentVuosi, years) {
        var depth = startingDepth || 0;
        var currentYears = years
            || arr[arr.length - 1].vlk.fi.replace(/\D/g, '').split('')
            || arr[arr.length - 1].vlk.sv.replace(/\D/g, '').split('');
        var currentVlkt = createEachYearLabel(arr, currentYears);
        var isSisalto = depth === 0;
        var filteredAineet = _(aineet).filter(function (oa) {
            return _.reduce(oa.vuosiluokkakokonaisuudet, function (col, item, index, all) {
                if (item._vuosiluokkakokonaisuus === vlk) {
                    _.isEmpty(item.vuosiluokat) ? col.unshift("all") : col.unshift(item.vuosiluokat);
                }
                if (all.length - 1 === index) {
                    if (_.isEmpty(col))
                        return false;
                    return !!_.filter(_.flatten(col), function (item) {
                        return (item === "all") ? true : item.vuosiluokka === currentVuosi;
                    }).length;
                }
                return col;
            }, []);
        }).value();
        _.each(oppiaineSort(filteredAineet), function (oa) {
            buildOppiaineItem(arr, oa, vlk, depth, isSisalto, currentVuosi, { 'menuType': 'vuosiluokittain' });
            if (oa.koosteinen && oa.oppimaarat.length > 0) {
                traverseOppiaineet(oa.oppimaarat, arr, vlk, 3, currentVuosi, currentYears);
            }
        });
    }
    function buildOppiaineItem(arr, oppiaine, vlk, depth, isSisalto, currentVuosi, opts) {
        if (!oppiaine.nimi[Kieli.getSisaltokieli()]) {
            return;
        }
        var vlkId = vlk ? vlkMap[vlk]['id'] : null;
        var currentYear = currentVuosi ? currentVuosi[currentVuosi.length - 1] : null;
        var type = oppiaine.tyyppi === 'yhteinen';
        var oppiaineUrl;
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
    var rakennaOppiaineetMenu = function (oppiaineet) {
        var menu = [];
        _.each(oppiaineSort(oppiaineet), function (oa) {
            buildOppiaineItem(menu, oa, null, 0, null, null, { 'menuType': 'oppiaineetMenu' });
            if (oa.koosteinen && oa.oppimaarat.length > 0) {
                _.each(oppiaineSort(oa.oppimaarat), function (om) {
                    buildOppiaineItem(menu, om, null, 1, null, null, { 'menuType': 'oppiaineetMenu' });
                });
            }
        });
        return menu;
    };
    var getVlkId = function (vlkt, oppiaine) {
        return _(oppiaine.vuosiluokkakokonaisuudet).filter(function (v) {
            return vlkt._tunniste === v._vuosiluokkakokonaisuus;
        }).map('id').first();
    };
    var getVuosiId = function (vlk, vuosi) {
        var year = 'vuosiluokka_' + vuosi;
        return _(vlk.vuosiluokat).filter(function (v) {
            return v.vuosiluokka === year;
        }).map('id').first();
    };
    var makeSisalto = function (perusteOpVlk, tavoitteet, perusteOppiaine, laajaalaiset, sortHelper) {
        return _(tavoitteet).each(function (item) {
            var perusteSisaltoAlueet = perusteOpVlk ? _.indexBy(perusteOpVlk.sisaltoalueet, 'tunniste') : {};
            var perusteKohdealueet = perusteOppiaine ? _.indexBy(perusteOppiaine.kohdealueet, 'id') : [];
            if (perusteOpVlk) {
                var perusteTavoite = _.find(perusteOpVlk.tavoitteet, function (pTavoite) {
                    return pTavoite.tunniste === item.tunniste;
                });
                item.$tavoite = perusteTavoite.tavoite;
                var alueet = _.map(perusteTavoite.sisaltoalueet, function (tunniste) {
                    return perusteSisaltoAlueet[tunniste] || {};
                });
                if (!_.isEmpty(alueet)) {
                    item.$sisaltoalueet = alueet.sort(function (a, b) {
                        if (sortHelper.indexOf(a.nimi.fi) > sortHelper.indexOf(b.nimi.fi)) {
                            return 1;
                        }
                        if (sortHelper.indexOf(a.nimi.fi) < sortHelper.indexOf(b.nimi.fi)) {
                            return -1;
                        }
                        return 0;
                    });
                    item.sisaltoalueet = item.sisaltoalueet.sort(function (a, b) {
                        if (sortHelper.indexOf(a.sisaltoalueet.nimi.fi) > sortHelper.indexOf(b.sisaltoalueet.nimi.fi)) {
                            return 1;
                        }
                        if (sortHelper.indexOf(a.sisaltoalueet.nimi.fi) < sortHelper.indexOf(b.sisaltoalueet.nimi.fi)) {
                            return -1;
                        }
                        return 0;
                    });
                }
                item.$kohdealue = perusteKohdealueet[_.first(perusteTavoite.kohdealueet)];
                item.$laajaalaiset = _.map(perusteTavoite.laajaalaisetosaamiset, function (tunniste) {
                    return laajaalaiset[tunniste];
                });
                item.$arvioinninkohteet = perusteTavoite.arvioinninkohteet;
            }
        })
            .sortBy('$tavoite')
            .value();
    };
    return {
        sortVlk: sortVlk,
        rakennaOppiaineetMenu: rakennaOppiaineetMenu,
        rakennaVuosiluokkakokonaisuuksienMenu: rakennaVuosiluokkakokonaisuuksienMenu,
        getVlkId: getVlkId,
        getVuosiId: getVuosiId,
        makeSisalto: makeSisalto
    };
});
//# sourceMappingURL=opsutils.js.map
