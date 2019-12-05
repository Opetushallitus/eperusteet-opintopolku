<template>
<div class="sidebar">
  <ep-spinner v-if="sidenavLoading" />
  <div v-else>
    <div class="search">
      <ep-search :value="query" @input="setValue" />
    </div>
    <div class="navigation-tree">
      <ep-opetussuunnitelma-sidenav-node v-if="treeData"
                               :node="treeData"
                               :current="current" />
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
import EpOpetussuunnitelmaSidenavNode from '@/components/EpOpetussuunnitelmaSidenav/EpOpetussuunnitelmaSidenavNode.vue';

@Component({
  components: {
    EpSearch,
    EpOpetussuunnitelmaSidenavNode,
    EpSpinner,
  }
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
