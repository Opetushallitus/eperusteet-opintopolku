<template>
  <div class="sidebar">
    <ep-spinner v-if="sidenavLoading" />
    <div v-else>
      <div class="navigation-tree">
        <ep-sidenav-node
          v-if="treeData"
          :node="treeData"
          :current="current"
          :get-children="getChildren"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';

import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSidenavNode from '@/components/EpSidenav/EpSidenavNode.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const sidenavLoading = computed(() => {
  return perusteDataStore.sidenavLoading;
});

const treeData = computed(() => {
  return perusteDataStore.collapsedSidenav;
});

const current = computed(() => {
  return perusteDataStore.current;
});

const getChildren = (node) => {
  const type = node.type;
  const currentValue = current.value;
  const parent = node.path[_.size(node.path) - 2];

  const isCurrentOrParentSelected = (currentValue && (node.key === currentValue.key
      || (parent && parent.key === currentValue.key && currentValue.type !== 'oppiaineet')));
  const isErikoistyyppi = type === 'oppiaineet'
      || type === 'oppiaine'
      || type === 'lukiooppiaineet_2015'
      || type === 'lukiooppimaarat_2015'
      || type === 'lukiokurssit'
      || type === 'oppimaarat'
      || type === 'poppiaine'
      || type === 'moduulit'
      || type === 'moduuli'
      || type === 'kurssit';

  if (isCurrentOrParentSelected && isErikoistyyppi) {
    return node.children;
  }
  else {
    return _.filter(node.children, 'isVisible');
  }
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.sidebar {
  .search {
    padding: $sidenav-padding;
  }

  .navigation-tree {
    padding-top: 15px;
  }
}
@media (max-width: 991.98px) {
  .navigation-tree {
    padding: 15px !important;
  }
}
</style>
