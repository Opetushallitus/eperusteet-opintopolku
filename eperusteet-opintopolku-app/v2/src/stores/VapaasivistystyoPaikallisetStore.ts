import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { IPaikallinenStore } from './IPaikallinenStore';
import { OpetussuunnitelmaQuery, getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Debounced } from '@shared/utils/delay';
import { Page } from '@shared/tyypit';

Vue.use(VueCompositionApi);

export class VapaasivistystyoPaikallisetStore implements IPaikallinenStore {
  public state = reactive({
    opetussuunnitelmat: null as Page<OpetussuunnitelmaDto> | null,
    query: {} as OpetussuunnitelmaQuery,
  })

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat?.data as any[]);
  public readonly opetussuunnitelmatPaged = computed(() => this.state.opetussuunnitelmat);
  public readonly query = computed(() => this.state.query);

  async fetch() {
    this.state.opetussuunnitelmat = null;
    this.state.opetussuunnitelmat = ((await getJulkisetOpetussuunnitelmat(this.state.query)).data as any);
  }

  @Debounced()
  async fetchQuery(query) {
    this.state.query = query;
    await this.fetch();
  }
}
