import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto } from '@shared/api/eperusteet';
import { OpetussuunnitelmaJulkinenDto } from '@shared/api/ylops';
import { OpetussuunnitelmatJulkiset } from '@shared/api/ylops';
import { ryhmat } from '@shared/utils/perusteet';
import { tiedoteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';


@Store
export class PerusteKoosteStore {
  @State() public koulutustyyppi: string;
  @State() public perusteId: number;
  @State() public perusteet: PerusteDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public opetussuunnitelmat: OpetussuunnitelmaJulkinenDto[] | null = null;

  constructor(
    koulutustyyppi: string,
    perusteId: number) {
    this.koulutustyyppi = koulutustyyppi;
    this.perusteId = perusteId;
    this.reload();
  }

  async setPerusteId(id: number) {
    this.perusteId = id;
    this.opetussuunnitelmat = null;
    this.opetussuunnitelmat = (await OpetussuunnitelmatJulkiset.getAllJulkiset(
      undefined,
      undefined,
      undefined,
      _.toString(id)
    )).data;
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
      else {
        // Jos ei yhtään perustetta
        this.opetussuunnitelmat = [];
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
      .value();
  }

  @Getter(state => _.find(state.perusteet, _.find(state.perusteet, ['id', state.perusteId])))
  public readonly activePeruste!: PerusteDto;
}
