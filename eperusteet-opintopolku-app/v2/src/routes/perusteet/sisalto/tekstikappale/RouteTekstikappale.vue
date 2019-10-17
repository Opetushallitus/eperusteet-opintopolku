<template>
<div class="content">
  <h1 class="teksti">{{ $kaanna(perusteenOsa.nimi) }}</h1>
  <div v-html="$kaanna(perusteenOsa.teksti)" class="teksti"></div>
  <pre>{{ current.id }}</pre>
  <pre>{{ parent && parent.label }}</pre>
  <pre>{{ previous && previous.label }}</pre>
  <pre>{{ next && next.label }}</pre>
</div>
</template>

<script lang="ts">
import { Component, Watch, Mixins, Prop, Vue } from 'vue-property-decorator';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { SidenavNode } from '@/components/EpPerusteSidenav/PerusteBuildingMethods';
import _ from 'lodash';


@Component
export default class RouteTekstikappale extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Prop({ required: true })
  private viiteId!: string;

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get sidenav() {
    return this.perusteDataStore.sidenav();
  }

  get next(): SidenavNode {
    if (this.parent) {
      return this.parent.children[this.currentIndex + 1];
    }
  }

  get previous(): SidenavNode {
    if (this.parent) {
      return this.parent.children[this.currentIndex - 1];
    }
  }

  get currentIndex(): SidenavNode {
    if (this.parent && this.current) {
      return _.findIndex(this.parent.children, { id: this.current.id });
    }
    return -1;
  }

  get parent(): SidenavNode {
    if (this.current) {
      return _.last(this.current.$$path);
    }
    return null;
  }

  get current(): SidenavNode | null {
    if (this.viiteId && this.sidenav) {
      const root = this.sidenav;
      const stack = [root];
      const viiteId = _.parseInt(this.viiteId);
      while (stack.length > 0) {
        const head = stack.pop();
        if (head!.id === viiteId) {
          return head;
        }
        stack.push(...head!.children);
      }
    }
    return null;
  }

  @Watch('viiteId', { immediate: true })
  onViiteUpdate(value) {
    this.perusteDataStore.viiteId = value;
  }

}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
  padding: $content-padding;

  .teksti {
    hyphens: auto;

    & /deep/ p {
      text-align: justify;
    }

    & /deep/ img {
      max-width: 100%;
      margin: 0 auto;
    }

    & /deep/ table {
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
