import { Store, State } from '@shared/stores/store';
import { Lops2019ModuuliDto } from '@shared/api/ylops';
import { Lops2019Perusteet } from '@shared/api/ylops';

@Store
export class Lops2019OpetussuunnitelmaModuuliStore {
  @State() public opsId: number;
  @State() public oppiaineId: number;
  @State() public moduuliId: number;
  @State() public moduuli: Lops2019ModuuliDto | null = null;

  public static async create(opsId: number, oppiaineId: number, moduuliId: number) {
    const store = new Lops2019OpetussuunnitelmaModuuliStore(opsId, oppiaineId, moduuliId);
    store.fetchModuuli();
    return store;
  }

  constructor(opsId: number, oppiaineId: number, moduuliId: number) {
    this.opsId = opsId;
    this.oppiaineId = oppiaineId;
    this.moduuliId = moduuliId;
  }

  async fetchModuuli() {
    this.moduuli = null;
    this.moduuli = (await Lops2019Perusteet
      .getAllLops2019PerusteModuuli(this.opsId, this.oppiaineId, this.moduuliId)).data;
  }
}
