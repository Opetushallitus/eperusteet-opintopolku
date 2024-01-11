import { computed, reactive } from '@vue/composition-api';
import { Page } from '../../tyypit';
import { KoodistoKoodiDto } from '../../api/eperusteet';
import { Debounced } from '../../utils/delay';

export interface IKoodisto {
  koodisto: string;
  query: (query: string, sivu: number, koodisto: string, vainVoimassaolevat?: boolean) => Promise<Page<KoodistoKoodiDto>>;
}

export class KoodistoSelectStore {
  public readonly state = reactive({
    data: null as Page<KoodistoKoodiDto> | null,
  });

  public readonly data = computed(() => this.state.data);
  public readonly koodisto = computed(() => this.config.koodisto);

  constructor(private config: IKoodisto) {
  }

  @Debounced(300)
  public async query(query: string = '', sivu = 0, onlyValidKoodis = true) {
    const result = await this.config.query(query, sivu, this.config.koodisto, onlyValidKoodis);
    this.state.data = result as any;
  }
}
