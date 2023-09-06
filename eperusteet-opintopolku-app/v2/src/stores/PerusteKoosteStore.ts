import { Store, State } from '@shared/stores/store';
import { PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { OpetussuunnitelmaJulkinenDto } from '@shared/api/ylops';
import { ryhmat } from '@shared/utils/perusteet';
import { julkaistutPerusteet } from '@/api/eperusteet';
import _ from 'lodash';

@Store
export class PerusteKoosteStore {
  @State() public koulutustyyppi: string;
  @State() public perusteJulkaisut: PerusteenJulkaisuData[] | null = null;
  @State() public opetussuunnitelmat: OpetussuunnitelmaJulkinenDto[] | null = null;

  constructor(
    koulutustyyppi: string) {
    this.koulutustyyppi = koulutustyyppi;
    this.reload();
  }

  async reload() {
    const koulutustyypit = ryhmat(this.koulutustyyppi);
    this.perusteJulkaisut = _.get((await julkaistutPerusteet({ koulutustyyppi: koulutustyypit, poistunut: true })), 'data');
  }
}
