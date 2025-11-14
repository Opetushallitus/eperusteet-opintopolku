import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Julkinen, TietoaPalvelustaDto } from '@shared/api/eperusteet';
import _ from 'lodash';

export const useTietoapalvelustaStore = defineStore('tietoapalvelusta', () => {
  // State as refs
  const tietoapalvelustaData = ref<TietoaPalvelustaDto | null>(null);

  // Getters as computed properties
  const tietoapalvelusta = computed(() => {
    if (!tietoapalvelustaData.value) {
      return null;
    }

    return {
      name: 'tietoa-palvelusta',
      linkText: 'tutustu-palveluun',
      translatedText: tietoapalvelustaData.value.tietoapalvelustaKuvaus,
      route: {
        name: 'peruste',
        params: {
          koulutustyyppi: 'opas',
          perusteId: _.toString(tietoapalvelustaData.value.id),
        },
      },
    };
  });

  // Actions as functions
  async function fetch() {
    try {
      tietoapalvelustaData.value = (await Julkinen.getTietoaPalvelusta()).data;
    }
    catch (e) {
      tietoapalvelustaData.value = null;
    }
  }

  return {
    // State
    tietoapalvelustaData,

    // Getters
    tietoapalvelusta,

    // Actions
    fetch,
  };
});
