import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { OpetussuunnitelmaJulkinenDto, OpetussuunnitelmatJulkiset } from '@shared/api/ylops';
import { IPaikallinenStore } from './IPaikallinenStore';

Vue.use(VueCompositionApi);

export class YleissivistavatPaikallisetStore implements IPaikallinenStore {
  public state = reactive({
    opetussuunnitelmat: null as OpetussuunnitelmaJulkinenDto[] | null,
    perusteId: null as number | null,
  })

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);
  public readonly perusteId = computed(() => this.state.perusteId);

  public async fetch(perusteId?: number, perusteenDiaarinumero?: string, koulutustyypit?: string[]) {
    this.state.perusteId = perusteId!;
    this.state.opetussuunnitelmat = null;
    this.state.opetussuunnitelmat = _.get((await OpetussuunnitelmatJulkiset.getAllJulkaistutOpetussuunnitelmat(
      koulutustyypit,
      undefined,
      undefined,
      perusteenDiaarinumero,
      0,
      999,
    )).data, 'data');
  }
}
