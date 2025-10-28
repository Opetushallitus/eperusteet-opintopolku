<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 v-if="perusteenOsa.nimi">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <h2 v-else>
        {{ $t('nimeton-taitotasoasteikko') }}
      </h2>

      <div
        v-if="perusteenOsa.kuvaus"
        class="mb-4"
      >
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <hr v-if="perusteenOsa.kuvaus">

      <EpCollapse
        v-for="(kategoria, kategoriaIndex) in perusteenOsa.taitotasoasteikkoKategoriat"
        :key="'kategoria' + kategoriaIndex"
        :use-padding="false"
        :border-bottom="kategoriaIndex < perusteenOsa.taitotasoasteikkoKategoriat.length - 1"
        :class="{'mt-4': kategoriaIndex === 0}"
      >
        <template #header>
          <h3 class="collapse-header">
            {{ $kaanna(kategoria.otsikko) || $t('nimeton-kategoria') }}
          </h3>
        </template>
        <template #default>
          <div
            v-for="(taitotaso, taitotasoIndex) in kategoria.taitotasoasteikkoKategoriaTaitotasot"
            :key="'taitotaso' + taitotasoIndex"
            class="mb-4"
          >
            <h4>{{ $kaanna(taitotaso.otsikko) || $t('nimeton-taitotaso') }}</h4>
            <ep-content-viewer
              :value="$kaanna(taitotaso.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </div>
        </template>
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
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kaantajataitotasoasteikkoId);

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

:deep(.collapse-button) {
  margin-bottom: 16px;
}

.collapse-header {
  margin: 0;
}

</style>

