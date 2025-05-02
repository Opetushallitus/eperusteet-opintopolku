import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Location } from 'vue-router';
import * as _ from 'lodash';
import mime from 'mime';
import {
  OpetussuunnitelmaKaikkiDto,
  NavigationNodeDto,
  Opetussuunnitelmat,
  JulkinenApi,
  DokumenttiDto,
  baseURL,
  JulkinenApiParams,
  KoulutustoimijaJulkinenDto,
  Arviointiasteikot,
  ArviointiasteikkoDto,
  LiitetiedostotParam,
} from '@shared/api/amosaa';
import {
  DokumenttiDtoTilaEnum,
  baseURL as perusteBaseURL,
  Liitetiedostot as PerusteLiitetiedostot,
  LiitetiedostotParam as PerusteLiitetiedostotParam,
  PerusteKaikkiDto,
  Perusteet,
  TutkinnonOsaKaikkiDto,
  TutkinnonOsaViiteSuppeaDto,
} from '@shared/api/eperusteet';
import { IOpetussuunnitelmaStore } from './IOpetussuunitelmaStore';
import {
  NavigationNode,
  buildTiedot,
  buildNavigation,
  filterNavigation,
  NavigationFilter,
} from '@shared/utils/NavigationBuilder';
import { Kielet } from '@shared/stores/kieli';
import { deepFilter, deepFind } from '@shared/utils/helpers';
import { PerusteTyyppi } from '@/utils/peruste';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { pinia } from '@/pinia';

export const useToteutussuunnitelmaDataStore = (key) => {
  const store = defineStore('toteutussuunnitelmaData-' + key, () => {
    // Individual refs instead of state object
    const opetussuunnitelmaId = ref<number>(0);
    const esikatselu = ref<boolean | undefined>(undefined);
    const revision = ref<number | undefined>(undefined);
    const navigation = ref<NavigationNodeDto | null>(null);
    const opetussuunnitelma = ref<OpetussuunnitelmaKaikkiDto | null>(null);
    const koulutustoimija = ref<KoulutustoimijaJulkinenDto | null>(null);
    const dokumenttiTila = ref<DokumenttiDto | null>(null);
    const currentRoute = ref<Location | null>(null);
    const sidenavFilter = ref<NavigationFilter>({
      label: '',
      isEnabled: false,
    });
    const arviointiasteikot = ref<ArviointiasteikkoDto[] | null>(null);
    const perusteKuvat = ref<object[]>([]);
    const perusteKaikki = ref<PerusteKaikkiDto | null>(null);
    const perusteidenTutkinnonOsat = ref<TutkinnonOsaKaikkiDto[] | null>(null);
    const perusteidenTutkinnonOsienViitteet = ref<TutkinnonOsaViiteSuppeaDto[] | null>(null);

    // Static create method as a regular function
    const create = async (opsId: number, rev: number | undefined = undefined) => {
      opetussuunnitelmaId.value = opsId;
      esikatselu.value = rev === 0 ? true : undefined;
      revision.value = rev;
      await init();
      // return store;
    };

    // Actions
    const init = async () => {
      koulutustoimija.value = (await JulkinenApi.getOpetussuunnitelmanToimija(opetussuunnitelmaId.value)).data;
      opetussuunnitelma.value = (await JulkinenApi.getOpetussuunnitelmaJulkaistuSisalto(
        opetussuunnitelmaId.value,
        _.toString(koulutustoimija.value!.id),
        esikatselu.value,
      )).data;

      await getDokumenttiTila();

      const navData = (await Opetussuunnitelmat.getOpetussuunnitelmaNavigationPublic(
        opetussuunnitelmaId.value,
        _.toString(koulutustoimija.value!.id),
        esikatselu.value,
      )).data;

      navigation.value = {
        ...navData,
        children: _.filter(navData.children, child => child.type !== 'tiedot'),
      };

      arviointiasteikot.value = (await Arviointiasteikot.getAllArviointiasteikot()).data;

      if (opetussuunnitelma.value?.peruste) {
        await fetchPerusteKuvat(opetussuunnitelma.value.peruste.perusteId!);
      }

      if (opetussuunnitelma.value?.peruste?.perusteId) {
        perusteKaikki.value = (await Perusteet.getKokoSisalto(opetussuunnitelma.value.peruste.perusteId)).data;

        if (isAmmatillinenOpetussuunnitelma(opetussuunnitelma.value)) {
          await setTutkinnonOsienSisallotPerusteista();
        }
      }
    };

    const setTutkinnonOsienSisallotPerusteista = async () => {
      const tutkinnonOsat = getJulkaistuSisalto('tutkinnonOsat');
      const perusteIds = _.uniq(
        [
          opetussuunnitelma.value!.peruste!.perusteId,
          ..._.chain(tutkinnonOsat)
            .filter(tosa => tosa.tosa?.vierastutkinnonosa || tosa.peruste?.perusteId || tosa.linkattuPerusteId)
            .map(tosa => tosa.tosa?.vierastutkinnonosa?.perusteId || tosa.peruste?.perusteId || tosa.linkattuPerusteId)
            .value(),
        ]);

      perusteidenTutkinnonOsat.value = _.flatMap(
        await Promise.all(
          _.map(
            perusteIds,
            async (perusteId) => (await Perusteet.getJulkaistutTutkinnonOsat(perusteId)).data
          ),
        ),
      );

      perusteidenTutkinnonOsienViitteet.value = _.flatMap(
        await Promise.all(
          _.map(
            perusteIds,
            async (perusteId) => (await Perusteet.getJulkaistutTutkinnonOsaViitteet(perusteId)).data
          ),
        ),
      );
    };

    const getDokumenttiTila = async () => {
      try {
        if (opetussuunnitelma.value) {
          dokumenttiTila.value = null;
          if (esikatselu.value) {
            dokumenttiTila.value = (await JulkinenApi.queryDokumentti(
              opetussuunnitelma.value!.id!,
              Kielet.getSisaltoKieli.value,
              _.toString(opetussuunnitelma.value!.koulutustoimija!.id!),
            )).data;
          }
          else {
            dokumenttiTila.value = (await JulkinenApi.getJulkaistuDokumentti(
              opetussuunnitelma.value!.id!,
              Kielet.getSisaltoKieli.value,
              _.toString(opetussuunnitelma.value!.koulutustoimija!.id!),
              revision.value,
            )).data;
          }
        }
      }
      catch (err) {
        // Error handling as in original code (empty catch block)
      }
    };

    const fetchPerusteKuvat = async (perusteenId: number) => {
      perusteKuvat.value = _.map(
        (await PerusteLiitetiedostot.getAllKuvat(perusteenId)).data,
        kuva => ({
          id: kuva.id!,
          kuva,
          src: perusteBaseURL + PerusteLiitetiedostotParam.getKuva(perusteenId, kuva.id! + '.' + mime.getExtension(kuva.mime!)).url,
        }),
      );
    };

    const getJulkaistuSisalto = (filter: any) => {
      return deepFind(filter, opetussuunnitelma.value);
    };

    const getJulkaistuSisaltoList = (filter: any) => {
      return deepFilter(filter, opetussuunnitelma.value);
    };

    const getJulkaistuPerusteSisalto = (filter: any) => {
      return deepFind(filter, perusteKaikki.value);
    };

    const updateRoute = (route: Location) => {
      currentRoute.value = route;
    };

    const updateFilter = _.debounce((filter: NavigationFilter) => {
      sidenavFilter.value = filter;
    }, 300);

    // Static method as a regular function
    const isAmmatillinenOpetussuunnitelma = (ops?: OpetussuunnitelmaKaikkiDto): boolean => {
      return _.includes(AmmatillisetKoulutustyypit, ops?.koulutustyyppi)
        || _.includes(AmmatillisetKoulutustyypit, ops?.peruste?.koulutustyyppi)
        || _.includes('yhteinen', ops?.tyyppi);
    };

    // Computed properties (getters)
    const dokumenttiUrl = computed(() => {
      if (opetussuunnitelma.value && dokumenttiTila.value && dokumenttiTila.value.tila === _.lowerCase(DokumenttiDtoTilaEnum.VALMIS)) {
        return baseURL + JulkinenApiParams.getDokumentti(
          opetussuunnitelma.value.id,
          Kielet.getSisaltoKieli.value,
          dokumenttiTila.value?.id,
          opetussuunnitelma.value.koulutustoimija.id,
        ).url;
      }
      return undefined;
    });

    const isAmmatillinen = computed(() => isAmmatillinenOpetussuunnitelma(opetussuunnitelma.value));

    const koulutustyyppi = computed(() => opetussuunnitelma.value?.peruste
      ? opetussuunnitelma.value?.peruste.koulutustyyppi
      : opetussuunnitelma.value?.koulutustyyppi);

    const tila = computed(() => opetussuunnitelma.value!.tila);

    const kuvat = computed(() => _.map(opetussuunnitelma.value!.liitteet, liite => ({
      id: liite.id!,
      src: baseURL + LiitetiedostotParam.getImage(opetussuunnitelma.value!.id!, liite.id!).url,
    })));

    const sidenavLoading = computed(() => {
      return !opetussuunnitelma.value || !navigation.value;
    });

    const sidenav = computed(() => {
      if (!opetussuunnitelma.value || !navigation.value) {
        return null;
      }
      else {
        const tiedot = buildTiedot('toteutussuunnitelmaTiedot', {
          toteutussuunnitelmaId: _.toString(opetussuunnitelmaId.value),
          ...(revision.value && { revision: revision.value }),
        });
        return buildNavigation(navigation.value, tiedot, true, revision.value);
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
          isVisible: !current.value || depth === 1 || onPath(value) || current.value.type === 'tiedot',
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

    return {
      // Expose refs
      opetussuunnitelmaId,
      esikatselu,
      revision,
      navigation,
      opetussuunnitelma,
      koulutustoimija,
      dokumenttiTila,
      currentRoute,
      sidenavFilter,
      arviointiasteikot,
      perusteKuvat,
      perusteKaikki,
      perusteidenTutkinnonOsat,
      perusteidenTutkinnonOsienViitteet,

      // Expose getters
      dokumenttiUrl,
      isAmmatillinen,
      koulutustyyppi,
      tila,
      kuvat,
      sidenavLoading,
      sidenav,
      flattenedSidenav,
      current,
      collapsedSidenav,
      filteredSidenav,

      // Expose actions
      create,
      init,
      setTutkinnonOsienSisallotPerusteista,
      getDokumenttiTila,
      fetchPerusteKuvat,
      getJulkaistuSisalto,
      getJulkaistuSisaltoList,
      getJulkaistuPerusteSisalto,
      updateRoute,
      updateFilter,
    };
  });

  return store(pinia);
};
