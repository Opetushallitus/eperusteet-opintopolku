import { Store, State, Getter } from '@shared/stores/store';
import { OpetussuunnitelmaDto, NavigationNodeDto, Opetussuunnitelmat, JulkinenApi, DokumenttiDto, baseURL, JulkinenApiParams, KoulutustoimijaJulkinenDto, Arviointiasteikot, ArviointiasteikkoDto, LiitetiedostotParam } from '@shared/api/amosaa';
import * as _ from 'lodash';
import { IOpetussuunnitelmaStore } from './IOpetussuunitelmaStore';
import { NavigationNode, buildTiedot, buildNavigation, filterNavigation, NavigationFilter } from '@shared/utils/NavigationBuilder';
import { Kielet } from '@shared/stores/kieli';
import { DokumenttiDtoTilaEnum } from '@shared/api/eperusteet';

@Store
export class ToteutussuunnitelmaDataStore implements IOpetussuunnitelmaStore {
  @State() public opetussuunnitelmaId: number;
  @State() public navigation: NavigationNodeDto | null = null;
  @State() public opetussuunnitelma: OpetussuunnitelmaDto | null = null;
  @State() public koulutustoimija: KoulutustoimijaJulkinenDto | null = null;
  @State() public dokumenttiTila: DokumenttiDto | null = null;
  @State() public currentRoute: Location | null = null;
  @State() public sidenavFilter: NavigationFilter = {
    label: '',
    isEnabled: false,
  };
  @State() public arviointiasteikot: ArviointiasteikkoDto[] | null = null;

  constructor(opetussuunnitelmaId: number) {
    this.opetussuunnitelmaId = opetussuunnitelmaId;
  }

  public static async create(opetussuunnitelmaId: number) {
    const result = new ToteutussuunnitelmaDataStore(opetussuunnitelmaId);
    await result.init();
    return result;
  }

  async init() {
    this.koulutustoimija = (await JulkinenApi.getOpetussuunnitelmanToimija(this.opetussuunnitelmaId)).data;
    this.opetussuunnitelma = (await Opetussuunnitelmat.getOpetussuunnitelma(this.opetussuunnitelmaId, _.toString(this.koulutustoimija.id))).data;
    this.dokumenttiTila = (await JulkinenApi.queryDokumentti(this.opetussuunnitelmaId, Kielet.getSisaltoKieli.value, _.toString(this.koulutustoimija.id))).data;
    const navigation = (await Opetussuunnitelmat.getOpetussuunnitelmaNavigationJulkinen(this.opetussuunnitelmaId, _.toString(this.koulutustoimija.id))).data;
    this.navigation = {
      ...navigation,
      children: _.filter(navigation.children, child => child.type !== 'tiedot'),
    };
    this.arviointiasteikot = (await Arviointiasteikot.getAllArviointiasteikot()).data;
  }

  @Getter(state => {
    if (state.dokumenttiTila && state.dokumenttiTila.tila === _.lowerCase(DokumenttiDtoTilaEnum.VALMIS)) {
      return baseURL + JulkinenApiParams.getDokumentti(state.opetussuunnitelma.id, Kielet.getSisaltoKieli.value, state.opetussuunnitelma.koulutustoimija.id).url;
    }
  })
  public readonly dokumenttiUrl!: string;

  public async getDokumenttiTila() {
    if (this.opetussuunnitelma) {
      this.dokumenttiTila = null;
      this.dokumenttiTila = (await JulkinenApi.queryDokumentti(this.opetussuunnitelma!.id!, Kielet.getSisaltoKieli.value, _.toString(this.opetussuunnitelma!.koulutustoimija!.id!))).data;
    }
  };

  @Getter(state => state.opetussuunnitelma.peruste ? state.opetussuunnitelma.peruste.koulutustyyppi : state.opetussuunnitelma.koulutustyyppi)
  public readonly koulutustyyppi!: string;

  @Getter(state => _.map(state.opetussuunnitelma.liitteet, liite => ({
    id: liite.id!,
    src: baseURL + LiitetiedostotParam.getImage(state.opetussuunnitelma.id!, liite.id!).url,
  })))
  public readonly kuvat!: any[];

  @Getter(state => {
    return !state.opetussuunnitelma || !state.navigation;
  })
  public readonly sidenavLoading!: boolean;

  @Getter((state, getters) => {
    if (state.sidenavFilter.isEnabled) {
      return filterNavigation(getters.sidenav, state.sidenavFilter);
    }
    else {
      return getters.collapsedSidenav;
    }
  })
  public readonly filteredSidenav!: NavigationNode | null;

  @Getter(state => {
    if (!state.opetussuunnitelma || !state.navigation) {
      return null;
    }
    else {
      const tiedot = buildTiedot('toteutussuunnitelmaTiedot', {
        toteutussuunnitelmaId: _.toString(state.opetussuunnitelmaId),
      });
      return buildNavigation(state.navigation, tiedot, true);
    }
  })
  public readonly sidenav!: NavigationNode | null;

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

  public updateRoute(route) {
    this.currentRoute = route;
  }

  @Getter((state, getters) => {
    if (getters.flattenedSidenav && state.currentRoute) {
      for (const node of getters.flattenedSidenav) {
        if (node.location && _.isMatch(state.currentRoute, node.location)) {
          return node || null;
        }
      }
    }
    return null;
  })
  public readonly current!: NavigationNode | null;

  public readonly updateFilter = _.debounce((filter: NavigationFilter) => {
    this.sidenavFilter = filter;
  }, 300);

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
        isVisible: !getters.current || depth === 1 || onPath(value) || getters.current.type === 'tiedot',
        children: _.map(value.children, child => map(child, depth + 1)),
      };
    };

    return map(getters.sidenav);
  })
  public readonly collapsedSidenav!: NavigationNode | null;
}
