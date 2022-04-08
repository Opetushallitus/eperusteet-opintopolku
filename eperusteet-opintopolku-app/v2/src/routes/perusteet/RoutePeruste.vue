<template>
<div class="peruste">
  <ep-header :koulutustyyppi="koulutustyyppi" :murupolku="murupolku">
    <template slot="header" v-if="peruste.tyyppi ==='opas'">
      {{ $t('ohjeet-ja-materiaalit')}}: {{ $kaanna(peruste.nimi) }}
    </template>
    <template slot="header" v-else>
      {{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{peruste.laajuus}} {{$t('osaamispiste')}}</span>
    </template>
    <template slot="subheader" v-if="peruste.tyyppi !=='opas'">
      <div class="diaarinumero">
        {{ peruste.diaarinumero }}
      </div>
    </template>
  </ep-header>
  <div class="container">
    <div class="lower">
      <PortalTarget ref="innerPortal" name="globalNavigation"></PortalTarget>
      <ep-sidebar>

        <template slot="bar">
          <!-- <ep-peruste-sidenav :peruste-data-store="perusteDataStore" /> -->
          <div class="sidebar" v-if="haku">
            <div class="search">
              <ep-search :value="tekstihaku" @input="updateTekstihaku" />
              <div>
                <router-link :to="{ query: { } }">{{ $t('palaa-rakenteeseen') }}</router-link>
              </div>
            </div>
          </div>
          <div v-else>
            <ep-peruste-sidenav
                @search-update="onSearch"
                :query="query"
                :peruste-data-store="perusteDataStore">
              <template v-slot:after>
                <div v-if="query">
                  <!-- TODO lisää jos halutaan käyttöön -->
                  <!-- <router-link :to="{ query: { haku: true } }">{{ $t('etsi-sisalloista') }}</router-link> -->
                </div>
              </template>
            </ep-peruste-sidenav>
          </div>
          <div class="tags">
            <span class="tag"></span>
          </div>
        </template>

        <template slot="view">
          <div v-if="haku">
            <ep-peruste-haku :peruste-data-store="perusteDataStore" :query="tekstihaku" />
          </div>
          <router-view v-else :key="$route.fullPath">
            <template v-slot:header v-if="peruste.tyyppi ==='opas'">
              {{$t('oppaan-tiedot')}}
            </template>
            <template v-slot:nimi v-if="peruste.tyyppi ==='opas'">
              <ep-form-content name="oppaan-nimi" headerType="h3" headerClass="h6">
                <ep-field v-model="peruste.nimi"></ep-field>
              </ep-form-content>
            </template>
            <template slot="previous-next-navigation">
              <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav" />
            </template>
          </router-view>
        </template>
      </ep-sidebar>
    </div>
  </div>

  <EpEsikatseluNotifikaatio v-if="perusteEsikatselussa">
    <div>{{$t('olet-esikastelutilassa-perustetta-ei-ole-viela-julkaistu')}}</div>
  </EpEsikatseluNotifikaatio>
</div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch, ProvideReactive } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { NavigationNode, traverseNavigation } from '@shared/utils/NavigationBuilder';
import * as _ from 'lodash';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpEsikatseluNotifikaatio from '@/components/EpEsikatselu/EpEsikatseluNotifikaatio.vue';
import EpPerusteHaku from '@/components/EpPerusteHaku.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { PerusteprojektiDtoTilaEnum } from '@shared/api/eperusteet';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';

@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
    EpHeader,
    EpPreviousNextNavigation,
    EpFormContent,
    EpField,
    EpEsikatseluNotifikaatio,
    EpPerusteHaku,
    EpSearch,
  },
  watch: {
    $route: {
      handler: 'onRouteUpdate',
      immediate: true,
      deep: true,
    },
  },
  inject: [],
})
export default class RoutePeruste extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private query = '';
  private tekstihaku = '';
  private haku = false;

  get sidenav() {
    return this.perusteDataStore.sidenav;
  }

  get peruste() {
    return this.perusteDataStore.peruste;
  }

  get current(): NavigationNode | null {
    return this.perusteDataStore.current;
  }

  get flattenedSidenav() {
    return this.perusteDataStore.flattenedSidenav;
  }

  get murupolku() {
    if (this.peruste && this.current) {
      return [
        ...this.current.path,
      ];
    }
    return [];
  }

  get koulutustyyppi() {
    return this.peruste?.koulutustyyppi || this.oppaanKoulutustyyppi;
  }

  get oppaanKoulutustyyppi() {
    if (_.size(this.peruste?.oppaanKoulutustyypit) === 1) {
      return _.take((this.peruste?.oppaanKoulutustyypit as any[]));
    }
  }

  onRouteUpdate(route) {
    this.haku = route.query.haku || false;
    if (!this.haku) {
      this.perusteDataStore.updateRoute(route);
    }
  }

  @Meta
  getMetaInfo() {
    if (this.peruste) {
      return {
        title: (this as any).$kaanna(this.peruste.nimi),
      };
    }
  }

  get perusteEsikatselussa() {
    return this.perusteDataStore.projektitila !== _.toLower(PerusteprojektiDtoTilaEnum.JULKAISTU);
  }

  @ProvideReactive('linkkiHandler')
  get linkkiHandler(): ILinkkiHandler {
    return {
      nodeToRoute(node) {
        return traverseNavigation(node, false).location;
      },
    } as ILinkkiHandler;
  };

  onSearch(value: string) {
    this.query = value;
  }

  private updateTekstihaku(value) {
    this.tekstihaku = value;
  }

  private setValue(value) {
    this.query = value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.peruste {
  .diaarinumero {
    font-weight: bold;
    font-size: small;
  }
}

.sidebar {
  .search {
    padding: $sidenav-padding;
  }

  .navigation-tree {
    padding: $sidenav-padding;
  }
}

</style>
