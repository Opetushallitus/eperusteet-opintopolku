<template>
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
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';

@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
  },
})
export default class RoutePeruste extends Mixins(EpPerusteRoute) {
}
</script>

<style scoped lang="scss">
</style>
