import * as _ from 'lodash';
import { Location } from 'vue-router';
import { Store, Getter, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet } from '@shared/api/eperusteet';
import { SidenavFilter, SidenavNode, buildSidenav, filterSidenav } from '@/utils/NavigationBuilder';
import { baseURL, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number;
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
    if (!state.sidenav || !getters.current) {
      return null;
    }

    const pathKeys = _.map(getters.current.path, 'key');
    const onPath = node => {
      const parent = node.path[_.size(node.path) - 2];
      return _.includes(pathKeys, node.key)
        || (parent && _.includes(pathKeys, parent.key));
    };

    const map = (v, depth = 0) => ({
      ...v,
      isVisible: depth === 1 || onPath(v),
      children: _.map(v.children, child => map(child, depth + 1)),
    });

    return map(state.sidenav);
  })
  public readonly collapsedSidenav!: SidenavNode | null;

  @Getter((state, getters) => {
    if (state.sidenavFilter.isEnabled) {
      return filterSidenav(state.sidenav, state.sidenavFilter);
    }
    else {
      return getters.collapsedSidenav;
    }
  })
  public readonly filteredSidenav!: SidenavNode | null;

  @Getter((state, getters) => {
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


  // Fixme: ota huomioon kielen vaihtaminen
  public async getDokumentit() {
    if (!this.peruste) {
      return;
    }

    const sisaltoKieli = Kielet.getSisaltoKieli;
    const suoritustavat = this.peruste.suoritustavat;
    if (suoritustavat) {
      for (let i = 0; i < suoritustavat.length; i++) {
        const st = suoritustavat[i];
        const suoritustapakoodi = st.suoritustapakoodi;
        if (suoritustapakoodi) {
          const dokumenttiId = (await Dokumentit.getDokumenttiId(this.perusteId, sisaltoKieli, suoritustapakoodi)).data;
          if (dokumenttiId) {
            this.dokumentit[sisaltoKieli] = baseURL + DokumentitParam.getDokumentti(dokumenttiId).url;
          }
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
    this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    this.sidenav = await buildSidenav(this.peruste!);
  }

}
