import _ from 'lodash';
import { Store, State, Getter } from '@shared/stores/store';
import { Location } from 'vue-router';
import { NavigationNodeDto, OpetussuunnitelmaKevytDto } from '@shared/api/tyypit';
import { baseURL, Opetussuunnitelmat, Dokumentit, DokumentitParam } from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';
import { buildNavigation, filterNavigation, NavigationFilter, NavigationNode } from "@shared/utils/NavigationBuilder";


@Store
export class OpetussuunnitelmaDataStore {
  @State() public opetussuunnitelma: OpetussuunnitelmaKevytDto | null = null;
  @State() public opetussuunnitelmaId: number;
  @State() public navigation: NavigationNodeDto | null = null;
  @State() public dokumentit: any = {};
  @State() public currentRoute: Location | null = null;
  @State() public sidenavFilter: NavigationFilter = {
    label: '',
    isEnabled: false,
  };

  public static async create(opetussuunnitelmaId: number) {
    const result = new OpetussuunnitelmaDataStore(opetussuunnitelmaId);
    await result.init();
    return result;
  }

  constructor(opetussuunnitelmaId: number) {
    this.opetussuunnitelmaId = opetussuunnitelmaId;
  }

  private async init() {
    this.opetussuunnitelma = (await Opetussuunnitelmat.getOpetussuunnitelma(this.opetussuunnitelmaId)).data;
    this.fetchNavigation();
  }

  private async fetchNavigation() {
    //this.navigation = (await Opetussuunnitelmat.getNavigation(this.opetussuunnitelmaId)).data;
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
    if (!this.opetussuunnitelma) {
      return;
    }
    const sisaltoKieli = Kielet.getSisaltoKieli;
    const dokumenttiId = (await Dokumentit.getDokumenttiId(this.opetussuunnitelmaId, sisaltoKieli)).data;
    if (dokumenttiId) {
      this.dokumentit[sisaltoKieli] = baseURL + DokumentitParam.get(_.toString(dokumenttiId)).url;
    }
  }

  public async updateRoute(route) {
    this.currentRoute = route;
  }

  public readonly updateFilter = _.debounce((filter: NavigationFilter) => {
    this.sidenavFilter = filter;
  }, 300);

}
