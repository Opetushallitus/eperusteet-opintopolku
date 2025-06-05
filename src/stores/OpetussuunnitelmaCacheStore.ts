import { defineStore } from 'pinia';
import { useOpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { ref } from 'vue';
import { pinia } from '@/pinia';
import { useRoute } from 'vue-router';
import { useToteutussuunnitelmaDataStore } from './ToteutussuunnitelmaDataStore';
import _ from 'lodash';

export const useOpetussuunnitelmaCacheStore = defineStore('opetussuunnitelmaCacheStore', () => {
  const opetussuunnitelmat = ref({});

  const addOpetussuunnitelmaStore = async (id, revision) => {
    const key = `${id}-${revision}`;
    if (!opetussuunnitelmat.value[key]) {
      const opetussuunnitelmaDataStore = useOpetussuunnitelmaDataStore(key);
      await opetussuunnitelmaDataStore.create(id, _.isNumber(revision) ? _.toNumber(revision) : undefined);
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
      await opetussuunnitelmaDataStore.create(id, _.isNumber(revision) ? _.toNumber(revision) : undefined);
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
