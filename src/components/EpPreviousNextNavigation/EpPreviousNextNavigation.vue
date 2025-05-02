<template>
  <div
    v-if="previous || next"
    class="d-flex flex-lg-row justify-content-between mt-5"
  >
    <b-link
      v-if="previous && previous.location"
      :to="previous.location"
      class="pb-3"
    >
      <div class="d-flex align-items-center">
        <EpMaterialIcon>arrow_back</EpMaterialIcon>
        <span class="mx-2">{{ $kaannaOlioTaiTeksti(previous.label) }}</span>
      </div>
    </b-link>

    <b-link
      v-if="next && next.location"
      :to="next.location"
      class="ml-auto pb-3"
    >
      <div class="d-flex align-items-center">
        <span class="next mx-2">{{ $kaannaOlioTaiTeksti(next.label) }}</span>
        <EpMaterialIcon>arrow_forward</EpMaterialIcon>
      </div>
    </b-link>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $kaannaOlioTaiTeksti } from '@shared/utils/globals';

const props = defineProps({
  activeNode: {
    type: Object as () => NavigationNode,
    required: true,
  },
  flattenedSidenav: {
    type: Array as () => Array<NavigationNode>,
    required: true,
  },
});

const filteredFlattenedSidenav = computed((): Array<NavigationNode> => {
  return _.filter(props.flattenedSidenav, node => node.location) as Array<NavigationNode>;
});

const activeIdx = computed((): number => {
  if (filteredFlattenedSidenav.value && props.activeNode) {
    return _.findIndex(filteredFlattenedSidenav.value, { key: props.activeNode.key });
  }
  return -1;
});

const previous = computed((): NavigationNode | null => {
  if (props.activeNode
      && (props.activeNode.type === 'viite' || props.activeNode.type === 'laajaalaiset')
      && _.size(props.activeNode.path) === 2
  ) {
    // Jos päätason node, otetaan edellinen samalta tasolta
    const rootChildren = props.activeNode.path[0].children;
    const idx = _.findIndex(rootChildren, { key: props.activeNode.key });
    return rootChildren[idx - 1];
  }
  else if (activeIdx.value >= 0 && filteredFlattenedSidenav.value) {
    return filteredFlattenedSidenav.value[activeIdx.value - 1] || null;
  }
  return null;
});

const next = computed((): NavigationNode | null => {
  if (props.activeNode
      && (props.activeNode.type === 'viite' || props.activeNode.type === 'laajaalaiset')
      && _.size(props.activeNode.path) === 2
  ) {
    // Jos päätason node, otetaan seuraava samalta tasolta
    const rootChildren = props.activeNode.path[0].children;
    const idx = _.findIndex(rootChildren, { key: props.activeNode.key });
    return rootChildren[idx + 1];
  }
  else if (activeIdx.value >= 0 && filteredFlattenedSidenav.value) {
    return filteredFlattenedSidenav.value[activeIdx.value + 1] || null;
  }
  return null;
});
</script>

<style scoped lang="scss">
.next {
  text-align: end;
}
</style>
