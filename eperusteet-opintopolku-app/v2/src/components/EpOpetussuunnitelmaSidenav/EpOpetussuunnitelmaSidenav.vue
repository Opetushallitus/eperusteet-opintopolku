<template>
<div class="sidebar">
  <ep-spinner v-if="sidenavLoading" />
  <div v-else>
    <div class="search">
      <ep-search :value="query" @input="setValue" />
    </div>
    <div class="navigation-tree">
      <ep-sidenav-node v-if="treeData"
                        :node="treeData"
                        :current="current"
                        :getChildren="getChildren" />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSidenavNode from '@/components/EpSidenav/EpSidenavNode.vue';

@Component({
  components: {
    EpSearch,
    EpSpinner,
    EpSidenavNode,
  },
})
export default class EpOpetussuunnitelmaSidenav extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  private query = '';

  private setValue(value) {
    this.query = value;
    this.opetussuunnitelmaDataStore.updateFilter({
      isEnabled: !_.isEmpty(value),
      label: value,
    });
  }

  getChildren(node) {
    const type = node.type;
    const current = this.current;
    const parent = node.path[_.size(node.path) - 2];

    const isCurrentOrParentSelected = (current && (node.key === current.key
        || (parent && parent.key === current.key && current.type !== 'oppiaineet')));

    const isOppiaineenSisalto
      = node.type === 'opintojaksot'
        || node.type === 'moduulit'
        || node.type === 'lukiokurssit';

    const isErikoistyyppi = type === 'oppiaineet'
        || type === 'oppiaine'
        || type === 'oppimaarat'
        || type === 'moduulit'
        || type === 'moduuli'
        || type === 'opintojaksot'
        || type === 'opintojakso'
        || type === 'lukiooppiaineet_2015'
        || type === 'lukiooppimaarat_2015';

    if ((isCurrentOrParentSelected && isErikoistyyppi) || isOppiaineenSisalto) {
      return node.children;
    }
    else {
      return _.filter(node.children, 'isVisible');
    }
  }

  get sidenavLoading() {
    return this.opetussuunnitelmaDataStore.sidenavLoading;
  }

  get treeData() {
    return this.opetussuunnitelmaDataStore.filteredSidenav;
  }

  get current() {
    return this.opetussuunnitelmaDataStore.current;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.sidebar {
  .search {
    padding: $sidenav-padding;
  }

  .navigation-tree {
    padding: $sidenav-padding;
  }
}

@media (max-width: 991.98px) {
  .navigation-tree {
    padding: 15px !important;
  }
}
</style>
