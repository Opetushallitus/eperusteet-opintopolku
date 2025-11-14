<template>
  <div class="content">
    <div v-if="oppiaine">
      <h2
        class="otsikko"
      >
        {{ $kaanna(oppiaine.nimi) }}
      </h2>

      <div class="teksti">
        <oppiaine-esitys
          :oppiaine="oppiaine"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <EpOpasKiinnitysLinkki :koodi-uri="oppiaineKoodiUri" />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import OppiaineEsitys from './OppiaineEsitys.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import * as _ from 'lodash';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();
const route = useRoute();

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: oppiaineId.value }) as any;
});

const oppiaineKoodiUri = computed(() => {
  return oppiaine.value?.koodi?.uri;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
