import { defineStore } from 'pinia';
import * as _ from 'lodash';
import {
  NavigationNodeDto,
  Perusteet,
  TermiDto,
  baseURL,
  Dokumentit,
  DokumentitParam,
  Termit,
  Liitetiedostot,
  LiitetiedostotParam,
  TekstiKappaleDto,
  LukioperusteenJulkisetTiedot,
  PerusteKaikkiDto,
  Arviointiasteikot,
  JulkaisuBaseDto, Julkaisut,
  DokumenttiDtoTilaEnum,
  Maaraykset,
  MaaraysDto,
} from '@shared/api/eperusteet';
import { LiiteDtoWrapper } from '@shared/tyypit';
import {
  buildNavigation,
  buildNavigationNode,
  NavigationFilter,
  NavigationNode,
  naytaPerusteTiedotNaviMenussa,
} from '@shared/utils/NavigationBuilder';

import { Location } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';
import { isKoulutustyyppiAmmatillinen, isPerusteVanhaLukio, isYleissivistavaKoulutustyyppi } from '@shared/utils/perusteet';
import { deepFind } from '@shared/utils/helpers';
import { isAmmatillinenKoulutustyyppi } from '../../eperusteet-frontend-utils/vue/src/utils/perusteet';
import { ref, computed } from 'vue';
import { pinia } from '@/pinia';

export const usePerusteDataStore = (key) => {
  const store = defineStore('perusteStore-' + key, () => {

    // State as refs
    const perusteKaikki = ref<PerusteKaikkiDto | null>(null);
    const perusteId = ref<number>(0);
    const esikatselu = ref<boolean | undefined>(undefined);
    const revision = ref<number | undefined>(undefined);
    const navigation = ref<NavigationNodeDto | null>(null);
    const suoritustapa = ref<string | null>(null);
    const currentRoute = ref<Location | null>(null);
    const termit = ref<TermiDto[] | null>(null);
    const kuvat = ref<LiiteDtoWrapper[] | null>(null);
    const dokumentti = ref<string | null>(null);
    const korvaavatPerusteet = ref<any[]>([]);
    const sidenavFilter = ref<NavigationFilter>({
      label: '',
      isEnabled: false,
    });
    const kvLiitteet = ref<any>({});
    const osaamisalaKuvaukset = ref<{ [key: string]: { [key: string]: Array<TekstiKappaleDto>; }; }>({});
    const liitteet = ref<any>({});
    const lukioOppineet = ref<any[]>([]);
    const geneerisetArviointiasteikot = ref<any[]>([]);
    const arviointiasteikot = ref<any[]>([]);
    const julkaisut = ref<JulkaisuBaseDto[] | null>(null);
    const muutosmaaraykset = ref<MaaraysDto[] | null>(null);
    const maarays = ref<MaaraysDto | null>(null);

    // Getters
    const peruste = computed(() => perusteKaikki.value);

    const sidenavLoading = computed(() => {
      return !peruste.value || !navigation.value;
    });

    const sidenav = computed(() => {
      if (!peruste.value || !navigation.value) {
        return null;
      }
      else {
        if (naytaPerusteTiedotNaviMenussa(peruste.value)) {
          let nimi = 'perusteen-tiedot';
          if (isYleissivistavaKoulutustyyppi(peruste.value?.koulutustyyppi)) {
            nimi = 'perusteen-tiedot-yleissivistava';
          }
          if (peruste.value?.tyyppi === 'opas') {
            nimi = 'oppaan-tiedot';
          }

          const tiedot = {
            ...buildNavigationNode('tiedot', nimi, 'perusteTiedot', {
              ...(revision.value && { revision: _.toString(revision.value) }),
            }),
          };

          return buildNavigation(navigation.value, tiedot, false, revision.value);
        }
        else {
          return buildNavigation(navigation.value, null, false, revision.value);
        }
      }
    });

    const collapsedSidenav = computed(() => {
      if (!sidenav.value) {
        return null;
      }

      const pathKeys = _.map(_.get(current.value, 'path'), 'key');
      const onPath = node => {
        const parent = node.path[_.size(node.path) - 2];
        return _.includes(pathKeys, node.key)
            || (parent && _.includes(pathKeys, parent.key));
      };

      const map = (value, depth = 0) => {
        return {
          ...value,
          isVisible: depth === 1 || onPath(value),
          children: _.map(value.children, child => map(child, depth + 1)),
        };
      };

      return map(sidenav.value);
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

    // Actions
    const create = async (id: number, rev?: number) => {
      perusteId.value = id;
      esikatselu.value = rev === 0 ? true : undefined;
      revision.value = rev;
      await init();
    };

    const init = async () => {
      const responses = await Promise.all([
        Perusteet.getKokoSisalto(perusteId.value, revision.value, esikatselu.value) as any,
        Termit.getAllTermit(perusteId.value),
        Liitetiedostot.getAllLiitteet(perusteId.value),
        Maaraykset.getPerusteenJulkaistutMuutosmaaraykset(perusteId.value),
        Perusteet.getKorvattavatPerusteet(perusteId.value),
        Maaraykset.getMaaraysPerusteella(perusteId.value),
      ]);

      perusteKaikki.value = responses[0].data;
      termit.value = responses[1].data;
      liitteet.value = responses[2].data;
      muutosmaaraykset.value = responses[3].data;
      korvaavatPerusteet.value = responses[4].data;
      maarays.value = responses[5].data;

      kuvat.value = _.map((await Liitetiedostot.getAllKuvat(perusteId.value)).data, kuva => ({
        id: kuva.id!,
        kuva,
        src: baseURL + LiitetiedostotParam.getKuva(perusteId.value, kuva.id!).url,
      }));

      await Promise.all([
        fetchNavigation(),
        getDokumentti(),
        fetchJulkaisut(),
      ]);

      if (perusteKaikki.value?.koulutustyyppi && isKoulutustyyppiAmmatillinen(perusteKaikki.value.koulutustyyppi)) {
        await getKvLiitteet();

        const results = await Promise.all([
          Perusteet.getOsaamisalat(perusteId.value) as any,
          Arviointiasteikot.getAll(),
        ]);

        osaamisalaKuvaukset.value = results[0].data;
        arviointiasteikot.value = results[1].data;
      }

      if (isPerusteVanhaLukio(peruste.value)) {
        lukioOppineet.value = _.get(perusteKaikki.value, 'lukiokoulutus.rakenne.oppiaineet')!;
      }
    };

    const fetchJulkaisut = async () => {
      julkaisut.value = (await Julkaisut.getJulkisetJulkaisut(perusteId.value!)).data;
    };

    const getJulkaistuPerusteSisalto = (filter) => {
      return deepFind(filter, perusteKaikki.value);
    };

    const fetchNavigation = async () => {
      navigation.value = (await Perusteet.getNavigationPublic(perusteId.value, Kielet.getUiKieli.value, esikatselu.value, revision.value)).data;
    };

    const getDokumentti = async () => {
      dokumentti.value = null;
      const sisaltoKieli = Kielet.getSisaltoKieli.value;
      const suoritustavat = peruste.value!.suoritustavat ? peruste.value!.suoritustavat : [{ suoritustapakoodi: 'REFORMI' }] as any[];
      if (suoritustavat) {
        for (let i = 0; i < suoritustavat.length; i++) {
          const st = suoritustavat[i];
          const suoritustapakoodi = st.suoritustapakoodi;
          if (suoritustapakoodi) {
            let dokumenttiId;

            if (!esikatselu.value) {
              const dokumentti = (await Dokumentit.getJulkaistuDokumentti(perusteId.value, sisaltoKieli, revision.value)).data;
              if (dokumentti?.tila === _.toLower(DokumenttiDtoTilaEnum.VALMIS)) {
                dokumenttiId = dokumentti.id;
              }
            }

            if (esikatselu.value) {
              dokumenttiId = (await Dokumentit.getDokumenttiId(perusteId.value, sisaltoKieli, suoritustapakoodi)).data;
            }

            if (dokumenttiId) {
              dokumentti.value = baseURL + DokumentitParam.getDokumentti(_.toString(dokumenttiId)).url;
            }
          }
        }
      }

      if (dokumentti.value === null) {
        dokumentti.value = '';
      }
    };

    const getLiite = async (lang: string) => {
      try {
        return await getKvLiite(lang);
      }
      catch (err) {
        return null;
      }
    };

    const getKvLiitteet = async () => {
      kvLiitteet.value = {
        fi: await getLiite('fi'),
        sv: await getLiite('sv'),
        en: await getLiite('en'),
      };
    };

    const getKvLiite = async (kieli) => {
      if (peruste.value && peruste.value.suoritustavat) {
        const dokumenttiId = (await Dokumentit.getKVLiiteDokumenttiId(perusteId.value, kieli, peruste.value.suoritustavat[0].suoritustapakoodi!)).data;
        if (dokumenttiId) {
          return baseURL + DokumentitParam.getDokumentti(_.toString(dokumenttiId)).url;
        }
      }
    };

    const updateRoute = (route) => {
      currentRoute.value = route;
    };

    return {
      // State
      perusteKaikki,
      perusteId,
      esikatselu,
      revision,
      navigation,
      suoritustapa,
      currentRoute,
      termit,
      kuvat,
      dokumentti,
      korvaavatPerusteet,
      sidenavFilter,
      kvLiitteet,
      osaamisalaKuvaukset,
      liitteet,
      lukioOppineet,
      geneerisetArviointiasteikot,
      arviointiasteikot,
      julkaisut,
      muutosmaaraykset,
      maarays,

      // Getters
      peruste,
      sidenavLoading,
      sidenav,
      collapsedSidenav,
      flattenedSidenav,
      current,

      // Actions
      create,
      fetchJulkaisut,
      getJulkaistuPerusteSisalto,
      getDokumentti,
      getKvLiitteet,
      getKvLiite,
      updateRoute,
    };
  });

  return store(pinia);
};
