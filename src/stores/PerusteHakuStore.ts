import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { PerusteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';
import { IPerusteHakuStore } from './IPerusteHakuStore';
import { Debounced } from '@shared/utils/delay';

@Store
export class PerusteHakuStore implements IPerusteHakuStore {
  @State() public perusteet: PerusteDto[] | null = null;
  @State() public page = 0;
  @State() public pages = 0;
  @State() public total = 0;
  @State() public perPage = 10;

  @State()
  public filterdata: PerusteQuery = {
    nimi: '',
    koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ],
    tuleva: true,
    siirtyma: true,
    voimassaolo: true,
    poistunut: false,
    tutkintonimikkeet: true,
    tutkinnonosat: true,
    osaamisalat: true,
  };

  constructor(data: PerusteQuery = {}) {
    this.filterdata = {
      ...this.filterdata,
      ...data,
    };
  }

  @Getter((state) => {
    if (state.filterdata.perusteTyyppi === 'opas') {
      return [
        'tuleva',
        'voimassaolo',
      ];
    }
    else {
      return [
        'tuleva',
        'voimassaolo',
        'siirtyma',
        'poistunut',
      ];
    }
  })
  public readonly toggles!: string[];

  @Getter((state) => ({
    ...state.filterdata,
    sivu: state.page,
    sivukoko: state.perPage,
    kieli: Kielet.getSisaltoKieli.value,
  }))
  public readonly filters!: PerusteQuery;

  @Debounced(1000)
  async fetch() {
    this.perusteet = null;
    const result = await perusteetQuery(this.filters);
    this.total = result['kokonaismäärä'];
    this.page = result.sivu;
    this.perPage = result.sivukoko;
    this.pages = result.sivuja;
    this.perusteet = result.data;
  }

  async updateFilters(filters: PerusteQuery) {
    this.filterdata = {
      ...this.filters,
      ...filters,
    };
    await this.fetch();
  }
}
