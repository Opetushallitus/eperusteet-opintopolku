import { Store, Getter, State } from '@shared/stores/store';
import { OpetussuunnitelmaJulkinenDto, PerusteDto, TiedoteDto } from '@shared/api/tyypit';
import { OpetussuunnitelmatJulkiset } from '@shared/api/ylops';
import { Perusteet } from '@shared/api/eperusteet';
import { tiedoteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';


@Store
export class PerusteKoosteStore {
  @State() public perusteet: PerusteDto[] | null = null;
  @State() public opetussuunnitelmat: OpetussuunnitelmaJulkinenDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public koulutustyyppi: string | null = null;
  @State() public perusteId: number | null = null;

  @Getter()
  info() {
    return {
      koulutustyyppi: this.koulutustyyppi,
      perusteId: this.perusteId,
    };
  }

  constructor(
    koulutustyyppi: string,
    perusteId: number) {
    this.koulutustyyppi = koulutustyyppi;
    this.perusteId = perusteId;
    this.reload();
  }

  async reload() {
    if (this.koulutustyyppi) {
      this.perusteet = await perusteetQuery({
        sivukoko: 100,
        koulutustyyppi: [this.koulutustyyppi],
        siirtyma: false,
        poistunut: false,
        voimassaolo: true,
        tuleva: true,
      });

      this.opetussuunnitelmat = (await OpetussuunnitelmatJulkiset.getAllJulkiset(this.koulutustyyppi)).data;
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
