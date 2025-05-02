import { defineStore } from 'pinia';
import { JulkiEtusivuDto, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import _ from 'lodash';
import { AmmatillisetKoulutustyypit, EperusteetKoulutustyypit } from '@shared/utils/perusteet';
import { DEFAULT_PUBLIC_WAIT_TIME_MS } from '@shared/utils/delay';
import {
  julkaistutOpsitJaPerusteet,
  julkaistutPerusteet,
  JulkaistutPerusteetQuery,
  JulkiEtusivuQuery,
} from '@/api/eperusteet';
import { Page } from '@shared/tyypit';
import { ref } from 'vue';
import { debounce } from 'lodash';

export const usePerusteStore = defineStore('peruste', () => {
  // State as refs
  const perusteet = ref<PerusteenJulkaisuData[] | null>(null);
  const query = ref<JulkaistutPerusteetQuery | undefined>(undefined);
  const opsitJaPerusteet = ref<Page<JulkiEtusivuDto> | null>(null);
  const julkiQuery = ref<JulkiEtusivuQuery | undefined>(undefined);

  // Actions
  const getYleisetPerusteet = debounce(async (queryParams?: JulkaistutPerusteetQuery) => {
    query.value = queryParams;
    perusteet.value = null;
    perusteet.value = ((await julkaistutPerusteet(
      {
        sivu: 0,
        sivukoko: 999,
        tuleva: true,
        siirtyma: true,
        voimassaolo: true,
        poistunut: false,
        koulutustyyppi: _.filter(EperusteetKoulutustyypit, kt => !_.includes(AmmatillisetKoulutustyypit, kt)),
        kieli: queryParams?.kieli,
        ...(queryParams || {}),
      },
    )).data as any);
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  const getOpsitJaPerusteet = debounce(async (queryParams: JulkiEtusivuQuery) => {
    julkiQuery.value = queryParams;
    opsitJaPerusteet.value = (await julkaistutOpsitJaPerusteet(julkiQuery.value));
  }, DEFAULT_PUBLIC_WAIT_TIME_MS);

  const clearOpsitJaPerusteet = () => {
    opsitJaPerusteet.value = null;
  };

  return {
    perusteet,
    query,
    opsitJaPerusteet,
    julkiQuery,
    getYleisetPerusteet,
    getOpsitJaPerusteet,
    clearOpsitJaPerusteet,
  };
});
