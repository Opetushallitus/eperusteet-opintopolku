import { Store, State } from '@shared/stores/store';
import { Laaja } from '@shared/api/tyypit';
import { Perusteenosat } from '@shared/api/eperusteet';


@Store
export class PerusteenOsaStore {
  @State() public perusteenOsa: Laaja | null = null;
  @State() public perusteenOsaId: number | null = null;

  public static async create(perusteenOsaId: number) {
    try {
      const result = new PerusteenOsaStore(perusteenOsaId);
      await result.init();
      return result;
    }
    catch (err) {
      console.error(err);
    }
  }

  constructor(perusteenOsaId: number) {
    this.perusteenOsaId = perusteenOsaId;
  }

  async init() {
    if (this.perusteenOsaId) {
      this.perusteenOsa = (await Perusteenosat.getPerusteenOsatByViite(this.perusteenOsaId)).data;
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }
}
