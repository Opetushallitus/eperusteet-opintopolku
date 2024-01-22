import { Osaamismerkit, OsaamismerkitQuery } from '@shared/api/eperusteet';
import { Debounced } from '@shared/utils/delay';
import { computed, reactive } from '@vue/composition-api';
import { OsaamismerkkiBaseDto, OsaamismerkkiKategoriaDto } from '@shared/generated/eperusteet';

export class OsaamismerkitStore {
  public state = reactive({
    osaamismerkit: null as OsaamismerkkiBaseDto[] | null,
    query: {} as OsaamismerkitQuery,
    kategoriat: [] as OsaamismerkkiKategoriaDto[] | null,
  });

  public readonly osaamismerkit = computed(() => this.state.osaamismerkit || null);
  public readonly options = computed(() => this.state.query);
  public readonly kategoriat = computed(() => this.state.kategoriat);

  @Debounced(300)
  public async updateOsaamismerkkiQuery(query: OsaamismerkitQuery) {
    this.state.osaamismerkit = null;
    this.state.osaamismerkit = await this.fetchOsaamismerkitImpl(query);
  }

  private async fetchOsaamismerkitImpl(q: OsaamismerkitQuery) {
    const res = (await Osaamismerkit.findJulkisetOsaamismerkitBy(
      q.nimi,
      q.kategoria,
    )).data as any;
    return res;
  }

  public async fetchKategoriat() {
    this.state.kategoriat = null;
    this.state.kategoriat = (await Osaamismerkit.getJulkisetKategoriat()).data;
  }
}
