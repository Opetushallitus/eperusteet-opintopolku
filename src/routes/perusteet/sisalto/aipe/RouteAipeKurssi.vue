<template>
  <div class="content">
    <h2>{{ $kaanna(kurssi.nimi) }}</h2>

    <div
      v-if="kurssi.koodi"
      class="mt-4"
    >
      <h3>{{ $t('koodi') }}</h3>
      <span>{{ kurssi.koodi.arvo }}</span>
    </div>

    <div
      v-if="kurssi.kuvaus"
      class="mt-4"
    >
      <h3>{{ $t('kuvaus') }}</h3>
      <ep-content-viewer
        :value="$kaanna(kurssi.kuvaus)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="tavoitteet && tavoitteet.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('liitetyt-tavoitteet') }}</h3>
      <div
        v-for="tavoite in tavoitteet"
        :key="'tavoite'+tavoite.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        {{ $kaanna(tavoite.tavoite) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

import { getTavoiteNumero } from '@shared/utils/perusteet';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();

const kurssiId = computed(() => {
  return _.toNumber(route.params.kurssiId);
});

const kurssi = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: kurssiId.value });
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: oppiaineId.value });
});

const tavoitteetById = computed(() => {
  if (oppiaine.value) {
    return _.keyBy(oppiaine.value.tavoitteet, 'id');
  }
  return {};
});

const tavoitteet = computed(() => {
  if (kurssi.value) {
    return _.chain(kurssi.value.tavoitteet)
      .map(tavoite => tavoitteetById.value![tavoite as any])
      .sortBy(tavoite => getTavoiteNumero(tavoite.tavoite))
      .value();
  }
  return [];
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
