<template>
<div class="sidebar">
  <ep-spinner v-if="sidenavLoading" />
  <div v-else>
    <div class="search">
      <ep-search
        :value="query"
        @input="setValue"
        :placeholder="$t('hae-sisallysluettelosta')"
        :srOnlyLabelText="$t('hae-suunnitelman-sisallysluettelosta')"/>
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
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSidenavNode from '@/components/EpSidenav/EpSidenavNode.vue';
import { Kielet } from '@shared/stores/kieli';
import { IOpetussuunnitelmaStore } from '@/stores/IOpetussuunitelmaStore';

@Component({
  components: {
    EpSearch,
    EpSpinner,
    EpSidenavNode,
  },
})
export default class EpOpetussuunnitelmaSidenav extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: IOpetussuunnitelmaStore;

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
        || node.type === 'lukiokurssit'
        || node.type === 'tutkinnonosat_paikalliset';

    const isErikoistyyppi = type === 'oppiaineet'
        || type === 'oppiaine'
        || type === 'oppimaarat'
        || type === 'moduulit'
        || type === 'moduuli'
        || type === 'opintojaksot'
        || type === 'opintojakso'
        || type === 'lukiooppiaineet_2015'
        || type === 'lukiooppimaarat_2015'
        || type === 'pakolliset_osaalueet'
        || type === 'valinnaiset_osaalueet'
        || type === 'paikalliset_osaalueet';

    if ((isCurrentOrParentSelected && isErikoistyyppi) || isOppiaineenSisalto) {
      return node.children;
    }
    else {
      const filteredChildren = _(node.children)
        .filter('isVisible')
        .filter(child => !_.get(child, 'meta.nimi-kieli-filter') || !!child.label[this.sisaltoKieli])
        .value();
      return _(filteredChildren)
        .reject((child, index) => {
          return _.get(child, 'meta.navigation-subtype')
          && (index === filteredChildren.length - 1 || _.get(_.nth(filteredChildren, index + 1), 'meta.navigation-subtype'))
          && _.size(child.children) === 0;
        })
        .value();
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

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.sidebar {

  .search {
    margin-bottom: 1rem;
  }

  .navigation-tree {
    padding: $sidenav-padding;
    background-color: $ylops-paikallinen-color;
    border-radius: 0.7rem;
    padding: 0.8rem;
  }
}

@media (max-width: 991.98px) {
  .navigation-tree {
    padding: 15px !important;
  }
}
</style>
