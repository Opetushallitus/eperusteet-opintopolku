import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { Sisaltoviitteet, SisaltoViiteDto } from '@shared/api/amosaa';

Vue.use(VueCompositionApi);

export class KoulutuksenOsatStore {
  public state = reactive({
    koulutuksenosat: [] as SisaltoViiteDto[] | null,
  });

  public readonly koulutuksenosat = computed(() => this.state.koulutuksenosat);

  async fetch(opsId, ktId) {
    this.state.koulutuksenosat = null;
    this.state.koulutuksenosat = (await Sisaltoviitteet.getSisaltoviitteeTyypilla(opsId, 'koulutuksenosa', ktId)).data;
  }
}
