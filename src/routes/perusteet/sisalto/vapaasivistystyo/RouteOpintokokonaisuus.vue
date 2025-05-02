<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <div class="row">
        <div class="col-lg-6 col-md-12 mb-4">
          <h3>{{ $t('osaamiskokonaisuuden-nimi') }}</h3>
          <div>{{ $kaanna(perusteenOsa.nimi) }}</div>
        </div>
        <div class="col-lg-6 col-md-12 mb-4">
          <h3>{{ $t('laajuus') }}</h3>
          <div>{{ perusteenOsa.minimilaajuus }}</div>
        </div>
      </div>

      <div class="mb-4">
        <h3>{{ $t('kuvaus') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />

        <hr>
      </div>

      <div class="mb-4">
        <h3>{{ $t('opetuksen-tavoitteet') }}</h3>
        <strong>{{ $kaanna(perusteenOsa.opetuksenTavoiteOtsikko) }}</strong>
        <ul>
          <li
            v-for="(tavoite, index) in perusteenOsa.opetuksenTavoitteet"
            :key="'tavoite'+index"
          >
            {{ $kaanna(tavoite.nimi) }}
          </li>
        </ul>
        <hr>
      </div>

      <div>
        <h3>{{ $t('arviointi') }}</h3>
        <strong>{{ $t('opetuksen-osaamisen-arvioinnin-kohteet') }}</strong>
        <ul>
          <li
            v-for="(arviointi, index) in perusteenOsa.arvioinnit"
            :key="'arviointi'+index"
          >
            {{ $kaanna(arviointi) }}
          </li>
        </ul>
      </div>

      <EpOpasKiinnitysLinkki :koodi-uri="osaamiskokonaisuusKoodiUri" />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { useRoute } from 'vue-router';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.opintokokonaisuusId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const perusteenOsaViite = computed(() => {
  return perusteenOsaStore.perusteenOsaViite;
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

const osaamiskokonaisuusKoodiUri = computed(() => {
  return (perusteenOsa.value as any)?.nimiKoodi.uri;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
