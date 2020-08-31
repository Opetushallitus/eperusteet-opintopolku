import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { TiedoteDto, Tiedotteet } from '@shared/api/eperusteet';

@Store
export class TiedoteStore {
  @State() public uusimmatTiedotteet: TiedoteDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public tiedote: TiedoteDto | null = null;
  @State() public tiedoteId: number | null = null;
  @State() public amount = 0;
  @State() public filter = {
    nimi: '',
    kieli: ['fi'],
    sivu: 0,
    sivukoko: 10,
  };

  async getUusimmat() {
    this.uusimmatTiedotteet = ((await Tiedotteet.findTiedotteetBy(
      0, 5, this.filter.kieli, undefined, undefined, undefined, undefined, undefined, ['opintopolku_etusivu'])).data as any).data;
  }

  public readonly updateFilter = _.debounce(async (filter) => {
    this.filter = {
      ...this.filter,
      ...filter,
    };
    this.tiedotteet = null;
    this.fetchUutiset();
  }, 300);

  async fetchUutiset() {
    const result = (await Tiedotteet.findTiedotteetBy(
      this.filter.sivu, this.filter.sivukoko, this.filter.kieli, this.filter.nimi,
      undefined, undefined, undefined, undefined, ['opintopolku_etusivu'])).data as any;
    this.amount = result['kokonaismäärä'];
    this.tiedotteet = result.data;
  }

  async fetchUutinen(tiedoteId: number) {
    this.tiedoteId = tiedoteId;
    this.tiedote = null;
    this.tiedote = (await Tiedotteet.getTiedote(this.tiedoteId)).data;
  }
}
