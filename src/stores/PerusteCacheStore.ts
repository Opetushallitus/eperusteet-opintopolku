import { ref } from '@vue/composition-api';
import { defineStore } from 'pinia';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

export const usePerusteCacheStore = defineStore('perusteCacheStore', () => {
  const perusteet = ref({});

  const addPerusteStore = async (perusteId, revision?) => {
    const key = perusteId + '-' + revision;
    if (!perusteet.value[key]) {
      perusteet.value[key] = PerusteDataStore.create(perusteId, revision);
    }
  };

  const getPerusteStore = async (perusteId, revision?) => {
    const key = perusteId + '-' + revision;
    if (!perusteet.value[key]) {
      addPerusteStore(perusteId, revision);
    }
    else {
    }
    return perusteet.value[key];
  };

  return { perusteet, addPerusteStore, getPerusteStore };
});
