<template>
  <div
    v-if="previous || next"
    class="d-flex flex-lg-row justify-content-between mt-5"
  >
    <b-link
      v-if="previous && previous.location"
      :to="previous.location"
      class="pb-3"
    >
      <div class="d-flex align-items-center">
        <EpMaterialIcon>arrow_back</EpMaterialIcon>
        <span class="mx-2">{{ $kaannaOlioTaiTeksti(previous.label) }}</span>
      </div>
    </b-link>

    <b-link
      v-if="next && next.location"
      :to="next.location"
      class="ml-auto pb-3"
    >
      <div class="d-flex align-items-center">
        <span class="next mx-2">{{ $kaannaOlioTaiTeksti(next.label) }}</span>
        <EpMaterialIcon>arrow_forward</EpMaterialIcon>
      </div>
    </b-link>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpPreviousNextNavigation extends Vue {
  @Prop({ required: true })
  private activeNode!: NavigationNode;

  @Prop({ required: true })
  private flattenedSidenav!: Array<NavigationNode>;

  get filteredFlattenedSidenav(): Array<NavigationNode> {
    return _.filter(this.flattenedSidenav, node => node.location) as Array<NavigationNode>;
  }

  get activeIdx(): number {
    if (this.filteredFlattenedSidenav && this.activeNode) {
      return _.findIndex(this.filteredFlattenedSidenav, { key: this.activeNode.key });
    }
    return -1;
  }

  get previous(): NavigationNode | null {
    if (this.activeNode
        && (this.activeNode.type === 'viite' || this.activeNode.type === 'laajaalaiset')
        && _.size(this.activeNode.path) === 2
    ) {
      // Jos päätason node, otetaan edellinen samalta tasolta
      const rootChildren = this.activeNode.path[0].children;
      const idx = _.findIndex(rootChildren, { key: this.activeNode.key });
      return rootChildren[idx - 1];
    }
    else if (this.activeIdx >= 0 && this.filteredFlattenedSidenav) {
      return this.filteredFlattenedSidenav[this.activeIdx - 1] || null;
    }
    return null;
  }

  get next(): NavigationNode | null {
    if (this.activeNode
        && (this.activeNode.type === 'viite' || this.activeNode.type === 'laajaalaiset')
        && _.size(this.activeNode.path) === 2
    ) {
      // Jos päätason node, otetaan seuraava samalta tasolta
      const rootChildren = this.activeNode.path[0].children;
      const idx = _.findIndex(rootChildren, { key: this.activeNode.key });
      return rootChildren[idx + 1];
    }
    else if (this.activeIdx >= 0 && this.filteredFlattenedSidenav) {
      return this.filteredFlattenedSidenav[this.activeIdx + 1] || null;
    }
    return null;
  }
}
</script>

<style scoped lang="scss">

.next {
  text-align: end;
}
</style>
