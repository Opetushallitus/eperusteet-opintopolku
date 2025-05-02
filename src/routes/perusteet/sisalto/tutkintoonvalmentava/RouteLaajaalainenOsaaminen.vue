<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko"
      >
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <ep-content-viewer
        class="mt-4"
        :value="$kaanna(perusteenOsa.teksti)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.laajaalainenosaaminenId);

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

const tekstikappaleenOsa = computed(() => {
  return route.params.osa;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
