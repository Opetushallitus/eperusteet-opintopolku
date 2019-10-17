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
import { Mixins, Component, Prop } from 'vue-property-decorator';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
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
export default class RoutePeruste extends Mixins(EpPerusteRoute) {
  get murupolku() {
    return [
      {
        name: (this as any).$kaanna(this.peruste.nimi),
        to: this.$route
      }
    ];
  }
}
</script>

<style scoped lang="scss">
</style>
