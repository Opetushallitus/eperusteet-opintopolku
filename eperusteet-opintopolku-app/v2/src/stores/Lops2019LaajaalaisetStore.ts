import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from "@shared/api/eperusteet";
import { Lops2019LaajaAlainenOsaaminenKokonaisuusDto } from '@shared/api/tyypit';

@Store
export class Lops2019LaajaalaisetStore {
  @State() public perusteId: number | null = null;
  @State() public laajaalaisetKokonaisuus: Lops2019LaajaAlainenOsaaminenKokonaisuusDto | null = null;

  public static readonly create = _.memoize(async (perusteId: number) => {
    try {
      const result = new Lops2019LaajaalaisetStore(perusteId);
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
      this.laajaalaisetKokonaisuus = (await Lops2019.getLaajaAlainenOsaaminenKokonaisuus(this.perusteId)).data;
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }
}
