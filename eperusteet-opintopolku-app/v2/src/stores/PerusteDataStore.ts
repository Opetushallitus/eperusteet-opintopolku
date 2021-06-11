import { Store, Getter, State } from '@shared/stores/store';
import * as _ from 'lodash';
import { NavigationNodeDto, PerusteDto, Perusteet, TermiDto, baseURL,
  Dokumentit, DokumentitParam,
  Termit,
  Liitetiedostot, LiitetiedostotParam, TekstiKappaleDto } from '@shared/api/eperusteet';
import { LiiteDtoWrapper } from '@shared/tyypit';

import {
  buildNavigation,
  filterNavigation,
  buildTiedot,
  NavigationFilter,
  NavigationNode,
} from '@shared/utils/NavigationBuilder';

import { perusteetQuery } from '@/api/eperusteet';
import { Location } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';
import { isKoulutustyyppiAmmatillinen } from '@shared/utils/perusteet';

@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public projektitila: string | null = null;
  @State() public perusteId: number;
  @State() public navigation: NavigationNodeDto | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public currentRoute: Location | null = null;
  @State() public termit: TermiDto[] | null = null;
  @State() public kuvat: LiiteDtoWrapper[] | null = null;
  @State() public dokumentti: string | null = null;
  @State() public korvaavatPerusteet: any[] = [];
  @State() public sidenavFilter: NavigationFilter = {
    label: '',
    isEnabled: false,
  };
  @State() public kvLiitteet: any = {};
  @State() public osaamisalaKuvaukset: { [key: string]: { [key: string]: Array<TekstiKappaleDto>; }; } = {};

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
    this.projektitila = (await Perusteet.getPerusteProjektiTila(this.perusteId)).data;
    this.termit = (await Termit.getAllTermit(this.perusteId)).data;
    this.kuvat = _.map((await Liitetiedostot.getAllKuvat(this.perusteId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: baseURL + LiitetiedostotParam.getKuva(this.perusteId, kuva.id!).url,
    }));
    this.fetchNavigation();

    if (isKoulutustyyppiAmmatillinen(this.peruste.koulutustyyppi!)) {
      await this.getKvLiitteet();
      this.osaamisalaKuvaukset = (await Perusteet.getOsaamisalat(this.perusteId)).data;
    }
  }

  private async fetchNavigation() {
    this.navigation = (await Perusteet.getNavigation(this.perusteId, Kielet.getUiKieli.value)).data;
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
      const tiedot = buildTiedot('perusteTiedot', {
        perusteId: _.toString(state.perusteId),
      });
      return buildNavigation(state.navigation, tiedot);
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
        if (node.location && _.isMatch(state.currentRoute, node.location)) {
          return node || null;
        }
      }
    }
    return null;
  })
  public readonly current!: NavigationNode | null;

  public async getDokumentit() {
    if (!this.peruste) {
      return;
    }

    const sisaltoKieli = Kielet.getSisaltoKieli.value;
    const suoritustavat = this.peruste.suoritustavat ? this.peruste.suoritustavat : [{ suoritustapakoodi: 'REFORMI' }] as any[];
    if (suoritustavat) {
      for (let i = 0; i < suoritustavat.length; i++) {
        const st = suoritustavat[i];
        const suoritustapakoodi = st.suoritustapakoodi;
        if (suoritustapakoodi) {
          const dokumenttiId = (await Dokumentit.getDokumenttiId(this.perusteId, sisaltoKieli, suoritustapakoodi)).data;
          if (dokumenttiId) {
            this.dokumentti = baseURL + DokumentitParam.getDokumentti(_.toString(dokumenttiId)).url;
          }
        }
      }
    }
  };

  public async getKvLiitteet() {
    this.kvLiitteet['fi'] = await this.getKvLiite('fi');
    this.kvLiitteet['sv'] = await this.getKvLiite('sv');
    this.kvLiitteet['en'] = await this.getKvLiite('en');
  }

  public async getKvLiite(kieli) {
    if (this.peruste && this.peruste.suoritustavat) {
      const dokumenttiId = (await Dokumentit.getKVLiiteDokumenttiId(this.perusteId, kieli, this.peruste.suoritustavat[0].suoritustapakoodi!)).data;
      if (dokumenttiId) {
        return baseURL + DokumentitParam.getDokumentti(_.toString(dokumenttiId)).url;
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
    this.currentRoute = route;
  }

  public readonly updateFilter = _.debounce((filter: NavigationFilter) => {
    this.sidenavFilter = filter;
  }, 300);
}
