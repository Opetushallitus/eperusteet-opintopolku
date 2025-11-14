<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <ep-content-viewer
        :value="$kaanna(perusteenOsa.teksti)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <div
        v-for="(alisivu, idx) in alisivut"
        :key="idx"
      >
        <router-link :to="alisivu.location">
          {{ $kaanna(alisivu.label) }}
        </router-link>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { useRoute } from 'vue-router';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.linkkisivuId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const current = computed(() => {
  return perusteDataStore.current || null;
});

const alisivut = computed(() => {
  return current.value?.children;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
