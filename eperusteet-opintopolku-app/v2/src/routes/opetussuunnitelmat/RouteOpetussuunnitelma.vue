<template>
<div class="opetussuunnitelma">
  <ep-header :koulutustyyppi="koulutustyyppi" :murupolku="murupolku">
    <template slot="header">
      {{ $kaanna(opetussuunnitelma.nimi) }}
    </template>
    <template slot="subheader">
      <div class="diaarinumero">
        {{ diaariNumero }}
      </div>
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <PortalTarget ref="innerPortal" name="globalNavigation"></PortalTarget>
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

  <EpEsikatseluNotifikaatio v-if="opetussuunnitelmaEsikatselussa">
    <div>{{$t('olet-esikatselutilassa-suunnitelmaa-ei-ole-viela-julkaistu')}}</div>
  </EpEsikatseluNotifikaatio>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, ProvideReactive } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { NavigationNode, traverseNavigation } from '@shared/utils/NavigationBuilder';

import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpOpetussuunnitelmaSidenav from '@/components/EpOpetussuunnitelmaSidenav/EpOpetussuunnitelmaSidenav.vue';
import { IOpetussuunnitelmaStore } from '@/stores/IOpetussuunitelmaStore';
import EpEsikatseluNotifikaatio from '@/components/EpEsikatselu/EpEsikatseluNotifikaatio.vue';
import { OpetussuunnitelmaKevytDtoTilaEnum } from '@shared/api/ylops';
import * as _ from 'lodash';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';

@Component({
  components: {
    EpOpetussuunnitelmaSidenav,
    EpHeader,
    EpSidebar,
    EpPreviousNextNavigation,
    EpEsikatseluNotifikaatio,
  },
  inject: [],
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
      return [{
        label: this.koulutustyyppi,
      },
      ...this.current.path,
      ];
    }
    return [];
  }

  get diaariNumero(): string {
    return this.opetussuunnitelma.perusteenDiaarinumero || this.opetussuunnitelma.perusteDiaarinumero || '';
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

  get opetussuunnitelmaEsikatselussa() {
    return this.opetussuunnitelmaDataStore?.tila !== _.toLower(OpetussuunnitelmaKevytDtoTilaEnum.JULKAISTU) || _.has(this.$route.query, 'esikatselu');
  }

  @ProvideReactive('isAmmatillinen')
  get isAmmatillinen(): boolean {
    return true;
  }

  @ProvideReactive('linkkiHandler')
  get linkkiHandler(): ILinkkiHandler {
    return {
      nodeToRoute(node) {
        return traverseNavigation(node, true).location;
      },
    } as ILinkkiHandler;
  };
}
</script>

<style scoped lang="scss">
.opetussuunnitelma {
  .diaarinumero {
    font-size: small;
  }
}
</style>
