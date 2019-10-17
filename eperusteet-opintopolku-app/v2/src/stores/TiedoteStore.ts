import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { TiedoteDto } from '@shared/api/tyypit';
import { Tiedotteet } from '@shared/api/eperusteet';


@Store
export class TiedoteStore {
  @State() public uusimmatTiedotteet: TiedoteDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public filter = {
    nimi: '',
    kieli: [ 'fi' ],
    sivu: 0,
    sivukoko: 10,
  };
  @State() public amount = 0;

  @Getter()
  public data() {
    return {
      tiedotteet: this.tiedotteet,
      filter: this.filter,
      amount: this.amount,
    };
  }

  async getUusimmat() {
    this.uusimmatTiedotteet = ((await Tiedotteet.findTiedotteetBy(
      0, 5, this.filter.kieli, undefined, undefined, undefined, true, true)).data as any).data;
  }

  public readonly updateFilter = _.debounce(async (filter) => {
    this.filter = {
      ...this.filter,
      ...filter,
    };
    this.tiedotteet = null;
    this.getUutiset();
  }, 300);

  async getUutiset() {
    const result = (await Tiedotteet.findTiedotteetBy(
      this.filter.sivu, this.filter.sivukoko, this.filter.kieli, this.filter.nimi,
      undefined, undefined, true, true)).data as any;
    this.amount = result['kokonaismäärä'];
    this.tiedotteet = result.data;
  }
}
