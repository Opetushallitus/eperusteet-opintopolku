import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Osaamismerkit, OsaamismerkitQuery } from '@shared/api/eperusteet';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import { OsaamismerkkiBaseDto, OsaamismerkkiKategoriaDto } from '@shared/generated/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { debounce } from 'lodash';

export const useOsaamismerkitStore = defineStore('osaamismerkit', () => {
  // State as refs
  const osaamismerkit = ref<OsaamismerkkiBaseDto[] | null>(null);
  const query = ref<OsaamismerkitQuery>({});
  const kategoriat = ref<OsaamismerkkiKategoriaDto[] | null>([]);

  // Getters as computed properties
  const options = computed(() => query.value);

  // Implementation functions
  async function fetchOsaamismerkitImpl(q: OsaamismerkitQuery) {
    const res = (await Osaamismerkit.findJulkisetOsaamismerkitBy(
      q.nimi,
      q.kategoria,
      q.koodit,
      q.poistunut,
      Kielet.getSisaltoKieli.value,
    )).data as any;
    return res;
  }

  // Actions
  const updateOsaamismerkitQuery = debounce(async (queryParams: OsaamismerkitQuery) => {
    osaamismerkit.value = null;
    query.value = queryParams;
    osaamismerkit.value = await fetchOsaamismerkitImpl(queryParams);
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  async function fetchKategoriat(q: OsaamismerkitQuery) {
    kategoriat.value = null;
    kategoriat.value = (await Osaamismerkit.getJulkisetKategoriat(q.poistunut, Kielet.getSisaltoKieli.value)).data;
  }

  return {
    // State
    osaamismerkit,
    query,
    kategoriat,

    // Getters
    options,

    // Actions
    updateOsaamismerkitQuery,
    fetchKategoriat,
  };
});
