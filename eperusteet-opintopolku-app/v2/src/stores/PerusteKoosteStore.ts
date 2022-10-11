import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto, Perusteet, Julkaisut, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { OpetussuunnitelmaJulkinenDto, OpetussuunnitelmatJulkiset } from '@shared/api/ylops';

import { Opetussuunnitelmat } from '@shared/api/amosaa';

import { ryhmat } from '@shared/utils/perusteet';
import { tiedoteQuery, perusteetQuery, julkaistutPerusteet } from '@/api/eperusteet';
import _ from 'lodash';
import { Page } from '@shared/tyypit';

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
    this.perusteJulkaisut = _.get((await julkaistutPerusteet({ koulutustyyppi: koulutustyypit })), 'data');
  }
}
