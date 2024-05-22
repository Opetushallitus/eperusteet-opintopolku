import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { Julkinen, TietoaPalvelustaDto } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class TietoapalvelustaStore {
  public state = reactive({
    tietoapalvelusta: null as TietoaPalvelustaDto | null,
  });

  public readonly tietoapalvelusta = computed(() => {
    if (!this.state.tietoapalvelusta) {
      return null;
    }

    return {
      name: 'tietoa-palvelusta',
      linkText: 'tutustu-palveluun',
      translatedText: this.state.tietoapalvelusta.tietoapalvelustaKuvaus,
      route: {
        name: 'peruste',
        params: {
          koulutustyyppi: 'opas',
          perusteId: _.toString(this.state.tietoapalvelusta.id),
        },
      },
    };
  });

  public async fetch() {
    this.state.tietoapalvelusta = (await Julkinen.getTietoaPalvelusta()).data;
  }
}
