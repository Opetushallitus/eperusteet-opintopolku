import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Lops2019, Lops2019ModuuliDto } from '@shared/api/eperusteet';

export const useLops2019ModuuliStore = defineStore('lops2019Moduuli', () => {
  // State
  const perusteId = ref<number>(0);
  const oppiaineId = ref<number>(0);
  const moduuliId = ref<number>(0);
  const moduuli = ref<Lops2019ModuuliDto | null>(null);

  // Actions
  const fetchModuuli = async () => {
    moduuli.value = null;
    moduuli.value = (await Lops2019.getModuuli(perusteId.value, oppiaineId.value, moduuliId.value)).data;
  };

  // Initialize store with required parameters
  const init = async (newPerusteId: number, newOppiaineId: number, newModuuliId: number) => {
    perusteId.value = newPerusteId;
    oppiaineId.value = newOppiaineId;
    moduuliId.value = newModuuliId;
    await fetchModuuli();
  };

  return {
    // State
    perusteId,
    oppiaineId,
    moduuliId,
    moduuli,

    // Actions
    fetchModuuli,
    init,
  };
});

