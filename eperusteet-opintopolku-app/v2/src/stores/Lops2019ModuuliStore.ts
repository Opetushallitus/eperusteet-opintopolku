import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019ModuuliDto } from '@shared/api/tyypit';

@Store
export class Lops2019ModuuliStore {
  @State() public perusteId: number | null = null;
  @State() public oppiaineId: number | null = null;
  @State() public moduuliId: number | null = null;
  @State() public moduuli: Lops2019ModuuliDto | null = null;

  public static readonly create = _.memoize(async (perusteId: number, oppiaineId: number, moduuliId: number) => {
    try {
      const result = new Lops2019ModuuliStore(perusteId, oppiaineId, moduuliId);
      await result.init();
      return result;
    }
    catch (err) {
      console.error(err);
    }
  });

  constructor(perusteId: number, oppiaineId: number, moduuliId: number) {
    this.perusteId = perusteId;
    this.oppiaineId = oppiaineId;
    this.moduuliId = moduuliId;
  }

  async init() {
    if (this.perusteId && this.oppiaineId && this.moduuliId) {
      this.moduuli = (await Lops2019.getModuuli(this.perusteId, this.oppiaineId, this.moduuliId)).data;
    }
    else {
      throw new Error('peruste-tai-oppiaine-tai-moduuli-id-puuttuu');
    }
  }
}
