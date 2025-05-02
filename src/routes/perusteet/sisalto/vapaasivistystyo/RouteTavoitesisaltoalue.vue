<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4"
      >
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <div class="mb-4">
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
        <hr>
      </div>

      <h3 class="mb-4">
        {{ $t('tavoitteet-ja-keskeiset-sisaltoalueet') }}
      </h3>

      <EpTavoitesisaltoalueTavoitealueet :model-value="perusteenOsa.tavoitealueet" />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpTavoitesisaltoalueTavoitealueet from '@shared/components/EpTavoitesisaltoalue/EpTavoitesisaltoalueTavoitealueet.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { useRoute } from 'vue-router';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.tavoitesisaltoalueId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const perusteenOsaViite = computed(() => {
  return perusteenOsaStore.perusteenOsaViite;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const current = computed(() => {
  return perusteDataStore.current || null;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
