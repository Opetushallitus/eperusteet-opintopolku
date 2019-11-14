<template>
<div class="peruste">
  <ep-header :koulutustyyppi="peruste.koulutustyyppi" :murupolku="murupolku">
    <template slot="header">
      {{ $kaanna(peruste.nimi) }}
    </template>
    <template slot="subheader">
      <div class="diaarinumero">
        {{ peruste.diaarinumero }}
      </div>
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <ep-sidebar>
        <template slot="bar">
          <ep-peruste-sidenav :peruste-data-store="perusteDataStore" />
        </template>
        <template slot="view">
          <router-view :key="$route.fullPath">
            <template slot="previous-next-navigation">
              <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav" />
            </template>
          </router-view>
        </template>
      </ep-sidebar>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { NavigationNode } from '@shared/utils/NavigationBuilder';

import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';


@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
    EpHeader,
    EpPreviousNextNavigation,
  },
})
export default class RoutePeruste extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get sidenav() {
    return this.perusteDataStore.sidenav;
  }

  get peruste() {
    return this.perusteDataStore.peruste;
  }

  get current(): NavigationNode | null {
    return this.perusteDataStore.current;
  }

  get flattenedSidenav() {
    return this.perusteDataStore.flattenedSidenav;
  }

  get murupolku() {
    if (this.peruste && this.current) {
      return [
        ...this.current.path,
      ];
    }
    return [];
  }

  @Watch('$route', { immediate: true })
  onRouteUpdate(route) {
    this.perusteDataStore.updateRoute(route);
  }

  @Meta
  getMetaInfo() {
    if (this.peruste) {
      return {
        title: (this as any).$kaanna(this.peruste.nimi),
      };
    }
  }
}
</script>

<style scoped lang="scss">
.peruste {
  .diaarinumero {
    font-weight: bold;
    font-size: small;
  }
}
</style>
