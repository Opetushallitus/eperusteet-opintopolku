import Vue from 'vue';
import VueCompositionApi, { computed } from '@vue/composition-api';
import * as _ from 'lodash';
import { ITPalauteProvider, Palaute } from '@shared/stores/types';
import { Palautteet } from '@shared/api/eperusteet';
import { EperusteetPalautekanava } from '@shared/tyypit';

Vue.use(VueCompositionApi);

export class PalauteStore implements ITPalauteProvider {
  async sendPalaute(palaute: Palaute) {
    palaute.key = EperusteetPalautekanava.opintopolku;
    await Palautteet.sendPalaute(palaute);
  }

  public readonly tutkintorakennepalaute = computed(() => true);
}
