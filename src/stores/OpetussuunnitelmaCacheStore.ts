import { defineStore } from 'pinia';
import { useOpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { ref } from 'vue';
import { pinia } from '@/pinia';
import { useRoute } from 'vue-router';
import { useToteutussuunnitelmaDataStore } from './ToteutussuunnitelmaDataStore';

export const useOpetussuunnitelmaCacheStore = defineStore('opetussuunnitelmaCacheStore', () => {
  const opetussuunnitelmat = ref({});

  const addOpetussuunnitelmaStore = async (useStore, type, opetussuunnitelmaId, revision?) => {
    const key = `${type}-${opetussuunnitelmaId}-${revision}`;
    if (!opetussuunnitelmat.value[key]) {
      const opetussuunnitelmaDataStore = useStore(key);
      await opetussuunnitelmaDataStore.create(opetussuunnitelmaId, revision);
      opetussuunnitelmat.value[key] = opetussuunnitelmaDataStore;
    }
  };

  const getOpetussuunnitelmaStore = (type, opetussuunnitelmaId, revision?) => {
    const key = `${type}-${opetussuunnitelmaId}-${revision}`;
    return opetussuunnitelmat.value[key];
  };

  return { opetussuunnitelmat, addOpetussuunnitelmaStore, getOpetussuunnitelmaStore };
});

export function getCachedOpetussuunnitelmaStore() {
  const route = useRoute();

  const opetussuunnitelmaCacheStore = useOpetussuunnitelmaCacheStore(pinia);

  if (route.params.opetussuunnitelmaId) {
    return opetussuunnitelmaCacheStore.getOpetussuunnitelmaStore('ops', route.params.opetussuunnitelmaId, route.params.revision);
  }

  if (route.params.toteutussuunnitelmaId) {
    return opetussuunnitelmaCacheStore.getOpetussuunnitelmaStore('totsu', route.params.toteutussuunnitelmaId, route.params.revision);
  }
}
