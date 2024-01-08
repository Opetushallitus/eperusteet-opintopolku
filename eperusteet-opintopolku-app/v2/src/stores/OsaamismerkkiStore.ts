import { Osaamismerkit } from '@shared/api/eperusteet';
import { computed, reactive } from '@vue/composition-api';
import { OsaamismerkkiBaseDto } from '@shared/generated/eperusteet';

export class OsaamismerkkiStore {
  public state = reactive({
    osaamismerkki: null as OsaamismerkkiBaseDto | null,
  });

  public static async create(osaamismerkkiId, koodi) {
    const result = new OsaamismerkkiStore(osaamismerkkiId, koodi);
    if (koodi) {
      await result.fetchByKoodi(koodi);
    }
    else {
      await result.fetchById(osaamismerkkiId);
    }
    return result;
  }

  constructor(osaamismerkkiId, koodi) {
  }

  public readonly osaamismerkki = computed(() => this.state.osaamismerkki || null);

  public async fetchById(id: number) {
    this.state.osaamismerkki = null;
    this.state.osaamismerkki = (await Osaamismerkit.getJulkinenOsaamismerkkiById(id)).data;
  }

  public async fetchByKoodi(koodi: number) {
    this.state.osaamismerkki = null;
    this.state.osaamismerkki = (await Osaamismerkit.getJulkinenOsaamismerkkiByKoodi(koodi)).data;
  }
}
