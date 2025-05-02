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
          :termit="perusteTermit"
          :kuvat="kuvat"
          :is-peruste-view="false"
          :nav-oppimaarat="oppimaarat"
          :opintojaksot="opintojaksot"
        />
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
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import OppiaineEsitys from '@/routes/perusteet/sisalto/lops2019/oppiaineet/OppiaineEsitys.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  opetussuunnitelmaDataStore: {
    type: Object as () => OpetussuunnitelmaDataStore,
    required: true,
  },
});

const route = useRoute();

const perusteTermit = computed(() => {
  return props.opetussuunnitelmaDataStore.perusteTermit;
});

const kuvat = computed(() => {
  return props.opetussuunnitelmaDataStore.kuvat;
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return props.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: oppiaineId.value });
});

const opintojaksot = computed(() => {
  if (oppiaine.value && oppiaine.value.koodi) {
    return _.filter(props.opetussuunnitelmaDataStore.getJulkaistuSisalto('opintojaksot'), oj => {
      const uri = oppiaine.value!.koodi!.uri;
      return _.some(oj.oppiaineet, { koodi: uri });
    });
  }
  return undefined;
});

const oppimaarat = computed(() => {
  function traverseTree(node, result) {
    (node.children || [])
      .map(child => {
        result.push(child);
        traverseTree(child, result);
        return child;
      });
  }

  if (props.opetussuunnitelmaDataStore.current) {
    const result: NavigationNode[] = [];
    traverseTree(props.opetussuunnitelmaDataStore.current, result);
    return _.filter(result, node => node.type === 'oppiaine' || node.type === 'poppiaine');
  }
  else {
    return [];
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
}
</style>
