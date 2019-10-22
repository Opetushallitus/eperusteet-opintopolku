<template>
<div class="d-flex flex-column flex-lg-row justify-content-between mt-5" v-if="previous || next">
  <b-link v-if="previous && previous.location" :to="previous.location">
    <div class="d-flex align-items-center">
      <fas icon="arrow-left"></fas>
      <span class="mx-2">{{ previous.label }}</span>
    </div>
  </b-link>

  <b-link v-if="next && next.location" :to="next.location" class="ml-auto">
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

  @Prop({ required: true })
  private activeNode!: SidenavNode | null;

  @Prop({ required: true })
  private flattenedSidenav!: Array<SidenavNode> | null;

  get activeIdx(): number {
    if (this.flattenedSidenav && this.activeNode) {
      return _.findIndex(this.flattenedSidenav, { key: this.activeNode.key });
    }
    return -1;
  }

  get previous(): SidenavNode | null {
    if (this.activeIdx >= 0) {
      return this.flattenedSidenav[this.activeIdx - 1] || null;
    }
    return null;
  }

  get next(): SidenavNode | null {
    if (this.activeIdx >= 0) {
      return this.flattenedSidenav[this.activeIdx + 1] || null;
    }
    return null;
  }
}
</script>


<style scoped lang="scss">
</style>
