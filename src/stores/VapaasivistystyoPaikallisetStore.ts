import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { IPaikallinenStore } from './IPaikallinenStore';
import { OpetussuunnitelmaQuery, getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto, JulkinenApi, KoulutustoimijaJulkinenDto } from '@shared/api/amosaa';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import { Page, Koulutustyyppi } from '@shared/tyypit';

Vue.use(VueCompositionApi);

export class VapaasivistystyoPaikallisetStore implements IPaikallinenStore {
  public state = reactive({
    opetussuunnitelmat: null as Page<OpetussuunnitelmaDto> | null,
    query: {} as OpetussuunnitelmaQuery,
    oppilaitokset: null as KoulutustoimijaJulkinenDto[] | null,
  });

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat?.data as any[]);
  public readonly opetussuunnitelmatPaged = computed(() => this.state.opetussuunnitelmat);
  public readonly query = computed(() => this.state.query);
  public readonly oppilaitokset = computed(() => this.state.oppilaitokset);

  async fetch() {
    this.state.opetussuunnitelmat = null;
    this.state.opetussuunnitelmat = ((await getJulkisetOpetussuunnitelmat(this.state.query)).data as any);

    if (!this.state.oppilaitokset) {
      this.state.oppilaitokset = (await JulkinenApi.findKoulutusatyypinKoulutustoimijat([Koulutustyyppi.vapaasivistystyo])).data;
    }
  }

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  async fetchQuery(query) {
    this.state.query = query;
    await this.fetch();
  }
}
