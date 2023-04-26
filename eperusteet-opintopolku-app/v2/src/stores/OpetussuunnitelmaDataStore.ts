import _ from 'lodash';
import { Getter, State, Store } from '@shared/stores/store';
import { Location } from 'vue-router';
import mime from 'mime-types';
import { YlopsNavigationNodeDto,
  baseURL,
  Dokumentit,
  DokumentitParams,
  Liitetiedostot,
  LiitetiedostotParam,
  Opetussuunnitelmat,
  Termisto,
  OpetussuunnitelmatJulkiset,
  OpetussuunnitelmaExportDto,
} from '@shared/api/ylops';

import { Kielet } from '@shared/stores/kieli';
import {
  baseURL as perusteBaseURL,
  Liitetiedostot as PerusteLiitetiedostot,
  LiitetiedostotParam as PerusteLiitetiedostotParam,
  Perusteet,
  PerusteKaikkiDto,
  Termit,
} from '@shared/api/eperusteet';
import {
  buildNavigation,
  buildTiedot,
  filterNavigation,
  NavigationFilter,
  NavigationNode,
} from '@shared/utils/NavigationBuilder';
import { IOpetussuunnitelmaStore } from './IOpetussuunitelmaStore';
import { deepFind } from '@shared/utils/helpers';

const PaikallisetKielet = new Set(['VK', 'EN', 'LA', 'RA', 'SM', 'SA', 'VE', 'IA', 'EA', 'PO', 'KI', 'JP', 'AR', 'KX']);
interface NavigationQueryResult { parent: YlopsNavigationNodeDto | null, target: YlopsNavigationNodeDto };

@Store
export class OpetussuunnitelmaDataStore implements IOpetussuunnitelmaStore {
  @State() public opetussuunnitelma: OpetussuunnitelmaExportDto | null = null;
  @State() public opetussuunnitelmaPerusteenId: number | null = null;
  @State() public opetussuunnitelmaId: number;
  @State() public esikatselu: boolean | undefined = undefined;
  @State() public revision: number | undefined = undefined;
  @State() public navigation: YlopsNavigationNodeDto | null = null;
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
  @State() public perusteKaikki: PerusteKaikkiDto | null = null;

  public static async create(opetussuunnitelmaId: number, revision: number | undefined = undefined) {
    const result = new OpetussuunnitelmaDataStore(opetussuunnitelmaId, revision);
    await result.init();
    return result;
  }

  constructor(opetussuunnitelmaId: number, revision) {
    this.opetussuunnitelmaId = opetussuunnitelmaId;
    this.esikatselu = revision === '0' ? true : undefined;
    this.revision = revision;
  }

  async init() {
    await Promise.all([this.fetchOpetussuunnitelma(), this.fetchNavigation()]);

    if (this.opetussuunnitelmaPerusteenId) {
      this.fetchPerusteTermit(this.opetussuunnitelmaPerusteenId);
      this.fetchPerusteKuvat(this.opetussuunnitelmaPerusteenId);
    }
    this.fetchTermit();
    this.fetchKuvat();

    if (this.opetussuunnitelma?.peruste?.id) {
      this.perusteKaikki = (await Perusteet.getKokoSisalto(this.opetussuunnitelma.peruste.id)).data;
    }
  }

  async fetchOpetussuunnitelma() {
    this.opetussuunnitelma = null;
    this.opetussuunnitelmaPerusteenId = null;
    this.opetussuunnitelma = (await OpetussuunnitelmatJulkiset.getOpetussuunnitelmaJulkaistu(this.opetussuunnitelmaId, this.esikatselu)).data;
    this.opetussuunnitelmaPerusteenId = this.opetussuunnitelma.perusteenId ? this.opetussuunnitelma.perusteenId : null;
  }

  public getJulkaistuSisalto(filter) {
    return deepFind(filter, this.opetussuunnitelma);
  }

  public getJulkaistuPerusteSisalto(filter) {
    return deepFind(filter, this.perusteKaikki);
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
      src: perusteBaseURL + PerusteLiitetiedostotParam.getKuva(perusteenId, this.getKuvaFilename(kuva)).url,
    }));
  }

  private getKuvaFilename(liite) {
    return liite.id! + '.' + mime.extension(liite.mime);
  }

  async fetchTermit() {
    this.termit = null;
    this.termit = (await Termisto.getAllTermit(this.opetussuunnitelmaId)).data;
  }

  async fetchKuvat() {
    this.kuvat = null;
    this.kuvat = _.map((await Liitetiedostot.getAllLiitteet(this.opetussuunnitelmaId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: baseURL + LiitetiedostotParam.getLiitetiedosto(this.opetussuunnitelmaId, this.getLiiteFilename(kuva)).url,
    }));
  }

  private getLiiteFilename(liite) {
    return liite.id! + '.' + mime.extension(liite.tyyppi);
  }

  findBy(navi: YlopsNavigationNodeDto, fn: (value: YlopsNavigationNodeDto) => boolean, parent: YlopsNavigationNodeDto | null = null): NavigationQueryResult[] {
    const kohde = _.get(navi, 'meta.koodi');

    const result: NavigationQueryResult[] = [];

    if (fn(navi)) {
      result.push({
        parent,
        target: navi,
      });
    }

    for (const ch of (navi.children || [])) {
      const nodes = this.findBy(ch, fn, navi);
      if (nodes) {
        result.push(...nodes);
      }
    }

    return result;
  }

  findByKoodi(navi: YlopsNavigationNodeDto, koodi: string) {
    return this.findBy(navi, (node) => {
      const kohde = _.get(node, 'meta.koodi');
      return (kohde === koodi || _.get(kohde, 'arvo') === koodi);
    });
  }

  findByTyyppi(navi: YlopsNavigationNodeDto, tyyppi: string) {
    return this.findBy(navi, (node) => node.type === tyyppi);
  }

  movePaikallisetOppiaineet(navi: YlopsNavigationNodeDto) {
    const vieraatKielet = this.findByKoodi(navi, 'VK');
    if (!_.isEmpty(vieraatKielet)) {
      const paikallisetOppiaineet = this.findByTyyppi(navi, 'poppiaine');
      const paikallisetKielet = _(paikallisetOppiaineet)
        .filter((node: any) => {
          const start = (_.get(node, 'target.meta.koodi') || '').substr(0, 2);
          return PaikallisetKielet.has(start);
        })
        .value();

      let vk = vieraatKielet[0].target; {
        const op = this.findByTyyppi(vk, 'oppimaarat');
        if (!_.isEmpty(op)) {
          vk = _.first(op)!.target;
        }
      }
      const paikalliset: YlopsNavigationNodeDto[] = [];

      for (const paikallinen of paikallisetKielet) {
        _.remove(paikallinen.parent!.children || [], { id: paikallinen.target.id });
        paikalliset.push(paikallinen.target);
      }

      vk.children = [...(vk.children || []), ..._.sortBy(paikalliset, 'meta.koodi')];
    }
  }

  async fetchNavigation() {
    this.navigation = null;
    const navigation = (await Opetussuunnitelmat.getNavigationPublic(this.opetussuunnitelmaId, Kielet.getSisaltoKieli.value, this.esikatselu)).data;
    this.movePaikallisetOppiaineet(navigation);
    this.navigation = navigation;
  }

  @Getter(state => state.opetussuunnitelma.tila)
  public readonly tila!: string;

  @Getter(state => [...(state.termit || []), ...(state.perusteTermit || [])])
  public readonly kaikkiTermit!: any[];

  @Getter(state => state.opetussuunnitelma.koulutustyyppi)
  public readonly koulutustyyppi!: string;

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
        ...(state.revision && { revision: state.revision }),
      });
      return buildNavigation(state.navigation, tiedot, true, state.revision);
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

    const koodit = _.chain(getters.flattenedSidenav)
      .filter('meta.koodi.uri')
      .keyBy('meta.koodi.uri')
      .value();

    const rawKoodit = _.chain(getters.flattenedSidenav)
      .filter('meta.koodi')
      .filter(node => _.isString(node.meta.koodi))
      .keyBy('meta.koodi')
      .value();

    return _.assign(koodit, rawKoodit);
  })
  public readonly navigationByUri!: { [uri: string]: NavigationNode };

  @Getter((state, getters) => {
    if (!getters.flattenedSidenav) {
      return {};
    }

    const koodit = _.chain(getters.flattenedSidenav)
      .filter(node => node.type === 'oppiaine' || node.type === 'poppiaine')
      .filter('meta.koodi.uri')
      .keyBy('meta.koodi.uri')
      .value();

    const rawKoodit = _.chain(getters.flattenedSidenav)
      .filter(node => node.type === 'oppiaine' || node.type === 'poppiaine')
      .filter('meta.koodi')
      .filter(node => _.isString(node.meta.koodi))
      .keyBy('meta.koodi')
      .value();
    return _.assign(koodit, rawKoodit);
  })
  public readonly oppiaineetNavigationByUri!: { [uri: string]: NavigationNode };

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

  // Fixme: ota huomioon kielen vaihtaminen
  public async getDokumentit() {
    if (!this.opetussuunnitelma) {
      return;
    }
    const sisaltoKieli = Kielet.getSisaltoKieli.value;

    let dokumenttiId;
    if (this.esikatselu) {
      dokumenttiId = (await Dokumentit.getLatestDokumenttiId(this.opetussuunnitelmaId, sisaltoKieli)).data;
    }
    else {
      dokumenttiId = (await Dokumentit.getJulkaistuDokumenttiId(this.opetussuunnitelmaId, sisaltoKieli)).data;
    }
    if (dokumenttiId) {
      this.dokumentit[sisaltoKieli] = baseURL + DokumentitParams.get(_.toString(dokumenttiId)).url;
    }
  }

  public updateRoute(route) {
    this.currentRoute = route;
  }

  public readonly updateFilter = _.debounce((filter: NavigationFilter) => {
    this.sidenavFilter = filter;
  }, 300);
}
