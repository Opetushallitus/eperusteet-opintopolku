import { Store, Getter, State } from '@shared/stores/store';
import { OpetussuunnitelmaJulkinenDto, PerusteDto, TiedoteDto } from '@shared/api/tyypit';
import { OpetussuunnitelmatJulkiset } from '@shared/api/ylops';
import { Perusteet } from '@shared/api/eperusteet';
import { ryhmat } from '@/utils/perusteet';
import { tiedoteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';


@Store
export class PerusteKoosteStore {
  @State() public perusteet: PerusteDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public koulutustyyppi: string | null = null;
  @State() public perusteId: number | null = null;
  @State() public opetussuunnitelmat: OpetussuunnitelmaJulkinenDto[] | null = null;

  constructor(
    koulutustyyppi: string,
    perusteId?: number) {
    this.koulutustyyppi = koulutustyyppi;
    this.perusteId = perusteId || null;
    this.reload();
  }

  async setPerusteId(id: number) {
    this.perusteId = id;
    this.opetussuunnitelmat = null;
    const opsit = await OpetussuunnitelmatJulkiset.getAllJulkiset(
      undefined, undefined, undefined, '' + id);
    this.opetussuunnitelmat = opsit.data;
  }

  async reload() {
    if (this.koulutustyyppi) {
      const koulutustyypit = ryhmat(this.koulutustyyppi);
      this.perusteet = (await perusteetQuery({
        sivukoko: 100,
        koulutustyyppi: koulutustyypit,
        siirtyma: false,
        poistunut: false,
        voimassaolo: true,
        tuleva: true,
      })).data;

      const id = _.get(this, 'perusteet[0].id');
      if (id) {
        this.setPerusteId(id);
      }
    }


    let tiedotteet: TiedoteDto[] = [];
    for (const peruste of this.perusteet || []) {
      tiedotteet = [...tiedotteet,
        ...(await tiedoteQuery({
          sivukoko: 5,
          perusteId: peruste.id,
        }))
      ];
    }

    this.tiedotteet = _.chain(tiedotteet)
      .filter('otsikko')
      .sortBy('luotu')
      .value();
  }
}
