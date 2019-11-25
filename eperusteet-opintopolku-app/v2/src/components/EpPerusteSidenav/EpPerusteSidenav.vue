<template>
  <div class="sidebar">
    <ep-spinner v-if="sidenavLoading" />
      <div v-else>
        <div class="search">
          <ep-search :value="query" @input="setValue" />
        </div>
        <div class="navigation-tree">
          <ep-peruste-sidenav-node v-if="treeData"
                                   :node="treeData"
                                   :current="current" />
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPerusteSidenavNode from '@/components/EpPerusteSidenav/EpPerusteSidenavNode.vue';

@Component({
  components: {
    EpSearch,
    EpPerusteSidenavNode,
    EpSpinner,
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
