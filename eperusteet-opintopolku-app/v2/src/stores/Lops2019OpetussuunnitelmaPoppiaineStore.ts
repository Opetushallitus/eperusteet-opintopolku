import { Store, State } from '@shared/stores/store';
import { KoodistoKoodiDto, Lops2019PaikallinenOppiaineDto, Oppiaineet, Opetussuunnitelmat } from '@shared/api/ylops';

import { KoodistoLops2019LaajaAlaiset } from '@shared/utils/perusteet';

@Store
export class Lops2019OpetussuunnitelmaPoppiaineStore {
  @State() public opsId: number;
  @State() public oppiaineId: number;
  @State() public oppiaine: Lops2019PaikallinenOppiaineDto | null = null;
  @State() public koodit: KoodistoKoodiDto[] = [];

  public static async create(opsId: number, oppiaineId: number) {
    const store = new Lops2019OpetussuunnitelmaPoppiaineStore(opsId, oppiaineId);
    store.fetchPoppiaine();
    return store;
  }

  constructor(opsId: number, oppiaineId: number) {
    this.opsId = opsId;
    this.oppiaineId = oppiaineId;
  }

  async fetchPoppiaine() {
    this.oppiaine = null;
    this.koodit = [];
    this.oppiaine = (await Oppiaineet.getLops2019PaikallinenOppiaine(this.opsId, this.oppiaineId)).data;
    this.koodit = (await Opetussuunnitelmat.getKoodistonKoodit(this.opsId, KoodistoLops2019LaajaAlaiset)).data;
  }
}
