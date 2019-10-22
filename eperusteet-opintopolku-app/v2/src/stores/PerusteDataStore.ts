import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import { SidenavFilter, SidenavNode, buildSidenav, filterSidenav } from '@/utils/NavigationBuilder';
import { baseURL, LiitetiedostotParam, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Location } from 'vue-router';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number | null = null;
  @State() public sisalto: Matala | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public currentRoute: Location | null = null;
  @State() public dokumentit: any = {};
  @State() public korvaavatPerusteet: any[] = [];
  @State() public sidenav: SidenavNode | null = null;
  @State() public sidenavFilter: SidenavFilter = {
    label: '',
    isEnabled: false,
  };

  public static async create(perusteId: number) {
    try {
      const result = new PerusteDataStore(perusteId);
      await result.init();
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
    function closeSubmenus(node) {
      return {
        ...node,
        children: _.map(node.children, child => ({
          ...child,
          children: [],
        })),
      };
    }

    if (getters.current) {
      let stack = _.reverse([...getters.current.path]);
      let head = stack.pop();
      while (!_.isEmpty(stack)) {
        let head = stack.pop();
      }
      return {};
    }
    else {
      return {
        ...state.sidenav,
        children: _.map(state.sidenav.children, child => ({
          ...child,
          children: [],
        })),
      };
    }
  })
  public readonly collapsedSidenav!: SidenavNode | null;

  @Getter((state, getters) => {
    if (state.sidenavFilter.isEnabled) {
      return filterSidenav(state.sidenav, state.sidenavFilter);
    }
    else {
      return state.sidenav;
    }
  })
  public readonly filteredSidenav!: SidenavNode | null;

  @Getter((state) => {
    const root = state.sidenav;
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
  })
  public readonly flattenedSidenav!: SidenavNode[];

  @Getter((state, getters) => {
    if (state.currentRoute && state.sidenav) {
      const stack = [state.sidenav];
      while (stack.length > 0) {
        const head = stack.pop();
        if (head && head.location) {
          if (_.isMatch(state.currentRoute as any, head!.location! as any)) {
            return head || null;
          }
        }
        _.forEach(head!.children, child => stack.push(child));
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

    this.korvaavatPerusteet = await Promise.all(_.map(this.peruste.korvattavatDiaarinumerot, async diaarinumero => ({
      diaarinumero,
      perusteet: (await perusteetQuery({ diaarinumero })).data,
    })));
  }

  public async updateRoute(route) {
    this.currentRoute = route;
  }

  public readonly updateFilter = _.debounce((filter: SidenavFilter) => {
    this.sidenavFilter = filter;
  }, 300);

  private async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
      this.sidenav = await buildSidenav(this.peruste!);
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }

}
