<template>
<div class="d-flex flex-column flex-lg-row justify-content-between mt-5" v-if="previous || next">
  <b-link v-if="previous && previous.location" :to="previous.location">
    <div class="d-flex align-items-center">
      <fas fixed-width icon="arrow-left"></fas>
      <span class="mx-2">{{ $kaannaOlioTaiTeksti(previous.label) }}</span>
    </div>
  </b-link>

  <b-link v-if="next && next.location" :to="next.location" class="ml-auto">
    <div class="d-flex align-items-center">
      <span class="mx-2">{{ $kaannaOlioTaiTeksti(next.label) }}</span>
      <fas fixed-width icon="arrow-right"></fas>
    </div>
  </b-link>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NavigationNode } from '@shared/utils/NavigationBuilder';

@Component
export default class EpPreviousNextNavigation extends Vue {

  @Prop({ required: true })
  private activeNode!: NavigationNode;

  @Prop({ required: true })
  private flattenedSidenav!: Array<NavigationNode>;

  get activeIdx(): number {
    if (this.flattenedSidenav && this.activeNode) {
      return _.findIndex(this.flattenedSidenav, { key: this.activeNode.key });
    }
    return -1;
  }

  get previous(): NavigationNode | null {
    if (this.activeNode && _.size(this.activeNode.path) === 2) {
      // Jos päätason node, otetaan edellinen samalta tasolta
      const rootChildren = this.activeNode.path[0].children;
      const idx = _.findIndex(rootChildren, { key: this.activeNode.key });
      return rootChildren[idx - 1];
    }
    else if (this.activeIdx >= 0 && this.flattenedSidenav) {
      return this.flattenedSidenav[this.activeIdx - 1] || null;
    }
    return null;
  }

  get next(): NavigationNode | null {
    if (this.activeNode && _.size(this.activeNode.path) === 2) {
      // Jos päätason node, otetaan seuraava samalta tasolta
      const rootChildren = this.activeNode.path[0].children;
      const idx = _.findIndex(rootChildren, { key: this.activeNode.key });
      return rootChildren[idx + 1];
    }
    else if (this.activeIdx >= 0 && this.flattenedSidenav) {
      return this.flattenedSidenav[this.activeIdx + 1] || null;
    }
    return null;
  }
}
</script>

<style scoped lang="scss">
</style>
