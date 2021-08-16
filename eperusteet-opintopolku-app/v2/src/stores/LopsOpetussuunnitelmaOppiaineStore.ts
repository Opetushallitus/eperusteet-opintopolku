import { Store, State } from '@shared/stores/store';
import { LukioOpetussuunnitelmat, LukioOppiaineTiedotDto } from '@shared/api/ylops';

@Store
export class LopsOpetussuunnitelmaOppiaineStore {
  @State() public opsId: number;
  @State() public oppiaineId: number;
  @State() public oppiaine: LukioOppiaineTiedotDto | null = null;

  public static async create(opsId: number, oppiaineId: number) {
    const store = new LopsOpetussuunnitelmaOppiaineStore(opsId, oppiaineId);
    store.fetchOppiaine();
    return store;
  }

  constructor(opsId: number, oppiaineId: number) {
    this.opsId = opsId;
    this.oppiaineId = oppiaineId;
  }

  async fetchOppiaine() {
    this.oppiaine = null;
    this.oppiaine = (await LukioOpetussuunnitelmat.getLukioOppiaine(this.opsId, this.oppiaineId)).data;
  }
}
