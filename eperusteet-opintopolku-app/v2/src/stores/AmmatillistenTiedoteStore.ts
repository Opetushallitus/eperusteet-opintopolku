import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { TiedoteDto, Tiedotteet } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ITiedotteetProvider } from '@shared/stores/types';
import { TiedoteQuery } from '@shared/api/types';
import { PageTiedoteDto } from '@shared/api/eperusteet';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';

Vue.use(VueCompositionApi);

export class AmmatillistenTiedoteStore implements ITiedotteetProvider {
  private state = reactive({
    tiedotteet: null as TiedoteDto[] | null,
    query: {} as TiedoteQuery,
  })

  public readonly tiedotteet = computed(() => this.state.tiedotteet);
  public readonly perusteenTiedotteet = computed(() => []);
  public readonly perusteId = computed(() => {});
  public readonly query = computed(() => this.state.query);

  async init(koulutustTyypit: string[]) {
    this.state.query.koulutusTyyppi = koulutustTyypit;
  }

  public async fetch() {
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
  }

  public async save() {
    // not supported
  }

  public async delete() {
    // not supported
  }
}
