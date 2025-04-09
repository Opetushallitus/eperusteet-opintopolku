import { defineStore } from 'pinia';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { ref } from 'vue';

export const useOpetussuunnitelmaCacheStore = defineStore('opetussuunnitelmaCacheStore', () => {
  const opetussuunnitelmat = ref({});

  const addOpetussuunnitelmaStore = async (opetussuunnitelmaId, revision?) => {
    const key = opetussuunnitelmaId + '-' + revision;
    if (!opetussuunnitelmat.value[key]) {
      opetussuunnitelmat.value[key] = OpetussuunnitelmaDataStore.create(opetussuunnitelmaId, revision);
    }
  };

  const getOpetussuunnitelmaStore = async (opetussuunnitelmaId, revision?) => {
    const key = opetussuunnitelmaId + '-' + revision;
    if (!opetussuunnitelmat.value[key]) {
      addOpetussuunnitelmaStore(opetussuunnitelmaId, revision);
    }

    return opetussuunnitelmat.value[key];
  };

  return { opetussuunnitelmat, addOpetussuunnitelmaStore, getOpetussuunnitelmaStore };
});
