<template>
  <div class="content">
    <div v-if="moduuli">
      <h2
        class="otsikko"
      >
        {{ $kaanna(moduuli.nimi) + (koodi ? ' (' + koodi.arvo + ')' : '') }}
      </h2>

      <div class="teksti">
        <moduuli-esitys
          :moduuli="moduuli"
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
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import ModuuliEsitys from '@shared/components/EpOpintojaksonModuuli/ModuuliEsitys.vue';
import * as _ from 'lodash';

const props = defineProps<{
  perusteDataStore: PerusteDataStore;
}>();

const route = useRoute();

const moduuliId = computed(() => {
  return _.toNumber(route.params.moduuliId);
});

const moduuli = computed(() => {
  return props.perusteDataStore.getJulkaistuPerusteSisalto({ id: moduuliId.value }) as any;
});

const termit = computed(() => {
  return props.perusteDataStore.termit;
});

const kuvat = computed(() => {
  return props.perusteDataStore.kuvat;
});

const koodi = computed(() => {
  if (moduuli.value) {
    return moduuli.value.koodi;
  }
  return undefined;
});
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
