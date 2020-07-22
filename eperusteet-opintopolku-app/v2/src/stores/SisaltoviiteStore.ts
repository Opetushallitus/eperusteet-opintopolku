import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, Matala, Perusteet, Opetussuunnitelmat, baseURL, LiitetiedostotParam, Arviointiasteikot, ArviointiasteikkoDto, Koodistot } from '@shared/api/amosaa';
import { faThemeisle } from '@fortawesome/free-brands-svg-icons';
import { KoodistoApi } from '@shared/generated/eperusteet';
import { metadataToLocalized } from '@shared/utils/perusteet';

Vue.use(VueCompositionApi);

export class SisaltoviiteStore {
  private state = reactive({
    sisaltoviite: null as Matala | null,
    perusteenTutkinnonosa: null as any | null,
    perusteenTutkinnonosaViite: null as any | null,
    kuvat: null as any[] | null,
    arviointiasteikot: null as ArviointiasteikkoDto[] | null,
  })

  constructor(private opsId: number, private sisaltoviiteId: number) {
    this.fetch();
  }

  public readonly sisaltoviite = computed(() => this.state.sisaltoviite);
  public readonly perusteenTutkinnonosa = computed(() => this.state.perusteenTutkinnonosa);
  public readonly perusteenTutkinnonosaViite = computed(() => this.state.perusteenTutkinnonosaViite);
  public readonly kuvat = computed(() => this.state.kuvat);
  public readonly arviointiasteikot = computed(() => this.state.arviointiasteikot);

  public async fetch() {
    const koulutustoimija = (await JulkinenApi.getOpetussuunnitelmanToimija(this.opsId)).data;
    const opetussuunnitelma = (await JulkinenApi.getOpetussuunnitelmaJulkinen(this.opsId, _.toString(koulutustoimija.id))).data;
    this.state.arviointiasteikot = (await Arviointiasteikot.getAllArviointiasteikot()).data;

    this.state.kuvat = _.map(opetussuunnitelma.liitteet, liite => ({
      id: liite.id!,
      src: baseURL + LiitetiedostotParam.getImage(this.opsId, liite.id!).url,
    }));

    this.state.sisaltoviite = (await JulkinenApi.getOpetussuunnitelmaTekstit(this.opsId, this.sisaltoviiteId, _.toString(koulutustoimija.id))).data;
    if (this.state.sisaltoviite.tosa && _.size(this.state.sisaltoviite.tosa.toteutukset) > 0) {
      const koodit = _.chain(await Promise.all(
        _.chain(this.state.sisaltoviite.tosa?.toteutukset)
          .map(toteutus => toteutus.koodit)
          .flatten()
          .uniq()
          .map(koodi => Koodistot.getKoodistoKoodiByUri(koodi))
          .value())
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
      const perusteId = _.get(this.state.sisaltoviite, 'peruste.id') || _.get(opetussuunnitelma, 'peruste.id');

      this.state.perusteenTutkinnonosa = (await Perusteet.getPerusteTutkinnonOsa(perusteId, this.state.sisaltoviite.tosa?.perusteentutkinnonosa)).data;
      this.state.perusteenTutkinnonosaViite = (await Perusteet.getTutkinnonOsaViite(perusteId, 'reformi', this.state.sisaltoviite.tosa?.perusteentutkinnonosa)).data;
    }
  }
}
