import { Store, State, Getter } from '@shared/stores/store';
import { OpetussuunnitelmaKaikkiDto, NavigationNodeDto, Opetussuunnitelmat, JulkinenApi, DokumenttiDto, baseURL, JulkinenApiParams, KoulutustoimijaJulkinenDto, Arviointiasteikot, ArviointiasteikkoDto, LiitetiedostotParam } from '@shared/api/amosaa';
import * as _ from 'lodash';
import { IOpetussuunnitelmaStore } from './IOpetussuunitelmaStore';
import { NavigationNode, buildTiedot, buildNavigation, filterNavigation, NavigationFilter } from '@shared/utils/NavigationBuilder';
import { Kielet } from '@shared/stores/kieli';
import { DokumenttiDtoTilaEnum,
  baseURL as perusteBaseURL,
  Liitetiedostot as PerusteLiitetiedostot,
  LiitetiedostotParam as PerusteLiitetiedostotParam,
  PerusteKaikkiDto,
  Perusteet } from '@shared/api/eperusteet';
import mime from 'mime-types';
import { deepFilter, deepFind } from '@shared/utils/helpers';

@Store
export class ToteutussuunnitelmaDataStore implements IOpetussuunnitelmaStore {
  @State() public opetussuunnitelmaId: number;
  @State() public navigation: NavigationNodeDto | null = null;
  @State() public opetussuunnitelma: OpetussuunnitelmaKaikkiDto | null = null;
  @State() public koulutustoimija: KoulutustoimijaJulkinenDto | null = null;
  @State() public dokumenttiTila: DokumenttiDto | null = null;
  @State() public currentRoute: Location | null = null;
  @State() public sidenavFilter: NavigationFilter = {
    label: '',
    isEnabled: false,
  };
  @State() public arviointiasteikot: ArviointiasteikkoDto[] | null = null;
  @State() public perusteKuvat: object[] = [];
  @State() public perusteKaikki: PerusteKaikkiDto | null = null;
  @State() public vieraatPerusteet: PerusteKaikkiDto[] | null = null;

  constructor(opetussuunnitelmaId: number, private esikatselu = false) {
    this.opetussuunnitelmaId = opetussuunnitelmaId;
  }

  public static async create(opetussuunnitelmaId: number, esikatselu = false) {
    const result = new ToteutussuunnitelmaDataStore(opetussuunnitelmaId, esikatselu);
    await result.init();
    return result;
  }

  async init() {
    this.koulutustoimija = (await JulkinenApi.getOpetussuunnitelmanToimija(this.opetussuunnitelmaId)).data;
    this.opetussuunnitelma = (await JulkinenApi.getOpetussuunnitelmaJulkaistuSisalto(this.opetussuunnitelmaId, _.toString(this.koulutustoimija.id), this.esikatselu)).data;
    this.getDokumenttiTila();
    const navigation = (await Opetussuunnitelmat.getOpetussuunnitelmaNavigationPublic(this.opetussuunnitelmaId, _.toString(this.koulutustoimija.id), this.esikatselu)).data;
    this.navigation = {
      ...navigation,
      children: _.filter(navigation.children, child => child.type !== 'tiedot'),
    };
    this.arviointiasteikot = (await Arviointiasteikot.getAllArviointiasteikot()).data;
    if (this.opetussuunnitelma?.peruste) {
      await this.fetchPerusteKuvat(this.opetussuunnitelma.peruste.perusteId!);
    }

    if (this.opetussuunnitelma?.peruste?.perusteId) {
      this.perusteKaikki = (await Perusteet.getKokoSisalto(this.opetussuunnitelma.peruste.perusteId)).data;
      this.vieraatPerusteet = await this.getTutkinnonosienVieraatPerusteet();
    }
  }

  public async getTutkinnonosienVieraatPerusteet() {
    const tutkinnonOsat = this.getJulkaistuSisalto('tutkinnonOsat');
    const perusteIds = _.chain(tutkinnonOsat)
      .filter(tosa => tosa.tosa?.vierastutkinnonosa)
      .map(tosa => tosa.tosa?.vierastutkinnonosa.perusteId)
      .uniq()
      .value();
    return Promise.all(_.map(perusteIds, async (perusteId) => (await Perusteet.getKokoSisalto(perusteId)).data));
  }

  @Getter(state => {
    if (state.dokumenttiTila && state.dokumenttiTila.tila === _.lowerCase(DokumenttiDtoTilaEnum.VALMIS)) {
      return baseURL + JulkinenApiParams.getDokumentti(state.opetussuunnitelma.id, Kielet.getSisaltoKieli.value, state.opetussuunnitelma.koulutustoimija.id).url;
    }
  })
  public readonly dokumenttiUrl!: string;

  public async getDokumenttiTila() {
    try {
      if (this.opetussuunnitelma) {
        this.dokumenttiTila = null;
        this.dokumenttiTila = (await JulkinenApi.queryDokumentti(this.opetussuunnitelma!.id!, Kielet.getSisaltoKieli.value, _.toString(this.opetussuunnitelma!.koulutustoimija!.id!))).data;
      }
    }
    catch (err) {
    }
  };

  @Getter(state => state.opetussuunnitelma.peruste ? state.opetussuunnitelma.peruste.koulutustyyppi : state.opetussuunnitelma.koulutustyyppi)
  public readonly koulutustyyppi!: string;

  @Getter(state => state.opetussuunnitelma.tila)
  public readonly tila!: string;

  @Getter(state => _.map(state.opetussuunnitelma.liitteet, liite => ({
    id: liite.id!,
    src: baseURL + LiitetiedostotParam.getImage(state.opetussuunnitelma.id!, liite.id!).url,
  })))
  public readonly kuvat!: any[];

  async fetchPerusteKuvat(perusteenId: number) {
    this.perusteKuvat = _.map((await PerusteLiitetiedostot.getAllKuvat(perusteenId)).data, kuva => ({
      id: kuva.id!,
      kuva,
      src: perusteBaseURL + PerusteLiitetiedostotParam.getKuva(perusteenId, kuva.id! + '.' + mime.extension(kuva.mime)).url,
    }));
  }

  public getJulkaistuSisalto(filter) {
    return deepFind(filter, this.opetussuunnitelma);
  }

  public getJulkaistuSisaltoList(filter) {
    return deepFilter(filter, this.opetussuunnitelma);
  }

  public getJulkaistuPerusteSisalto(filter, perusteId?) {
    const peruste = _.find(this.vieraatPerusteet, vperuste => vperuste.id === perusteId) || this.perusteKaikki;
    return deepFind(filter, peruste);
  }

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
