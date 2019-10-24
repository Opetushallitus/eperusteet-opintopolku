import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019OppiaineDto } from '@shared/api/tyypit';
import { SidenavNode, SidenavBuilder } from '@/utils/NavigationBuilder';

@Store
export class Lops2019OppiaineetStore implements SidenavBuilder {
  @State() public perusteId: number;
  @State() public oppiaineet: Array<Lops2019OppiaineDto> | null = null;
  @State() public sidenav: SidenavNode | null = null;

  public static async create(perusteId: number) {
    const store = new Lops2019OppiaineetStore(perusteId);
    store.fetchOppiaineet();
    return store;
  }


  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  /**
   * Haetaan oppiaineet jos perusteId on muuttunut
   */
  async fetchOppiaineet() {
    this.oppiaineet = null;
    this.oppiaineet = (await Lops2019.getOppiaineet(this.perusteId)).data;
  }
}
