<template>
<div class="sidebar">
  <div class="search">
    <ep-search :value="filter.label" @input="setValue"></ep-search>
  </div>

  <div class="tree">
    <ul class="tree-list">
      <ep-peruste-sidenav-node :node="treeData"
                               :filter="filter"></ep-peruste-sidenav-node>
    </ul>
  </div>

  <!--<pre>{{ treeData }}</pre>-->
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpPerusteSidenavNode from '@/components/EpPerusteSidenav/EpPerusteSidenavNode.vue';
import { buildYksinkertainenNavigation, FilterObj } from './PerusteBuildingMethods';

@Component({
  components: {
    EpSearch,
    EpPerusteSidenavNode,
  }
})
export default class EpPerusteSidenav extends Vue {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;

    private filter: FilterObj = {
      label: '',
      isEnabled: false
    };

    private setValue(value) {
      this.filter.isEnabled = !_.isEmpty(value);
      this.filter.label = value;
    }

    private get treeData() {
      return buildYksinkertainenNavigation(
        this, // Vue instance
        this.perusteDataStore.perusteId!,
        this.perusteDataStore.sisalto!,
        this.filter
      );
    }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.sidebar {
  .search {
    padding: $sidenav-padding;
  }

  ul.tree-list {
    // Remove default list styles
    list-style: none;
    padding: $sidenav-padding;
  }
}
</style>
