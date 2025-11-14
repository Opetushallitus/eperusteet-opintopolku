<template>
  <div class="content">
    <div v-if="laajaAlaisetKokonaisuus">
      <h2
        class="otsikko"
      >
        {{ $t('laaja-alaisen-osaamisen-osa-alueet') }}
      </h2>
      <div>
        <div
          v-if="hasLaajaAlaiset"
          class="laaja-alaiset"
        >
          <div
            v-for="(laajaAlainen, idx) in laajaAlaiset"
            :id="getLaajaAlainenIdBykoodi(laajaAlainen)"
            :key="idx"
          >
            <h3 class="otsikko">
              {{ $kaanna(laajaAlainen.nimi) }}
            </h3>
            <div v-if="laajaAlainen.koodi">
              <strong>{{ $t('koodi') }}</strong>
              <p>{{ laajaAlainen.koodi.arvo }}</p>
            </div>
            <ep-content-viewer
              :value="$kaanna(laajaAlainen.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </div>
        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onUpdated, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import VueScrollTo from 'vue-scrollto';
import { getLaajaAlainenId } from '@shared/utils/NavigationBuilder';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna, $t } from '@shared/utils/globals';

import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();

const laajaAlaisetKokonaisuus = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto('lops2019.laajaAlainenOsaaminen');
});

const laajaAlaiset = computed(() => {
  return _.get(laajaAlaisetKokonaisuus.value, 'laajaAlaisetOsaamiset');
});

const hasLaajaAlaiset = computed(() => {
  return !_.isEmpty(laajaAlaiset.value);
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

onUpdated(() => {
  // Odotetaan myös alikomponenttien päivittymistä
  nextTick(() => {
    if (route && route.hash && laajaAlaisetKokonaisuus.value) {
      VueScrollTo.scrollTo(route.hash);
    }
  });
});

function getLaajaAlainenIdBykoodi(laajaAlainen: any) {
  const koodiUri = _.get(laajaAlainen, 'koodi.uri');
  _.set(laajaAlainen, 'meta.koodi.uri', koodiUri);
  return getLaajaAlainenId(laajaAlainen);
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
