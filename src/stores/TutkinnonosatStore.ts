import  { reactive, computed } from'vue';
import _ from 'lodash';
import { JulkinenApi, Perusteet, Sisaltoviitteet, Opetussuunnitelmat, OpetussuunnitelmaDto, SisaltoViiteKevytDtoTyyppiEnum } from '@shared/api/amosaa';

export class TutkinnonosatStore {
  private state = reactive({
    tutkinnonosat: null as any[] | null,
  });

  constructor(private opetussuunnitelma: OpetussuunnitelmaDto) {
    this.fetch();
  }

  public readonly tutkinnonosat = computed(() => this.state.tutkinnonosat);

  public async fetch() {
    const tutkinnonosaViitteetById = _.keyBy((await Sisaltoviitteet.getTutkinnonosat(this.opetussuunnitelma.id!, _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data, 'id');
    const sisaltoviitteet = (await Sisaltoviitteet.getOtsikot(this.opetussuunnitelma.id!, _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data;
    const tutkinnonosaViitteet = _.chain(sisaltoviitteet)
      .filter(sisaltoviite => sisaltoviite.tyyppi === _.toLower(SisaltoViiteKevytDtoTyyppiEnum.TUTKINNONOSAT))
      .map(tutkinnonosatViite => tutkinnonosatViite.lapset as any)
      .flatMap()
      .map(tutkinnonosaId => tutkinnonosaViitteetById[tutkinnonosaId])
      .value();

    const perusteIds = _.uniq([
      this.opetussuunnitelma.peruste!.id!,
      ..._.chain(tutkinnonosaViitteet)
        .filter('peruste')
        .map('peruste.id')
        .uniq()
        .value(),
    ]);

    const perusteidenTutkinnonosaViitteet = _.chain(await Promise.all(_.map(perusteIds, perusteId => Perusteet.getTutkinnonOsaViitteet(perusteId, this.opetussuunnitelma.suoritustapa!))))
      .map('data')
      .flatMap()
      .value();

    const perusteenTutkinnonosaViitteet = _.keyBy(perusteidenTutkinnonosaViitteet, '_tutkinnonOsa');

    this.state.tutkinnonosat = _.map(tutkinnonosaViitteet, (tutkinnonosaViite, index) => {
      return {
        jarjestysnro: index + 1,
        tutkinnonosaViite,
        perusteenTutkinnonosaViite: tutkinnonosaViite.tosa?.perusteentutkinnonosa ? perusteenTutkinnonosaViitteet[tutkinnonosaViite.tosa.perusteentutkinnonosa] : undefined,
      };
    });
  }
}
