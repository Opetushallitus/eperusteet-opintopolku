import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto, Perusteet, Tiedotteet, getAllPerusteet, PerusteQuery } from '@shared/api/eperusteet';
import { Koulutustyyppi } from '@shared/tyypit';

import _ from 'lodash';
import { AmmatillisetKoulutustyypit, EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import { Debounced } from '@shared/utils/delay';

@Store
export class PerusteStore {
  @State() public perusteet: PerusteDto[] | null = null;
  @State() public ammatillisetLukumaarat: any[] | null = null;
  @State() public query: PerusteQuery | undefined = undefined;

  @Debounced(300)
  async getYleisetPerusteet(query?: PerusteQuery) {
    this.query = query;
    this.perusteet = null;
    this.perusteet = ((await getAllPerusteet(
      {
        sivu: 0,
        sivukoko: 100,
        tuleva: true,
        siirtyma: true,
        voimassaolo: true,
        poistunut: false,
        koulutustyyppi: _.filter(EperusteetKoulutustyypit, kt => !_.includes(AmmatillisetKoulutustyypit, kt)),
        kieli: query?.kieli,
        julkaistu: true,
        ...(query || {}),
      }
    )).data as any).data;
    this.ammatillisetLukumaarat = (await Perusteet.getJulkaistutLukumaarilla(
      _.reject(AmmatillisetKoulutustyypit, kt => kt === Koulutustyyppi.valma || kt === Koulutustyyppi.telma))).data;
  }
}
