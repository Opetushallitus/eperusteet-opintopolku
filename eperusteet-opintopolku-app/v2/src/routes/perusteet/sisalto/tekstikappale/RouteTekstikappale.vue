<template>
<div class="content">
  <h1 class="teksti" id="tekstikappale-otsikko">{{ $kaanna(perusteenOsa.nimi) }}</h1>
  <div class="teksti" v-html="$kaanna(perusteenOsa.teksti)"></div>

  <!-- Alikappaleet -->
  <ep-spinner v-if="isLoading" />
  <div v-else>
    <div v-for="(alikappale, idx) in alikappaleet" :key="idx">
      <h2 class="teksti">{{ $kaanna(alikappale.nimi) }}</h2>
      <div class="teksti" v-html="$kaanna(alikappale.teksti)"></div>
    </div>
  </div>

  <ep-previous-next-navigation :viite-id="viiteId" :sidenav="sidenav"></ep-previous-next-navigation>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Watch, Mixins, Prop } from 'vue-property-decorator';
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
export default class RouteTekstikappale extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Prop({ required: true })
  private viiteId!: string;

  private alikappaleet: Laaja[] = [];
  private isLoading = true;

  async mounted() {
    if (this.alikappaleNodes) {
      for (const node of this.alikappaleNodes) {
        if (node.id) {
          const alikappale = (await Perusteenosat.getPerusteenOsatByViite(node.id)).data;
          this.alikappaleet.push(alikappale);
        }
      }
    }
    this.isLoading = false;
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get sidenav() {
    return this.perusteDataStore.sidenav;
  }

  get current() {
    return this.perusteDataStore.current;
  }

  get alikappaleNodes(): Array<SidenavNode> | null {
    if (this.current && this.current.depth === 1) {
      return this.current.children;
    }
    return null;
  }

  @Watch('viiteId', { immediate: true })
  onViiteUpdate(value) {
    this.perusteDataStore.updateViiteId(value);
  }

}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
  padding: 0 $content-padding;

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
