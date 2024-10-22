import { ref } from '@vue/composition-api';
import { defineStore } from 'pinia';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';

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
    else {
    }
    return opetussuunnitelmat.value[key];
  };

  return { opetussuunnitelmat, addOpetussuunnitelmaStore, getOpetussuunnitelmaStore };
});
