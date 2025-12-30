<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 v-if="perusteenOsa.nimi">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <h2 v-else>
        {{ $t('nimeton-aihealue') }}
      </h2>

      <div class="mb-4">
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <hr class="my-4">

      <EpCollapse
        v-for="(kategoria, kategoriaIndex) in perusteenOsa.kategoriat"
        :key="'kategoria' + kategoriaIndex"
        :border-bottom="false"
        :border-top="false"
        :use-padding="false"
      >
        <template #header>
          <h3>{{ $kaanna(kategoria.nimi) || $t('nimeton-kategoria') }}</h3>
        </template>

        <div
          v-if="kategoria.kuvaus"
          class="mb-3"
        >
          <ep-content-viewer
            :value="$kaanna(kategoria.kuvaus)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="kategoria.perustaso"
          class="mb-3"
        >
          <h4>{{ $t('perustaso') }}</h4>
          <ep-content-viewer
            :value="$kaanna(kategoria.perustaso)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="kategoria.keskitaso"
          class="mb-3"
        >
          <h4>{{ $t('keskitaso') }}</h4>
          <ep-content-viewer
            :value="$kaanna(kategoria.keskitaso)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="kategoria.ylintaso"
          class="mb-3"
        >
          <h4>{{ $t('ylin-taso') }}</h4>
          <ep-content-viewer
            :value="$kaanna(kategoria.ylintaso)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>

        <hr
          v-if="kategoriaIndex < perusteenOsa.kategoriat.length - 1"
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
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kaantajaaihealueId);

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

