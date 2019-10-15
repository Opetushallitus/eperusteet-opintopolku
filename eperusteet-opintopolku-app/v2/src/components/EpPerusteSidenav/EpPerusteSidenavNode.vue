<template>
<li v-if="isVisible && isFiltered"
    class="node-tree">
    <b-link v-if="node.to"
            :to="node.to">
        <span class="label"
              :class="{ 'label-match': isMatch }">{{ node.label }}</span>
    </b-link>
    <span v-else
          class="label"
          :class="{ 'label-match': isMatch }">{{ node.label }}</span>

    <ul v-if="!isCollapsed && node.children && node.children.length">
        <ep-peruste-sidenav-node v-for="(child, idx) in node.children"
                                 :key="idx"
                                 :node="child"
                                 :filter="filter"></ep-peruste-sidenav-node>
    </ul>
</li>
<div v-else
     class="node-tree skip">
    <div v-if="!isCollapsed && node.children && node.children.length">
        <ep-peruste-sidenav-node v-for="(child, idx) in node.children"
                                 :key="idx"
                                 :node="child"
                                 :filter="filter"></ep-peruste-sidenav-node>
    </div>
</div>
</template>

<script lang="ts">
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

  private get isVisible() {
    return this.node.isVisible;
  }

  private get isFiltered() {
    return this.node.isFiltered;
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

.node-tree {
    ul {
        // Remove default list styles
        list-style: none;
        padding-left: $sidenav-depth-padding;
    }

    li {
        color: $sidenav-color;
        padding: 0.25em 0;
        hyphens: auto;

        & a {
            color: $sidenav-color;
        }
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
