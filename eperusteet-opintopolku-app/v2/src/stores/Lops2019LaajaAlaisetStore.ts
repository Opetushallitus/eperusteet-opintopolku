import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019LaajaAlainenOsaaminenKokonaisuusDto } from '@shared/api/tyypit';

@Store
export class Lops2019LaajaAlaisetStore {
  @State() public perusteId: number | null = null;
  @State() public laajaAlaisetKokonaisuus: Lops2019LaajaAlainenOsaaminenKokonaisuusDto | null = null;

  public static readonly create = _.memoize(() => new Lops2019LaajaAlaisetStore());

  async getLaajaAlaisetKokonaisuus(perusteId: number) {
    if (!perusteId) {
      this.perusteId = null;
      this.laajaAlaisetKokonaisuus = null;
    }
    else if (perusteId !== this.perusteId || !this.laajaAlaisetKokonaisuus) {
      // Jos peruste vaihtunut ja laaja-alaisia ei ole jo haettu
      this.perusteId = perusteId;
      this.laajaAlaisetKokonaisuus = null;
      this.laajaAlaisetKokonaisuus = (await Lops2019.getLaajaAlainenOsaaminenKokonaisuus(this.perusteId)).data;
    }
  }
}
