<template>
  <div>
    <span v-if="numerointi">{{ numerointi }} </span>
    {{ $kaannaOlioTaiTeksti(node.label) }}
    <span
      v-if="koodi"
      class="code-field"
    >({{ koodi }})</span>
  </div>
</template>

<script setup lang="ts">
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import * as _ from 'lodash';
import { computed } from 'vue';

const props = defineProps({
  node: {
    type: Object as () => NavigationNode,
    required: true,
  },
});

const koodi = computed(() => {
  return _.get(props.node, 'meta.koodi.arvo') || _.get(props.node, 'meta.koodi');
});

const numerointi = computed(() => {
  return _.get(props.node, 'meta.numerointi');
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
