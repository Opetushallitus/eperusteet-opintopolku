import  { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, Matala, Perusteet, OpetussuunnitelmaDto, Koodistot, Sisaltoviitteet } from '@shared/api/amosaa';

export class SisaltoviiteStore {
  private state = reactive({
    sisaltoviite: null as Matala | null,
    perusteenTutkinnonosa: null as any | null,
    perusteenTutkinnonosaViite: null as any | null,
    kuvat: null as any[] | null,
    fetching: true as boolean,
  });

  constructor(private opetussuunnitelma: OpetussuunnitelmaDto, private sisaltoviiteId: number) {
    this.fetch();
  }

  public readonly sisaltoviite = computed(() => this.state.sisaltoviite);
  public readonly perusteenTutkinnonosa = computed(() => this.state.perusteenTutkinnonosa);
  public readonly perusteenTutkinnonosaViite = computed(() => this.state.perusteenTutkinnonosaViite);
  public readonly fetching = computed(() => this.state.fetching);

  public async fetch() {
    this.state.fetching = true;
    this.state.sisaltoviite = (await JulkinenApi.getOpetussuunnitelmaTekstit(this.opetussuunnitelma.id!, this.sisaltoviiteId, _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data;
    if (this.state.sisaltoviite.tosa && _.size(this.state.sisaltoviite.tosa.toteutukset) > 0) {
      const koodit = _.chain(await Promise.all(
        _.chain(this.state.sisaltoviite.tosa?.toteutukset)
          .map(toteutus => toteutus.koodit)
          .flatten()
          .uniq()
          .map(koodi => Koodistot.getKoodistoKoodiByUri(koodi))
          .value()),
      ).map('data')
        .map(koodi => {
          return {
            ...koodi,
            nimi: _.mapValues(_.keyBy(koodi.metadata, v => _.toLower(v.kieli)), v => v.nimi),
          };
        })
        .keyBy('koodiUri')
        .value();

      this.state.sisaltoviite.tosa.toteutukset = _.map(this.state.sisaltoviite.tosa?.toteutukset, toteutus => {
        return {
          ...toteutus,
          tutkintonimikkeetJaOsaamisalat: _.map(toteutus.koodit, koodi => koodit[koodi]),
        };
      });
    }

    if (this.state.sisaltoviite.tosa?.perusteentutkinnonosa) {
      const perusteId = _.get(this.state.sisaltoviite, 'peruste.id') || _.get(this.opetussuunnitelma, 'peruste.id');

      this.state.perusteenTutkinnonosa = (await Perusteet.getPerusteTutkinnonOsa(perusteId!, this.state.sisaltoviite.tosa?.perusteentutkinnonosa)).data;
      this.state.perusteenTutkinnonosaViite = (await Perusteet.getTutkinnonOsaViite(perusteId!, this.opetussuunnitelma.suoritustapa!, this.state.sisaltoviite.tosa?.perusteentutkinnonosa)).data;
    }

    this.state.fetching = false;
  }
}
