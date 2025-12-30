<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 v-if="perusteenOsa.nimi">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <h2 v-else>
        {{ $t('nimeton-taitotasokuvaus') }}
      </h2>

      <ep-content-viewer
        :value="$kaanna(perusteenOsa.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <hr
        v-if="perusteenOsa.kuvaus"
        class="my-4"
      >

      <EpCollapse
        v-for="(tutkintotaso, tutkintotasoIndex) in perusteenOsa.tutkintotasot"
        :key="'tutkintotaso' + tutkintotasoIndex"
        :border-bottom="false"
        :border-top="false"
        :use-padding="false"
      >
        <template #header>
          <h3>{{ $kaanna(tutkintotaso.nimi) || $t('nimeton-tutkintotaso') }}</h3>
        </template>

        <div
          v-for="(osa, osaIndex) in tutkintotaso.osat"
          :key="'osa' + osaIndex"
          class="mb-4"
        >
          <h4 class="mb-2">
            {{ $kaanna(osa.suorituksenOsa.nimi) }}
          </h4>

          <div
            v-for="(taitotaso, taitotasoIndex) in osa.taitotasot"
            :key="'taitotaso' + taitotasoIndex"
            class="mb-2"
          >
            <div class="mb-1">
              {{ $t('taso') }} {{ $kaanna(taitotaso.taitotaso.nimi) }}
            </div>
            <ep-content-viewer
              :value="$kaanna(taitotaso.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </div>
        </div>

        <hr
          v-if="tutkintotasoIndex < perusteenOsa.tutkintotasot.length - 1"
          class="my-4"
        >
      </EpCollapse>

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

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kaantajataitotasokuvausId);

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

