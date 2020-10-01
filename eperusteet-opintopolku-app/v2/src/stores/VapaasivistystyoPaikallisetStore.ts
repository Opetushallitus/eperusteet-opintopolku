import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { IPaikallinenStore } from './IPaikallinenStore';

Vue.use(VueCompositionApi);

export class VapaasivistystyoPaikallisetStore implements IPaikallinenStore {
  public state = reactive({
    opetussuunnitelmat: null as any[] | null,
    perusteId: null as number | null,
  })

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);
  public readonly perusteId = computed(() => this.state.perusteId);

  public async setPerusteId(id: number) {
    this.state.perusteId = id;
    this.state.opetussuunnitelmat = [];
  }
}
