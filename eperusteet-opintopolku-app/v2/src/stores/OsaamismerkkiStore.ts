import { Osaamismerkit } from '@shared/api/eperusteet';
import { computed, reactive } from '@vue/composition-api';
import { OsaamismerkkiBaseDto } from '@shared/generated/eperusteet';

export class OsaamismerkkiStore {
  public state = reactive({
    osaamismerkki: null as OsaamismerkkiBaseDto | null,
  })

  public static async create(osaamismerkkiId: number) {
    const result = new OsaamismerkkiStore(osaamismerkkiId);
    await result.fetch(osaamismerkkiId);
    return result;
  }

  constructor(osaamismerkkiId: number) {
  }

  public readonly osaamismerkki = computed(() => this.state.osaamismerkki || null);

  public async fetch(id: number) {
    this.state.osaamismerkki = null;
    this.state.osaamismerkki = (await Osaamismerkit.getJulkinenOsaamismerkkiById(id)).data;
  }
}
