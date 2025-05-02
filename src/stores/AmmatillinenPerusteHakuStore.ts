import { defineStore } from 'pinia';
import { Arviointiasteikot, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import { ref, computed } from 'vue';
import { DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import _ from 'lodash';

export const useAmmatillinenPerusteHakuStore = defineStore('ammatillinenPerusteHaku', () => {
  // State
  const perusteet = ref<PerusteenJulkaisuData[] | null>(null);
  const page = ref(0);
  const pages = ref(0);
  const total = ref(0);
  const perPage = ref(10);
  const arviointiasteikot = ref<any[]>([]);
  const filterdata = ref<JulkaistutPerusteetQuery>({
    nimiTaiKoodi: '',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    tuleva: true,
    siirtyma: false,
    voimassaolo: true,
    poistunut: false,
    perusteet: true,
    tutkinnonosat: false,
  });

  // Getters
  const toggles = computed(() => [
    'tuleva',
    'voimassaolo',
    'siirtyma',
    'poistunut',
  ]);

  const filters = computed(() => ({
    ...filterdata.value,
    sivu: page.value,
    sivukoko: perPage.value,
    kieli: Kielet.getSisaltoKieli.value,
  }));

  // Actions
  function init(data: JulkaistutPerusteetQuery = {}) {
    filterdata.value = {
      ...filterdata.value,
      ...data,
    };
  }

  // Debounce function for fetch
  const debouncedFetch = _.debounce(async () => {
    await performFetch();
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  // Implement the actual fetch
  async function performFetch() {
    perusteet.value = null;
    const result = await julkaistutPerusteet(filters.value);

    total.value = result['kokonaismäärä'];
    page.value = result.sivu;
    perPage.value = result.sivukoko;
    pages.value = result.sivuja;
    perusteet.value = result.data;
  }

  // Create a debounced version of fetch
  async function fetch() {
    debouncedFetch();
  }

  async function updateFilters(newFilters: JulkaistutPerusteetQuery) {
    filterdata.value = {
      ...filters.value,
      ...newFilters,
    };
    await fetch();
  }

  async function fetchArviointiasteikot() {
    arviointiasteikot.value = (await Arviointiasteikot.getAll()).data;
  }

  return {
    // State
    perusteet,
    page,
    pages,
    total,
    perPage,
    arviointiasteikot,
    filterdata,

    // Getters
    toggles,
    filters,

    // Actions
    init,
    fetch,
    updateFilters,
    fetchArviointiasteikot,
  };
});
