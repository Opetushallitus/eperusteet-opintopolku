import { defineStore } from 'pinia';
import { Arviointiasteikot, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import { ref, computed } from 'vue';
import { debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import _ from 'lodash';
import { Page } from '@shared/tyypit';

export const useAmmatillinenPerusteHakuStore = defineStore('ammatillinenPerusteHaku', () => {
  // State
  const perusteet = ref<Page<PerusteenJulkaisuData> | null>(null);
  const arviointiasteikot = ref<any[]>([]);

  const filterToQueryParams = {
    nimiTaiKoodi: 'haku',
    tutkintotyyppi: 'tutkintotyyppi',
    tuleva: 'tuleva',
    voimassaolo: 'voimassaolo',
    siirtyma: 'siirtyma',
    poistunut: 'poistunut',
    perusteet: 'perusteet',
    tutkinnonosat: 'tutkinnonosat',
    sivu: 'sivu',
  };

  const fetch = debounced(async (filters: JulkaistutPerusteetQuery) => {
    perusteet.value = null;
    perusteet.value = await julkaistutPerusteet(
      {
        ...filters,
        sivukoko: 10,
      },
    );
  });

  async function fetchArviointiasteikot() {
    arviointiasteikot.value = (await Arviointiasteikot.getAll()).data;
  }

  return {
    // State
    perusteet,
    arviointiasteikot,

    filterToQueryParams,

    // Actions
    fetch,
    fetchArviointiasteikot,
  };
});
