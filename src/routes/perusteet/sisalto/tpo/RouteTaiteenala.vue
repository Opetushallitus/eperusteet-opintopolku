<template>
  <router-view
    v-if="taiteenalanOsa"
    v-slot="{ Component }"
  >
    <component
      :is="Component"
      v-if="Component"
    >
      <template #previous-next-navigation>
        <slot name="previous-next-navigation" />
      </template>
    </component>
  </router-view>

  <div
    v-else
    class="content"
  >
    <div v-if="perusteenOsa">
      <h2
        id="taiteenala-otsikko"
        class="otsikko"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <div class="d-flex w-50 justify-content-between">
        <ep-form-content
          v-if="perusteenOsa.koodi"
          class="mt-4"
          name="koodi"
        >
          <span v-html="perusteenOsa.koodi.arvo" />
        </ep-form-content>

        <ep-form-content
          v-if="perusteenOsa.laajuus"
          class="mt-4 ml-5"
          name="laajuus"
        >
          {{ perusteenOsa.laajuus }} {{ $t('opintopiste') }}
        </ep-form-content>
      </div>

      <ep-content-viewer
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
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { $kaanna } from '@shared/utils/globals';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.viiteId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
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

const taiteenalanOsa = computed(() => {
  return route.params.osa || route.params.vapaatekstiId || route.params.taiteenosaId;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: $content-padding;
}
</style>
