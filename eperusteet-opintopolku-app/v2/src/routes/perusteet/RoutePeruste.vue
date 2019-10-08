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
import { Mixins, Component, Prop } from 'vue-property-decorator';
import EpRoute from '@shared/mixins/EpRoute';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';

@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
  },
})
export default class RoutePeruste extends Mixins(EpRoute) {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;
}
</script>

<style scoped lang="scss">
</style>
