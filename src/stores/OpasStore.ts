import  { reactive, computed } from '@vue/composition-api';
import { PerusteHakuDto, Oppaat, PerusteQuery } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ryhmat } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { julkaistutPerusteet, JulkaistutPerusteetQuery } from '@/api/eperusteet';

export class OpasStore {
  public state = reactive({
    oppaat: null as PerusteHakuDto[] | null,
    query: {} as JulkaistutPerusteetQuery,
  });

  constructor(koulutustyyppi: string) {
    this.state.query = {
      sivu: 0,
      sivukoko: 100,
      kieli: Kielet.getUiKieli.value,
      koulutustyyppi: ryhmat(koulutustyyppi),
      tuleva: false,
      voimassaolo: false,
      siirtyma: false,
      poistunut: false,
      tyyppi: 'opas',
    };

    this.fetch();
  }

  public readonly oppaat = computed(() => this.state.oppaat);

  public async fetch() {
    const res = (await julkaistutPerusteet(this.state.query)) as any;
    this.state.oppaat = res.data;
  }
}
