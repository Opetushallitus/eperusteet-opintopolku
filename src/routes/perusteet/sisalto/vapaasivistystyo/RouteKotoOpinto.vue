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

      <div class="mb-4">
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
        <hr>
      </div>

      <EpKotoTaitotasot
        :model-value="perusteenOsa.taitotasot"
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
import _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpKotoTaitotasot from '@shared/components/EpKotoTaitotasot/EpKotoTaitotasot.vue';
import { $kaanna } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { useRoute } from 'vue-router';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kotoOpintoId);

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
