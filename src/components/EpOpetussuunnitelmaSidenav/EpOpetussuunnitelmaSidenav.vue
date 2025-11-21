<template>
  <div class="sidebar">
    <ep-spinner v-if="sidenavLoading" />
    <div v-else>
      <div class="search">
        <ep-search
          :model-value="query"
          :placeholder="$t('hae-sisallysluettelosta')"
          :sr-only-label-text="$t('hae-suunnitelman-sisallysluettelosta')"
          @update:model-value="setValue"
        />
      </div>
      <div class="navigation-tree">
        <EpHakutulosmaara
          :kokonaismaara="hakutuloksetKokonaismaara"
          piilota-nakyva-tulosmaara
        >
          <span
            v-if="!!hakutuloksetKokonaismaara && hakutuloksetKokonaismaara === 1"
            class="sr-only"
          >
            <span class="sr-only">{{ $t('hakuasi-vastaava-tulos') }}: {{ $kaanna(hakutulokset[0].label) }}</span>
          </span>
        </EpHakutulosmaara>
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
import { ref, computed } from 'vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSidenavNode from '@/components/EpSidenav/EpSidenavNode.vue';
import { Kielet } from '@shared/stores/kieli';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import { $t, $kaanna } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const query = ref('');

const setValue = (value) => {
  query.value = value;
  if (value.length === 0 || value.length > 2) {
    opetussuunnitelmaDataStore.updateFilter({
      isEnabled: !_.isEmpty(value),
      label: value,
    });
  }
};

const getChildren = (node) => {
  const type = node.type;
  const currentValue = current.value;
  const parent = node.path[_.size(node.path) - 2];

  const isCurrentOrParentSelected = (currentValue && (node.key === currentValue.key
      || (parent && parent.key === currentValue.key && currentValue.type !== 'oppiaineet')));

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
      .filter(child => !_.get(child, 'meta.nimi-kieli-filter') || !!child.label[sisaltoKieli.value])
      .value();
    return _(filteredChildren)
      .reject((child, index) => {
        return _.get(child, 'meta.navigation-subtype')
        && (index === filteredChildren.length - 1 || _.get(_.nth(filteredChildren, index + 1), 'meta.navigation-subtype'))
        && _.size(child.children) === 0;
      })
      .value();
  }
};

const sidenavLoading = computed(() => {
  return opetussuunnitelmaDataStore.sidenavLoading;
});

const treeData = computed(() => {
  return opetussuunnitelmaDataStore.filteredSidenav;
});

const current = computed(() => {
  return opetussuunnitelmaDataStore.current;
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const flattenTree = (tree) => {
  return _.flatMap(tree, node => {
    if (node.children) {
      return [node, ...flattenTree(node.children)];
    }
    return node;
  });
};

const hakutulokset = computed(() => {
  if (treeData.value) {
    return _.filter(flattenTree(treeData.value.children), node => node.isMatch && node.type !== 'root');
  }
  return [];
});

const hakutuloksetKokonaismaara = computed(() => {
  return hakutulokset.value?.length;
});
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
