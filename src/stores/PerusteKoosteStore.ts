import { PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { ryhmat } from '@shared/utils/perusteet';
import { julkaistutPerusteet } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';
import  { reactive, computed } from'vue';
import { usePerusteCacheStore } from '@/stores/PerusteCacheStore';

export class PerusteKoosteStore implements IPerusteKoosteStore {
  public state = reactive({
    koulutustyyppi: '' as string | '',
    perusteJulkaisut: null as PerusteenJulkaisuData[] | null,
  });

  public readonly perusteCacheStore = usePerusteCacheStore();

  public readonly koulutustyyppi = computed(() => this.state.koulutustyyppi);
  public readonly perusteJulkaisut = computed(() => this.state.perusteJulkaisut);

  constructor(koulutustyyppi: string) {
    this.state.koulutustyyppi = koulutustyyppi;
  }

  async fetch() {
    const koulutustyypit = ryhmat(this.state.koulutustyyppi);
    this.state.perusteJulkaisut = null;
    this.state.perusteJulkaisut = _.get((await julkaistutPerusteet({ koulutustyyppi: koulutustyypit, poistunut: true })), 'data');

    this.state.perusteJulkaisut.forEach(async (peruste) => {
      this.perusteCacheStore.addPerusteStore(peruste.id);
    });
  }
}
