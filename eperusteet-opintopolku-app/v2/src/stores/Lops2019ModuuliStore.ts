import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019ModuuliDto } from '@shared/api/ylops';

@Store
export class Lops2019ModuuliStore {
  @State() public perusteId: number;
  @State() public oppiaineId: number;
  @State() public moduuliId: number;
  @State() public moduuli: Lops2019ModuuliDto | null = null;

  public static async create(perusteId: number, oppiaineId: number, moduuliId: number) {
    const result = new Lops2019ModuuliStore(perusteId, oppiaineId, moduuliId);
    result.fetchModuuli();
    return result;
  }

  constructor(perusteId: number, oppiaineId: number, moduuliId: number) {
    this.perusteId = perusteId;
    this.oppiaineId = oppiaineId;
    this.moduuliId = moduuliId;
  }

  async fetchModuuli() {
    this.moduuli = null;
    this.moduuli = (await Lops2019.getModuuli(this.perusteId, this.oppiaineId, this.moduuliId)).data;
  }
}
