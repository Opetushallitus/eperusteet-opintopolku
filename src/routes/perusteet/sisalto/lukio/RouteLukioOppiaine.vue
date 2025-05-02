<template>
  <div class="content">
    <router-view v-if="kurssiId">
      <template #previous-next-navigation>
        <slot name="previous-next-navigation" />
      </template>
    </router-view>

    <div v-else-if="oppiaine">
      <h2 class="otsikko">
        {{ $kaanna(oppiaine.nimi) }} <span v-if="oppiaine.koodiArvo">({{ oppiaine.koodiArvo }})</span>
      </h2>

      <div
        v-if="oppiaine.tehtava"
        class="mt-4"
      >
        <h3>{{ $kaanna(oppiaine.tehtava.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.tehtava.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="oppiaine.tavoitteet"
        class="mt-4"
      >
        <h3>{{ $kaanna(oppiaine.tavoitteet.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.tavoitteet.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="oppiaine.arviointi"
        class="mt-4"
      >
        <h3>{{ $kaanna(oppiaine.arviointi.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.arviointi.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="oppiaine.pakollinenKurssiKuvaus"
        class="mt-4"
      >
        <h3>{{ $t('pakolliset-kurssit') }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.pakollinenKurssiKuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="oppiaine.syventavaKurssiKuvaus"
        class="mt-4"
      >
        <h3>{{ $t('syventavat-kurssit') }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.syventavaKurssiKuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="oppiaine.soveltavaKurssiKuvaus"
        class="mt-4"
      >
        <h3>{{ $t('soveltavat-kurssit') }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaine.soveltavaKurssiKuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { deepFind } from '@shared/utils/helpers';
import * as _ from 'lodash';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { $kaanna, $t } from '@shared/utils/globals';

import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();

const kurssiId = computed(() => {
  return _.toNumber(route.params.kurssiId);
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: oppiaineId.value }) as any;
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

.content {
  padding: 0 $content-padding;
}
</style>
