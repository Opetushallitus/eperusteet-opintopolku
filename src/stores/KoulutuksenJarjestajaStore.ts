import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { KoulutustoimijaJulkinenDto, JulkinenApi, OpetussuunnitelmaDto, getJulkisetOpetussuunnitelmat } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Page } from '@shared/tyypit';
import { Debounced } from '@shared/utils/delay';

Vue.use(VueCompositionApi);

export class KoulutuksenJarjestajaStore {
  private state = reactive({
    koulutustoimija: null as KoulutustoimijaJulkinenDto | null,
    yhteisetOsuudet: null as OpetussuunnitelmaDto[] | null,
    toteutussuunnitelmat: null as Page<OpetussuunnitelmaDto> | null,
  });

  constructor(private koulutustoimijaId: number) {
    this.fetch();
  }

  public readonly koulutustoimija = computed(() => this.state.koulutustoimija);
  public readonly yhteisetOsuudet = computed(() => this.state.yhteisetOsuudet);
  public readonly toteutussuunnitelmat = computed(() => this.state.toteutussuunnitelmat);

  public async fetch() {
    this.state.koulutustoimija = (await JulkinenApi.getKoulutustoimijaByKtId(this.koulutustoimijaId)).data;
    this.state.yhteisetOsuudet = ((await getJulkisetOpetussuunnitelmat({
      organisaatio: this.state.koulutustoimija.organisaatio,
      tyyppi: ['yhteinen'],
      sivu: 0,
      sivukoko: 9999,
      kieli: Kielet.getUiKieli.value,
    })).data as any).data;

    await this.fetchToteutussuunnitelmat('', 0);
  }

  @Debounced()
  public async fetchToteutussuunnitelmat(nimi, sivu) {
    this.state.toteutussuunnitelmat = ((await getJulkisetOpetussuunnitelmat({
      organisaatio: this.state.koulutustoimija!.organisaatio,
      tyyppi: ['ops', 'yleinen'],
      nimi,
      sivu,
      sivukoko: 5,
      kieli: Kielet.getUiKieli.value,
      koulutustyyppi: AmmatillisetKoulutustyypit,
    })).data as any);
  }
}
