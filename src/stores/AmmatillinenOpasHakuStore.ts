import { Store, Getter, State } from '@shared/stores/store';
import { PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteHakuStore } from './IPerusteHakuStore';
import { Debounced } from '@shared/utils/delay';

@Store
export class AmmatillinenOpasHakuStore implements IPerusteHakuStore {
  @State() public perusteet: PerusteenJulkaisuData[] | null = null;
  @State() public page = 0;
  @State() public pages = 0;
  @State() public total = 0;
  @State() public perPage = 10;

  @State()
  public filterdata: JulkaistutPerusteetQuery = {
    nimi: '',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    tuleva: true,
    voimassaolo: true,
    siirtyma: false,
    poistunut: false,
    tyyppi: 'opas',
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

  @Debounced(500)
  async fetch() {
    this.perusteet = null;
    const result = await julkaistutPerusteet(this.filters);
    this.total = result['kokonaismäärä'];
    this.page = result.sivu;
    this.perPage = result.sivukoko;
    this.pages = result.sivuja;
    this.perusteet = result.data;
  }

  async updateFilters(filters: JulkaistutPerusteetQuery) {
    this.filterdata = {
      ...this.filters,
      ...filters,
    };
    await this.fetch();
  }
}
