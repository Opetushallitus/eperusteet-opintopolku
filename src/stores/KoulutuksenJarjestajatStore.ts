import { ref } from 'vue';
import { defineStore } from 'pinia';
import _ from 'lodash';
import { KoulutustoimijaJulkinenDto, JulkinenApi } from '@shared/api/amosaa';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';

export const useKoulutuksenJarjestajatStore = defineStore('koulutuksenJarjestajat', () => {
  const koulutustoimijat = ref<KoulutustoimijaJulkinenDto[] | null>(null);

  const fetch = async () => {
    const res = (await JulkinenApi.findKoulutustoimijat(
      0,
      9999,
      undefined,
      undefined,
      AmmatillisetKoulutustyypit)).data as any;
    koulutustoimijat.value = res.data;
  };

  return {
    koulutustoimijat,
    fetch,
  };
});
