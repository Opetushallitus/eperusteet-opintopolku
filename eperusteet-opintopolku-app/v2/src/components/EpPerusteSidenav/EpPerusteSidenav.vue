<template>
<div class="sidebar">
  <div class="search">
    <ep-search></ep-search>
  </div>

  <div class="tree">
    <ul class="tree-list">
      <ep-peruste-sidenav-node :node="treeData"></ep-peruste-sidenav-node>
    </ul>
  </div>
  
  <pre>{{ treeData }}</pre>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpPerusteSidenavNode from '@/components/EpPerusteSidenav/EpPerusteSidenavNode.vue';
import { yksinkertainenLinkit } from './PerusteBuildingMethods';

@Component({
  components: {
    EpSearch,
    EpPerusteSidenavNode,
  }
})
export default class EpPerusteSidenav extends Vue {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;

    private rootDepth = 0;

    private get treeData() {
      return yksinkertainenLinkit(this.perusteDataStore.perusteId!, this.perusteDataStore.sisalto!);
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
