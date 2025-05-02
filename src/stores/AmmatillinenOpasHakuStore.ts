import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';
import { DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';

export const useAmmatillinenOpasHakuStore = defineStore('ammatillinenOpasHaku', () => {
  // State
  const perusteet = ref<PerusteenJulkaisuData[] | null>(null);
  const page = ref(0);
  const pages = ref(0);
  const total = ref(0);
  const perPage = ref(10);

  const filterdata = ref<JulkaistutPerusteetQuery>({
    nimi: '',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    tuleva: true,
    voimassaolo: true,
    siirtyma: false,
    poistunut: false,
    tyyppi: 'opas',
  });

  // Getters
  const toggles = computed(() => {
    return [
      'tuleva',
      'voimassaolo',
    ];
  });

  const filters = computed(() => ({
    ...filterdata.value,
    sivu: page.value,
    sivukoko: perPage.value,
    kieli: Kielet.getSisaltoKieli.value,
  }));

  // Actions
  const fetch = _.debounce(async () => {
    perusteet.value = null;
    const result = await julkaistutPerusteet(filters.value);
    total.value = result['kokonaismäärä'];
    page.value = result.sivu;
    perPage.value = result.sivukoko;
    pages.value = result.sivuja;
    perusteet.value = result.data;
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  const updateFilters = async (newFilters: JulkaistutPerusteetQuery) => {
    filterdata.value = {
      ...filters.value,
      ...newFilters,
    };
    await fetch();
  };

  // Initialize with provided data if needed
  const init = (data: JulkaistutPerusteetQuery = {}) => {
    filterdata.value = {
      ...filterdata.value,
      ...data,
    };
  };

  return {
    // State
    perusteet,
    page,
    pages,
    total,
    perPage,
    filterdata,

    // Getters
    toggles,
    filters,

    // Actions
    fetch,
    updateFilters,
    init,
  };
});
