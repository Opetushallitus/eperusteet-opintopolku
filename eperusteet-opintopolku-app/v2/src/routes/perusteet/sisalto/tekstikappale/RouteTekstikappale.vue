<template>
<div id="default-anchor" class="content">
  <div v-if="perusteenOsa && !isLoading">
    <h2 class="otsikko">{{ $kaanna(perusteenOsa.nimi) }}</h2>
    <div class="teksti" v-html="$kaanna(perusteenOsa.teksti)"></div>

    <!-- Alikappaleet -->
    <div v-for="(alikappale, idx) in alikappaleet" :key="idx">
      <h3 class="otsikko">{{ $kaanna(alikappale.nimi) }}</h3>
      <div class="teksti" v-html="$kaanna(alikappale.teksti)"></div>
    </div>

    <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav"></ep-previous-next-navigation>
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { NavigationNode } from '@/utils/NavigationBuilder';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Perusteenosat } from '@shared/api/eperusteet';
import { Laaja } from '@shared/api/tyypit';
import _ from 'lodash';


@Component({
  components: {
    EpPreviousNextNavigation,
    EpSpinner,
  }
})
export default class RouteTekstikappale extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  private alikappaleet: Laaja[] = [];
  private isLoading = false;

  @Watch('current', { immediate: true })
  async updateAlikappaleet() {
    if (!this.current) {
      return;
    }

    this.isLoading = true;
    if (this.current.children) {
      this.alikappaleet = await Promise.all(_(this.current.children)
        .filter('location')
        .map(async (node: any) =>
          (await Perusteenosat.getPerusteenOsatByViite(node.location.params.viiteId)).data)
        .value());
    }
    this.isLoading = false;
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get flattenedSidenav() {
    return this.perusteDataStore.flattenedSidenav;
  }

  get currentRoute() {
    return this.perusteDataStore.currentRoute;
  }

  get sidenav() {
    return this.perusteDataStore.sidenav;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get alikappaleNodes(): Array<NavigationNode> | null {
    if (this.current && this.current.path.length === 2) {
      return this.current.children;
    }
    return null;
  }

}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';
@import '../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
