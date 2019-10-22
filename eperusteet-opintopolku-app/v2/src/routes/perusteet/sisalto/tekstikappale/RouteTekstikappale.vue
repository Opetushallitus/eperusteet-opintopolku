<template>
<div class="content" v-if="perusteenOsa">
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

  <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav"></ep-previous-next-navigation>
</div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { SidenavNode } from '@/utils/NavigationBuilder';
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

  @Prop({ required: true, type: Number })
  private viiteId!: string | number;

  get viiteIdNumber() {
    if (_.isString(this.viiteId)) {
      return _.parseInt(this.viiteId);
    }
    return this.viiteId;
  }

  private alikappaleet: Laaja[] = [];
  private isLoading = false;

  @Watch('alikappaleNodes')
  async updateAlikappaleet() {
    this.isLoading = true;
    if (this.alikappaleNodes) {
      this.alikappaleet = await Promise.all(_(this.alikappaleNodes)
        .filter(node => node.type === 'viite')
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

  get alikappaleNodes(): Array<SidenavNode> | null {
    if (this.current && this.current.path.length === 2) {
      return this.current.children;
    }
    return null;
  }

  @Watch('viiteId', { immediate: true })
  onViiteUpdate(value: number) {
    this.perusteDataStore.updateRoute(this.$route);
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
