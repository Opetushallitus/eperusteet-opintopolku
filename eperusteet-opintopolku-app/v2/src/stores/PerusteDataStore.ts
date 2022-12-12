import { Store, Getter, State } from '@shared/stores/store';
import * as _ from 'lodash';
import { findDeep } from 'deepdash-es/standalone';
import { NavigationNodeDto, PerusteDto, Perusteet, TermiDto, baseURL,
  Dokumentit, DokumentitParam,
  Termit,
  Liitetiedostot, LiitetiedostotParam, TekstiKappaleDto, LukioperusteenJulkisetTiedot, PerusteKaikkiDto, GeneerinenArviointiasteikko, Arviointiasteikot, Aipeopetuksensisalto } from '@shared/api/eperusteet';
import { Koulutustyyppi, KoulutustyyppiToteutus, LiiteDtoWrapper } from '@shared/tyypit';

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
import { isKoulutustyyppiAmmatillinen, isPerusteVanhaLukio } from '@shared/utils/perusteet';
import { deepFind } from '@shared/utils/helpers';

@Store
export class PerusteDataStore {
  @State() public perusteKaikki: PerusteKaikkiDto | null = null;
  @State() public projektitila: string | null = null;
  @State() public perusteId: number;
  @State() public esikatselu: boolean | undefined = undefined;
  @State() public revision: number | undefined = undefined;
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
  @State() public liitteet: any = {};
  @State() public lukioOppineet: any[] = [];
  @State() public geneerisetArviointiasteikot: any[] = [];
  @State() public arviointiasteikot: any[] = [];
  @State() public laajaAlaisetOsaamiset: any[] = [];
  @State() public perusteJulkaisu: any = null;
  @State() public perusteJulkaisuP: Promise<any> | null = null;

  public static async create(perusteId: number, revision: number | null = null) {
    const result = new PerusteDataStore(perusteId, revision);
    await result.init();

    return result;
  }

  constructor(perusteId: number, revision?) {
    this.perusteId = perusteId;
    this.esikatselu = revision === '0' ? true : undefined;
    this.revision = _.toNumber(revision) > 0 ? revision : undefined;
  }

  private async init() {
    this.perusteKaikki = (await Perusteet.getKokoSisalto(this.perusteId, this.revision, this.esikatselu)).data;
    this.projektitila = (await Perusteet.getPerusteProjektiTila(this.perusteId)).data;
    this.termit = (await Termit.getAllTermit(this.perusteId)).data;
    this.kuvat = _.map((await Liitetiedostot.getAllKuvat(this.perusteId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: baseURL + LiitetiedostotParam.getKuva(this.perusteId, kuva.id!).url,
    }));
    this.fetchNavigation();

    if (isKoulutustyyppiAmmatillinen(this.perusteKaikki.koulutustyyppi!)) {
      try {
        await this.getKvLiitteet();
      }
      catch (err) { }
      this.osaamisalaKuvaukset = (await Perusteet.getOsaamisalat(this.perusteId)).data;
      this.arviointiasteikot = (await Arviointiasteikot.getAll()).data;
    }

    if (this.perusteKaikki.koulutustyyppi === Koulutustyyppi.aikuistenperusopetus) {
      this.laajaAlaisetOsaamiset = (await Aipeopetuksensisalto.getAipeOsaamiset(this.perusteId)).data;
    }

    if (isPerusteVanhaLukio(this.peruste)) {
      this.lukioOppineet = _.get((await LukioperusteenJulkisetTiedot.getOppiainePuuRakenne(this.perusteId)).data, 'oppiaineet')!;
    }

    this.liitteet = (await Liitetiedostot.getAllLiitteet(this.perusteId)).data;
  }

  public getJulkaistuPerusteSisalto(filter) {
    return deepFind(filter, this.perusteKaikki);
  }

  public async fetchJulkaisu() {
    if (this.perusteJulkaisu) {
      return this.perusteJulkaisu;
    }

    if (this.perusteJulkaisuP) {
      const { data } = await this.perusteJulkaisuP;
      return data;
    }

    this.perusteJulkaisuP = Perusteet.getKokoSisalto(this.perusteId);
    const { data } = await this.perusteJulkaisuP;
    this.perusteJulkaisu = data;
    this.perusteJulkaisuP = null;
    return data;
  }

  private async fetchNavigation() {
    this.navigation = (await Perusteet.getNavigationPublic(this.perusteId, Kielet.getUiKieli.value, this.esikatselu, this.revision)).data;
  }

  @Getter(state => {
    return state.perusteKaikki;
  })
  public readonly peruste!: PerusteKaikkiDto | null;

  @Getter((state, getters) => {
    return !getters.peruste || !state.navigation;
  })
  public readonly sidenavLoading!: boolean;

  @Getter((state, getters) => {
    if (!getters.peruste || !state.navigation) {
      return null;
    }
    else {
      const tiedot = buildTiedot('perusteTiedot', {
        perusteId: _.toString(state.perusteId),
        revision: state.revision,
      });
      return buildNavigation(state.navigation, tiedot, false, state.revision);
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

  private async getLiite(lang: string) {
    try {
      return await this.getKvLiite(lang);
    }
    catch (err) {
      return null;
    }
  }

  public async getKvLiitteet() {
    this.kvLiitteet = {
      fi: await this.getKvLiite('fi'),
      sv: await this.getKvLiite('sv'),
      en: await this.getKvLiite('en'),
    };
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
