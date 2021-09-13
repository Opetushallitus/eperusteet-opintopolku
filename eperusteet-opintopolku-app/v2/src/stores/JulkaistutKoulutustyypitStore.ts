import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { Perusteet, KoulutustyyppiLukumaara } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';

Vue.use(VueCompositionApi);

const logger = createLogger('Main');

export class JulkaistutKoulutustyypitStore {
  public state = reactive({
    koulutustyyppiLukumaarat: null as KoulutustyyppiLukumaara[] | null,
  })

  public readonly koulutustyyppiLukumaarat = computed(() => this.state.koulutustyyppiLukumaarat);
  public readonly julkaistutKoulutustyypit = computed(() => _.map(this.state.koulutustyyppiLukumaarat, 'koulutustyyppi'));

  public async fetch(kieli) {
    this.state.koulutustyyppiLukumaarat = null;
    try {
      this.state.koulutustyyppiLukumaarat = (await Perusteet.getJulkaistutKoulutustyypit(kieli)).data;
    }
    catch (e) {
      logger.error(e);
      this.state.koulutustyyppiLukumaarat = [];
    }
  }
}
