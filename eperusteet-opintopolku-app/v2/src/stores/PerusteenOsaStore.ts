import { Store, State } from '@shared/stores/store';
import { Laaja, ViiteLaaja } from '@shared/api/tyypit';
import { Perusteenosat } from '@shared/api/eperusteet';


@Store
export class PerusteenOsaStore {
  @State() public perusteenOsa: Laaja | null = null;
  @State() public perusteenOsaId: number;
  @State() public perusteenOsaViite: ViiteLaaja | null = null;

  public static async create(perusteenOsaId: number) {
    return new PerusteenOsaStore(perusteenOsaId);
  }

  constructor(perusteenOsaId: number) {
    this.perusteenOsaId = perusteenOsaId;
  }

  async fetchPerusteenOsa(deep: boolean = false) {
    this.perusteenOsaViite = null;
    this.perusteenOsa = null;
    if (deep) {
      this.perusteenOsaViite = (await Perusteenosat.getPerusteenOsatByViiteSisalto(this.perusteenOsaId)).data;
      this.perusteenOsa = this.perusteenOsaViite.perusteenOsa as Laaja;
    }
    else {
      this.perusteenOsa = (await Perusteenosat.getPerusteenOsatByViite(this.perusteenOsaId)).data;
    }
  }
}
