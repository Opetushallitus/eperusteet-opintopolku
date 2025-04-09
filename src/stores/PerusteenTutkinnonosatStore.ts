import Vue, { computed, reactive } from 'vue';
import _ from 'lodash';
import { TutkinnonRakenne, PerusteDto } from '@shared/api/eperusteet';
import { perusteenSuoritustapa } from '@shared/utils/perusteet';

export class PerusteenTutkinnonosatStore {
  private state = reactive({
    tutkinnonosat: null as any[] | null,
  });

  constructor(private peruste: PerusteDto) {
    this.fetch();
  }

  public readonly tutkinnonosat = computed(() => this.state.tutkinnonosat);

  public async fetch() {
    this.state.tutkinnonosat = (await TutkinnonRakenne.getPerusteenTutkinnonOsat(this.peruste.id!, perusteenSuoritustapa(this.peruste))).data as any[];
  }
}
