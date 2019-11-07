import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { NavigationNodeDto, PerusteDto, TermiDto, LiiteDtoWrapper } from '@shared/api/tyypit';
import { Perusteet } from '@shared/api/eperusteet';
import { NavigationFilter, NavigationNode, buildNavigation, filterNavigation } from '@shared/utils/NavigationBuilder';
import { baseURL,
  Dokumentit, DokumentitParam,
  Termit,
  Liitetiedostot, LiitetiedostotParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Location } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number;
  @State() public navigation: NavigationNodeDto | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public currentRoute: Location | null = null;
  @State() public termit: TermiDto[] | null = null;
  @State() public kuvat: LiiteDtoWrapper[] | null = null;
  @State() public dokumentit: any = {};
  @State() public korvaavatPerusteet: any[] = [];
  @State() public sidenavFilter: NavigationFilter = {
    label: '',
    isEnabled: false,
  };

  public static async create(perusteId: number) {
    const result = new PerusteDataStore(perusteId);
    await result.init();

    return result;
  }

  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  private async init() {
    this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    this.termit = (await Termit.getAllTermit(this.perusteId)).data;
    this.kuvat =_.map((await Liitetiedostot.getAllKuvat(this.perusteId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: baseURL + LiitetiedostotParam.getKuva(this.perusteId, kuva.id!).url
    }));
    this.fetchNavigation();
  }

  async fetchNavigation() {
    this.navigation = (await Perusteet.getNavigation(this.perusteId)).data;
  }

  @Getter(state => {
    return !state.peruste || !state.navigation;
  })
  public readonly sidenavLoading!: boolean;

  @Getter(state => {
    if (!state.peruste || !state.navigation) {
      return null;
    }
    else {
      return buildNavigation(state.peruste, state.navigation);
    }
  })
  public readonly sidenav!: NavigationNode | null;

  @Getter((state, getters) => {
    if (!getters.sidenav) {
      return null;
    }

    const pathKeys = _.map(_.get(getters, 'current.path'), 'key');
    const onPath = node => {
      const parent = node.path[_.size(node.path) - 2];
      return _.includes(pathKeys, node.key)
          || (parent && _.includes(pathKeys, parent.key));
    };

    const map = (value, depth = 0) => {
      return {
        ...value,
        isVisible: !getters.current || depth === 1 || onPath(value),
        children: _.map(value.children, child => map(child, depth + 1)),
      };
    };

    return map(getters.sidenav);
  })
  public readonly collapsedSidenav!: NavigationNode | null;

  @Getter((state, getters) => {
    if (state.sidenavFilter.isEnabled) {
      return filterNavigation(getters.sidenav, state.sidenavFilter);
    }
    else {
      return getters.collapsedSidenav;
    }
  })
  public readonly filteredSidenav!: NavigationNode | null;

  @Getter((state, getters) => {
    const root = getters.sidenav;
    const result: Array<NavigationNode> = [];

    function traverseTree(node: NavigationNode) {
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
  public readonly flattenedSidenav!: NavigationNode[];

  @Getter((state, getters) => {
    if (getters.flattenedSidenav && state.currentRoute) {
      for (const node of getters.flattenedSidenav) {
        // Fixme: Jokin parempi ratkaisu tähän
        if (node.location && node.location.params) {
          node.location.params = _.mapValues(node.location.params, param => _.toString(param));
        }
        if (node.location && _.isMatch(state.currentRoute, node.location)) {
          return node || null;
        }
      }
    }
    return null;
  })
  public readonly current!: NavigationNode | null;


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

  public updateRoute(route) {
    this.currentRoute = {
      name: route.name,
      params: _.mapValues(route.params, param => _.toString(param)),
    };
  }

  public readonly updateFilter = _.debounce((filter: NavigationFilter) => {
    this.sidenavFilter = filter;
  }, 300);

}
