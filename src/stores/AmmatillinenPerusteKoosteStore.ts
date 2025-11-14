import _ from 'lodash';
import { OpetussuunnitelmaDto, getJulkisetOpetussuunnitelmat, OpetussuunnitelmaQuery } from '@shared/api/amosaa';
import { TiedoteDto, Perusteet, PerusteKaikkiDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { tiedoteQuery } from '@/api/eperusteet';
import { Page } from '@shared/tyypit';
import { DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { usePerusteCacheStore } from '@/stores/PerusteCacheStore';
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAmmatillinenPerusteKoosteStore = defineStore('ammatillinenPerusteKooste', () => {
  // Individual refs instead of a state object
  const peruste = ref<PerusteKaikkiDto | null>(null);
  const opetussuunnitelmat = ref<Page<OpetussuunnitelmaDto> | null>(null);
  const tiedotteet = ref<TiedoteDto | null>(null);
  const opsQuery = ref<OpetussuunnitelmaQuery | null>(null);

  // Store instances
  const perusteCacheStore = usePerusteCacheStore();

  // Actions
  async function fetch(perusteId: number) {
    peruste.value = null;
    perusteCacheStore.addPerusteStore(perusteId);
    peruste.value = (await Perusteet.getKokoSisalto(perusteId)).data;

    opsQuery.value = {
      perusteenDiaarinumero: peruste.value!.diaarinumero,
      perusteId: peruste.value!.id,
      sivu: 0,
      sivukoko: 10,
      kieli: Kielet.getUiKieli.value,
      koulutustyyppi: AmmatillisetKoulutustyypit,
    };

    await fetchOpetussuunnitelmat(opsQuery.value);

    const vanhat = (await tiedoteQuery({
      sivukoko: 100,
      perusteId,
      julkinen: true,
    }));

    const uudet = (await tiedoteQuery({
      sivukoko: 100,
      perusteIds: [perusteId],
    }));

    tiedotteet.value = _.chain([
      ...vanhat,
      ...uudet,
    ])
      .filter(tiedote => !!tiedote.otsikko)
      .uniqBy('id')
      .sortBy('luotu')
      .reverse()
      .value() as any;
  }

  // Using debounced function instead of decorator
  const fetchOpetussuunnitelmat = _.debounce(async function(query: any) {
    opetussuunnitelmat.value = null;
    opetussuunnitelmat.value = ((await getJulkisetOpetussuunnitelmat({ ...opsQuery.value, ...query })).data as any);
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  // Initialize store if perusteId is provided
  function init(perusteId: number) {
    return fetch(perusteId);
  }

  return {
    // Expose the refs directly
    peruste,
    opetussuunnitelmat,
    tiedotteet,
    opsQuery,

    // Actions
    fetch,
    fetchOpetussuunnitelmat,
    init,

    // Store instances
    perusteCacheStore,
  };
});
