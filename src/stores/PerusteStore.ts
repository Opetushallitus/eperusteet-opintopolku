import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto, Perusteet, Tiedotteet, getAllPerusteet, PerusteQuery, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Koulutustyyppi } from '@shared/tyypit';

import _ from 'lodash';
import { AmmatillisetKoulutustyypit, EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import { Debounced } from '@shared/utils/delay';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';

@Store
export class PerusteStore {
  @State() public perusteet: PerusteenJulkaisuData[] | null = null;
  @State() public query: JulkaistutPerusteetQuery | undefined = undefined;

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
}
