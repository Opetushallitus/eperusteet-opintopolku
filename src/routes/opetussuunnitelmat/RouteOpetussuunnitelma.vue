<template>
  <div class="opetussuunnitelma">
    <ep-header
      :koulutustyyppi="koulutustyyppi"
      :tyyppi="tyyppi"
      :murupolku="murupolku"
    >
      <template slot="header">
        {{ $kaanna(opetussuunnitelma.nimi) }}
      </template>
      <template slot="subheader">
        <div class="diaarinumero">
          {{ diaariNumero }}
        </div>
      </template>
    </ep-header>

    <EpNotificationBar :has-sisalto-kielelle="hasSisaltoKielelle" />

    <div class="container pt-4">
      <div class="lower">
        <PortalTarget
          ref="innerPortal"
          name="globalNavigation"
        />
        <ep-sidebar :scroll-enabled="true">
          <template slot="bar">
            <ep-opetussuunnitelma-sidenav :opetussuunnitelma-data-store="opetussuunnitelmaDataStore" />
          </template>
          <template slot="view">
            <router-view :key="$route.fullPath">
              <template slot="previous-next-navigation">
                <ep-previous-next-navigation
                  :active-node="current"
                  :flattened-sidenav="flattenedSidenav"
                />
              </template>
            </router-view>
          </template>
        </ep-sidebar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, ProvideReactive } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { NavigationNode, traverseNavigation } from '@shared/utils/NavigationBuilder';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpOpetussuunnitelmaSidenav from '@/components/EpOpetussuunnitelmaSidenav/EpOpetussuunnitelmaSidenav.vue';
import { IOpetussuunnitelmaStore } from '@/stores/IOpetussuunitelmaStore';
import EpNotificationBar from '@/components/EpNotificationBar/EpNotificationBar.vue';
import { OpetussuunnitelmaKevytDtoTilaEnum } from '@shared/api/ylops';
import * as _ from 'lodash';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';
import { createOpetussuunnitelmaMurupolku } from '@/utils/murupolku';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpOpetussuunnitelmaSidenav,
    EpHeader,
    EpSidebar,
    EpPreviousNextNavigation,
    EpNotificationBar,
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
    if (this.opetussuunnitelmaDataStore?.opetussuunnitelma?.jotpatyyppi === 'MUU') {
      return 'koulutustyyppi_muu';
    }
    return this.tyyppi === 'yhteinen' ? 'koulutustyyppi_1' : this.opetussuunnitelmaDataStore.koulutustyyppi;
  }

  get tyyppi() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma?.tyyppi;
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
        ...createOpetussuunnitelmaMurupolku(this.opetussuunnitelma, this.koulutustyyppi),
        ...this.current.path,
      ];
    }
    return [];
  }

  get diaariNumero(): string {
    return this.opetussuunnitelma.perusteenDiaarinumero || this.opetussuunnitelma.perusteDiaarinumero || '';
  }

  @Watch('$route', { deep: true, immediate: true })
  async onRouteUpdate(route) {
    this.opetussuunnitelmaDataStore.updateRoute(route);

    await Vue.nextTick();
    const h2 = this.$el.querySelector('h2');
    h2?.setAttribute('tabindex', '-1');
    h2?.focus();
  }

  @Meta
  getMetaInfo() {
    if (this.opetussuunnitelma) {
      return {
        title: this.$kaanna(this.opetussuunnitelma.nimi),
        meta: [
          {
            vmid: 'description',
            name: 'description',
            content: [
              this.$kaanna(this.opetussuunnitelma.nimi),
              this.$t(this.opetussuunnitelma.koulutustyyppi),
            ],
          },
        ],
      };
    }
  }

  get opetussuunnitelmaEsikatselussa() {
    return this.opetussuunnitelmaDataStore?.tila !== _.toLower(OpetussuunnitelmaKevytDtoTilaEnum.JULKAISTU) || _.has(this.$route.query, 'esikatselu');
  }

  get hasSisaltoKielelle() {
    return _.includes(this.opetussuunnitelma?.julkaisukielet, _.toString(Kielet.getSisaltoKieli.value));
  }

  @ProvideReactive('linkkiHandler')
  get linkkiHandler(): ILinkkiHandler {
    return {
      nodeToRoute(node) {
        return traverseNavigation(node, true).location;
      },
    } as ILinkkiHandler;
  }

  @ProvideReactive('opetussuunnitelma')
  get provideOpetussuunnitelma() {
    return this.opetussuunnitelma;
  }
}
</script>

<style scoped lang="scss">
.opetussuunnitelma {
  .diaarinumero {
    font-size: small;
  }
}

::v-deep .sidenav .view{
  border:0;
}

</style>
