<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 v-if="perusteenOsa.nimi">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <h2 v-else>
        {{ $t('nimeton-kielitaito') }}
      </h2>

      <ep-content-viewer
        class="mb-4"
        :value="$kaanna(perusteenOsa.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <div
        v-for="(taitotaso, taitotasoIndex) in perusteenOsa.taitotasot"
        :key="'taitotaso' + taitotasoIndex"
        class="mt-4"
      >
        <div class="mb-2">
          <h3>{{ $t('taso') }} {{ $kaanna(taitotaso.taitotaso.nimi) }}</h3>
        </div>
        <div v-if="taitotaso.kuvaus">
          <ep-content-viewer
            :value="$kaanna(taitotaso.kuvaus)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kaantajakielitaitoId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
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
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}

</style>

