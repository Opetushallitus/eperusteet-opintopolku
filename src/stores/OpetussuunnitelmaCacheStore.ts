import { defineStore } from 'pinia';
import { useOpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { ref } from 'vue';
import { pinia } from '@/pinia';
import { useRoute } from 'vue-router';
import { useToteutussuunnitelmaDataStore } from './ToteutussuunnitelmaDataStore';

export const useOpetussuunnitelmaCacheStore = defineStore('opetussuunnitelmaCacheStore', () => {
  const opetussuunnitelmat = ref({});

  const addOpetussuunnitelmaStore = async (id, revision) => {
    const key = `${id}-${revision}`;
    if (!opetussuunnitelmat.value[key]) {
      const opetussuunnitelmaDataStore = useOpetussuunnitelmaDataStore(key);
      await opetussuunnitelmaDataStore.create(id, revision);
      opetussuunnitelmat.value[key] = opetussuunnitelmaDataStore;
    }
  };

  const getOpetussuunnitelmaStore = (id, revision) => {
    const key = `${id}-${revision}`;
    return opetussuunnitelmat.value[key];
  };

  return { opetussuunnitelmat, addOpetussuunnitelmaStore, getOpetussuunnitelmaStore };
});

export const useToteutussuunnitelmaCacheStore = defineStore('toteutussuunnitelmaCacheStore', () => {
  const toteutussuunnitelmat = ref({});

  const addToteutussuunnitelmaStore = async (id, revision) => {
    const key = `${id}-${revision}`;
    if (!toteutussuunnitelmat.value[key]) {
      const opetussuunnitelmaDataStore = useToteutussuunnitelmaDataStore(key);
      await opetussuunnitelmaDataStore.create(id, revision);
      toteutussuunnitelmat.value[key] = opetussuunnitelmaDataStore;
    }
  };

  const getToteutussuunnitelmaStore = (id, revision) => {
    const key = `${id}-${revision}`;
    return toteutussuunnitelmat.value[key];
  };

  return { toteutussuunnitelmat, addToteutussuunnitelmaStore, getToteutussuunnitelmaStore };
});

export function getCachedOpetussuunnitelmaStore() {
  const route = useRoute();

  if (route.params.opetussuunnitelmaId) {
    const opetussuunnitelmaCacheStore = useOpetussuunnitelmaCacheStore(pinia);
    return opetussuunnitelmaCacheStore.getOpetussuunnitelmaStore(route.params.opetussuunnitelmaId, route.params.revision);
  }

  const toteutussuunnitelmaCacheStore = useToteutussuunnitelmaCacheStore(pinia);
  return toteutussuunnitelmaCacheStore.getToteutussuunnitelmaStore(route.params.toteutussuunnitelmaId, route.params.revision);
}
