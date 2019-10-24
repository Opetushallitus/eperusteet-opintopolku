import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import { SidenavFilter, SidenavNode, buildSidenav } from '@/utils/NavigationBuilder';
import { baseURL, LiitetiedostotParam, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Koulutustyyppi, KoulutustyyppiToteutus } from "@shared/tyypit";
import { Lops2019OppiaineetStore } from "@/stores/Lops2019OppiaineetStore";


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number;
  @State() public sisalto: Matala | null = null;
  @State() public suoritustapa: string | null = null;
  @State() public viiteId: number | null = null;
  @State() public dokumentit: any = {};
  @State() public korvaavatPerusteet: any[] = [];
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
    if (state.perusteId && state.sisalto) {
      const viiteId = state.viiteId ? state.viiteId : undefined;
      return buildSidenav(state.peruste, state.sisalto, state.sidenavFilter, viiteId);
    }
    else {
      return null;
    }
  })
  public readonly sidenav!: SidenavNode | null;

  get flattenedSidenav(): Array<SidenavNode> {
    const root = this.sidenav;
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
  }

  @Getter((state, getters) => {
    if (state.viiteId && getters.sidenav) {
      const root = getters.sidenav;
      const stack = [root];
      const viiteId = state.viiteId;
      while (stack.length > 0) {
        const head = stack.pop();
        if (head.id === viiteId) {
          return head || null;
        }
        stack.push(...head!.children);
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

  public async updateViiteId(value) {
    this.viiteId = _.isString(value) ? _.parseInt(value) : value;
  }

  public readonly updateFilter = _.debounce((filter: SidenavFilter) => {
    this.sidenavFilter = filter;
  }, 300);

  private async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }

  private async initSisalto() {
    if (this.perusteId && this.peruste) {
      // Todo: erikoisammattitutkinto vaatii oikean suoritustapakoodin
      this.sisalto = (await Sisallot.getSuoritustapaSisaltoUUSI(this.perusteId, 'LUKIOKOULUTUS2019')).data;
    }
    else {
      throw new Error('peruste-id-tai-peruste-puuttuu');
    }
  }
}
