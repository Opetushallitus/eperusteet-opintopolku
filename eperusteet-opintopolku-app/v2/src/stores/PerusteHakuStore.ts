import { Store, Getter, State } from '@shared/stores/store';
import { PerusteDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { PerusteQuery, perusteetQuery } from '@/api/eperusteet';
import _ from 'lodash';

@Store
export class PerusteHakuStore {
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
    koulutusvienti: false,
    tuleva: true,
    siirtyma: true,
    voimassaolo: true,
    poistunut: false,
    tutkintonimikkeet: false,
    tutkinnonosat: false,
    osaamisalat: false,
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
        'tutkintonimikkeet',
        'tutkinnonosat',
        'osaamisalat',
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

  public readonly fetch = _.debounce(async () => {
    this.perusteet = null;
    const result = await perusteetQuery(this.filters);
    this.total = result['kokonaismäärä'];
    this.page = result.sivu;
    this.perPage = result.sivukoko;
    this.pages = result.sivuja;
    this.perusteet = result.data;
  }, 300);

  public updateFilters(filters: PerusteQuery) {
    this.filterdata = {
      ...this.filters,
      ...filters,
    };
    this.fetch();
  }
}
