import { defineStore } from 'pinia';
import { Laaja, ViiteLaaja, Perusteenosat } from '@shared/api/eperusteet';
import * as _ from 'lodash';
import { ref } from 'vue';
import { pinia } from '@/pinia';

export const usePerusteenOsaStore = defineStore('perusteenOsa', () => {
  // State as refs
  const perusteenOsa = ref<Laaja | null>(null);
  const perusteenOsaId = ref<number>(0);
  const perusteenOsaViite = ref<ViiteLaaja | null>(null);

  // Actions
  const create = async (id: number, julkaistuPerusteenOsaViite?: Laaja) => {
    perusteenOsaId.value = id;
    perusteenOsaViite.value = julkaistuPerusteenOsaViite as any;
    perusteenOsa.value = _.get(julkaistuPerusteenOsaViite, 'perusteenOsa') as any;

    return {
      perusteenOsa,
      perusteenOsaId,
      perusteenOsaViite,
    };
  };

  return {
    // State
    perusteenOsa,
    perusteenOsaId,
    perusteenOsaViite,

    // Actions
    create,
  };
});

export function createPerusteOsaStore(perusteDataStore, perusteenOsaId) {
  const store = usePerusteenOsaStore(pinia);
  store.create(
    _.parseInt(perusteenOsaId),
    perusteDataStore.getJulkaistuPerusteSisalto({ id: _.parseInt(perusteenOsaId) }),
  );

  return store;
}
