import { defineStore } from 'pinia';
import { usePerusteDataStore } from '@/stores/PerusteDataStore';
import { ref } from 'vue';
import { pinia } from '@/pinia';
import { useRoute } from 'vue-router';
import _ from 'lodash';

export const usePerusteCacheStore = defineStore('perusteCacheStore', () => {
  const perusteet = ref({});

  const addPerusteStore = async (perusteId, revision = '') => {
    const key = perusteId + '-' + revision;
    if (!perusteet.value[key]) {
      const perusteDataStore = usePerusteDataStore(key);
      await perusteDataStore.create(perusteId, revision ? _.toNumber(revision) : undefined);
      perusteet.value[key] = perusteDataStore;
    }
  };

  const getPerusteStore = (perusteId, revision = '') => {
    const key = perusteId + '-' + revision;
    if (!perusteId) {
      return null;
    }

    return perusteet.value[key];
  };

  return { perusteet, addPerusteStore, getPerusteStore };
});

export function getCachedPerusteStore() {
  const route = useRoute();
  const perusteCacheStore = usePerusteCacheStore(pinia);
  return perusteCacheStore.getPerusteStore(route.params.perusteId, route.params.revision);
}
