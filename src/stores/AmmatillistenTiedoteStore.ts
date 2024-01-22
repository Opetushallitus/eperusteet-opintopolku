import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { TiedoteDto, Tiedotteet, PageTiedoteDto } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ITiedotteetProvider } from '@shared/stores/types';
import { TiedoteQuery } from '@shared/api/types';

Vue.use(VueCompositionApi);

export class AmmatillistenTiedoteStore implements ITiedotteetProvider {
  private state = reactive({
    tiedotteet: null as TiedoteDto[] | null,
    query: {} as TiedoteQuery,
    options: null as TiedoteQuery | null,
    isLoading: true,
    kokonaismaara: null as number | null,
  });

  public readonly options = computed(() => this.state.tiedotteet);
  public readonly tiedotteet = computed(() => this.state.tiedotteet);
  public readonly isLoading = computed(() => this.state.isLoading);
  public readonly kokonaismaara = computed(() => this.state.kokonaismaara);
  public readonly perusteenTiedotteet = computed(() => []);
  public readonly query = computed(() => this.state.query);

  async init(options: TiedoteQuery) {
    this.state.options = options;
    this.state.query.koulutusTyyppi = options.koulutusTyyppi;
  }

  public async fetch() {
    this.state.isLoading = true;
    this.state.kokonaismaara = null;
    const res = (await Tiedotteet.findTiedotteetBy(
      0,
      9999,
      this.state.query.kieli,
      this.state.query.nimi,
      this.state.query.perusteId,
      this.state.query.perusteeton,
      this.state.query.julkinen,
      this.state.query.yleinen,
      this.state.query.tiedoteJulkaisuPaikka,
      this.state.query.perusteIds,
      this.state.query.koulutusTyyppi,
    )).data as any;
    this.state.tiedotteet = res.data;
    this.state.kokonaismaara = res.data.kokonaismaara;
    this.state.isLoading = false;
  }

  public async save() {
    // not supported
  }

  public async delete() {
    // not supported
  }
}
