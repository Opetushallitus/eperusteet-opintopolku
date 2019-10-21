<template>
<div class="node">
  <div v-if="node.type !== 'root'">
    <b-link v-if="node.to" :to="node.to">
      <span class="label" :class="{ 'label-match': isMatch }">{{ node.label }}</span>
    </b-link>
    <span v-else class="label" :class="{ 'label-match': isMatch }">{{ node.label }}</span>
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
    return this.node.children;
    // return _.filter(this.node.children, {
    //   isVisible: true,
    //   isFiltered: true
    // });
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
  padding: 0.25em 0;
  hyphens: auto;
  margin-top: 10px;

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

  ul.root-list {
    padding-left: 0;
  }

  .router-link-active {
    //text-decoration: underline;
    color: $sidenav-active-color;
  }

  .label-match {
    font-weight: bold;
  }
}
</style>
