import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto, Perusteet } from '@shared/api/eperusteet';
import { OpetussuunnitelmaJulkinenDto, OpetussuunnitelmatJulkiset } from '@shared/api/ylops';

import { Opetussuunnitelmat } from '@shared/api/amosaa';

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
    if (this.perusteId) {
      this.perusteet = [(await Perusteet.getPerusteenTiedot(this.perusteId)).data];

      this.setPerusteId(this.perusteId);
    }
    else if (this.koulutustyyppi) {
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
          sivukoko: 100,
          perusteId: peruste.id,
        })),
      ];
    }

    tiedotteet = [...tiedotteet,
      ...(await tiedoteQuery({
        sivukoko: 100,
        koulutusTyyppi: ryhmat(this.koulutustyyppi),
      })),
    ];

    tiedotteet = [...tiedotteet,
      ...(await tiedoteQuery({
        sivukoko: 100,
        perusteIds: _.map(this.perusteet, 'id') as number[],
      })),
    ];

    this.tiedotteet = _.chain(tiedotteet)
      .uniqBy('id')
      .filter('otsikko')
      .value();
  }

  @Getter(state => _.find(state.perusteet, _.find(state.perusteet, ['id', state.perusteId])))
  public readonly activePeruste!: PerusteDto;
}
