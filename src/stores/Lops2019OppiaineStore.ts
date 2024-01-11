import { Store, State } from '@shared/stores/store';
import { Lops2019, Lops2019OppiaineKaikkiDto } from '@shared/api/eperusteet';

@Store
export class Lops2019OppiaineStore {
  @State() public perusteId: number;
  @State() public oppiaineId: number;
  @State() public oppiaine: Lops2019OppiaineKaikkiDto | null = null;

  public static async create(perusteId: number, oppiaineId: number) {
    const store = new Lops2019OppiaineStore(perusteId, oppiaineId);
    store.fetchOppiaine();
    return store;
  }

  constructor(perusteId: number, oppiaineId:number) {
    this.perusteId = perusteId;
    this.oppiaineId = oppiaineId;
  }

  async fetchOppiaine() {
    this.oppiaine = null;
    this.oppiaine = (await Lops2019.getOppiaine(this.perusteId, this.oppiaineId)).data;
  }
}
