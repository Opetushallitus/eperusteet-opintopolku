import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LukioOpetussuunnitelmat, LukioOppiaineTiedotDto } from '@shared/api/ylops';

export const useLopsOpetussuunnitelmaOppiaineStore = defineStore('lopsOpetussuunnitelmaOppiaine', () => {
  // State
  const opsId = ref<number>(0);
  const oppiaineId = ref<number>(0);
  const oppiaine = ref<LukioOppiaineTiedotDto | null>(null);

  // Actions
  const create = async (oId: number, opId: number) => {
    opsId.value = oId;
    oppiaineId.value = opId;
    await fetchOppiaine();
    return {
      opsId,
      oppiaineId,
      oppiaine,
      fetchOppiaine,
    };
  };

  const fetchOppiaine = async () => {
    oppiaine.value = null;
    oppiaine.value = (await LukioOpetussuunnitelmat.getLukioOppiaine(opsId.value, oppiaineId.value)).data;
  };

  return {
    // State
    opsId,
    oppiaineId,
    oppiaine,

    // Actions
    create,
    fetchOppiaine,
  };
});

// For backward compatibility with components that use the class directly
export class LopsOpetussuunnitelmaOppiaineStore {
  static async create(opsId: number, oppiaineId: number) {
    const store = useLopsOpetussuunnitelmaOppiaineStore();
    return store.create(opsId, oppiaineId);
  }
}
