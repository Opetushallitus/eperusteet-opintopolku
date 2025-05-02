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
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { ViiteLaaja } from '@shared/api/eperusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna, $t } from '@shared/utils/globals';

const props = defineProps<{
  perusteDataStore: PerusteDataStore;
  perusteenOsaStore: PerusteenOsaStore;
}>();

const route = useRoute();

const kuvat = computed(() => {
  return props.perusteDataStore.kuvat;
});

const termit = computed(() => {
  return props.perusteDataStore.termit;
});

const vapaaTekstiId = computed(() => {
  return route.params.vapaatekstiId;
});

const tekstikappaleenOsa = computed(() => {
  return route.params.osa;
});

const osa = computed(() => {
  if (tekstikappaleenOsa.value) {
    return _.get(props.perusteenOsaStore.perusteenOsaViite?.perusteenOsa, tekstikappaleenOsa.value);
  }

  if (vapaaTekstiId.value) {
    return _.find(_.get(props.perusteenOsaStore.perusteenOsaViite?.perusteenOsa, 'vapaatTekstit'), { id: _.toNumber(vapaaTekstiId.value) });
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
