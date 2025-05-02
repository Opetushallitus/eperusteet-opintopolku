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
        v-for="(sisaltoavain, index) in sisaltoAvaimet"
        :key="'sisaltoavain'+index"
        class="mt-4"
      >
        <div
          v-if="(oppiaine[sisaltoavain] && oppiaine[sisaltoavain].teksti) || (oppiaine.perusteen[sisaltoavain] && oppiaine.perusteen[sisaltoavain].teksti)"
          class="mt-4"
        >
          <h3>{{ $kaanna((oppiaine[sisaltoavain] && oppiaine[sisaltoavain].otsikko) || oppiaine.perusteen[sisaltoavain].otsikko) }}</h3>

          <EpCollapse
            v-if="oppiaine.perusteen[sisaltoavain]"
            :border-bottom="false"
            :shadow="true"
            class="mb-4"
            :expanded-by-default="!(oppiaine[sisaltoavain] && oppiaine[sisaltoavain].teksti)"
          >
            <template #header>
              <div>
                {{ $t('tukiteksti') }}
              </div>
            </template>
            <ep-content-viewer
              :value="$kaanna(oppiaine.perusteen[sisaltoavain].teksti)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </EpCollapse>

          <ep-content-viewer
            v-if="oppiaine[sisaltoavain] && oppiaine[sisaltoavain].teksti"
            :value="$kaanna(oppiaine[sisaltoavain].teksti)"
            :termit="termit"
            :kuvat="kuvat"
          />
        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { $kaanna, $t } from '@shared/utils/globals';

const route = useRoute();

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const termit = computed(() => {
  return [
    opetussuunnitelmaDataStore.perusteTermit,
    opetussuunnitelmaDataStore.termit,
  ];
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: oppiaineId.value });
});

const kurssiId = computed(() => {
  return _.toNumber(route.params.kurssiId);
});

const sisaltoAvaimet = computed(() => {
  return ['tehtava', 'tavoitteet', 'arviointi'];
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
