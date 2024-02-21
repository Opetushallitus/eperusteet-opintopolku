import { Store, State } from '@shared/stores/store';
import { PerusteenJulkaisuData } from '@shared/api/eperusteet';
import _ from 'lodash';
import { AmmatillisetKoulutustyypit, EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import { Debounced } from '@shared/utils/delay';
import {
  julkaistutOpsitJaPerusteet,
  julkaistutPerusteet,
  JulkaistutPerusteetQuery,
  JulkiEtusivuQuery,
} from '@/api/eperusteet';
import { JulkiEtusivuDto } from '@shared/generated/eperusteet';

@Store
export class PerusteStore {
  @State() public perusteet: PerusteenJulkaisuData[] | null = null;
  @State() public query: JulkaistutPerusteetQuery | undefined = undefined;
  @State() public opsitJaPerusteet: JulkiEtusivuDto[] | null = null;
  @State() public julkiQuery: JulkiEtusivuQuery | undefined = undefined;
  @State() public opsitJaPerusteetCount = 0;

  @Debounced(300)
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

  @Debounced(300)
  async getOpsitJaPerusteet(query: JulkiEtusivuQuery) {
    this.julkiQuery = query;
    this.opsitJaPerusteet = null;
    const result = (await julkaistutOpsitJaPerusteet(this.julkiQuery));
    this.opsitJaPerusteetCount = result['kokonaismäärä'];
    this.opsitJaPerusteet = result.data;
  }
}
