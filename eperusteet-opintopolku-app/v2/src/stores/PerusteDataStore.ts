import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto } from '@shared/api/tyypit';
import { Perusteet } from '@shared/api/eperusteet';
import _ from 'lodash';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;

  constructor(private perusteId: number) {
    console.log('before construction', _.get(this.peruste, 'id'));
    this.peruste = null;
    console.log('constructing', perusteId);
    this.reload();
  }

  async reload() {
    this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
  }
}
