<template>
  <div
    class="node"
    :class="{ 'node-root': isRoot, 'separator': hasSeparator }"
  >
    <div v-if="!isRoot">
      <div
        v-if="isModuuli"
        class="indicator-wrapper"
      >
        <ep-color-indicator :kind="node.meta.pakollinen ? 'pakollinen' : 'valinnainen'" />
      </div>
      <div
        v-if="isKurssi && kurssiTyyppiVari[node.meta.tyyppi]"
        class="indicator-wrapper"
      >
        <ep-color-indicator
          :background-color="kurssiTyyppiVari[node.meta.tyyppi]"
          :tooltip="false"
        />
      </div>
      <div class="label-wrapper flex items-center">
        <router-link
          v-if="node.location && !subtype"
          :to="node.location"
        >
          <span
            class="label"
            :class="{ 'label-match': isMatch }"
          >
            <EpSidenavNodeLabel :node="node" />
          </span>
        </router-link>
        <div
          v-else
          class="label label-plain"
          :class="{ 'label-match': isMatch, 'subtype': subtype, 'pl-0': !hasChildren }"
        >
          <EpSidenavNodeLabel :node="node" />
        </div>

        <EpNavigationPostFix
          v-if="node.meta && node.meta.postfix_label"
          :node="node"
          class="ml-1"
        />
      </div>
    </div>
    <!-- children -->
    <ul
      v-if="hasChildren"
      class="children"
      :class="{ 'root-list': isRoot }"
    >
      <li
        v-for="(child, idx) in children"
        :key="idx"
      >
        <EpSidenavNode
          :node="child"
          :current="current"
          :get-children="getChildren"
        />
      </li>
    </ul>

    <hr v-if="hasSeparator">
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpNavigationPostFix from '@shared/components/EpTreeNavibar/EpNavigationPostFix.vue';
import EpSidenavNodeLabel from '@/components/EpSidenav/EpSidenavNodeLabel.vue';

const props = defineProps({
  node: {
    type: Object as () => NavigationNode,
    required: true,
  },
  current: {
    type: Object as () => NavigationNode,
    required: false,
    default: undefined,
  },
  getChildren: {
    type: Function,
    required: false,
    default: undefined,
  },
});

const children = computed(() => {
  return props.getChildren(props.node);
});

const hasChildren = computed(() => {
  return !_.isEmpty(children.value);
});

const isModuuli = computed(() => {
  return props.node.type === 'moduuli' && typeof _.get(props.node, 'meta.pakollinen') === 'boolean';
});

const isKurssi = computed(() => {
  return props.node.type === 'lukiokurssi' && _.get(props.node, 'meta.tyyppi');
});

const kurssiTyyppiVari = {
  'VALTAKUNNALLINEN_PAKOLLINEN': '#bddb8a',
  'PAKOLLINEN': '#bddb8a',
  'VALTAKUNNALLINEN_SYVENTAVA': '#997bb6',
  'VALTAKUNNALLINEN_SOVELTAVA': '#f8a35e',
};

const isRoot = computed(() => {
  return props.node.type === 'root';
});

const hasSeparator = computed(() => {
  return props.node.meta && props.node.meta.post_separator;
});

const isMatch = computed(() => {
  return props.node.isMatch;
});

const subtype = computed(() => {
  return _.get(props.node.meta, 'navigation-subtype');
});

const koodi = computed(() => {
  return _.get(props.node, 'meta.koodi.arvo') || _.get(props.node, 'meta.koodi');
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.node:has(> ul.children) {
  padding-bottom: 0px;
}

.node {
  color: $sidenav-color;
  hyphens: auto;

  &:not(.node-root, .separator){
    padding-bottom: $sidenav-padding;
  }

  &.root {
    padding: 0;
  }

  a {
    color: $sidenav-color;
    display: block;
  }

  ul, ol {
    // Remove default list styles
    list-style: none;
    margin: 0;
    padding-left: $sidenav-depth-padding;
    counter-reset: item;
    font-size: 15px;
  }

  ol {
    a:before {
      content: counters(item, ".");
      counter-increment: item;
      padding-right: 1em;
    }
  }

  li {
    display: block;
  }

  // First element shouldn't has top padding

  ul.children:not(:first-child) {
    padding-top: $sidenav-padding;
  }

  // ul.children {
  //   .node {
  //     padding-bottom: 0;
  //   }
  // }

  ul.root-list, ol.root-list {
    font-size: 16px;
    padding-left: 0;

    & > li:first-child > .node {
      padding-top: 0;
    }
  }

  @media (max-width: 991.98px) {
    ul.root-list, ol.root-list {
      font-size: 18px;
    }

    ul, ol {
      font-size: 17px;
    }
  }

  .router-link-active {
    font-weight: 600;
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

  .label-wrapper {
    .icon {
      font-size: 1rem;
      color: $blue3;
    }
  }

  .subtype {
    padding-left: $sidenav-depth-padding;
    padding-top: 5px;
    color: $sidenav-navigation-subtype-color;
  }

  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
}
</style>
