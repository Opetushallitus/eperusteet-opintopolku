import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { PerusteHakuDto, Oppaat, PerusteQuery } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ryhmat } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';

Vue.use(VueCompositionApi);

export class OpasStore {
  public state = reactive({
    oppaat: null as PerusteHakuDto[] | null,
    query: {} as PerusteQuery,
  })

  constructor(koulutustyyppi: string) {
    this.state.query = {
      sivu: 0,
      sivukoko: 100,
      kieli: [Kielet.getUiKieli.value],
      koulutustyyppi: ryhmat(koulutustyyppi),
    };

    this.fetch();
  }

  public readonly oppaat = computed(() => this.state.oppaat);

  public async fetch() {
    const res = (await Oppaat.getAllOppaat(
      this.state.query.sivu,
      this.state.query.sivukoko,
      this.state.query.nimi,
      _.head(this.state.query.kieli),
      this.state.query.muokattu,
      this.state.query.koulutustyyppi
    )).data as any;

    this.state.oppaat = res.data;
  }
}
