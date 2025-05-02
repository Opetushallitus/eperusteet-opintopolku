import { ref } from 'vue';
import { defineStore } from 'pinia';
import _ from 'lodash';
import { KoulutustoimijaJulkinenDto, JulkinenApi, OpetussuunnitelmaDto, getJulkisetOpetussuunnitelmat } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Page } from '@shared/tyypit';
import { DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';

export const useKoulutuksenJarjestajaStore = defineStore('koulutuksenJarjestaja', () => {
  const koulutustoimija = ref<KoulutustoimijaJulkinenDto | null>(null);
  const yhteisetOsuudet = ref<OpetussuunnitelmaDto[] | null>(null);
  const toteutussuunnitelmat = ref<Page<OpetussuunnitelmaDto> | null>(null);
  const koulutustoimijaId = ref<number | null>(null);

  const fetchKoulutustoimija = async () => {
    if (koulutustoimijaId.value === null) return;
    koulutustoimija.value = (await JulkinenApi.getKoulutustoimijaByKtId(koulutustoimijaId.value)).data;
  };

  const init = async (id: number) => {
    koulutustoimijaId.value = id;
    await fetchKoulutustoimija();
  };

  const fetch = async () => {
    yhteisetOsuudet.value = null;
    if (!koulutustoimija.value) return;
    yhteisetOsuudet.value = ((await getJulkisetOpetussuunnitelmat({
      organisaatio: koulutustoimija.value.organisaatio,
      tyyppi: ['yhteinen'],
      sivu: 0,
      sivukoko: 9999,
      kieli: Kielet.getUiKieli.value,
    })).data as any).data;
  };

  const fetchToteutussuunnitelmat = _.debounce(async (nimi: string, sivu: number) => {
    toteutussuunnitelmat.value = null;
    if (!koulutustoimija.value) return;
    toteutussuunnitelmat.value = ((await getJulkisetOpetussuunnitelmat({
      organisaatio: koulutustoimija.value.organisaatio,
      tyyppi: ['ops', 'yleinen'],
      nimi,
      sivu,
      sivukoko: 5,
      kieli: Kielet.getUiKieli.value,
      koulutustyyppi: AmmatillisetKoulutustyypit,
    })).data as any);
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  return {
    koulutustoimija,
    yhteisetOsuudet,
    toteutussuunnitelmat,
    init,
    fetchKoulutustoimija,
    fetch,
    fetchToteutussuunnitelmat,
  };
});
