import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Lops2019, Lops2019OppiaineKaikkiDto } from '@shared/api/eperusteet';

export const useLops2019OppiaineStore = defineStore('lops2019Oppiaine', () => {
  // State
  const perusteId = ref<number>(0);
  const oppiaineId = ref<number>(0);
  const oppiaine = ref<Lops2019OppiaineKaikkiDto | null>(null);

  // Actions
  const create = async (pId: number, oId: number) => {
    perusteId.value = pId;
    oppiaineId.value = oId;
    await fetchOppiaine();
    return {
      perusteId,
      oppiaineId,
      oppiaine,
      fetchOppiaine,
    };
  };

  const fetchOppiaine = async () => {
    oppiaine.value = null;
    oppiaine.value = (await Lops2019.getOppiaine(perusteId.value, oppiaineId.value)).data;
  };

  return {
    // State
    perusteId,
    oppiaineId,
    oppiaine,

    // Actions
    create,
    fetchOppiaine,
  };
});

// For backward compatibility with components that use the class directly
export class Lops2019OppiaineStore {
  static async create(perusteId: number, oppiaineId: number) {
    const store = useLops2019OppiaineStore();
    return store.create(perusteId, oppiaineId);
  }
}
