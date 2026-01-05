<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 v-if="perusteenOsa.nimi">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <h2 v-else>
        {{ $t('nimeton-todistusmalli') }}
      </h2>

      <ep-content-viewer
        :value="$kaanna(perusteenOsa.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <h3 class="mt-4">
        {{ $t('taitotasokuvaukset') }}
      </h3>

      <hr class="my-4">

      <template
        v-for="(taso, index) in tasot"
        :key="taso.key"
      >
        <EpCollapse
          v-if="perusteenOsa[taso.key] && perusteenOsa[taso.key].taitotasot && perusteenOsa[taso.key].taitotasot.length > 0"
          :border-bottom="false"
          :border-top="false"
          :use-padding="false"
        >
          <template #header>
            <h4>{{ taso.label }}</h4>
          </template>
          <div
            v-for="(taitotaso, taitotasoIndex) in perusteenOsa[taso.key].taitotasot"
            :key="taso.key + '-view-' + taitotasoIndex"
            class="mb-3"
          >
            <h5 class="mb-1">
              {{ $t('taso') }} {{ taitotaso.taitotaso ? $kaanna(taitotaso.taitotaso.nimi) : '' }}
              <span v-if="taitotaso.asteikko"> / {{ $kaanna(taitotaso.asteikko) }} ({{ $t('evkn-asteikko') }})</span>
            </h5>
            <ep-content-viewer
              :value="$kaanna(taitotaso.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </div>

          <hr
            v-if="index < tasot.length - 1"
            class="my-4"
          >
        </EpCollapse>
      </template>

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
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { $t } from '@shared/utils/globals';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kaantajatodistusmalliId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const tasot = [
  {key: 'ylintaso', label: $t('ylin-taso')},
  {key: 'keskitaso', label: $t('keskitaso')},
  {key: 'perustaso', label: $t('perustaso')},
];
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}

</style>

