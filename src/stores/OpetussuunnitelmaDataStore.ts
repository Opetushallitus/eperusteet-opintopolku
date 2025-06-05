import _ from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Location } from 'vue-router';
import mime from 'mime';
import { YlopsNavigationNodeDto,
  baseURL,
  Dokumentit,
  DokumentitParams,
  Liitetiedostot,
  LiitetiedostotParam,
  Opetussuunnitelmat,
  Termisto,
  OpetussuunnitelmatJulkiset,
  OpetussuunnitelmaExportDto,
  DokumenttiDtoTilaEnum,
} from '@shared/api/ylops';

import { Kielet } from '@shared/stores/kieli';
import {
  baseURL as perusteBaseURL,
  Liitetiedostot as PerusteLiitetiedostot,
  LiitetiedostotParam as PerusteLiitetiedostotParam,
  Perusteet,
  PerusteKaikkiDto,
  Termit,
  Julkaisut,
} from '@shared/api/eperusteet';
import {
  buildNavigation,
  buildTiedot,
  filterNavigation,
  NavigationFilter,
  NavigationNode,
} from '@shared/utils/NavigationBuilder';
import { IOpetussuunnitelmaStore } from './IOpetussuunitelmaStore';
import { deepFind } from '@shared/utils/helpers';
import { pinia } from '@/pinia';

const PaikallisetKielet = new Set(['VK', 'EN', 'LA', 'RA', 'SM', 'SA', 'VE', 'IA', 'EA', 'PO', 'KI', 'JP', 'AR', 'KX']);
interface NavigationQueryResult { parent: YlopsNavigationNodeDto | null, target: YlopsNavigationNodeDto }

export const useOpetussuunnitelmaDataStore = (key) => {
  const store = defineStore('opetussuunnitelmaData-'+key, () => {
    // Individual refs instead of state object
    const opetussuunnitelma = ref<OpetussuunnitelmaExportDto | null>(null);
    const opetussuunnitelmaPerusteenId = ref<number | null>(null);
    const opetussuunnitelmaId = ref<number>(0);
    const esikatselu = ref<boolean | undefined>(undefined);
    const revision = ref<number | undefined>(undefined);
    const navigation = ref<YlopsNavigationNodeDto | null>(null);
    const dokumentti = ref<string | null>(null);
    const currentRoute = ref<Location | null>(null);
    const sidenavFilter = ref<NavigationFilter>({
      label: '',
      isEnabled: false,
    });
    const perusteTermit = ref<object[] | null>(null);
    const perusteKuvat = ref<object[] | null>(null);
    const termit = ref<object[] | null>(null);
    const kuvat = ref<object[] | null>(null);
    const perusteKaikki = ref<PerusteKaikkiDto | null>(null);

    // Static create method as a regular function
    const create = async (opsId: number, rev: number | undefined = undefined) => {
      opetussuunnitelmaId.value = opsId;
      revision.value = rev;
      await init();
    };

    // Actions
    const init = async () => {
      await Promise.all([
        fetchOpetussuunnitelma(),
        fetchNavigation(),
        fetchTermit(),
        fetchKuvat(),
      ]);

      await getDokumentti();

      if (opetussuunnitelmaPerusteenId.value) {
        await Promise.all([
          fetchPerusteTermit(opetussuunnitelmaPerusteenId.value),
          fetchPerusteKuvat(opetussuunnitelmaPerusteenId.value),
        ]);
      }

      if (opetussuunnitelma.value?.peruste) {
        const perusteenJulkaisut = (await Julkaisut.getKaikkiJulkaisut(opetussuunnitelma.value.peruste.id!)).data;
        const maxRev = _.max(_.map(perusteenJulkaisut, 'revision'));
        const rev = _.chain(perusteenJulkaisut)
          .filter(julkaisu => julkaisu.luotu! >= (opetussuunnitelma.value?.peruste?.globalVersion?.aikaleima || 0))
          .sortBy('luotu')
          .first()
          .get('revision')
          .value();

        perusteKaikki.value = (await Perusteet.getKokoSisalto(opetussuunnitelma.value.peruste.id!, rev !== maxRev ? rev : undefined)).data;
      }
    };

    const fetchOpetussuunnitelma = async () => {
      opetussuunnitelma.value = null;
      opetussuunnitelmaPerusteenId.value = null;
      opetussuunnitelma.value = (await OpetussuunnitelmatJulkiset.getOpetussuunnitelmaJulkaistu(opetussuunnitelmaId.value, revision.value)).data;
      opetussuunnitelmaPerusteenId.value = opetussuunnitelma.value.perusteenId ? opetussuunnitelma.value.perusteenId : null;
    };

    const getJulkaistuSisalto = (filter: any) => {
      return deepFind(filter, opetussuunnitelma.value);
    };

    const getJulkaistuPerusteSisalto = (filter: any) => {
      return deepFind(filter, perusteKaikki.value);
    };

    const fetchPerusteTermit = async (perusteenId: number) => {
      perusteTermit.value = null;
      perusteTermit.value = (await Termit.getAllTermit(perusteenId)).data;
    };

    const fetchPerusteKuvat = async (perusteenId: number) => {
      perusteKuvat.value = null;
      perusteKuvat.value = _.map((await PerusteLiitetiedostot.getAllKuvat(perusteenId)).data, kuva => ({
        id: kuva.id!,
        kuva,
        src: perusteBaseURL + PerusteLiitetiedostotParam.getKuva(perusteenId, getKuvaFilename(kuva)).url,
      }));
    };

    const getKuvaFilename = (liite: any) => {
      return liite.id! + '.' + mime.getExtension(liite.mime);
    };

    const fetchTermit = async () => {
      termit.value = null;
      termit.value = (await Termisto.getAllTermit(opetussuunnitelmaId.value)).data;
    };

    const fetchKuvat = async () => {
      kuvat.value = null;
      kuvat.value = _.map((await Liitetiedostot.getAllLiitteet(opetussuunnitelmaId.value)).data, kuva => ({
        id: kuva.id!,
        kuva,
        src: baseURL + LiitetiedostotParam.getLiitetiedosto(opetussuunnitelmaId.value, getLiiteFilename(kuva)).url,
      }));
    };

    const getLiiteFilename = (liite: any) => {
      return liite.id! + '.' + mime.getExtension(liite.tyyppi);
    };

    const findBy = (navi: YlopsNavigationNodeDto, fn: (value: YlopsNavigationNodeDto) => boolean, parent: YlopsNavigationNodeDto | null = null): NavigationQueryResult[] => {
      const result: NavigationQueryResult[] = [];

      if (fn(navi)) {
        result.push({
          parent,
          target: navi,
        });
      }

      for (const ch of (navi.children || [])) {
        const nodes = findBy(ch, fn, navi);
        if (nodes) {
          result.push(...nodes);
        }
      }

      return result;
    };

    const findByKoodi = (navi: YlopsNavigationNodeDto, koodi: string) => {
      return findBy(navi, (node) => {
        const kohde = _.toString(_.get(node, 'meta.koodi'));
        return (kohde === koodi || _.get(kohde, 'arvo') === koodi);
      });
    };

    const findByTyyppi = (navi: YlopsNavigationNodeDto, tyyppi: string) => {
      return findBy(navi, (node) => node.type === tyyppi);
    };

    const movePaikallisetOppiaineet = (navi: YlopsNavigationNodeDto) => {
      const vieraatKielet = findByKoodi(navi, 'VK');
      if (!_.isEmpty(vieraatKielet)) {
        const paikallisetOppiaineet = findByTyyppi(navi, 'poppiaine');
        const paikallisetKielet = _(paikallisetOppiaineet)
          .filter((node: any) => {
            const start = (_.get(node, 'target.meta.koodi') || '').substr(0, 2);
            return PaikallisetKielet.has(start);
          })
          .value();

        let vk = vieraatKielet[0].target; {
          const op = findByTyyppi(vk, 'oppimaarat');
          if (!_.isEmpty(op)) {
            vk = _.first(op)!.target;
          }
        }
        const paikalliset: YlopsNavigationNodeDto[] = [];

        for (const paikallinen of paikallisetKielet) {
          _.remove(paikallinen.parent!.children || [], { id: paikallinen.target.id });
          paikalliset.push(paikallinen.target);
        }

        vk.children = [...(vk.children || []), ..._.sortBy(paikalliset, 'meta.koodi')];
      }
    };

    const fetchNavigation = async () => {
      navigation.value = null;
      const navData = (await Opetussuunnitelmat.getNavigationPublic(opetussuunnitelmaId.value, Kielet.getSisaltoKieli.value, revision.value)).data;
      movePaikallisetOppiaineet(navData);
      navigation.value = navData;
    };

    const getDokumentti = async () => {
      dokumentti.value = null;
      const sisaltoKieli = Kielet.getSisaltoKieli.value;

      if (esikatselu.value) {
        const dokumenttiId = (await Dokumentit.getLatestDokumenttiId(opetussuunnitelmaId.value, sisaltoKieli)).data;
        asetaKielenDokumentti(dokumenttiId);
      }
      else {
        const julkaistuDokumentti = (await Dokumentit.getJulkaistuDokumentti(opetussuunnitelmaId.value, sisaltoKieli)).data;
        if (julkaistuDokumentti?.tila === _.toLower(DokumenttiDtoTilaEnum.VALMIS)) {
          asetaKielenDokumentti(julkaistuDokumentti.id);
        }
      }

      if (dokumentti.value === null) {
        dokumentti.value = '';
      }
    };

    const asetaKielenDokumentti = (dokumenttiId: any) => {
      if (dokumenttiId) {
        dokumentti.value = baseURL + DokumentitParams.get(_.toString(dokumenttiId)).url;
      }
    };

    const updateRoute = (route: any) => {
      currentRoute.value = route;
    };

    const updateFilter = _.debounce((filter: NavigationFilter) => {
      sidenavFilter.value = filter;
    }, 300);

    // Computed properties (getters)
    const tila = computed(() => opetussuunnitelma.value?.tila);

    const kaikkiTermit = computed(() => [...(termit.value || []), ...(perusteTermit.value || [])]);

    const koulutustyyppi = computed(() => opetussuunnitelma.value?.koulutustyyppi);

    const sidenavLoading = computed(() => {
      return !opetussuunnitelma.value || !navigation.value;
    });

    const sidenav = computed(() => {
      if (!opetussuunnitelma.value || !navigation.value) {
        return null;
      }
      else {
        return buildNavigation(navigation.value, null, true, revision.value);
      }
    });

    const flattenedSidenav = computed(() => {
      const root = sidenav.value;
      const result: Array<NavigationNode> = [];

      function traverseTree(node: NavigationNode) {
        result.push(node);
        (node.children || [])
          .map(child => {
            traverseTree(child);
            return child;
          });
      }

      if (root) {
        traverseTree(root);
      }

      return result;
    });

    const navigationByUri = computed(() => {
      if (!flattenedSidenav.value) {
        return {};
      }

      const koodit = _.chain(flattenedSidenav.value)
        .filter('meta.koodi.uri')
        .keyBy('meta.koodi.uri')
        .value();

      const rawKoodit = _.chain(flattenedSidenav.value)
        .filter('meta.koodi')
        .filter(node => _.isString(node.meta.koodi))
        .keyBy('meta.koodi')
        .value();

      return _.assign(koodit, rawKoodit);
    });

    const oppiaineetNavigationByUri = computed(() => {
      if (!flattenedSidenav.value) {
        return {};
      }

      const koodit = _.chain(flattenedSidenav.value)
        .filter(node => node.type === 'oppiaine' || node.type === 'poppiaine')
        .filter('meta.koodi.uri')
        .keyBy('meta.koodi.uri')
        .value();

      const rawKoodit = _.chain(flattenedSidenav.value)
        .filter(node => node.type === 'oppiaine' || node.type === 'poppiaine')
        .filter('meta.koodi')
        .filter(node => _.isString(node.meta.koodi))
        .keyBy('meta.koodi')
        .value();
      return _.assign(koodit, rawKoodit);
    });

    const current = computed(() => {
      if (flattenedSidenav.value && currentRoute.value) {
        for (const node of flattenedSidenav.value) {
          if (node.location && _.isMatch(currentRoute.value, node.location)) {
            return node || null;
          }
        }
      }
      return null;
    });

    const collapsedSidenav = computed(() => {
      if (!sidenav.value) {
        return null;
      }

      const pathKeys = _.map(_.get(current.value, 'path'), 'key');
      const onPath = (node: any) => {
        const parent = node.path[_.size(node.path) - 2];
        return _.includes(pathKeys, node.key)
            || (parent && _.includes(pathKeys, parent.key));
      };

      const map = (value: any, depth = 0) => {
        return {
          ...value,
          isVisible: !current.value || depth === 1 || onPath(value),
          children: _.map(value.children, child => map(child, depth + 1)),
        };
      };

      return map(sidenav.value);
    });

    const filteredSidenav = computed(() => {
      if (sidenavFilter.value.isEnabled) {
        return filterNavigation(sidenav.value, sidenavFilter.value);
      }
      else {
        return collapsedSidenav.value;
      }
    });

    // Group all getters and actions
    const getters = {
      tila,
      kaikkiTermit,
      koulutustyyppi,
      sidenavLoading,
      sidenav,
      collapsedSidenav,
      filteredSidenav,
      flattenedSidenav,
      navigationByUri,
      oppiaineetNavigationByUri,
      current,
    };

    const actions = {
      create,
      init,
      fetchOpetussuunnitelma,
      getJulkaistuSisalto,
      getJulkaistuPerusteSisalto,
      fetchPerusteTermit,
      fetchPerusteKuvat,
      getKuvaFilename,
      fetchTermit,
      fetchKuvat,
      getLiiteFilename,
      findBy,
      findByKoodi,
      findByTyyppi,
      movePaikallisetOppiaineet,
      fetchNavigation,
      getDokumentti,
      asetaKielenDokumentti,
      updateRoute,
      updateFilter,
    };

    return {
      // Expose refs
      opetussuunnitelma,
      opetussuunnitelmaPerusteenId,
      opetussuunnitelmaId,
      esikatselu,
      revision,
      navigation,
      dokumentti,
      currentRoute,
      sidenavFilter,
      perusteTermit,
      perusteKuvat,
      termit,
      kuvat,
      perusteKaikki,

      // Expose getters and actions
      ...getters,
      ...actions,
    };
  });

  return store(pinia);
};
