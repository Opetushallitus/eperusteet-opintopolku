import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, Matala, KoulutustoimijaJulkinenDto } from '@shared/api/amosaa';

Vue.use(VueCompositionApi);

export class SisaltoviiteStore {
  private state = reactive({
    sisaltoviite: null as Matala | null,
  })

  constructor(private opsId: number, private sisaltoviiteId: number) {
    this.fetch();
  }

  public readonly sisaltoviite = computed(() => this.state.sisaltoviite);

  public async fetch() {
    const koulutustoimija = (await JulkinenApi.getOpetussuunnitelmanToimija(this.opsId)).data;
    this.state.sisaltoviite = (await JulkinenApi.getOpetussuunnitelmaTekstit(this.opsId, this.sisaltoviiteId, _.toString(koulutustoimija.id))).data;
  }
}
