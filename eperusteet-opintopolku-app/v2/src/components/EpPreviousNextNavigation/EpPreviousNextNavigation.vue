<template>
<div class="d-flex flex-column flex-lg-row justify-content-between mt-5" v-if="previous || next">
  <b-link v-if="previous && previous.to" :to="previous.to">
    <div class="d-flex align-items-center">
      <fas icon="arrow-left"></fas>
      <span class="mx-2">{{ previous.label }}</span>
    </div>
  </b-link>

  <b-link v-if="next && next.to" :to="next.to" class="ml-auto">
    <div class="d-flex align-items-center">
      <span class="mx-2">{{ next.label }}</span>
      <fas icon="arrow-right"></fas>
    </div>
  </b-link>
</div>
</template>


<script lang="ts">
import _ from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { SidenavNode } from '@/utils/NavigationBuilder';

@Component
export default class EpPreviousNextNavigation extends Vue {

  @Prop({
    required: false,
    default: null,
    validator(value) {
      return _.isNull(value) || _.isInteger(value);
    },
  })
  private viiteId!: number | null;

  @Prop({ required: true })
  private sidenav!: SidenavNode | null;


  get flattenedSidenav(): Array<SidenavNode> {
    const root = this.sidenav;
    const result: Array<SidenavNode> = [];

    function traverseTree(node: SidenavNode) {
      result.push(node);
      (node.children || [])
        .map(child => {
          traverseTree(child);
          return child;
        });
    }

    if (root) {
      traverseTree(root);
    }

    return result;
  }

  get current(): SidenavNode | null {
    for (const node of this.flattenedSidenav) {
      if (this.viiteId && this.viiteId === node.id) {
        return node;
      }
      else if (this.$route.name === 'perusteTiedot' && node.type === 'tiedot') {
        return node;
      }
    }
    return null;
  }

  get previous(): SidenavNode | null {
    if (this.flattenedSidenav && this.current) {
      const index = _.findIndex(this.flattenedSidenav, this.current);
      return this.flattenedSidenav[index - 1] || null;
    }
    return null;
  }

  get next(): SidenavNode | null {
    if (this.flattenedSidenav && this.current) {
      const index = _.findIndex(this.flattenedSidenav, this.current);
      return this.flattenedSidenav[index + 1] || null;
    }
    return null;
  }
}
</script>


<style scoped lang="scss">
</style>
