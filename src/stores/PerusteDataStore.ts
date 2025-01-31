import { Store, Getter, State } from '@shared/stores/store';
import * as _ from 'lodash';
import {
  NavigationNodeDto,
  Perusteet,
  TermiDto,
  baseURL,
  Dokumentit,
  DokumentitParam,
  Termit,
  Liitetiedostot,
  LiitetiedostotParam,
  TekstiKappaleDto,
  LukioperusteenJulkisetTiedot,
  PerusteKaikkiDto,
  Arviointiasteikot,
  JulkaisuBaseDto, Julkaisut,
  DokumenttiDtoTilaEnum,
  Maaraykset,
  MaaraysDto,
} from '@shared/api/eperusteet';
import { LiiteDtoWrapper } from '@shared/tyypit';
import {
  buildNavigation,
  buildNavigationNode,
  NavigationFilter,
  NavigationNode,
  naytaPerusteTiedotNaviMenussa,
} from '@shared/utils/NavigationBuilder';

import { Location } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';
import { isKoulutustyyppiAmmatillinen, isPerusteVanhaLukio } from '@shared/utils/perusteet';
import { deepFind } from '@shared/utils/helpers';
import { isAmmatillinenKoulutustyyppi } from '../../eperusteet-frontend-utils/vue/src/utils/perusteet';
@Store
export class PerusteDataStore {
  @State() public perusteKaikki: PerusteKaikkiDto | null = null;
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
  @State() public julkaisut: JulkaisuBaseDto[] | null = null;
  @State() public muutosmaaraykset: MaaraysDto[] | null = null;
  @State() public maarays: MaaraysDto | null = null;

  public static async create(perusteId: number, revision: number | null = null) {
    const result = new PerusteDataStore(perusteId, revision);
    await result.init();

    return result;
  }

  constructor(perusteId: number, revision?) {
    this.perusteId = perusteId;
    this.esikatselu = revision === '0' ? true : undefined;
    this.revision = _.isNull(revision) ? undefined : revision;
  }

  private async init() {
    [
      this.perusteKaikki,
      this.termit,
      this.liitteet,
      this.muutosmaaraykset,
      this.korvaavatPerusteet,
      this.maarays,
    ] = _.map(await Promise.all([
      Perusteet.getKokoSisalto(this.perusteId, this.revision, this.esikatselu) as any,
      Termit.getAllTermit(this.perusteId),
      Liitetiedostot.getAllLiitteet(this.perusteId),
      Maaraykset.getPerusteenJulkaistutMuutosmaaraykset(this.perusteId),
      Perusteet.getKorvattavatPerusteet(this.perusteId),
      Maaraykset.getMaaraysPerusteella(this.perusteId),
    ]), 'data');

    this.kuvat = _.map((await Liitetiedostot.getAllKuvat(this.perusteId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: baseURL + LiitetiedostotParam.getKuva(this.perusteId, kuva.id!).url,
    }));

    await Promise.all([
      this.fetchNavigation(),
      this.getDokumentti(),
      this.fetchJulkaisut(),
    ]);

    if (isKoulutustyyppiAmmatillinen(this.perusteKaikki?.koulutustyyppi!)) {
      try {
        await this.getKvLiitteet();
      }
      catch (err) { }

      [
        this.osaamisalaKuvaukset,
        this.arviointiasteikot,
      ] = _.map(await Promise.all([
        Perusteet.getOsaamisalat(this.perusteId) as any,
        Arviointiasteikot.getAll(),
      ]), 'data');
    }

    if (isPerusteVanhaLukio(this.peruste)) {
      this.lukioOppineet = _.get(this.perusteKaikki, 'lukiokoulutus.rakenne.oppiaineet')!;
    }
  }

  async fetchJulkaisut() {
    this.julkaisut = (await Julkaisut.getJulkisetJulkaisut(this.perusteId!)).data;
  }

  public getJulkaistuPerusteSisalto(filter) {
    return deepFind(filter, this.perusteKaikki);
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
      if (naytaPerusteTiedotNaviMenussa(getters.peruste)) {
        const nimi = getters.peruste?.tyyppi === 'normaali' ? 'perusteen-tiedot' : 'oppaan-tiedot';
        const tiedot = {
          ...buildNavigationNode('tiedot', nimi, 'perusteTiedot', {
            ...(state.revision && { revision: state.revision }),
          }),
        };

        return buildNavigation(state.navigation, tiedot, false, state.revision);
      }
      else {
        return buildNavigation(state.navigation, null, false, state.revision);
      }
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
        isVisible: depth === 1 || onPath(value),
        children: _.map(value.children, child => map(child, depth + 1)),
      };
    };

    return map(getters.sidenav);
  })
  public readonly collapsedSidenav!: NavigationNode | null;

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

  public async getDokumentti() {
    this.dokumentti = null;
    const sisaltoKieli = Kielet.getSisaltoKieli.value;
    const suoritustavat = this.peruste!.suoritustavat ? this.peruste!.suoritustavat : [{ suoritustapakoodi: 'REFORMI' }] as any[];
    if (suoritustavat) {
      for (let i = 0; i < suoritustavat.length; i++) {
        const st = suoritustavat[i];
        const suoritustapakoodi = st.suoritustapakoodi;
        if (suoritustapakoodi) {
          let dokumenttiId;

          if (!this.esikatselu) {
            const dokumentti = (await Dokumentit.getJulkaistuDokumentti(this.perusteId, sisaltoKieli, this.revision)).data;
            if (dokumentti?.tila === _.toLower(DokumenttiDtoTilaEnum.VALMIS)) {
              dokumenttiId = dokumentti.id;
            }
          }

          if (this.esikatselu || !dokumenttiId) {
            dokumenttiId = (await Dokumentit.getDokumenttiId(this.perusteId, sisaltoKieli, suoritustapakoodi)).data;
          }

          if (dokumenttiId) {
            this.dokumentti = baseURL + DokumentitParam.getDokumentti(_.toString(dokumenttiId)).url;
          }
        }
      }
    }

    if (this.dokumentti === null) {
      this.dokumentti = '';
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

  public updateRoute(route) {
    this.currentRoute = route;
  }
}
