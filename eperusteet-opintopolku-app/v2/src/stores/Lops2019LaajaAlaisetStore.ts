import { Store, State } from '@shared/stores/store';
import { Lops2019, Lops2019LaajaAlainenOsaaminenKokonaisuusDto } from '@shared/api/eperusteet';

@Store
export class Lops2019LaajaAlaisetStore {
  @State() public perusteId: number;
  @State() public laajaAlaisetKokonaisuus: Lops2019LaajaAlainenOsaaminenKokonaisuusDto | null = null;

  public static async create(perusteId: number) {
    const store = new Lops2019LaajaAlaisetStore(perusteId);
    store.getLaajaAlaisetKokonaisuus();
    return store;
  }

  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  async getLaajaAlaisetKokonaisuus() {
    this.laajaAlaisetKokonaisuus = null;
    this.laajaAlaisetKokonaisuus = (await Lops2019.getLaajaAlainenOsaaminenKokonaisuus(this.perusteId)).data;
  }
}
