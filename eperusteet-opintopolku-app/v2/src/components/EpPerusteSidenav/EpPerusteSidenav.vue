<template>
  <div class="sidebar">

    <ep-spinner v-if="sidenavLoading" />
    <div v-else>
      <div class="search">
        <div class="d-flex justify-content-between align-items-center">
          <ep-search :value="query" @input="setValue" class="w-100"/>
          <NavigateNumberToggle v-model="numerointi" />
        </div>

        <slot name="after"></slot>
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
import { Component, Prop, ProvideReactive, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSidenavNode from '@/components/EpSidenav/EpSidenavNode.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import NavigateNumberToggle from '@/components/EpSidenav/NavigateNumberToggle.vue';

@Component({
  components: {
    EpSearch,
    EpSpinner,
    EpSidenavNode,
    EpToggle,
    NavigateNumberToggle,
  },
})
export default class EpPerusteSidenav extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ default: '' })
  private query!: string;

  @ProvideReactive()
  private numerointi: boolean = false;

  private setValue(value) {
    this.query = value;
    this.perusteDataStore.updateFilter({
      isEnabled: !_.isEmpty(value),
      label: value,
    });
    this.$emit('search-update', value);
  }

  getChildren(node) {
    const type = node.type;
    const current = this.current;
    const parent = node.path[_.size(node.path) - 2];

    const isCurrentOrParentSelected = (current && (node.key === current.key
        || (parent && parent.key === current.key && current.type !== 'oppiaineet')));
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
  }

  get sidenavLoading() {
    return this.perusteDataStore.sidenavLoading;
  }

  get treeData() {
    return this.perusteDataStore.filteredSidenav;
  }

  get current() {
    return this.perusteDataStore.current;
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
