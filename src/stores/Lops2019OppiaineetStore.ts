import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Lops2019, Lops2019OppiaineDto } from '@shared/api/eperusteet';

export const useLops2019OppiaineetStore = defineStore('lops2019Oppiaineet', () => {
  // State
  const perusteId = ref<number | null>(null);
  const oppiaineet = ref<Array<Lops2019OppiaineDto> | null>(null);

  // Actions
  const init = async (id: number) => {
    perusteId.value = id;
    // You can uncomment the next line if you want to fetch data immediately on init
    // await fetchOppiaineet();
    return {
      perusteId,
      oppiaineet,
      fetchOppiaineet,
    };
  };

  /**
   * Haetaan oppiaineet jos perusteId on muuttunut
   */
  const fetchOppiaineet = async () => {
    oppiaineet.value = null;
    oppiaineet.value = (await Lops2019.getOppiaineet(perusteId.value!)).data;
  };

  return {
    // State
    perusteId,
    oppiaineet,

    // Actions
    init,
    fetchOppiaineet,
  };
});
