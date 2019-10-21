<template>
<div class="node" :class="{ 'node-root': isRoot }">
  <div v-if="!isRoot">
    <b-link v-if="node.to" :to="node.to">
      <span class="label" :class="{ 'label-match': isMatch }">{{ node.label }}</span>
    </b-link>
    <span v-else class="label label-plain" :class="{ 'label-match': isMatch }">{{ node.label }}</span>
  </div>

  <!-- children -->
  <ul v-if="!isCollapsed && children && children.length > 0" :class="{ 'root-list': isRoot }">
    <li v-for="(child, idx) in children" :key="idx">
      <ep-peruste-sidenav-node :key="idx" :node="child" :sidenav-filter="sidenavFilter" />
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SidenavFilter, SidenavNode } from '@/utils/NavigationBuilder';

@Component({
  name: 'EpPerusteSidenavNode',
})
export default class EpPerusteSidenavNode extends Vue {
  @Prop({ required: true })
  node!: SidenavNode;

  @Prop({ required: true })
  sidenavFilter!: SidenavFilter;

  get children() {
    return _.filter(this.node.children, {
      isVisible: true,
      isFiltered: true
    });
  }

  get isRoot() {
    return this.node.type === 'root';
  }

  get isCollapsed() {
    return this.node.isCollapsed && !this.sidenavFilter.isEnabled;
  }

  get isMatch() {
    return this.node.isMatch && this.sidenavFilter.isEnabled;
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

  .router-link-active {
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
