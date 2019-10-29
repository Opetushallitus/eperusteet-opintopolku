<template>
<div class="node" :class="{ 'node-root': isRoot }">
  <div v-if="!isRoot">
    <b-link v-if="node.location" :to="node.location">
      <span class="label" :class="{ 'label-match': isMatch }">
        {{ $kaanna(node.label) }}
      </span>
    </b-link>
    <span v-else
          class="label label-plain"
          :class="{ 'label-match': isMatch }">{{ $kaanna(node.label) }}</span>
  </div>

  <!-- children -->
  <ul :class="{ 'root-list': isRoot }">
    <li v-for="(child, idx) in children" :key="idx">
      <ep-peruste-sidenav-node :key="idx" :node="child" />
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NavigationNode } from '@/utils/NavigationBuilder';


@Component({
  name: 'EpPerusteSidenavNode',
})
export default class EpPerusteSidenavNode extends Vue {
  @Prop({ required: true })
  node!: NavigationNode;

  get children() {
    return _.filter(this.node.children, 'isVisible');
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
}
</style>
