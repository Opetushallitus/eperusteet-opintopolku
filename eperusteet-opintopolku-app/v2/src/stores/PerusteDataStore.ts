import { Store, State } from '@shared/stores/store';
import { PerusteDto } from '@shared/api/tyypit';
import { Perusteet } from '@shared/api/eperusteet';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number | null = null;

  constructor(perusteId?: number) {
    this.perusteId = perusteId || null;
  }

  async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    } else {
      throw new Error('peruste-id-puuttuu');
    }
  }
}
