import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from "@shared/api/eperusteet";
import { Lops2019OppiaineDto } from '@shared/api/tyypit';

@Store
export class Lops2019OppiaineetStore {
  @State() public perusteId: number | null = null;
  @State() public oppiaineet: Array<Lops2019OppiaineDto> | null = null;

  public static readonly create = _.memoize(async (perusteId: number) => {
    try {
      const result = new Lops2019OppiaineetStore(perusteId);
      await result.init();
      return result;
    }
    catch (err) {
      console.error(err);
    }
  });

  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  async init() {
    if (this.perusteId) {
      console.log(this.perusteId);
      this.oppiaineet = (await Lops2019.getOppiaineet(this.perusteId)).data;
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }
}
