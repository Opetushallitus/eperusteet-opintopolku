<template>
<div class="sidebar">
  <div class="search">
    <ep-search :value="query" @input="setValue" />
  </div>

  <div class="navigation-tree">
      <ep-peruste-sidenav-node v-if="treeData"
                               :node="treeData"
                               :filter="filter" />
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpPerusteSidenavNode from '@/components/EpPerusteSidenav/EpPerusteSidenavNode.vue';

@Component({
  components: {
    EpSearch,
    EpPerusteSidenavNode,
  }
})
export default class EpPerusteSidenav extends Vue {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;
    private query = '';

    private setValue(value) {
      this.query = value;
      this.perusteDataStore.updateFilter({
        isEnabled: !_.isEmpty(value),
        label: value,
      });
    }

    get filter() {
      return this.perusteDataStore.sidenavFilter;
    }

    get treeData() {
      return this.perusteDataStore.sidenav;
    }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.sidebar {
  .search {
    padding: $sidenav-padding;
  }

  .navigation-tree {
    padding: $sidenav-padding;
  }
}
</style>
