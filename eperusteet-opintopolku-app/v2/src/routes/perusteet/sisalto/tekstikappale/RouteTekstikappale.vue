<template>
<div class="content">
  <h2 class="otsikko" id="tekstikappale-otsikko">{{ $kaanna(perusteenOsa.nimi) }}</h2>
  <div class="teksti" v-html="$kaanna(perusteenOsa.teksti)"></div>

  <!-- Alikappaleet -->
  <ep-spinner v-if="isLoading" />
  <div v-else>
    <div v-for="(alikappale, idx) in alikappaleet" :key="idx">
      <h3 class="otsikko">{{ $kaanna(alikappale.nimi) }}</h3>
      <div class="teksti" v-html="$kaanna(alikappale.teksti)"></div>
    </div>
  </div>

  <ep-previous-next-navigation :viite-id="viiteId" :sidenav="sidenav"></ep-previous-next-navigation>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { SidenavNode } from '@/components/EpPerusteSidenav/PerusteBuildingMethods';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Perusteenosat } from '@shared/api/eperusteet';
import { Laaja } from '@shared/api/tyypit';


@Component({
  components: {
    EpPreviousNextNavigation,
    EpSpinner,
  }
})
export default class RouteTekstikappale extends Mixins(EpPerusteRoute) {

  private alikappaleet: Array<Laaja> = [];

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Prop({ required: true })
  private viiteId!: string;

  async init() {
    if (this.alikappaleNodes) {
      for (const node of this.alikappaleNodes) {
        if (node.id) {
          const alikappale = (await Perusteenosat.getPerusteenOsatByViite(node.id)).data;
          this.alikappaleet.push(alikappale);
        }
      }
    }
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get sidenav() {
    return this.store.sidenav();
  }

  get current(): SidenavNode | null {
    if (this.viiteId && this.sidenav) {
      const root = this.sidenav;
      const stack = [root];
      const viiteId = _.parseInt(this.viiteId);
      while (stack.length > 0) {
        const head = stack.pop();
        if (head!.id === viiteId) {
          return head || null;
        }
        stack.push(...head!.children);
      }
    }
    return null;
  }

  get alikappaleNodes(): Array<SidenavNode> | null {
    if (this.current && this.current.depth === 1) {
      return this.current.children;
    }
    return null;
  }

  @Watch('viiteId', { immediate: true })
  onViiteUpdate(value) {
    this.store.viiteId = value;
  }

}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
  padding: 0 $content-padding;
  overflow-x: auto;

  .otsikko, .teksti {
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
