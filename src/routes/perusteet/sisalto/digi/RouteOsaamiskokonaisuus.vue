<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 class="otsikko mb-4">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <ep-content-viewer
        :value="$kaanna(perusteenOsa.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <div
        v-for="(aihekokonaisuus, index) in perusteenOsa.aihekokonaisuudet"
        :key="'aihekokonaisuus'+index"
        class="mt-5"
      >
        <h3>{{ $kaanna(aihekokonaisuus.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(aihekokonaisuus.yleiskuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <EpCollapse :border-bottom="false">
        <template #header>
          <h3
            class="collapse-header"
          >
            {{ $kaanna(perusteenOsa.nimi) }} {{ $t('varhaiskasvatuksessa-ja-esi-ja-perusopetuksessa') }}
          </h3>
        </template>

        <ep-tabs>
          <ep-tab
            v-for="kasitteisto in perusteenOsa.kasitteistot"
            :key="'kasitteisto' + kasitteisto.taso"
            :title="$t(kasitteisto.taso.toLowerCase())"
          >
            <ep-content-viewer
              class="mt-3"
              :value="$kaanna(kasitteisto.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </ep-tab>
        </ep-tabs>
      </EpCollapse>

      <EpCollapse
        v-if="perusteenOsa.keskeinenKasitteisto"
        :border-bottom="false"
      >
        <template #header>
          <h3
            class="collapse-header"
          >
            {{ $t('keskeinen-kasitteisto') }}
          </h3>
        </template>
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.keskeinenKasitteisto)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </EpCollapse>

      <EpCollapse
        :border-bottom="false"
        :collapsable="false"
      >
        <template #header>
          <h3
            class="collapse-header"
          >
            {{ $t('paa-alueet') }}
          </h3>
        </template>
        <div class="row">
          <router-link
            v-for="paaAlue in paaAlueet"
            :key="'paaAlue'+paaAlue.id"
            class="paa-alue col-3"
            :to="{name: 'perusteOsaamiskokonaisuusPaaAlue', params: {osaamiskokonaisuusPaaAlueId: paaAlue.id + ''}}"
          >
            <div class="nimi">
              {{ $kaanna(paaAlue.perusteenOsa.nimi) }}
            </div>
          </router-link>
        </div>
      </EpCollapse>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { useRoute } from 'vue-router';
import EpTabs from '@shared/components/EpTabs/EpTabs.vue';
import EpTab from '@shared/components/EpTabs/EpTab.vue';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.osaamiskokonaisuusId);

const current = computed(() => {
  return perusteDataStore.current || null;
});

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const paaAlueet = computed((): any[] => {
  return _.filter(perusteenOsaStore.perusteenOsaViite?.lapset, lapsi => _.get(lapsi, 'perusteenOsa.osanTyyppi') === 'osaamiskokonaisuus_paa_alue');
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: $content-padding;
}

:deep(.collapse-button) {
  background-color: $digitaalinen-osaaminen-color;
  padding: 0.3rem 0.6rem;
  margin-bottom: 16px;
}

.collapse-header {
  margin: 0;
}

.paa-alue {
  margin: 20px;
  height: 150px;
  background-color: $digitaalinen-osaaminen-paa-alue-color;
  border-radius: 10px;
  background-position: center bottom;
  background-repeat: no-repeat;

  .nimi {
    margin-top: 10px;
    font-weight: 500;
    color: $black;
    overflow-wrap: break-word;
  }

  @include tile-background-shadow;

    &:hover {
      @include tile-background-shadow-selected;
    }
}

</style>
