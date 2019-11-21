<template>
<div class="node" :class="{ 'node-root': isRoot }">
  <div v-if="!isRoot">
    <div class="indicator-wrapper" v-if="isModuuli">
      <ep-color-indicator :kind="node.meta.pakollinen ? 'pakollinen' : 'valinnainen'" />
    </div>
    <div class="label-wrapper">
      <b-link v-if="node.location" :to="node.location">
      <span class="label" :class="{ 'label-match': isMatch }">
        {{ $kaannaOlioTaiTeksti(node.label) }}
      </span>
      </b-link>
      <span v-else
            class="label label-plain"
            :class="{ 'label-match': isMatch }">
        {{ $kaannaOlioTaiTeksti(node.label) }}
    </span>
    </div>
  </div>

  <!-- children -->
  <ul :class="{ 'root-list': isRoot }" v-if="hasChildren">
    <li v-for="(child, idx) in children" :key="idx">
      <ep-peruste-sidenav-node :node="child" :current="current" />
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';


@Component({
  name: 'EpPerusteSidenavNode',
  components: {
    EpColorIndicator,
  }
})
export default class EpPerusteSidenavNode extends Vue {
  @Prop({ required: true })
  node!: NavigationNode;

  @Prop({ required: false })
  current!: NavigationNode;

  get children() {
    const node = this.node;
    const type = this.node.type;
    const current = this.current;
    const parent = node.path[_.size(node.path) - 2];

    const isCurrentOrParentSelected = (current && (node.key === current.key
        ||  (parent && parent.key === current.key && current.type !== 'oppiaineet')));
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
  }
  get hasChildren() {
    return !_.isEmpty(this.children);
  }

  get isModuuli() {
    return this.node.type === 'moduuli' && typeof _.get(this.node, 'meta.pakollinen') === 'boolean';
  }

  get isRoot() {
    return this.node.type === 'root';
  }

  get isMatch() {
    return this.node.isMatch;
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

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

  .label-plain {
    cursor: not-allowed;
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
