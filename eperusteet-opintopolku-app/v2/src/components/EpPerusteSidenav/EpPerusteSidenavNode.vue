<template>
<div class="node">
    <div v-if="!isRoot">
        <b-link v-if="node.to" :to="node.to">
            <span class="label" :class="{ 'label-match': isMatch }">{{ node.label }}</span>
        </b-link>
        <span v-else class="label" :class="{ 'label-match': isMatch }">{{ node.label }}</span>
    </div>
    <!-- children -->
    <ul v-if="!isCollapsed && children && children.length" :class="{ 'root-list': isRoot }">
      <li v-for="(child, idx) in children" :key="idx">
        <ep-peruste-sidenav-node :node="child" :filter="filter"></ep-peruste-sidenav-node>
      </li>
    </ul>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FilterObj, SidenavNode } from '@/components/EpPerusteSidenav/PerusteBuildingMethods';

@Component({
  components: {
    EpPerusteSidenavNode
  }
})
export default class EpPerusteSidenavNode extends Vue {
  @Prop({ required: true })
  private node!: SidenavNode;

  @Prop({ required: true })
  private filter!: FilterObj;

  private get children() {
    return _.filter(this.node.children, {
      isVisible: true,
      isFiltered: true
    });
  }

  private get isRoot() {
    return this.node.type === 'root';
  }

  private get isCollapsed() {
    return this.node.isCollapsed && !this.filter.isEnabled;
  }

  private get isMatch() {
    return this.node.isMatch && this.filter.isEnabled;
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.node {
  color: $sidenav-color;
  padding: 0.25em 0;
  hyphens: auto;

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
