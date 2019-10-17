import { Getter, Store, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import _ from 'lodash';
import { SidenavFilter, SidenavNode, buildYksinkertainenNavigation } from '@/components/EpPerusteSidenav/PerusteBuildingMethods';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number | null = null;
  @State() public sisalto: Matala | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public viiteId: number | null = null;
  @State() public sidenavFilter: SidenavFilter = {
    label: '',
    isEnabled: false,
  };

  public static async create(perusteId: number) {
    try {
      const result = new PerusteDataStore(perusteId);
      await result.init();
      await result.initSisalto();
      return result;
    }
    catch (err) {
      console.error(err);
    }
  }

  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  get sidenav(): SidenavNode | null {
    if (this.perusteId && this.sisalto) {
      return buildYksinkertainenNavigation(
        this.viiteId!,
        this.perusteId!,
        this.sisalto!,
        this.sidenavFilter);
    }
    else {
      return null;
    }
  }

  get current(): SidenavNode | null {
    if (this.viiteId && this.sidenav) {
      const root = this.sidenav;
      const stack = [root];
      const viiteId = this.viiteId;
      while (stack.length > 0) {
        const head = stack.pop();
        if (head!.id === viiteId) {
          return head || null;
        }
        stack.push(...head!.children);
      }
    }
    return null;
  }

  public async updateViiteId(value) {
    this.viiteId = value;
  }

  public readonly updateFilter = _.debounce((filter: SidenavFilter) => {
    this.sidenavFilter = filter;
  }, 300);

  private async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }

  private async initSisalto() {
    if (this.perusteId && this.peruste) {
      // Todo: erikoisammattitutkinto vaatii oikean suoritustapakoodin
      this.sisalto = (await Sisallot.getSuoritustapaSisaltoUUSI(this.perusteId, 'LUKIOKOULUTUS2019')).data;
    }
    else {
      throw new Error('peruste-id-tai-peruste-puuttuu');
    }
  }
}
