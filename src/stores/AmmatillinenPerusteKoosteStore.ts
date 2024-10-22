import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { OpetussuunnitelmaDto, getJulkisetOpetussuunnitelmat, OpetussuunnitelmaQuery } from '@shared/api/amosaa';
import { TiedoteDto, Perusteet, PerusteKaikkiDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { tiedoteQuery } from '@/api/eperusteet';
import { Page } from '@shared/tyypit';
import { Debounced } from '@shared/utils/delay';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { usePerusteCacheStore } from '@/stores/PerusteCacheStore';

Vue.use(VueCompositionApi);

export class AmmatillinenPerusteKoosteStore {
  public state = reactive({
    peruste: null as PerusteKaikkiDto | null,
    opetussuunnitelmat: null as Page<OpetussuunnitelmaDto> | null,
    tiedotteet: null as TiedoteDto | null,
    opsQuery: null as OpetussuunnitelmaQuery | null,
  });

  constructor(private perusteId: number) {
    this.fetch();
  }

  public readonly peruste = computed(() => this.state.peruste);
  public readonly tiedotteet = computed(() => this.state.tiedotteet);
  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);
  public readonly perusteCacheStore = usePerusteCacheStore();

  public async fetch() {
    this.state.peruste = null;
    this.perusteCacheStore.addPerusteStore(this.perusteId);
    this.state.peruste = (await Perusteet.getKokoSisalto(this.perusteId)).data;

    this.state.opsQuery = {
      perusteenDiaarinumero: this.state.peruste!.diaarinumero,
      perusteId: this.state.peruste!.id,
      sivu: 0,
      sivukoko: 10,
      kieli: Kielet.getUiKieli.value,
      koulutustyyppi: AmmatillisetKoulutustyypit,
    };

    await this.fetchOpetussuunnitelmat(this.state.opsQuery);

    const vanhat = (await tiedoteQuery({
      sivukoko: 100,
      perusteId: this.perusteId,
      julkinen: true,
    }));

    const uudet = (await tiedoteQuery({
      sivukoko: 100,
      perusteIds: [this.perusteId],
    }));

    this.state.tiedotteet = _.chain([
      ...vanhat,
      ...uudet,
    ])
      .filter(tiedote => !!tiedote.otsikko)
      .uniqBy('id')
      .sortBy('luotu')
      .reverse()
      .value() as any;
  }

  @Debounced(300)
  public async fetchOpetussuunnitelmat(query) {
    this.state.opetussuunnitelmat = null;
    this.state.opetussuunnitelmat = ((await getJulkisetOpetussuunnitelmat({ ...this.state.opsQuery, ...query })).data as any);
  }
}
