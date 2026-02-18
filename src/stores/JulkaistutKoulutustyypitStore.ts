import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import _ from 'lodash';
import { Perusteet, KoulutustyyppiLukumaara, findAllJulkaisut, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';
import { getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Page } from '@shared/tyypit';

const logger = createLogger('Main');

export const useJulkaistutKoulutustyypitStore = defineStore('julkaistutKoulutustyypit', () => {
  // State as refs
  const koulutustyyppiLukumaarat = ref<KoulutustyyppiLukumaara[] | null>(null);
  const muuLukumaarat = ref<number | null>(null);
  const digitaalinenOsaaminen = ref<PerusteenJulkaisuData[] | null>(null);
  const kielikaantajatutkinto = ref<PerusteenJulkaisuData[] | null>(null);

  // Getters as computed properties
  const julkaistutKoulutustyypit = computed(() => {
    if (!koulutustyyppiLukumaarat.value
      || _.isNil(muuLukumaarat.value)
      || !digitaalinenOsaaminen.value) {
      return null;
    }

    return _.filter([
      ..._.map(koulutustyyppiLukumaarat.value, 'koulutustyyppi'),
      ...(!!muuLukumaarat.value && muuLukumaarat.value > 0 ? ['koulutustyyppi_muu'] : []),
      ...(!!digitaalinenOsaaminen.value && digitaalinenOsaaminen.value.length > 0 ? ['koulutustyyppi_digi'] : []),
      ...(!!kielikaantajatutkinto.value && kielikaantajatutkinto.value.length > 0 ? ['kielikaantajatutkinto'] : []),
    ]);
  });

  // Actions as functions
  async function fetch(kieli) {
    koulutustyyppiLukumaarat.value = null;
    muuLukumaarat.value = null;
    digitaalinenOsaaminen.value = null;

    try {
      koulutustyyppiLukumaarat.value = (await Perusteet.getJulkaistutKoulutustyyppiLukumaarat(kieli)).data;
      muuLukumaarat.value = (((await getJulkisetOpetussuunnitelmat({ jotpatyyppi: ['MUU', 'VST'], kieli, sivukoko: 1 })).data) as Page<OpetussuunnitelmaDto>).kokonaismäärä;
      digitaalinenOsaaminen.value = ((((await findAllJulkaisut({ tyyppi: 'digitaalinen_osaaminen', kieli })).data) as Page<PerusteenJulkaisuData>).data);
      kielikaantajatutkinto.value = ((((await findAllJulkaisut({ tyyppi: 'kieli_kaantaja_tutkinto', kieli })).data) as Page<PerusteenJulkaisuData>).data);
    }
    catch (e) {
      logger.error(e);
      koulutustyyppiLukumaarat.value = [];
    }
  }

  return {
    // State
    koulutustyyppiLukumaarat,
    muuLukumaarat,
    digitaalinenOsaaminen,
    kielikaantajatutkinto,

    // Getters
    julkaistutKoulutustyypit,

    // Actions
    fetch,
  };
});
