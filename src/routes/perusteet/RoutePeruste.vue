<template>
<div class="peruste">
  <ep-header :koulutustyyppi="koulutustyyppi" :murupolku="murupolku" :tyyppi="peruste.tyyppi" v-sticky sticky-side="top">
    <template slot="header" v-if="peruste.tyyppi ==='opas' && peruste.opasTyyppi !== 'tietoapalvelusta'">
      {{ $t('ohjeet-ja-materiaalit')}}: {{ $kaanna(peruste.nimi) }}
    </template>
    <template slot="header" v-else>
      {{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{peruste.laajuus}} {{$t('osaamispiste')}}</span>
    </template>
    <template slot="subheader">
      <div class="diaarinumero" v-if="peruste.tyyppi !=='opas'">
        {{ peruste.diaarinumero }}
      </div>
      <ep-search class="query mt-3" v-model="query" :maxlength="100"/>
    </template>
  </ep-header>

  <EpNotificationBar :julkaisu-pvm="julkaisuPvm" :has-sisalto-kielelle="hasSisaltoKielelle"/>

  <div class="container mt-4">
    <div class="lower">
      <div v-if="sisaltohaku">
        <ep-peruste-haku :peruste-data-store="perusteDataStore" :query="query" @clear="suljeSisaltohaku">
          <template v-slot:nimi="{ tulos }">
            <router-link :to="tulos.location" @click.native="sisaltohakuValinta(tulos.location)">
              {{ tulos.nimi}}
            </router-link>
          </template>
        </ep-peruste-haku>
      </div>
      <template v-else>
        <PortalTarget ref="innerPortal" name="globalNavigation"></PortalTarget>
        <ep-sidebar :scroll-enabled="true">
          <template slot="bar">
            <div>
              <a id="sr-focus" class="sr-only" href="" aria-hidden="true" tabindex="-1"/>
              <ep-peruste-sidenav
                  :peruste-data-store="perusteDataStore">
              </ep-peruste-sidenav>
            </div>
            <div class="tags">
              <span class="tag"></span>
            </div>
          </template>

          <template slot="view">
            <router-view :key="$route.fullPath">
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
      </template>
    </div>
  </div>
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
import EpNotificationBar from '@/components/EpNotificationBar/EpNotificationBar.vue';
import EpPerusteHaku from '@/components/EpPerusteHaku.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { PerusteprojektiDtoTilaEnum } from '@shared/api/eperusteet';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';
import Sticky from 'vue-sticky-directive';
import { createPerusteMurupolku } from '@/utils/murupolku';
import { Kielet } from '@shared/stores/kieli';
import { Route } from 'vue-router';
import { Debounced } from '@shared/utils/delay';

@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
    EpHeader,
    EpPreviousNextNavigation,
    EpFormContent,
    EpField,
    EpNotificationBar,
    EpPerusteHaku,
    EpSearch,
  },
  directives: {
    Sticky,
  },
  watch: {
    query: {
      handler: 'queryImplDebounce',
      immediate: true,
    },
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
  private sisaltohaku = false;
  private oldLocation: Route | null = null;
  private queryImplDebounce = _.debounce(this.onQueryChange, 300);

  mounted() {
    this.query = this.routeQuery;
  }

  get routeQuery() {
    return this.$route.query.query as string || '';
  }

  onQueryChange(value) {
    if (this.query.length > 2) {
      this.sisaltohaku = true;
      this.$router.replace({ query: {
        ...(value && { query: value }),
      } }).catch(() => {});
    }
  }

  @Watch('routeQuery', { immediate: true })
  private async routeQueryChange() {
    this.query = this.routeQuery;
  }

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
    if (this.peruste) {
      let currentPath = this.current ? this.current.path : [];
      return [
        ...createPerusteMurupolku(this.peruste, this.koulutustyyppi, this.routeKoulutustyyppi),
        ...currentPath,
      ];
    }
    return [];
  }

  get routeKoulutustyyppi() {
    return this.$route.params?.koulutustyyppi;
  }

  get koulutustyyppi() {
    return this.peruste?.koulutustyyppi || this.oppaanKoulutustyyppi;
  }

  get hasSisaltoKielelle() {
    return _.includes(this.peruste?.kielet, _.toString(Kielet.getSisaltoKieli.value));
  }

  get oppaanKoulutustyyppi() {
    if (_.size(this.peruste?.oppaanKoulutustyypit) === 1) {
      return _.take((this.peruste?.oppaanKoulutustyypit as any[])).toString();
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
    return this.perusteDataStore.projektitila !== _.toLower(PerusteprojektiDtoTilaEnum.JULKAISTU) || _.has(this.$route.query, 'esikatselu');
  }

  @ProvideReactive('linkkiHandler')
  get linkkiHandler(): ILinkkiHandler {
    return {
      nodeToRoute(node) {
        return traverseNavigation(node, false).location;
      },
    } as ILinkkiHandler;
  };

  get routeName() {
    return this.$route.name;
  }

  get julkaisuPvm() {
    let julkaisu = this.perusteDataStore.julkaisut?.find(julkaisu => julkaisu.revision === _.toNumber(this.$route.params?.revision));
    return julkaisu ? julkaisu.luotu : null;
  }

  get ensimainenNavi() {
    return _.find(this.flattenedSidenav, navi => navi.type !== 'root');
  }

  @Watch('flattenedSidenav', { immediate: true })
  routeNameChange() {
    if (this.routeName === 'peruste') {
      if (this.ensimainenNavi) {
        this.$router.replace(this.ensimainenNavi.location!);
      }
    }
    this.resetFocusForScreenReader();
  }

  private resetFocusForScreenReader() {
    // jos painetaan sisäistä linkkiä, jossa sidenavin sisältö muuttuu, siirretään tabin focus piilotettuun linkkiin,
    // jotta ruudunlukijan focus ei jää sinne, missä linkkiä painettiin
    const input = document.getElementById('sr-focus');
    if (input) {
      input.focus();
      input.blur();
    }
  }

  suljeSisaltohaku() {
    this.query = '';
    this.sisaltohaku = false;
  }

  sisaltohakuValinta(location) {
    this.$router.push(location).catch(() => { });
    this.sisaltohaku = false;
    this.query = '';
    this.onRouteUpdate(this.$route);
  }

  onRouteUpdate(route) {
    this.perusteDataStore.updateRoute(route);
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

  .query {
    max-width: 340px;
  }

  @media (max-width: 991.98px) {
    .query {
      max-width: 100%;
    }
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
