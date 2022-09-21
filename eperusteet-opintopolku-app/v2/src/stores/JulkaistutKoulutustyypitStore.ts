import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { Perusteet, KoulutustyyppiLukumaara } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';
import { getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Page } from '@shared/tyypit';

Vue.use(VueCompositionApi);

const logger = createLogger('Main');

export class JulkaistutKoulutustyypitStore {
  public state = reactive({
    koulutustyyppiLukumaarat: null as KoulutustyyppiLukumaara[] | null,
    muuLukumaarat: null as Number | null,
  })

  public readonly koulutustyyppiLukumaarat = computed(() => this.state.koulutustyyppiLukumaarat);
  public readonly julkaistutKoulutustyypit = computed(() => _.map(this.state.koulutustyyppiLukumaarat, 'koulutustyyppi'));
  public readonly muuLukumaarat = computed(() => this.state.muuLukumaarat);

  public async fetch(kieli) {
    this.state.koulutustyyppiLukumaarat = null;
    try {
      this.state.koulutustyyppiLukumaarat = (await Perusteet.getJulkaistutKoulutustyyppiLukumaarat(kieli)).data;
      this.state.muuLukumaarat = (((await getJulkisetOpetussuunnitelmat({ jotpatyyppi: ['MUU', 'VST'], sivukoko: 1 })).data) as Page<OpetussuunnitelmaDto>).kokonaismäärä;
    }
    catch (e) {
      logger.error(e);
      this.state.koulutustyyppiLukumaarat = [];
    }
  }
}
