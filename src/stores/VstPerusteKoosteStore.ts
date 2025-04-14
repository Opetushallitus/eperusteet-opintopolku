import { Osaamismerkit, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { ryhmat } from '@shared/utils/perusteet';
import { julkaistutPerusteet } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';
import OsaamismerkkiTile from '@/routes/osaamismerkit/OsaamismerkkiTile.vue';
import  { reactive, computed } from '@vue/composition-api';
import { usePerusteCacheStore } from '@/stores/PerusteCacheStore';

export class VstPerusteKoosteStore implements IPerusteKoosteStore {
  public state = reactive({
    koulutustyyppi: '' as string | '',
    perusteJulkaisut: null as PerusteenJulkaisuData[] | null,
    muutTilet: [] as any[],
  });

  public readonly koulutustyyppi = computed(() => this.state.koulutustyyppi);
  public readonly perusteJulkaisut = computed(() => this.state.perusteJulkaisut);
  public readonly muutTilet = computed(() => this.state.muutTilet);
  public readonly perusteCacheStore = usePerusteCacheStore();

  constructor(koulutustyyppi: string) {
    this.state.koulutustyyppi = koulutustyyppi;
    this.fetchOsaamismerkit();
  }

  async fetch() {
    const koulutustyypit = ryhmat(this.state.koulutustyyppi);
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
