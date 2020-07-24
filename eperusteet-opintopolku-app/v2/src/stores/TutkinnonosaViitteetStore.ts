import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, Perusteet, Sisaltoviitteet, Opetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';

Vue.use(VueCompositionApi);

export class TutkinnonosaViitteetStore {
  private state = reactive({
    tutkinnonosaViitteet: null as any[] | null,
  })

  constructor(private opetussuunnitelma: OpetussuunnitelmaDto) {
    this.fetch();
  }

  public readonly tutkinnonosaViitteet = computed(() => this.state.tutkinnonosaViitteet);

  public async fetch() {
    this.state.tutkinnonosaViitteet = (await Sisaltoviitteet.getTutkinnonosat(this.opetussuunnitelma.id!, _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data;
  }
}
