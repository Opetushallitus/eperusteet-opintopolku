import Vue, { computed, reactive } from 'vue';
import { Julkinen, TietoaPalvelustaDto } from '@shared/api/eperusteet';
import _ from 'lodash';

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
    try {
      this.state.tietoapalvelusta = (await Julkinen.getTietoaPalvelusta()).data;
    }
    catch (e) {
      this.state.tietoapalvelusta = null;
    }
  }
}
