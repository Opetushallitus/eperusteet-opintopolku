import { Store, State } from '@shared/stores/store';
import { JulkiEtusivuDto, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import _ from 'lodash';
import { AmmatillisetKoulutustyypit, EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import {
  julkaistutOpsitJaPerusteet,
  julkaistutPerusteet,
  JulkaistutPerusteetQuery,
  JulkiEtusivuQuery,
} from '@/api/eperusteet';
import { Page } from '@shared/tyypit';

@Store
export class PerusteStore {
  @State() public perusteet: PerusteenJulkaisuData[] | null = null;
  @State() public query: JulkaistutPerusteetQuery | undefined = undefined;
  @State() public opsitJaPerusteet: Page<JulkiEtusivuDto> | null = null;
  @State() public julkiQuery: JulkiEtusivuQuery | undefined = undefined;

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  async getYleisetPerusteet(query?: JulkaistutPerusteetQuery) {
    this.query = query;
    this.perusteet = null;
    this.perusteet = ((await julkaistutPerusteet(
      {
        sivu: 0,
        sivukoko: 999,
        tuleva: true,
        siirtyma: true,
        voimassaolo: true,
        poistunut: false,
        koulutustyyppi: _.filter(EperusteetKoulutustyypit, kt => !_.includes(AmmatillisetKoulutustyypit, kt)),
        kieli: query?.kieli,
        ...(query || {}),
      },
    )).data as any);
  }

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  async getOpsitJaPerusteet(query: JulkiEtusivuQuery) {
    this.julkiQuery = query;
    this.opsitJaPerusteet = (await julkaistutOpsitJaPerusteet(this.julkiQuery));
  }
}
