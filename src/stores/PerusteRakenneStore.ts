import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { TutkinnonRakenne, RakenneModuuliDto, PerusteDto } from '@shared/api/eperusteet';
import { perusteenSuoritustapa } from '@shared/utils/perusteet';

Vue.use(VueCompositionApi);

export class PerusteRakenneStore {
  private state = reactive({
    rakenne: null as RakenneModuuliDto[] | null,
  });

  constructor(private perusteId: number, private suoritustapa: string) {
    this.fetch();
  }

  public readonly rakenne = computed(() => this.state.rakenne);

  public async fetch() {
    const tutkinnonOsat = _.keyBy((await TutkinnonRakenne.getPerusteenTutkinnonOsat(this.perusteId, this.suoritustapa as any)).data, 'id');
    this.state.rakenne = (await TutkinnonRakenne.getRakenne(this.perusteId, this.suoritustapa as any)).data as any;
    this.state.rakenne!['osat'] = this.lisaaTutkinnonOsat(this.state.rakenne!['osat'], tutkinnonOsat);
  }

  private lisaaTutkinnonOsat(osat: any[], tutkinnonosatById) {
    return _.map(osat, osa => {
      return {
        ...osa,
        ...(osa['_tutkinnonOsaViite'] && { tutkinnonosa: tutkinnonosatById[osa['_tutkinnonOsaViite']] }),
        osat: this.lisaaTutkinnonOsat(osa.osat, tutkinnonosatById),
      };
    });
  }
}
