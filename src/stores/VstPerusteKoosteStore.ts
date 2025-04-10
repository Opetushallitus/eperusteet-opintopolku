import { Osaamismerkit, PerusteenJulkaisuData, Perusteet, PerusteKevytDto } from '@shared/api/eperusteet';
import { ryhmat } from '@shared/utils/perusteet';
import { julkaistutPerusteet } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';
import VueCompositionApi, { computed, reactive } from '@vue/composition-api';
import OsaamismerkkiTile from '@/routes/osaamismerkit/OsaamismerkkiTile.vue';
import Vue from 'vue';
import { usePerusteCacheStore } from '@/stores/PerusteCacheStore';

Vue.use(VueCompositionApi);

export class VstPerusteKoosteStore implements IPerusteKoosteStore {
  public state = reactive({
    koulutustyyppi: '' as string | '',
    perusteJulkaisut: null as PerusteenJulkaisuData[] | null,
    muutTilet: [] as any[],
    julkaistutKoostePerusteet: null as PerusteKevytDto[] | null,
  });

  public readonly koulutustyyppi = computed(() => this.state.koulutustyyppi);
  public readonly perusteJulkaisut = computed(() => this.state.perusteJulkaisut);
  public readonly muutTilet = computed(() => this.state.muutTilet);
  public readonly perusteCacheStore = usePerusteCacheStore();
  public readonly perusteJarjestykset = computed(() => _.filter(this.state.julkaistutKoostePerusteet, peruste => _.includes(_.map(this.state.perusteJulkaisut, 'id'), peruste.id)));

  constructor(koulutustyyppi: string) {
    this.state.koulutustyyppi = koulutustyyppi;
    this.fetchOsaamismerkit();
  }

  async fetch() {
    const koulutustyypit = ryhmat(this.state.koulutustyyppi);
    this.state.julkaistutKoostePerusteet = null;
    this.state.perusteJulkaisut = null;

    this.state.julkaistutKoostePerusteet = (await Perusteet.getJulkaistutKoostePerusteet()).data;
    this.state.perusteJulkaisut = _.get((await julkaistutPerusteet({ koulutustyyppi: koulutustyypit, poistunut: true })), 'data');

    this.state.perusteJulkaisut.forEach(async (peruste) => {
      this.perusteCacheStore.addPerusteStore(peruste.id);
    });
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
