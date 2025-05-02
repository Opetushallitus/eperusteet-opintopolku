import { defineStore } from 'pinia';
import { usePerusteDataStore } from '@/stores/PerusteDataStore';
import { ref } from 'vue';
import { pinia } from '@/pinia';

export const usePerusteCacheStore = defineStore('perusteCacheStore', () => {
  const perusteet = ref({});

  const addPerusteStore = async (perusteId, revision?) => {
    console.log('Adding peruste store', perusteId, revision);
    const key = perusteId + '-' + revision;
    if (!perusteet.value[key]) {
      const perusteDataStore = usePerusteDataStore(key);
      console.log('Creating peruste store', key, perusteDataStore);
      await perusteDataStore.create(perusteId, revision);
      perusteet.value[key] = perusteDataStore;
      console.log('Peruste store created', key, perusteet.value[key]);
    }
  };

  const getPerusteStore = (perusteId, revision?) => {
    console.log('Getting peruste store', perusteId, revision);
    if (!perusteId) {
      return null;
    }

    const key = perusteId + '-' + revision;
    // if (!perusteet.value[key]) {
    //   await addPerusteStore(perusteId, revision);
    // }

    console.log('Peruste store', key, perusteet.value[key]);

    return perusteet.value[key];
  };

  return { perusteet, addPerusteStore, getPerusteStore };
});

export function getCachedPerusteStore(perusteId, revision) {
  const perusteCacheStore = usePerusteCacheStore(pinia);
  return perusteCacheStore.getPerusteStore(perusteId, revision);
}
