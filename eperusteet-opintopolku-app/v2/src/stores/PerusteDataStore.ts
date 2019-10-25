import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import { SidenavFilter, SidenavNode, buildSidenav, filterSidenav, traverseSisalto } from '@/utils/NavigationBuilder';
import { baseURL, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Location } from 'vue-router';
import { Koulutustyyppi, KoulutustyyppiToteutus } from '@shared/tyypit';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';

@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number;
  @State() public sisalto: Matala | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public currentRoute: Location | null = null;
  @State() public dokumentit: any = {};
  @State() public korvaavatPerusteet: any[] = [];
  @State() public sidenavFilter: SidenavFilter = {
    label: '',
    isEnabled: false,
  };
  @State() private sidenavNodes: {
    [key: string]: SidenavNode[] | null
  } = {};


  public static async create(perusteId: number) {
    const result = new PerusteDataStore(perusteId);
    await result.init();

    return {
      perusteDataStore: result,
      ...await result.createStoresForPeruste(),
    };
  }

  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  private async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
      this.fetchSisalto();
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }

  private setSidenavNode(key) {
    this.sidenavNodes = {
      ...this.sidenavNodes,
      [key]: null
    };
    return node => {
      this.sidenavNodes = {
        ...this.sidenavNodes,
        [key]: node
      };
    };
  }

  private async createStoresForPeruste() {
    if (!this.peruste) {
      throw new Error('peruste-ei-alustettu');
    }

    const peruste =  this.peruste;

    const koulutustyyppi = peruste.koulutustyyppi!;
    const koulutustyyppiToteutus = peruste.toteutus as KoulutustyyppiToteutus | undefined;

    const base = {

    };

    switch (koulutustyyppi) {
    case Koulutustyyppi.lisaopetus:
    case Koulutustyyppi.esiopetus:
    case Koulutustyyppi.varhaiskasvatus:
    case Koulutustyyppi.perusopetusvalmistava:
    case Koulutustyyppi.tpo:
      return {
        ...base,
      };
    case Koulutustyyppi.perusopetus:
      return {
        ...base,
        // todo: muut osat
      };
    case Koulutustyyppi.aikuistenperusopetus:
      return {
        ...base,
        // todo: muut osat
      };
    case Koulutustyyppi.lukiokoulutus:
    case Koulutustyyppi.lukiovalmistavakoulutus:
    case Koulutustyyppi.aikuistenlukiokoulutus:
      if (koulutustyyppiToteutus && koulutustyyppiToteutus === KoulutustyyppiToteutus.lops2019) {
        return {
          ...base,
          lops2019oppiaineetStore: await Lops2019OppiaineetStore.create(this.perusteId, this.setSidenavNode('oppiaineet')),
        };
      }
      else {
        return {
          ...base,
          // todo: muut osat
        };
      }
      case Koulutustyyppi.telma:
      case Koulutustyyppi.perustutkinto:
      case Koulutustyyppi.ammattitutkinto:
      case Koulutustyyppi.erikoisammattitutkinto:
        return {
          ...base,
          // todo: tutkinnon osat yms.
        };
    }

    throw new Error('koulutustyyppin-storet-ei-toteutettu');
  }

  async fetchSisalto() {
    const suoritustapakoodi = this.peruste!.suoritustavat
      ? this.peruste!.suoritustavat![0].suoritustapakoodi as any
      : 'LUKIOKOULUTUS2019';
    this.sisalto = null;
    const fn = this.setSidenavNode('tekstikappaleet');
    this.sisalto = (await Sisallot.getSuoritustapaSisaltoUUSI(this.perusteId, suoritustapakoodi)).data;
    fn(traverseSisalto(this.sisalto));
  }



  @Getter(state => {
    return !state.peruste || !_.every(_.values(state.sidenavNodes));
  })
  public readonly sidenavLoading!: boolean;

  @Getter(state => {
    if (!state.peruste) {
      return null;
    }
    else {
      return buildSidenav(state.peruste, _.values(state.sidenavNodes));
    }
  })
  public readonly sidenav!: SidenavNode | null;

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
  public readonly collapsedSidenav!: SidenavNode | null;

  @Getter((state, getters) => {
    if (state.sidenavFilter.isEnabled) {
      return filterSidenav(getters.sidenav, state.sidenavFilter);
    }
    else {
      return getters.collapsedSidenav;
    }
  })
  public readonly filteredSidenav!: SidenavNode | null;

  @Getter((state, getters) => {
    const root = getters.sidenav;
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
    if (getters.flattenedSidenav && state.currentRoute) {
      for (const node of getters.flattenedSidenav) {
        if (node!.location && _.isMatch(state.currentRoute, node!.location)) {
          return node || null;
        }
      }
    }
    return null;
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

  public updateRoute(route) {
    this.currentRoute = {
      name: route.name,
      params: _.mapValues(route.params, param => '' + param),
    };
  }

  public readonly updateFilter = _.debounce((filter: SidenavFilter) => {
    this.sidenavFilter = filter;
  }, 300);

}
