<template>
  <div
    v-if="osa"
    class="content"
  >
    <h2 v-if="osa.nimi">
      {{ $kaanna(osa.nimi) }}
    </h2>
    <h2 v-else>
      {{ $t(tekstikappaleenOsa) }}
    </h2>

    <ep-content-viewer
      :value="$kaanna(osa.teksti)"
      :termit="termit"
      :kuvat="kuvat"
    />

    <slot name="previous-next-navigation" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const route = useRoute();
const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.viiteId);

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const vapaaTekstiId = computed(() => {
  return route.params.vapaatekstiId;
});

const tekstikappaleenOsa = computed(() => {
  return route.params.osa;
});

const osa = computed(() => {
  if (tekstikappaleenOsa.value) {
    return _.get(perusteenOsaStore.perusteenOsaViite?.perusteenOsa, tekstikappaleenOsa.value);
  }

  if (vapaaTekstiId.value) {
    return _.find(_.get(perusteenOsaStore.perusteenOsaViite?.perusteenOsa, 'vapaatTekstit'), { id: _.toNumber(vapaaTekstiId.value) });
  }

  return undefined;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
