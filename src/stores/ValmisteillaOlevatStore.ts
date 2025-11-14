import { ref } from 'vue';
import _ from 'lodash';
import { PerusteBaseDto, Perusteet } from '@shared/api/eperusteet';
import { Page } from '@shared/tyypit';
import { defineStore } from 'pinia';

export const useValmisteillaOlevatStore = defineStore('valmisteillaOlevat', () => {
  const perusteet = ref<Page<PerusteBaseDto> | null>(null);

  const fetch = async (sivu: number, sivukoko: number, koulutustyypit: string[]) => {
    perusteet.value = null;
    perusteet.value = (await Perusteet.getJulkaisuAikatauluPerusteet(sivu, sivukoko, koulutustyypit)).data as Page<PerusteBaseDto>;
  };

  return {
    perusteet,
    fetch,
  };
});
