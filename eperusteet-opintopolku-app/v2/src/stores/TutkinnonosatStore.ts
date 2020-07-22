import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, Perusteet, Sisaltoviitteet, Opetussuunnitelmat } from '@shared/api/amosaa';

Vue.use(VueCompositionApi);

export class TutkinnonosatStore {
  private state = reactive({
    tutkinnonosat: null as any[] | null,
  })

  constructor(private opsId: number) {
    this.fetch();
  }

  public readonly tutkinnonosat = computed(() => this.state.tutkinnonosat);

  public async fetch() {
    const koulutustoimija = (await JulkinenApi.getOpetussuunnitelmanToimija(this.opsId)).data;
    const opetussuunnitelma = (await Opetussuunnitelmat.getOpetussuunnitelma(this.opsId, _.toString(koulutustoimija.id))).data;
    const tutkinnonosaViitteet = (await Sisaltoviitteet.getTutkinnonosat(this.opsId, _.toString(koulutustoimija.id))).data;

    const perusteIds = [
      opetussuunnitelma.peruste!.id!,
      ..._.chain(tutkinnonosaViitteet)
        .filter('peruste')
        .map('peruste.id')
        .uniq()
        .value(),
    ];

    const perusteidenTutkinnonosaViitteet = _.chain(await Promise.all(_.map(perusteIds, (perusteId: number) => Perusteet.getTutkinnonOsaViitteet(perusteId, 'reformi'))))
      .map('data')
      .flatMap()
      .value();

    const perusteenTutkinnonosaViitteet = _.keyBy(perusteidenTutkinnonosaViitteet, '_tutkinnonOsa');

    this.state.tutkinnonosat = _.map(tutkinnonosaViitteet, (tutkinnonosaViite, index) => {
      return {
        jarjestysnro: index + 1,
        tutkinnonosaViite,
        perusteenTutkinnonosaViite: perusteenTutkinnonosaViitteet[tutkinnonosaViite.tosa?.perusteentutkinnonosa!],
      };
    });
  }
}
