import { Osaamismerkit } from '@shared/api/eperusteet';
import { OsaamismerkkiBaseDto } from '@shared/generated/eperusteet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOsaamismerkkiStore = defineStore('osaamismerkki', () => {
  // State as refs
  const osaamismerkki = ref<OsaamismerkkiBaseDto | null>(null);

  // Actions
  const fetchById = async (id: number) => {
    osaamismerkki.value = null;
    osaamismerkki.value = (await Osaamismerkit.getJulkinenOsaamismerkkiById(id)).data;
  };

  const fetchByKoodi = async (koodi: number) => {
    osaamismerkki.value = null;
    osaamismerkki.value = (await Osaamismerkit.getJulkinenOsaamismerkkiByKoodi(koodi)).data;
  };

  // Initialize store with either id or koodi
  const init = async (osaamismerkkiId?: number | null, koodi?: number | null) => {
    if (koodi) {
      await fetchByKoodi(koodi);
    }
    else if (osaamismerkkiId) {
      await fetchById(osaamismerkkiId);
    }
  };

  return {
    osaamismerkki,
    fetchById,
    fetchByKoodi,
    init,
  };
});
