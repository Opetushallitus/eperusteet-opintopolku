import _ from 'lodash';
import { Getter, State, Store } from '@shared/stores/store';
import { Location } from 'vue-router';
import mime from 'mime-types';
import { Lops2019OpintojaksoDto, NavigationNodeDto, OpetussuunnitelmaKevytDto } from '@shared/api/tyypit';
import {
  baseURL,
  Dokumentit,
  DokumentitParam,
  Liitetiedostot,
  LiitetiedostotParam,
  Opetussuunnitelmat,
  Opintojaksot,
  Termisto
} from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';
import {
  baseURL as perusteBaseURL,
  Liitetiedostot as PerusteLiitetiedostot,
  LiitetiedostotParam as PerusteLiitetiedostotParam,
  Termit
} from '@shared/api/eperusteet';
import {
  buildNavigation,
  buildTiedot,
  filterNavigation,
  NavigationFilter,
  NavigationNode
} from '@shared/utils/NavigationBuilder';


@Store
export class OpetussuunnitelmaDataStore {
  @State() public opetussuunnitelma: OpetussuunnitelmaKevytDto | null = null;
  @State() public opetussuunnitelmaPerusteenId: number | null = null;
  @State() public opetussuunnitelmaId: number;
  @State() public navigation: NavigationNodeDto | null = null;
  @State() public opintojaksot: Lops2019OpintojaksoDto[] | null = null;
  @State() public dokumentit: any = {};
  @State() public currentRoute: Location | null = null;
  @State() public sidenavFilter: NavigationFilter = {
    label: '',
    isEnabled: false,
  };
  @State() public perusteTermit: object[] | null = null;
  @State() public perusteKuvat: object[] | null = null;
  @State() public termit: object[] | null = null;
  @State() public kuvat: object[] | null = null;

  public static async create(opetussuunnitelmaId: number) {
    const result = new OpetussuunnitelmaDataStore(opetussuunnitelmaId);
    await result.init();
    return result;
  }

  constructor(opetussuunnitelmaId: number) {
    this.opetussuunnitelmaId = opetussuunnitelmaId;
  }

  async init() {
    await this.fetchOpetussuunnitelma();

    if (this.opetussuunnitelmaPerusteenId) {
      this.fetchPerusteTermit(this.opetussuunnitelmaPerusteenId);
      this.fetchPerusteKuvat(this.opetussuunnitelmaPerusteenId);
    }
    this.fetchTermit();
    this.fetchKuvat();

    if (this.opetussuunnitelma && (this.opetussuunnitelma.toteutus as any) === 'lops2019') {
      this.fetchOpintojaksot();
    }

    this.fetchNavigation();
  }

  async fetchOpetussuunnitelma() {
    this.opetussuunnitelma = null;
    this.opetussuunnitelmaPerusteenId = null;
    this.opetussuunnitelma = (await Opetussuunnitelmat.getOpetussuunnitelma(this.opetussuunnitelmaId)).data;
    this.opetussuunnitelmaPerusteenId = this.opetussuunnitelma.perusteenId ? this.opetussuunnitelma.perusteenId : null;
  }

  async fetchPerusteTermit(perusteenId: number) {
    this.perusteTermit = null;
    this.perusteTermit = (await Termit.getAllTermit(perusteenId)).data;
  }

  async fetchPerusteKuvat(perusteenId: number) {
    this.perusteKuvat = null;
    this.perusteKuvat = _.map((await PerusteLiitetiedostot.getAllKuvat(perusteenId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: perusteBaseURL + PerusteLiitetiedostotParam.getKuva(perusteenId, this.getKuvaFilename(kuva)).url
    }));
  }

  private getKuvaFilename(liite) {
    return liite.id! + '.' +  mime.extension(liite.mime);
  }

  async fetchTermit() {
    this.termit = null;
    this.termit = (await Termisto.getAllTermit(this.opetussuunnitelmaId)).data;
  }

  async fetchKuvat() {
    this.kuvat = null;
    this.kuvat =_.map((await Liitetiedostot.getAllLiitteet(this.opetussuunnitelmaId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: baseURL + LiitetiedostotParam.getLiitetiedosto(this.opetussuunnitelmaId, this.getLiiteFilename(kuva)).url
    }));
  }

  private getLiiteFilename(liite) {
    return liite.id! + '.' +  mime.extension(liite.tyyppi);
  }

  async fetchNavigation() {
    this.navigation = null;
    this.navigation = (await Opetussuunnitelmat.getNavigation(this.opetussuunnitelmaId)).data;
  }

  async fetchOpintojaksot() {
    this.opintojaksot = (await Opintojaksot.getAllOpintojaksot(this.opetussuunnitelmaId)).data;
  }

  @Getter(state => {
    return !state.opetussuunnitelma || !state.navigation;
  })
  public readonly sidenavLoading!: boolean;

  @Getter(state => {
    if (!state.opetussuunnitelma || !state.navigation) {
      return null;
    }
    else {
      const tiedot = buildTiedot('opetussuunnitelmaTiedot', {
        opetussuunnitelmaId: _.toString(state.opetussuunnitelmaId),
      });
      return buildNavigation(state.navigation, tiedot, true);
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
    if (!getters.flattenedSidenav) {
      return {};
    }

    return _.chain(getters.flattenedSidenav)
        .filter('meta.koodi.uri')
        .keyBy('meta.koodi.uri')
        .value();
  })
  public readonly navigationByUri!: { [uri: string]: NavigationNode };

  @Getter((state, getters) => {
    if (getters.flattenedSidenav && state.currentRoute) {

      // Fixme: Jokin parempi ratkaisu stringin pakottamiseksi
      const keys = _.keys(state.currentRoute.params);
      _.each(keys, key => {
        state.currentRoute.params[key] = _.toString(state.currentRoute.params[key]) ;
      });

      for (const node of getters.flattenedSidenav) {
        // Fixme: Jokin parempi ratkaisu stringin pakottamiseksi
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
