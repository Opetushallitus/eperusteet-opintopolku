import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { PerusteenOsatApi, Laaja, TutkinnonRakenne, TutkinnonOsaViiteDto, Arviointiasteikot, GeneerinenArviointiasteikko } from '@shared/api/eperusteet';

Vue.use(VueCompositionApi);

export class PerusteenTutkinnonosaStore {
  private state = reactive({
    tutkinnonosa: null as any | null,
    tutkinnonosaViite: null as TutkinnonOsaViiteDto | null | undefined,
  })

  constructor(private perusteId: number, private tutkinnonOsaViiteId: number) {
    this.fetch();
  }

  public readonly tutkinnonosa = computed(() => this.state.tutkinnonosa);
  public readonly tutkinnonosaViite = computed(() => this.state.tutkinnonosaViite);

  public async fetch() {
    const tutkinnonOsaViitteet = (await TutkinnonRakenne.getPerusteenTutkinnonOsat(this.perusteId, 'REFORMI')).data;
    this.state.tutkinnonosaViite = _.head(_.filter(tutkinnonOsaViitteet, tutkinnonOsaViite => tutkinnonOsaViite.id === this.tutkinnonOsaViiteId));
    this.state.tutkinnonosa = (await PerusteenOsatApi.getPerusteenOsa(_.toNumber(_.get(this.state.tutkinnonosaViite!, '_tutkinnonOsa')))).data as any;
    this.state.tutkinnonosa = {
      ...this.state.tutkinnonosa,
      geneerinenArviointiasteikko: null,
    };

    const arviointiasteikot = (await Arviointiasteikot.getAll()).data;
    if (this.state.tutkinnonosa.arviointi) {
      this.state.tutkinnonosa.arviointi.arvioinninKohdealueet = _.map(this.state.tutkinnonosa.arviointi.arvioinninKohdealueet, arvKohdealue => {
        return {
          ...arvKohdealue,
          arvioinninKohteet: _.map(arvKohdealue.arvioinninKohteet, arvioinninKohde => {
            const arviointiAsteikko = _.keyBy(arviointiasteikot, 'id')[arvioinninKohde._arviointiAsteikko];
            const osaamistasot = _.keyBy(arviointiAsteikko.osaamistasot, 'id');
            return {
              ...arvioinninKohde,
              osaamistasonKriteerit: _.sortBy(_.map(arvioinninKohde.osaamistasonKriteerit, osaamistasonKriteeri => {
                return {
                  ...osaamistasonKriteeri,
                  osaamistaso: osaamistasot[osaamistasonKriteeri._osaamistaso],
                };
              }), '_osaamistaso'),
            };
          }),
        };
      });
    }

    if (_.get(this.state.tutkinnonosa, '_geneerinenArviointiasteikko')) {
      this.state.tutkinnonosa.geneerinenArviointiasteikko = (await GeneerinenArviointiasteikko.getOneGeneerisetArviointiasteikko(_.get(this.state.tutkinnonosa, '_geneerinenArviointiasteikko'))).data;

      const arviointiAsteikko = _.keyBy(arviointiasteikot, 'id')[_.get(this.state.tutkinnonosa.geneerinenArviointiasteikko, '_arviointiAsteikko')];
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
