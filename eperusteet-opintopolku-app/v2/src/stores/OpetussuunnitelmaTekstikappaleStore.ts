import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { TekstiKappaleKevytDto, Puu, PerusteTekstiKappaleViiteMatalaDto, Matala } from '@shared/api/tyypit';
import { Lops2019Perusteet, OpetussuunnitelmanSisalto } from '@shared/api/ylops';


@Store
export class OpetussuunnitelmaTekstikappaleStore {
  @State() public opsId: number;
  @State() public tekstiKappaleViiteId: number;
  @State() public tekstiKappaleViite: Puu | null = null;
  @State() public tekstiKappaleViitteet: number[] | null = null;
  @State() public tekstiKappaleOriginalViite: Puu | null = null;
  @State() public tekstiKappaleOriginal: TekstiKappaleKevytDto | null = null;
  @State() public tekstiKappaleOriginalViitteetObj: object | null = null;
  @State() public tekstiKappale: TekstiKappaleKevytDto | null = null;
  @State() public perusteTekstikappaleViite: PerusteTekstiKappaleViiteMatalaDto | null = null;

  public static async create(opsId: number, tekstiKappaleViiteId: number) {
    return new OpetussuunnitelmaTekstikappaleStore(opsId, tekstiKappaleViiteId);
  }

  constructor(opsId: number, tekstiKappaleViiteId: number) {
    this.opsId = opsId;
    this.tekstiKappaleViiteId = tekstiKappaleViiteId;
  }

  async fetchTekstikappale(deep: boolean = false) {
    this.tekstiKappaleViite = null;
    this.tekstiKappale = null;
    this.tekstiKappaleViitteet = null;


    if (deep) {
      this.tekstiKappaleViite = (await OpetussuunnitelmanSisalto
          .getTekstiKappaleViiteSyva(this.opsId, this.tekstiKappaleViiteId)).data;
    }
    else {
      this.tekstiKappaleViite = (await OpetussuunnitelmanSisalto
          .getTekstiKappaleViite(this.opsId, this.tekstiKappaleViiteId)).data;
    }
    this.tekstiKappale = this.tekstiKappaleViite.tekstiKappale as TekstiKappaleKevytDto;

    if (!_.isEmpty(this.tekstiKappaleViite)) {
      const viitteet: any[] = [];
      const stack = [this.tekstiKappaleViite!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        if (head.id) {
          viitteet.push(head.id);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite
        })));
      }

      this.tekstiKappaleViitteet = _.slice(viitteet, 1);
    }
  }

  async fetchPerusteTekstikappale() {
    this.perusteTekstikappaleViite = null;

    if (this.tekstiKappaleViite && this.tekstiKappaleViite.perusteTekstikappaleId) {
      this.perusteTekstikappaleViite = (await Lops2019Perusteet
          .getAllLops2019PerusteTekstikappale(this.opsId, this.tekstiKappaleViite.perusteTekstikappaleId)).data;
    }
  }

  async fetchOriginalTekstikappale() {
    this.tekstiKappaleOriginalViite = null;
    this.tekstiKappaleOriginal = null;
    this.tekstiKappaleOriginalViitteetObj = {};

    // Saman tason pohjan viite
    this.tekstiKappaleOriginalViite = (await OpetussuunnitelmanSisalto
        .getTekstiKappaleViiteOriginal(this.opsId, this.tekstiKappaleViiteId)).data;
    this.tekstiKappaleOriginal = this.tekstiKappaleOriginalViite.tekstiKappale as TekstiKappaleKevytDto;

    if (this.tekstiKappaleViitteet) {
      const viitteet: Matala[] = [];
      await Promise.all(this.tekstiKappaleViitteet.map(async viite => {
        const tekstiKappaleOriginal = (await OpetussuunnitelmanSisalto
            .getTekstiKappaleViiteOriginal(this.opsId, viite)).data;
        // Jos alkuperäinen ei löydy, palauttaa rajapinta tyhjän merkkijonon
        if (_.isObject(tekstiKappaleOriginal)) {
          viitteet.push(tekstiKappaleOriginal);
        }
      }));

      this.tekstiKappaleOriginalViitteetObj = _.keyBy(viitteet, 'id');
    }
  }
}
