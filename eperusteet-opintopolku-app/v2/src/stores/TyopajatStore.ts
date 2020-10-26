import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';

Vue.use(VueCompositionApi);

export class TyopajatStore {
  public state = reactive({
    opetussuunnitelmat: null as OpetussuunnitelmaDto | null,
  })

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);

  public async fetch() {
    this.state.opetussuunnitelmat = ((await JulkinenApi.findOpetussuunnitelmat(
      undefined,
      undefined,
      undefined,
      undefined,
      0,
      100,
      '',
      Kielet.getUiKieli.value,
      true,
    )).data as any).data;
  }
}
