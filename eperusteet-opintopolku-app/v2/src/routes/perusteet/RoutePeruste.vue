<template>
<div class="peruste">
  <ep-header :koulutustyyppi="peruste.koulutustyyppi" :murupolku="murupolku">
    <template slot="header">
      {{ $kaanna(peruste.nimi) }}
      <div class="diaarinumero">
        {{ peruste.diaarinumero }}
      </div>
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
import _ from 'lodash';
import { Vue, Prop, Component } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { SidenavNode } from '@/utils/NavigationBuilder';
import { MurupolkuOsa } from '@/tyypit';


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

  get murupolku(): Array<MurupolkuOsa> {
    const polku: Array<MurupolkuOsa> = [{
      to: { name: 'root' },
      text: this.$t('eperusteet') as string,
      active: false,
    }];

    if (this.peruste) {
      polku.push({
        text: (this as any).$kaanna(this.peruste.nimi),
        to: this.$route,
        active: false,
      });
    }

    const route = this.$route;
    if (route) {
      // Jos tekstikappale
      if (route.name === 'tekstikappale' && this.current) {
        const path: Array<MurupolkuOsa> = _.map(this.current.path, node => {
          return {
            text: node.label,
            to: node.to,
            active: false
          };
        });
        // Rajataan root pois murupolusta
        if (path.length > 0) {
          path.shift();
        }

        // Lisätään jatkeeksi
        polku.push(...path);
        polku.push({
          text: this.current.label,
          to: this.current.to,
          active: true,
        });
      }

      if (route.name === 'perusteTiedot' && this.peruste) {
        polku.push({
          text: this.$t('tiedot') as string,
          to: { name: 'perusteTiedot', params: { perusteId: this.peruste.id } } as any,
          active: true,
        });
      }
    }

    return polku;
  }

}
</script>

<style scoped lang="scss">
.peruste {
  .diaarinumero {
    font-size: small;
  }
}
</style>
