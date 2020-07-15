<template>
<div class="opetussuunnitelma">
  <ep-header :koulutustyyppi="koulutustyyppi" :murupolku="murupolku">
    <template slot="header">
      {{ $kaanna(opetussuunnitelma.nimi) }}
    </template>
    <template slot="subheader">
      <div class="diaarinumero">
        {{ opetussuunnitelma.perusteenDiaarinumero }}
      </div>
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <ep-sidebar>
        <template slot="bar">
        <ep-opetussuunnitelma-sidenav :opetussuunnitelma-data-store="opetussuunnitelmaDataStore" />
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { NavigationNode } from '@shared/utils/NavigationBuilder';

import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpOpetussuunnitelmaSidenav from '@/components/EpOpetussuunnitelmaSidenav/EpOpetussuunnitelmaSidenav.vue';
import { IOpetussuunnitelmaStore } from '@/stores/IOpetussuunitelmaStore';

@Component({
  components: {
    EpOpetussuunnitelmaSidenav,
    EpHeader,
    EpSidebar,
    EpPreviousNextNavigation,
  },
})
export default class RouteOpetussuunnitelma extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: IOpetussuunnitelmaStore;

  get opetussuunnitelma() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma;
  }

  get koulutustyyppi() {
    return this.opetussuunnitelmaDataStore.koulutustyyppi;
  }

  get current(): NavigationNode | null {
    return this.opetussuunnitelmaDataStore.current;
  }

  get flattenedSidenav() {
    return this.opetussuunnitelmaDataStore.flattenedSidenav;
  }

  get murupolku() {
    if (this.opetussuunnitelma && this.current) {
      return [
        ...this.current.path,
      ];
    }
    return [];
  }

  @Watch('$route', { deep: true, immediate: true })
  onRouteUpdate(route) {
    this.opetussuunnitelmaDataStore.updateRoute(route);
  }

  @Meta
  getMetaInfo() {
    if (this.opetussuunnitelma) {
      return {
        title: (this as any).$kaanna(this.opetussuunnitelma.nimi),
      };
    }
  }
}
</script>

<style scoped lang="scss">
.opetussuunnitelma {
  .diaarinumero {
    font-size: small;
  }
}
</style>
