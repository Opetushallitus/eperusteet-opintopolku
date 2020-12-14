import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { PerusteDto, TiedoteDto, Perusteet } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { tiedoteQuery } from '@/api/eperusteet';

Vue.use(VueCompositionApi);

export class AmmatillinenPerusteKoosteStore {
  public state = reactive({
    peruste: null as PerusteDto | null,
    opetussuunnitelmat: null as OpetussuunnitelmaDto | null,
    tiedotteet: null as TiedoteDto | null,
  })

  constructor(private perusteId: number) {
    this.fetch();
  }

  public readonly peruste = computed(() => this.state.peruste);
  public readonly tiedotteet = computed(() => this.state.tiedotteet);
  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);

  public async fetch() {
    this.state.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;

    this.state.opetussuunnitelmat = ((await JulkinenApi.findOpetussuunnitelmat(
      this.state.peruste.diaarinumero,
      this.state.peruste.id,
      undefined,
      undefined,
      0,
      100,
      '',
      Kielet.getUiKieli.value,
    )).data as any).data;

    const vanhat = (await tiedoteQuery({
      sivukoko: 100,
      perusteId: this.perusteId,
    }));

    const uudet = (await tiedoteQuery({
      sivukoko: 100,
      perusteIds: [this.perusteId],
    }));

    this.state.tiedotteet = _.chain([
      ...vanhat,
      ...uudet,
    ])
      .uniqBy('id')
      .sortBy('luotu')
      .reverse()
      .value() as any;
  }
}
