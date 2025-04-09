import Vue, { computed, reactive } from 'vue';
import { getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';

export class TyopajatStore {
  public state = reactive({
    opetussuunnitelmat: null as OpetussuunnitelmaDto | null,
  });

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);

  public async fetch() {
    this.state.opetussuunnitelmat = ((await getJulkisetOpetussuunnitelmat({
      sivu: 0,
      sivukoko: 100,
      kieli: Kielet.getUiKieli.value,
    })).data as any).data;
  }
}
