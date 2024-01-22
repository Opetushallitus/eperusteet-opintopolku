import { Store, State } from '@shared/stores/store';
import { Laaja, ViiteLaaja, Perusteenosat } from '@shared/api/eperusteet';
import * as _ from 'lodash';

@Store
export class PerusteenOsaStore {
  @State() public perusteenOsa: Laaja | null = null;
  @State() public perusteenOsaId: number;
  @State() public perusteenOsaViite: ViiteLaaja | null = null;

  public static async create(perusteenOsaId: number, julkaistuPerusteenOsaViite?: Laaja) {
    return new PerusteenOsaStore(perusteenOsaId, julkaistuPerusteenOsaViite);
  }

  constructor(perusteenOsaId: number, private julkaistuPerusteenOsaViite?: Laaja) {
    this.perusteenOsaId = perusteenOsaId;
    this.perusteenOsaViite = this.julkaistuPerusteenOsaViite as any;
    this.perusteenOsa = _.get(this.julkaistuPerusteenOsaViite, 'perusteenOsa') as any;
  }
}
