import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Lops2019, Lops2019LaajaAlainenOsaaminenKokonaisuusDto } from '@shared/api/eperusteet';

export const useLops2019LaajaAlaisetStore = defineStore('lops2019LaajaAlaiset', () => {
  // State
  const perusteId = ref<number | null>(null);
  const laajaAlaisetKokonaisuus = ref<Lops2019LaajaAlainenOsaaminenKokonaisuusDto | null>(null);

  // Actions
  const init = async (id: number) => {
    perusteId.value = id;
    await getLaajaAlaisetKokonaisuus();
    return {
      perusteId,
      laajaAlaisetKokonaisuus,
      getLaajaAlaisetKokonaisuus,
    };
  };

  const getLaajaAlaisetKokonaisuus = async () => {
    laajaAlaisetKokonaisuus.value = null;
    laajaAlaisetKokonaisuus.value = (await Lops2019.getLaajaAlainenOsaaminenKokonaisuus(perusteId.value!)).data;
  };

  return {
    // State
    perusteId,
    laajaAlaisetKokonaisuus,

    // Actions
    init,
    getLaajaAlaisetKokonaisuus,
  };
});
