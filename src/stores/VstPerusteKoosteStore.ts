import { Osaamismerkit, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { ryhmat } from '@shared/utils/perusteet';
import { julkaistutPerusteet } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';
import VueCompositionApi, { computed, reactive } from '@vue/composition-api';
import OsaamismerkkiTile from '@/routes/osaamismerkit/OsaamismerkkiTile.vue';
import Vue from 'vue';

Vue.use(VueCompositionApi);

export class VstPerusteKoosteStore implements IPerusteKoosteStore {
  public state = reactive({
    koulutustyyppi: '' as string | '',
    perusteJulkaisut: null as PerusteenJulkaisuData[] | null,
    muutTilet: [] as any[],
  });

  public readonly koulutustyyppi = computed(() => this.state.koulutustyyppi);
  public readonly perusteJulkaisut = computed(() => this.state.perusteJulkaisut);
  public readonly muutTilet = computed(() => this.state.muutTilet);

  constructor(koulutustyyppi: string) {
    this.state.koulutustyyppi = koulutustyyppi;
    this.fetchOsaamismerkit();
  }

  async fetch() {
    const koulutustyypit = ryhmat(this.state.koulutustyyppi);
    this.state.perusteJulkaisut = _.get((await julkaistutPerusteet({ koulutustyyppi: koulutustyypit, poistunut: true })), 'data');
  }

  async fetchOsaamismerkit() {
    const osaamismerkit = (await Osaamismerkit.findJulkisetOsaamismerkitBy()).data as any;
    if (osaamismerkit.length > 0) {
      this.state.muutTilet.push({
        route: { name: 'osaamismerkit' },
        komponentti: OsaamismerkkiTile,
      });
    }
  }
}
