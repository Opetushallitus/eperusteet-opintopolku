import { Osaamismerkit, OsaamismerkitQuery } from '@shared/api/eperusteet';
import { Debounced, DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import { computed, reactive } from '@vue/composition-api';
import { OsaamismerkkiBaseDto, OsaamismerkkiKategoriaDto } from '@shared/generated/eperusteet';
import { Kielet } from '@shared/stores/kieli';

export class OsaamismerkitStore {
  public state = reactive({
    osaamismerkit: null as OsaamismerkkiBaseDto[] | null,
    query: {} as OsaamismerkitQuery,
    kategoriat: [] as OsaamismerkkiKategoriaDto[] | null,
  });

  public readonly osaamismerkit = computed(() => this.state.osaamismerkit);
  public readonly options = computed(() => this.state.query);
  public readonly kategoriat = computed(() => this.state.kategoriat);

  @Debounced(DEFAULT_PUBLIC_WAIT_TIME_MS)
  public async updateOsaamismerkkiQuery(query: OsaamismerkitQuery) {
    this.state.osaamismerkit = null;
    this.state.osaamismerkit = await this.fetchOsaamismerkitImpl(query);
  }

  public async fetchOsaamismerkitImpl(q: OsaamismerkitQuery) {
    const res = (await Osaamismerkit.findJulkisetOsaamismerkitBy(
      q.nimi,
      q.kategoria,
      q.koodit,
      q.poistunut,
      Kielet.getSisaltoKieli.value,
    )).data as any;
    return res;
  }

  public async fetchKategoriat(q: OsaamismerkitQuery) {
    this.state.kategoriat = null;
    this.state.kategoriat = (await Osaamismerkit.getJulkisetKategoriat(q.poistunut, Kielet.getSisaltoKieli.value)).data;
  }
}
