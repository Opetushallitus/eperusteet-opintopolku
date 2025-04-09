import { defineStore } from 'pinia';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { ref } from 'vue';

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

    return perusteet.value[key];
  };

  return { perusteet, addPerusteStore, getPerusteStore };
});
