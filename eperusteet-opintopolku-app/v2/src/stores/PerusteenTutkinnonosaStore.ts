import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { PerusteenOsatApi, Laaja, TutkinnonRakenne, TutkinnonOsaViiteDto, Arviointiasteikot, GeneerinenArviointiasteikko, ArviointiAsteikkoDto, PerusteDto } from '@shared/api/eperusteet';
import { perusteenSuoritustapa } from '@shared/utils/perusteet';

Vue.use(VueCompositionApi);

export class PerusteenTutkinnonosaStore {
  private state = reactive({
    tutkinnonosa: null as any | null,
    tutkinnonosaViite: null as TutkinnonOsaViiteDto | null | undefined,
    arviointiasteikot: null as ArviointiAsteikkoDto[] | null,
  })

  constructor(private peruste: PerusteDto, private tutkinnonOsaViiteId: number) {
    this.fetch();
  }

  public readonly tutkinnonosa = computed(() => this.state.tutkinnonosa);
  public readonly tutkinnonosaViite = computed(() => this.state.tutkinnonosaViite);
  public readonly arviointiasteikot = computed(() => this.state.arviointiasteikot);

  public async fetch() {
    this.state.arviointiasteikot = (await Arviointiasteikot.getAll()).data;
    const tutkinnonOsaViitteet = _.flatMap(await Promise.all(_.map(this.peruste.suoritustavat, async (suoritustapa) => {
      return (await TutkinnonRakenne.getPerusteenTutkinnonOsat(this.peruste.id!, suoritustapa.suoritustapakoodi!)).data;
    })));
    this.state.tutkinnonosaViite = _.head(_.filter(tutkinnonOsaViitteet, tutkinnonOsaViite => tutkinnonOsaViite.id === this.tutkinnonOsaViiteId));
    this.state.tutkinnonosa = (await PerusteenOsatApi.getPerusteenOsa(_.toNumber(_.get(this.state.tutkinnonosaViite!, '_tutkinnonOsa')))).data as any;
    this.state.tutkinnonosa = {
      ...this.state.tutkinnonosa,
      geneerinenArviointiasteikko: null,
      osaAlueet: await Promise.all(_.map(this.state.tutkinnonosa.osaAlueet, async (osaAlue) => {
        return {
          ...osaAlue,
          osaamistavoitteet: (await PerusteenOsatApi.getOsaamistavoitteet(this.state.tutkinnonosa.id, osaAlue.id)).data,
        };
      })),
    };

    if (_.get(this.state.tutkinnonosa, '_geneerinenArviointiasteikko')) {
      this.state.tutkinnonosa.geneerinenArviointiasteikko = (await GeneerinenArviointiasteikko.getOneGeneerisetArviointiasteikko(_.get(this.state.tutkinnonosa, '_geneerinenArviointiasteikko'))).data;

      const arviointiAsteikko = _.keyBy(this.state.arviointiasteikot, 'id')[_.get(this.state.tutkinnonosa.geneerinenArviointiasteikko, '_arviointiAsteikko')];
      const osaamistasot = _.keyBy(arviointiAsteikko.osaamistasot, 'id');
      this.state.tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit = _.map(this.state.tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit, otKriteeri => {
        return {
          ...otKriteeri,
          osaamistaso: osaamistasot[_.get(otKriteeri, '_osaamistaso')],
        };
      });
    }
  }
}
