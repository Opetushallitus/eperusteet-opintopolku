import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import { SidenavFilter, SidenavNode, buildSidenav, filterSidenav } from '@/utils/NavigationBuilder';
import { baseURL, LiitetiedostotParam, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Location } from 'vue-router';
import { Koulutustyyppi, KoulutustyyppiToteutus } from "@shared/tyypit";
import { Lops2019OppiaineetStore } from "@/stores/Lops2019OppiaineetStore";


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
    const result = new PerusteDataStore(perusteId);
    await result.init();

    result.initSisalto();

    const stores = {
      perusteDataStore: result,
      ...await result.createStoresForPeruste(),
    };

    return stores;
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

        };
      case Koulutustyyppi.perusopetus:
        return {

        };
      case Koulutustyyppi.aikuistenperusopetus:
        return {

        };
      case Koulutustyyppi.lukiokoulutus:
      case Koulutustyyppi.lukiovalmistavakoulutus:
      case Koulutustyyppi.aikuistenlukiokoulutus:
        if (koulutustyyppiToteutus && koulutustyyppiToteutus === KoulutustyyppiToteutus.lops2019) {
          return {
            ...base,
            lops2019oppiaineetStore: await Lops2019OppiaineetStore.create(this.perusteId),
          };
        }
        /*
        else {
          // todo
          break;
        }
        */
      /*
      case Koulutustyyppi.telma:
      case Koulutustyyppi.perustutkinto:
      case Koulutustyyppi.ammattitutkinto:
      case Koulutustyyppi.erikoisammattitutkinto:
        // todo
        break;
      */
    }

    throw new Error('koulutustyyppin-storet-ei-toteutettu');
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
