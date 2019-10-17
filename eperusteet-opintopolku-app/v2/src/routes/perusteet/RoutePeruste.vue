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
import { Prop, Mixins, Component } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
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
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get sidenav() {
    return this.perusteDataStore.sidenav;
  }

  get current(): SidenavNode | null {
    return this.perusteDataStore.current;
  }

  get murupolku() {
    let result = [{
      label: (this as any).$kaanna(this.peruste.nimi),
      to: this.$route
    }];

    if (this.current) {
      result = [
        ...result,
        ...this.current.$$path,
        this.current,
      ];
    }
    return result;
  }

}
</script>

<style scoped lang="scss">
</style>
