import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from "@shared/api/eperusteet";
import { Lops2019OppiaineKaikkiDto } from '@shared/api/tyypit';

@Store
export class Lops2019OppiaineStore {
  @State() public perusteId: number | null = null;
  @State() public oppiaineId: number | null = null;
  @State() public oppiaine: Lops2019OppiaineKaikkiDto | null = null;

  public static readonly create = _.memoize(async (perusteId: number, oppiaineId: number) => {
    try {
      const result = new Lops2019OppiaineStore(perusteId, oppiaineId);
      await result.init();
      return result;
    }
    catch (err) {
      console.error(err);
    }
  });

  constructor(perusteId: number, oppiaineId: number) {
    this.perusteId = perusteId;
    this.oppiaineId = oppiaineId;
  }

  async init() {
    if (this.perusteId && this.oppiaineId) {
      this.oppiaine = (await Lops2019.getOppiaine(this.perusteId, this.oppiaineId)).data;
    }
    else {
      throw new Error('peruste-tai-oppiaine-id-puuttuu');
    }
  }
}
