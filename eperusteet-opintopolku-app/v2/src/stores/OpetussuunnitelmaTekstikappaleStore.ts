import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import {
  TekstiKappaleDto,
  Puu,
  Matala,
  PerusteTekstiKappaleViiteDto,
} from '@shared/api/tyypit';
import { Lops2019Perusteet, OpetussuunnitelmanSisalto } from '@shared/api/ylops';


@Store
export class OpetussuunnitelmaTekstikappaleStore {
  @State() public opsId: number;
  @State() public tekstiKappaleViiteId: number;
  @State() public tekstiKappaleViite: Puu | null = null;
  @State() public tekstiKappaleViitteet: number[] | null = null;
  @State() public tekstiKappaleOriginalViite: Puu | null = null;
  @State() public tekstiKappaleOriginal: TekstiKappaleDto | null = null;
  @State() public tekstiKappaleOriginalViitteetObj: object | null = null;
  @State() public tekstiKappale: TekstiKappaleDto | null = null;
  @State() public perusteTekstikappaleViite: PerusteTekstiKappaleViiteDto | null = null;
  @State() public tekstiKappaleAllLoaded: boolean = false;

  public static async create(opsId: number, tekstiKappaleViiteId: number) {
    return new OpetussuunnitelmaTekstikappaleStore(opsId, tekstiKappaleViiteId);
  }

  constructor(opsId: number, tekstiKappaleViiteId: number) {
    this.opsId = opsId;
    this.tekstiKappaleViiteId = tekstiKappaleViiteId;
  }

  async fetchTekstikappaleAll(deep: boolean = false) {
    this.tekstiKappaleAllLoaded = false;
    this.tekstiKappaleViite = null;
    this.tekstiKappale = null;
    this.tekstiKappaleViitteet = null;
    this.perusteTekstikappaleViite = null;
    this.tekstiKappaleOriginalViite = null;
    this.tekstiKappaleOriginal = null;

    await this.fetchTekstikappale(deep);

    await Promise.all([
      this.tekstiKappaleViite!.naytaPerusteenTeksti ? this.fetchPerusteTekstikappale(): new Promise<void>(res => res()),
      this.tekstiKappaleViite!.naytaPohjanTeksti ? this.fetchOriginalTekstikappaleDeep() : new Promise<void>(res => res()),
    ]);

    this.tekstiKappaleAllLoaded = true;
  }

  async fetchTekstikappale(deep: boolean = false) {
    if (deep) {
      this.tekstiKappaleViite = (await OpetussuunnitelmanSisalto
        .getTekstiKappaleViiteSyva(this.opsId, this.tekstiKappaleViiteId)).data;
    }
    else {
      this.tekstiKappaleViite = (await OpetussuunnitelmanSisalto
        .getTekstiKappaleViite(this.opsId, this.tekstiKappaleViiteId)).data as Puu;
    }

    if (this.tekstiKappaleViite.tekstiKappale) {
      this.tekstiKappale = this.tekstiKappaleViite.tekstiKappale;
    }
  }

  async fetchPerusteTekstikappale() {
    this.perusteTekstikappaleViite = null;
    if (this.tekstiKappaleViite && this.tekstiKappaleViite.perusteTekstikappaleId) {
      this.perusteTekstikappaleViite = (await Lops2019Perusteet
        .getAllLops2019PerusteTekstikappale(this.opsId,
          this.tekstiKappaleViite.perusteTekstikappaleId)).data as PerusteTekstiKappaleViiteDto;
    }
  }

  async fetchOriginalTekstikappaleDeep() {
    this.tekstiKappaleOriginalViite = null;
    this.tekstiKappaleOriginal = null;
    this.tekstiKappaleOriginalViitteetObj = {};

    // Saman tason pohjan viite
    await this.fetchOriginalTekstikappale();

    // Haetaan alikappaleiden pohjien tekstit
    this.getAliviiteIds();
    if (this.tekstiKappaleViitteet) {
      const viitteet: Matala[] = [];
      await Promise.all(this.tekstiKappaleViitteet.map(async viite => {
        const tekstiKappaleOriginal = await this.fetchOriginalAlikappale(viite);
        // Jos alkuperäinen ei löydy, rajapinta palauttaa tyhjän merkkijonon. Sen takia tarkistetaan onko objekti.
        if (_.isObject(tekstiKappaleOriginal)) {
          viitteet.push(tekstiKappaleOriginal);
        }
      }));

      this.tekstiKappaleOriginalViitteetObj = _.keyBy(viitteet, 'id');
    }
  }

  async fetchOriginalAlikappale(viite: number) {
    return (await OpetussuunnitelmanSisalto
      .getTekstiKappaleViiteOriginal(this.opsId, viite)).data;
  }

  async fetchOriginalTekstikappale() {
    this.tekstiKappaleOriginalViite = (await OpetussuunnitelmanSisalto
      .getTekstiKappaleViiteOriginal(this.opsId, this.tekstiKappaleViiteId)).data as Puu;
    if (this.tekstiKappaleOriginalViite.tekstiKappale) {
      this.tekstiKappaleOriginal = this.tekstiKappaleOriginalViite.tekstiKappale;
    }
  }

  private getAliviiteIds() {
    if (!_.isEmpty(this.tekstiKappaleViite)) {
      const viitteet: any[] = [];
      const stack = [this.tekstiKappaleViite!];


      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        // Lisätään vain ne, joilla halutaan näyttää pohjan sisältö
        if (head.id && head.naytaPohjanTeksti) {
          viitteet.push(head.id);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite
        })));
      }

      this.tekstiKappaleViitteet = _.slice(viitteet, 1);
    }
  }
}