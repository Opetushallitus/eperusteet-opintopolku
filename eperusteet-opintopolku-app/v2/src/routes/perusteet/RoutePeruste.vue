<template>
<div>
  <ep-header :koulutustyyppi="peruste.koulutustyyppi" :murupolku="murupolku">
    <template slot="header">
      {{ $kaanna(peruste.nimi) }}
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <ep-sidebar>
        <template slot="bar">
          <ep-peruste-sidenav :peruste-data-store="perusteDataStore" />
        </template>
        <template slot="view">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
        </template>
      </ep-sidebar>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Prop, Mixins, Component } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { SidenavNode } from '@/components/EpPerusteSidenav/PerusteBuildingMethods';


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

  get current(): SidenavNode | null {
    return this.perusteDataStore.current;
  }

  get murupolku() {
    if (this.peruste && this.current) {
      return [{
          label: (this as any).$kaanna(this.peruste.nimi),
          to: this.$route
        },
        ...this.current.path,
        this.current,
      ];
    }
    else {
      return [];
    }
  }

}
</script>

<style scoped lang="scss">
</style>
