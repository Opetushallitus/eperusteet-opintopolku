<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 class="otsikko mb-4">
        {{ $kaanna(perusteenOsa.otsikko) }}
      </h2>

      <ep-content-viewer
        :value="$kaanna(perusteenOsa.yleiskuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <div
        v-for="(aihekokonaisuus, index) in perusteenOsa.aihekokonaisuudet"
        :key="'aihekokonaisuus'+index"
        class="mt-5"
      >
        <h3>{{ $kaanna(aihekokonaisuus.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(aihekokonaisuus.yleiskuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { useRoute } from 'vue-router';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.aihekokonaisuudetId);

const current = computed(() => {
  return perusteDataStore.current || null;
});

const perusteenOsa = computed(() => {
  return perusteDataStore.perusteenOsa;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
