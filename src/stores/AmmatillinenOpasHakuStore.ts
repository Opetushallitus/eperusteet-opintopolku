import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';
import { debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import { Page } from '@shared/tyypit';

export const useAmmatillinenOpasHakuStore = defineStore('ammatillinenOpasHaku', () => {
  // State
  const perusteet = ref<Page<PerusteenJulkaisuData> | null>(null);
  const hardFilters = ref<JulkaistutPerusteetQuery>({
    tyyppi: 'opas',
  });

  const filterToQueryParams = {
    nimiTaiKoodi: 'query',
    sivu: 'page',
  };

  const fetch = debounced(async (filters: JulkaistutPerusteetQuery) => {
    perusteet.value = null;
    perusteet.value = (await julkaistutPerusteet(
      {
        ...filters,
        ...hardFilters.value,
        sivukoko: 10,
      },
    ));
  });

  return {
    perusteet,
    filterToQueryParams,
    fetch,
  };
});
