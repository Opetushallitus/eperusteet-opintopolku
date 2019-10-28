<template>
<div class="opetussuunnitelma">
  <ep-header :koulutustyyppi="opetussuunnitelma.koulutustyyppi" :murupolku="murupolku">
    <template slot="header">
      {{ $kaanna(opetussuunnitelma.nimi) }}
      <div class="diaarinumero">
        {{ opetussuunnitelma.perusteenDiaarinumero }}
      </div>
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <ep-sidebar>
        <template slot="bar">
          <!-- Todo: sidenav -->
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';

@Component({
  components: {
    EpHeader,
    EpSidebar,
  },
})
export default class RouteOpetussuunnitelma extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get opetussuunnitelma() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma;
  }

  get current(): any | null {
    // Todo
    return null;
  }

  get murupolku() {
    if (this.opetussuunnitelma && this.current) {
      return [
        ...this.current.path,
      ];
    }
    return [];
  }

  @Watch('$route', { immediate: true })
  onRouteUpdate(route) {
    this.opetussuunnitelmaDataStore.updateRoute(route);
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.opetussuunnitelma {
  .diaarinumero {
    font-size: small;
  }
}
</style>
