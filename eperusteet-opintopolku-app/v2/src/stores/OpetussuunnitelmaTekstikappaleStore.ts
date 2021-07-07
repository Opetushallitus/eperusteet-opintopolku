import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { TekstiKappaleDto, Puu, PerusteTekstiKappaleViiteDto, Lops2019Perusteet, OpetussuunnitelmanSisalto, TekstiKappaleViiteDto } from '@shared/api/ylops';
import { Matala } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('OpetussuunnitelmaTekstikappaleStore');

@Store
export class OpetussuunnitelmaTekstikappaleStore {
  @State() public opsId: number;
  @State() public tekstiKappaleViiteId: number;
  @State() public tekstiKappaleViite: Puu | null = null;
  @State() public tekstiKappaleViitteet: number[] | null = null;
  @State() public tekstiKappaleOriginalViites: Puu[] | null = null;
  @State() public tekstiKappaleOriginals: TekstiKappaleDto[] | null = null;
  @State() public tekstiKappaleOriginalViitteetObj: object | null = null;
  @State() public tekstiKappale: TekstiKappaleDto | null = null;
  @State() public perusteTekstikappaleViite: PerusteTekstiKappaleViiteDto | TekstiKappaleViiteDto | null = null;
  @State() public tekstiKappaleAllLoaded: boolean = false;
  @State() public opstoteutus: string | null = null;

  public static async create(opsId: number, tekstiKappaleViiteId: number, opstoteutus: string) {
    return new OpetussuunnitelmaTekstikappaleStore(opsId, tekstiKappaleViiteId, opstoteutus);
  }

  constructor(opsId: number, tekstiKappaleViiteId: number, opstoteutus: string) {
    this.opsId = opsId;
    this.tekstiKappaleViiteId = tekstiKappaleViiteId;
    this.opstoteutus = opstoteutus;
  }

  async fetchTekstikappaleAll(deep: boolean = false) {
    this.tekstiKappaleAllLoaded = false;
    this.tekstiKappaleViite = null;
    this.tekstiKappale = null;
    this.tekstiKappaleViitteet = null;
    this.perusteTekstikappaleViite = null;
    this.tekstiKappaleOriginalViites = null;
    this.tekstiKappaleOriginals = null;

    await this.fetchTekstikappale(deep);

    await Promise.all([
      this.tekstiKappaleViite!.naytaPerusteenTeksti ? this.fetchPerusteTekstikappale() : new Promise<void>(resolve => resolve()),
      this.tekstiKappaleViite!.naytaPohjanTeksti ? this.fetchOriginalTekstikappaleDeep() : new Promise<void>(resolve => resolve()),
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
      try {
        if (this.opstoteutus === 'lukio' || this.opstoteutus === 'lukiokoulutus') {
          this.perusteTekstikappaleViite = (await Lops2019Perusteet
            .getAllLops2019PerusteTekstikappale(this.opsId,
              this.tekstiKappaleViite.perusteTekstikappaleId)).data as PerusteTekstiKappaleViiteDto;
        }
        else {
          this.perusteTekstikappaleViite = (await OpetussuunnitelmanSisalto.getPerusteTekstikappale(this.opsId, this.tekstiKappaleViiteId)).data;
        }
      }
      catch (err) {
        logger.error(err);
      }
    }
  }

  async fetchOriginalTekstikappaleDeep() {
    this.tekstiKappaleOriginalViites = null;
    this.tekstiKappaleOriginals = null;
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
    this.tekstiKappaleOriginalViites = (await OpetussuunnitelmanSisalto
      .getTekstiKappaleViiteOriginals(this.opsId, this.tekstiKappaleViiteId)).data as Puu[];
    if (_.size(_.filter(this.tekstiKappaleOriginalViites, 'tekstiKappale')) > 0) {
      this.tekstiKappaleOriginals = _.map(this.tekstiKappaleOriginalViites, 'tekstiKappale') as TekstiKappaleDto[];
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
          ...viite,
        })));
      }

      this.tekstiKappaleViitteet = _.slice(viitteet, 1);
    }
  }
}
