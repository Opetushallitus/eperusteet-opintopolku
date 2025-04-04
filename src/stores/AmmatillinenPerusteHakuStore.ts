import { Store, Getter, State } from '@shared/stores/store';
import { Arviointiasteikot, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteHakuStore } from './IPerusteHakuStore';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';

@Store
export class AmmatillinenPerusteHakuStore implements IPerusteHakuStore {
  @State() public perusteet: PerusteenJulkaisuData[] | null = null;
  @State() public page = 0;
  @State() public pages = 0;
  @State() public total = 0;
  @State() public perPage = 10;
  @State() public arviointiasteikot: any[] = [];

  @State()
  public filterdata: JulkaistutPerusteetQuery = {
    nimiTaiKoodi: '',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    tuleva: true,
    siirtyma: false,
    voimassaolo: true,
    poistunut: false,
    perusteet: true,
    tutkinnonosat: false,
  };

  constructor(data: JulkaistutPerusteetQuery = { }) {
    this.filterdata = {
      ...this.filterdata,
      ...data,
    };
  }

  @Getter((state) => {
    return [
      'tuleva',
      'voimassaolo',
      'siirtyma',
      'poistunut',
    ];
  })
  public readonly toggles!: string[];

  @Getter((state) => ({
    ...state.filterdata,
    sivu: state.page,
    sivukoko: state.perPage,
    kieli: Kielet.getSisaltoKieli.value,
  }))
  public readonly filters!: JulkaistutPerusteetQuery;

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  async fetch() {
    this.perusteet = null;
    const result = await julkaistutPerusteet(this.filters);

    this.total = result['kokonaismäärä'];
    this.page = result.sivu;
    this.perPage = result.sivukoko;
    this.pages = result.sivuja;
    this.perusteet = result.data;
  };

  async updateFilters(filters: JulkaistutPerusteetQuery) {
    this.filterdata = {
      ...this.filters,
      ...filters,
    };
    await this.fetch();
  }

  async fetchArviointiasteikot() {
    this.arviointiasteikot = (await Arviointiasteikot.getAll()).data;
  }
}
