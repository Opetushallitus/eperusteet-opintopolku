import { Store, Getter, State } from '@shared/stores/store';
import { PageTiedoteDto, TiedoteDto } from '@/api/tyypit';
import { Tiedotteet } from '@/api/eperusteet';


@Store
export class TiedoteStore {
  @State() public uusimmatTiedotteet: TiedoteDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public lang = 'fi';
  @State() public page = 0;
  @State() public perPage = 0;
  @State() public amount = 0;

  @Getter()
  public data() {
    return {
      tiedotteet: this.tiedotteet,
      lang: this.lang,
      page: this.page,
      perPage: this.perPage,
      amount: this.amount,
    };
  }

  async getUusimmat() {
    this.uusimmatTiedotteet = ((await Tiedotteet.findTiedotteetBy(0, 5, [this.lang], undefined, undefined, undefined, true, true)).data as any).data;
  }

  async getUutiset(sivu, sivukoko, lang) {
    if (lang === this.lang && this.page === sivu && this.tiedotteet) {
      return this.tiedotteet;
    }
    else {
      const result = (await Tiedotteet.findTiedotteetBy(
        sivu, sivukoko, [lang], undefined, undefined, undefined, true, true)).data as any;
      this.lang = lang;
      this.page = result.sivu;
      this.perPage = result.sivukoko;
      this.amount = result['kokonaismäärä'];
      this.tiedotteet = result.data;
    }
  }
}
