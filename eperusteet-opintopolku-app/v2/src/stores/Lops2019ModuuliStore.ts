import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019ModuuliDto } from '@shared/api/tyypit';

@Store
export class Lops2019ModuuliStore {
  @State() public perusteId: number;
  @State() public oppiaineId: number;
  @State() public moduuliId: number;
  @State() public moduuli: Lops2019ModuuliDto | null = null;

  public static readonly create = _.memoize(async (perusteId: number, oppiaineId: number, moduuliId: number) => {
    const result = new Lops2019ModuuliStore(perusteId, oppiaineId, moduuliId);
    result.init();
    return result;
  });

  constructor(perusteId: number, oppiaineId: number, moduuliId: number) {
    this.perusteId = perusteId;
    this.oppiaineId = oppiaineId;
    this.moduuliId = moduuliId;
  }

  async init() {
    this.moduuli = (await Lops2019.getModuuli(this.perusteId, this.oppiaineId, this.moduuliId)).data;
  }
}
