import { Osaamismerkit, OsaamismerkitQuery, OsaamismerkkiDto } from '@shared/api/eperusteet';
import { Debounced } from '@shared/utils/delay';
import { computed, reactive } from '@vue/composition-api';
import { OsaamismerkkiKategoriaDto } from '@shared/generated/eperusteet';
import { Page } from '@shared/tyypit';

export class OsaamismerkitStore {
  public state = reactive({
    osaamismerkkiPage: null as Page<OsaamismerkkiDto> | null,
    query: {} as OsaamismerkitQuery,
    isLoading: false,
    kokonaismaara: 0,
    kategoriat: [] as OsaamismerkkiKategoriaDto[] | null,
  })

  public readonly osaamismerkit = computed(() => this.state.osaamismerkkiPage?.data || null);
  public readonly options = computed(() => this.state.query);
  public readonly kategoriat = computed(() => this.state.kategoriat);
  public readonly kokonaismaara = computed(() => this.state.osaamismerkkiPage?.kokonaismäärä);

  async init(query: OsaamismerkitQuery) {
    this.state.query = query;
    this.state.osaamismerkkiPage = null;
    await this.fetchKategoriat();
  }

  @Debounced(300)
  public async updateOsaamismerkkiQuery(query: OsaamismerkitQuery) {
    this.state.osaamismerkkiPage = null;
    this.state.osaamismerkkiPage = await this.fetchOsaamismerkitImpl(query);
  }

  private async fetchOsaamismerkitImpl(q: OsaamismerkitQuery) {
    const res = (await Osaamismerkit.findOsaamismerkitBy(
      0,
      9999,
      q.nimi,
      ['JULKAISTU'],
      q.kategoria,
      true,
      false,
      false,
    )).data as any;
    return res;
  }

  public async fetchKategoriat() {
    this.state.kategoriat = null;
    this.state.kategoriat = (await Osaamismerkit.getKategoriat()).data;
  }
}
