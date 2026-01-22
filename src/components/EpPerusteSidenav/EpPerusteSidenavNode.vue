<template>
  <div
    class="node"
    :class="{ 'node-root': isRoot }"
  >
    <div v-if="!isRoot">
      <div
        v-if="isModuuli"
        class="indicator-wrapper"
      >
        <ep-color-indicator :kind="node.meta.pakollinen ? 'pakollinen' : 'valinnainen'" />
      </div>
      <div class="label-wrapper">
        <router-link
          v-if="node.location"
          :to="node.location"
        >
          <span
            class="label"
            :class="{ 'label-match': isMatch }"
          >
            {{ $kaannaOlioTaiTeksti(node.label) }}
          </span>
        </router-link>
        <span
          v-else
          class="label label-plain"
          :class="{ 'label-match': isMatch }"
        >
          {{ $kaannaOlioTaiTeksti(node.label) }}
        </span>
      </div>
    </div>

    <!-- children -->
    <ul
      v-if="hasChildren"
      :class="{ 'root-list': isRoot }"
    >
      <li
        v-for="(child, idx) in children"
        :key="idx"
      >
        <ep-peruste-sidenav-node
          :node="child"
          :current="current"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { $kaannaOlioTaiTeksti } from '@shared/utils/globals';

const props = defineProps({
  node: {
    type: Object as () => NavigationNode,
    required: true,
  },
  current: {
    type: Object as () => NavigationNode,
    required: false,
  },
});

const children = computed(() => {
  const node = props.node;
  const type = props.node.type;
  const current = props.current;
  const parent = node.path[_.size(node.path) - 2];

  const isCurrentOrParentSelected = (current && (node.key === current.key
      || (parent && parent.key === current.key && current.type !== 'oppiaineet')));
  const isErikoistyyppi = type === 'oppiaineet'
      || type === 'oppiaine'
      || type === 'oppimaarat'
      || type === 'moduulit'
      || type === 'moduuli';

  if (isCurrentOrParentSelected && isErikoistyyppi) {
    return node.children;
  }
  else {
    return _.filter(node.children, 'isVisible');
  }
});

const hasChildren = computed(() => {
  return !_.isEmpty(children.value);
});

const isModuuli = computed(() => {
  return props.node.type === 'moduuli' && typeof _.get(props.node, 'meta.pakollinen') === 'boolean';
});

const isRoot = computed(() => {
  return props.node.type === 'root';
});

const isMatch = computed(() => {
  return props.node.isMatch;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.node {
  color: $sidenav-color;
  hyphens: auto;
  &:not(.node-root) {
    padding-top: 1em;
  }

  &.root {
    padding: 0;
  }

  a {
    color: $sidenav-color;
    display: block;
  }

  ul {
    // Remove default list styles
    list-style: none;
    padding-left: $sidenav-depth-padding;
    margin: 0;
  }

  // First element shouldn't has top padding
  ul.root-list {
    padding-left: 0;
    & > li:first-child > .node {
      padding-top: 0;
    }
  }

  .router-link-exact-active.router-link-active {
    color: $sidenav-active-color;
  }

  .label-match {
    font-weight: bold;
  }

  .indicator-wrapper {
    position: absolute;
  }

  // Lisätään margini indikaattorille, jotta rivitys menee samalle tasolle.
  // Esim.
  // o Tekstien tulkinta ja
  //   kirjoittaminen
  .indicator-wrapper + .label-wrapper {
    margin-left: 20px;
  }
}
</style>
