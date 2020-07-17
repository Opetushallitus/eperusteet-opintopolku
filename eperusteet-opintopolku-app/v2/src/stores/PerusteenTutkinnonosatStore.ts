import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { TutkinnonRakenne } from '@shared/api/eperusteet';

Vue.use(VueCompositionApi);

export class PerusteenTutkinnonosatStore {
  private state = reactive({
    tutkinnonosat: null as any[] | null,
  })

  constructor(private perusteId: number) {
    this.fetch();
  }

  public readonly tutkinnonosat = computed(() => this.state.tutkinnonosat);

  public async fetch() {
    this.state.tutkinnonosat = (await TutkinnonRakenne.getPerusteenTutkinnonOsat(this.perusteId, 'REFORMI')).data as any[];
  }
}
