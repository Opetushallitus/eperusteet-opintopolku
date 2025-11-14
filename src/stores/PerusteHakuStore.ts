import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { PerusteDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { PerusteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';

export const usePerusteHakuStore = defineStore('perusteHaku', () => {
  // State
  const perusteet = ref<PerusteDto[] | null>(null);
  const page = ref(0);
  const pages = ref(0);
  const total = ref(0);
  const perPage = ref(10);

  const filterdata = ref<PerusteQuery>({
    nimi: '',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    tuleva: true,
    siirtyma: true,
    voimassaolo: true,
    poistunut: false,
    tutkintonimikkeet: true,
    tutkinnonosat: true,
    osaamisalat: true,
  });

  // Getters
  const toggles = computed(() => {
    if (filterdata.value.perusteTyyppi === 'opas') {
      return [
        'tuleva',
        'voimassaolo',
      ];
    }
    else {
      return [
        'tuleva',
        'voimassaolo',
        'siirtyma',
        'poistunut',
      ];
    }
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
    const result = await perusteetQuery(filters.value);
    total.value = result['kokonaismäärä'];
    page.value = result.sivu;
    perPage.value = result.sivukoko;
    pages.value = result.sivuja;
    perusteet.value = result.data;
  }, 1000);

  const updateFilters = async (newFilters: PerusteQuery) => {
    filterdata.value = {
      ...filters.value,
      ...newFilters,
    };
    await fetch();
  };

  // Initialize with provided data if needed
  const init = (data: PerusteQuery = {}) => {
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
