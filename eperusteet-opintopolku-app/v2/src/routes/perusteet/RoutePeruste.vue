<template>
<div>
  <ep-header :murupolku="murupolku">
    <template slot="header">
    {{ $kaanna(peruste.nimi) }}
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <ep-sidebar>
        <template slot="bar">
        <ep-peruste-sidenav :peruste-data-store="perusteDataStore"></ep-peruste-sidenav>
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
import { Mixins, Component } from 'vue-property-decorator';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
import EpHeader from '@/components/EpHeader/EpHeader.vue';

@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
    EpHeader,
  },
})
export default class RoutePeruste extends Mixins(EpPerusteRoute) {

  private get murupolku() {
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
