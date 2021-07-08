import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto, TiedoteDto, Perusteet, Julkaisut, JulkaisuJulkinenDto } from '@shared/api/eperusteet';
import { OpetussuunnitelmaJulkinenDto, OpetussuunnitelmatJulkiset } from '@shared/api/ylops';

import { Opetussuunnitelmat } from '@shared/api/amosaa';

import { ryhmat } from '@shared/utils/perusteet';
import { tiedoteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';

@Store
export class PerusteKoosteStore {
  @State() public koulutustyyppi: string;
  @State() public perusteId: number;
  @State() public julkaistutPerusteet: JulkaisuJulkinenDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public opetussuunnitelmat: OpetussuunnitelmaJulkinenDto[] | null = null;

  constructor(
    koulutustyyppi: string,
    perusteId: number) {
    this.koulutustyyppi = koulutustyyppi;
    this.perusteId = perusteId;
    this.reload();
  }

  async reload() {
    if (this.perusteId) {
      // this.perusteet = [(await Perusteet.getPerusteenTiedot(this.perusteId)).data];
      this.julkaistutPerusteet = [(await Julkaisut.getPerusteenJulkaisu(this.perusteId)).data as any];
    }
    else if (this.koulutustyyppi) {
      const koulutustyypit = ryhmat(this.koulutustyyppi);
      // this.perusteet = (await perusteetQuery({
      //   sivukoko: 100,
      //   koulutustyyppi: koulutustyypit,
      //   siirtyma: false,
      //   poistunut: false,
      //   voimassaolo: true,
      //   tuleva: true,
      //   julkaistu: true,
      // })).data;
      this.julkaistutPerusteet = (await Julkaisut.getKoulutustyyppienJulkaisut(koulutustyypit)).data as any;
    }

    let tiedotteet: TiedoteDto[] = [];
    for (const julkaisu of this.julkaistutPerusteet || []) {
      tiedotteet = [...tiedotteet,
        ...(await tiedoteQuery({
          sivukoko: 100,
          perusteId: julkaisu.peruste!.id,
        })),
      ];
    }

    tiedotteet = [...tiedotteet,
      ...(await tiedoteQuery({
        sivukoko: 100,
        koulutusTyyppi: ryhmat(this.koulutustyyppi),
      })),
    ];

    if (_.size(this.julkaistutPerusteet) > 0) {
      tiedotteet = [...tiedotteet,
        ...(await tiedoteQuery({
          sivukoko: 100,
          perusteIds: _.map(this.julkaistutPerusteet, julkaisu => julkaisu.peruste!.id) as number[],
        })),
      ];
    }

    this.tiedotteet = _.chain(tiedotteet)
      .uniqBy('id')
      .filter('otsikko')
      .value();
  }

  @Getter(state => _.get(_.find(state.julkaistutPerusteet, _.find(state.julkaistutPerusteet, ['peruste.id', state.perusteId])), 'peruste'))
  public readonly activePeruste!: PerusteDto;
}
