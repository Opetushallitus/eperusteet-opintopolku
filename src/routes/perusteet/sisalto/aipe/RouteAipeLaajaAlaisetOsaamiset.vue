<template>
  <div class="content">
    <div v-if="laajaAlaisetOsaamiset">
      <h2 class="otsikko">
        {{ $t('laaja-alaiset-osaamiset') }}
      </h2>

      <EpCollapse
        v-for="lao in laajaAlaisetOsaamiset"
        :key="'lao' + lao.id"
      >
        <template #header>
          <h3>
            {{ $kaanna(lao.nimi) }}
          </h3>
        </template>
        <div v-html="$kaanna(lao.kuvaus)" />
      </EpCollapse>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import * as _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const laajaAlaisetOsaamiset = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto('aipe.laajaalaisetosaamiset');
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
