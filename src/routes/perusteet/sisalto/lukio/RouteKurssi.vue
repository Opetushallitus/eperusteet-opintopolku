<template>
  <div class="content">
    <div v-if="kurssi">
      <h2
        class="otsikko"
      >
        {{ $kaanna(kurssi.nimi) }} <span v-if="kurssi.koodiArvo">({{ kurssi.koodiArvo }})</span>
      </h2>

      <ep-content-viewer
        v-if="kurssi.kuvaus"
        :value="$kaanna(kurssi.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <ep-content-viewer
        v-if="kurssi.tyyppi === 'PAKOLLINEN' && oppiaine.pakollinenKurssiKuvaus"
        :value="$kaanna( oppiaine.pakollinenKurssiKuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <ep-content-viewer
        v-if="kurssi.tyyppi === 'VALTAKUNNALLINEN_SYVENTAVA' && oppiaine.syventavaKurssiKuvaus"
        :value="$kaanna( oppiaine.syventavaKurssiKuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <ep-content-viewer
        v-if="kurssi.tyyppi === 'VALTAKUNNALLINEN_SOVELTAVA' && oppiaine.soveltavaKurssiKuvaus"
        :value="$kaanna( oppiaine.soveltavaKurssiKuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <div
        v-if="kurssi.tavoitteet"
        class="mt-4"
      >
        <h3>{{ $kaanna(kurssi.tavoitteet.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(kurssi.tavoitteet.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="kurssi.keskeisetSisallot"
        class="mt-4"
      >
        <h3>{{ $kaanna(kurssi.keskeisetSisallot.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(kurssi.keskeisetSisallot.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="kurssi.tavoitteetJaKeskeisetSisallot"
        class="mt-4"
      >
        <h3>{{ $kaanna(kurssi.tavoitteetJaKeskeisetSisallot.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(kurssi.tavoitteetJaKeskeisetSisallot.teksti)"
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
import { $kaanna } from '@shared/utils/globals';

import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();

const kurssiId = computed(() => {
  return _.toNumber(route.params.kurssiId);
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const kurssi = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: kurssiId.value }) as any;
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
