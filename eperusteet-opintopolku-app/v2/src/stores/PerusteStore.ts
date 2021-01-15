import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto, Perusteet, Tiedotteet, getAllPerusteet } from '@shared/api/eperusteet';

import _ from 'lodash';
import { AmmatillisetKoulutustyypit, EperusteetKoulutustyypit } from '@shared/utils/perusteet';

@Store
export class PerusteStore {
  @State() public perusteet: PerusteDto[] | null = null;

  async getYleisetPerusteet() {
    this.perusteet = ((await getAllPerusteet(
      {
        sivu: 0,
        sivukoko: 100,
        tuleva: true,
        siirtyma: true,
        voimassaolo: true,
        poistunut: false,
        koulutustyyppi: _.filter(EperusteetKoulutustyypit, kt => !_.includes(AmmatillisetKoulutustyypit, kt)),
        julkaistu: true,
      }
    )).data as any).data;
  }
}
