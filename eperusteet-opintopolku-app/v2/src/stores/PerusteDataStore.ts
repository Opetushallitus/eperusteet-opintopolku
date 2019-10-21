import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import { SidenavFilter, SidenavNode, buildSidenav } from '@/utils/NavigationBuilder';
import { baseURL, LiitetiedostotParam, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number | null = null;
  @State() public sisalto: Matala | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public viiteId: number | null = null;
  @State() public dokumentit: any = {};
  @State() public korvaavatPerusteet: any[] = [];
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

  @Getter((state, getters) => {
    if (state.perusteId && state.sisalto) {
      const viiteId = state.viiteId ? state.viiteId : undefined;
      return buildSidenav(state.peruste, state.sisalto, state.sidenavFilter, viiteId);
    }
    else {
      return null;
    }
  })
  public readonly sidenav!: SidenavNode | null;

  get flattenedSidenav(): Array<SidenavNode> {
    const root = this.sidenav;
    const result: Array<SidenavNode> = [];

    function traverseTree(node: SidenavNode) {
      result.push(node);
      (node.children || [])
        .map(child => {
          traverseTree(child);
          return child;
        });
    }

    if (root) {
      traverseTree(root);
    }

    return result;
  }

  @Getter((state, getters) => {
    if (state.viiteId && getters.sidenav) {
      const root = getters.sidenav;
      const stack = [root];
      const viiteId = state.viiteId;
      while (stack.length > 0) {
        const head = stack.pop();
        if (head!.id === viiteId) {
          return head || null;
        }
        stack.push(...head!.children);
      }
    }
    else {
      return null;
    }
  })
  public readonly current!: SidenavNode | null;



  public async getDokumentit(sisaltoKieli) {
    if (!this.peruste) {
      return;
    }

    const suoritustavat = this.peruste.suoritustavat;
    if (suoritustavat) {
      for (let i = 0; i < suoritustavat.length; i++) {
        const st = suoritustavat[i];
        const suoritustapakoodi = st.suoritustapakoodi;
        if (suoritustapakoodi) {
          const dokumenttiId = await Dokumentit.getDokumenttiId(this.peruste!.id!, sisaltoKieli, suoritustapakoodi);
          this.dokumentit[sisaltoKieli] = baseURL + DokumentitParam.getDokumentti(dokumenttiId.data).url;
        }
      }
    }
  }

  async getKorvaavatPerusteet() {
    if (!this.peruste) {
      return;
    }

    this.korvaavatPerusteet = await Promise.all(_.map(this.peruste.korvattavatDiaarinumerot, diaarinumero => ({
      diaarinumero,
      perusteet: perusteetQuery({ diaarinumero }),
    })));
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
