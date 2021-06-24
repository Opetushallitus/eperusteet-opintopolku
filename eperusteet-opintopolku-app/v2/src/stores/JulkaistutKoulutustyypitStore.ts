import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { Perusteet } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';

Vue.use(VueCompositionApi);

const logger = createLogger('Main');

export class JulkaistutKoulutustyypitStore {
  public state = reactive({
    julkaistutKoulutustyypit: null as string[] | null,
  })

  public readonly julkaistutKoulutustyypit = computed(() => this.state.julkaistutKoulutustyypit);

  public async fetch(kieli) {
    this.state.julkaistutKoulutustyypit = null;
    try {
      this.state.julkaistutKoulutustyypit = (await Perusteet.getJulkaistutKoulutustyypit(kieli)).data;
    }
    catch (e) {
      logger.error(e);
      this.state.julkaistutKoulutustyypit = [];
    }
  }
}
