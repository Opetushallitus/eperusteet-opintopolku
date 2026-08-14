<template>
  <div
    v-if="taiteenosa"
    class="content"
  >
    <h2
      id="taiteenosa-otsikko"
      class="otsikko"
    >
      <span v-if="numerointi">{{ numerointi }}</span>
      {{ $kaanna(taiteenosa.nimi) }}
    </h2>

    <ep-form-content
      v-if="taiteenosa.laajuus"
      class="mt-4"
      name="laajuus"
    >
      {{ taiteenosa.laajuus }} {{ $t('opintopiste') }}
    </ep-form-content>

    <ep-content-viewer
      v-if="taiteenosa.kuvaus"
      class="mt-4"
      :value="$kaanna(taiteenosa.kuvaus.teksti)"
      :termit="termit"
      :kuvat="kuvat"
    />

    <template v-if="taiteenosa.tavoitteet && taiteenosa.tavoitteet.length > 0">
      <h3 class="mt-4 mb-3">
        {{ $t('tavoitteet') }}
      </h3>
      <ul>
        <li
          v-for="(tavoite, index) in taiteenosa.tavoitteet"
          :key="'tavoite' + index"
        >
          {{ $kaanna(tavoite) }}
        </li>
      </ul>
    </template>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</template>

<script setup lang="ts">
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { $kaanna } from '@shared/utils/globals';
import * as _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.viiteId);

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

const taiteenosa = computed(() => {
  return _.find(
    _.get(perusteenOsaStore.perusteenOsaViite?.perusteenOsa, 'taiteenOsat'),
    { id: _.toNumber(route.params.taiteenosaId) },
  );
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
