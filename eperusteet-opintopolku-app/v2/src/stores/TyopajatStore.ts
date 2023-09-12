import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';

Vue.use(VueCompositionApi);

export class TyopajatStore {
  public state = reactive({
    opetussuunnitelmat: null as OpetussuunnitelmaDto | null,
  })

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);

  public async fetch() {
    this.state.opetussuunnitelmat = ((await getJulkisetOpetussuunnitelmat({
      sivu: 0,
      sivukoko: 100,
      kieli: Kielet.getUiKieli.value,
    })).data as any).data;
  }
}
