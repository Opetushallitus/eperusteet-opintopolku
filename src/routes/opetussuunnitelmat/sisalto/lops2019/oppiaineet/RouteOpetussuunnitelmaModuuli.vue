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
          :termit="perusteTermit"
          :kuvat="perusteKuvat"
          :is-peruste-view="false"
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
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import ModuuliEsitys from '@shared/components/EpOpintojaksonModuuli/ModuuliEsitys.vue';
import _ from 'lodash';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  opetussuunnitelmaDataStore: {
    type: Object as () => OpetussuunnitelmaDataStore,
    required: true,
  },
});

const route = useRoute();

const moduuliId = computed(() => {
  return _.toNumber(route.params.moduuliId);
});

const moduuli = computed(() => {
  return props.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: moduuliId.value });
});

const koodi = computed(() => {
  if (moduuli.value) {
    return moduuli.value.koodi;
  }
  return undefined;
});

const perusteTermit = computed(() => {
  return props.opetussuunnitelmaDataStore.perusteTermit;
});

const perusteKuvat = computed(() => {
  return props.opetussuunnitelmaDataStore.perusteKuvat;
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
