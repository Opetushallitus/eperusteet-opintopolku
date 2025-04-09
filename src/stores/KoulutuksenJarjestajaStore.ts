import Vue, { computed, reactive } from 'vue';
import _ from 'lodash';
import { KoulutustoimijaJulkinenDto, JulkinenApi, OpetussuunnitelmaDto, getJulkisetOpetussuunnitelmat } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Page } from '@shared/tyypit';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';

export class KoulutuksenJarjestajaStore {
  private state = reactive({
    koulutustoimija: null as KoulutustoimijaJulkinenDto | null,
    yhteisetOsuudet: null as OpetussuunnitelmaDto[] | null,
    toteutussuunnitelmat: null as Page<OpetussuunnitelmaDto> | null,
  });

  public static async create(koulutustoimijaId) {
    const result = new KoulutuksenJarjestajaStore(koulutustoimijaId);
    await result.fetchKoulutustoimija();
    return result;
  }

  constructor(private koulutustoimijaId: number) {
    this.fetchKoulutustoimija();
  }

  public readonly koulutustoimija = computed(() => this.state.koulutustoimija);
  public readonly yhteisetOsuudet = computed(() => this.state.yhteisetOsuudet);
  public readonly toteutussuunnitelmat = computed(() => this.state.toteutussuunnitelmat);

  public async fetchKoulutustoimija() {
    this.state.koulutustoimija = (await JulkinenApi.getKoulutustoimijaByKtId(this.koulutustoimijaId)).data;
  }

  public async fetch() {
    this.state.yhteisetOsuudet = null;
    this.state.yhteisetOsuudet = ((await getJulkisetOpetussuunnitelmat({
      organisaatio: this.state.koulutustoimija!.organisaatio,
      tyyppi: ['yhteinen'],
      sivu: 0,
      sivukoko: 9999,
      kieli: Kielet.getUiKieli.value,
    })).data as any).data;
  }

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  public async fetchToteutussuunnitelmat(nimi, sivu) {
    this.state.toteutussuunnitelmat = null;
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
