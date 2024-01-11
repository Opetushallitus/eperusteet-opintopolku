import { Store, State } from '@shared/stores/store';
import { Lops2019OppiaineKaikkiDto, Lops2019Perusteet } from '@shared/api/ylops';

@Store
export class Lops2019OpetussuunnitelmaOppiaineStore {
  @State() public opsId: number;
  @State() public oppiaineId: number;
  @State() public oppiaine: Lops2019OppiaineKaikkiDto | null = null;

  public static async create(opsId: number, oppiaineId: number) {
    const store = new Lops2019OpetussuunnitelmaOppiaineStore(opsId, oppiaineId);
    store.fetchOppiaine();
    return store;
  }

  constructor(opsId: number, oppiaineId: number) {
    this.opsId = opsId;
    this.oppiaineId = oppiaineId;
  }

  async fetchOppiaine() {
    this.oppiaine = null;
    this.oppiaine = (await Lops2019Perusteet.getAllLops2019PerusteOppiaineById(this.opsId, this.oppiaineId)).data;
  }
}
