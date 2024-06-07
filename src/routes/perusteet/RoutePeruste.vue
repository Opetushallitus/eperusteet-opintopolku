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
      <ep-search
        class="query mt-3"
        v-model="query"
        :maxlength="100"
        :placeholder="$t('hae')"
        :srOnlyLabelText="sisaltoHakuSrLabel"
        />
    </template>
  </ep-header>

  <EpPerusteNotificationBar :julkaisut="julkaisut" :peruste="peruste" />

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
        <ep-sidebar :scroll-enabled="scroll">
          <template slot="bar">

            <EpOpsAiChat
              v-if="dokumentti"
              class="mt-2"
              :sourceName="peruste.nimi"
              :sourceId="perusteId"
              sourceType="peruste"
              :revision="revision"
              :educationLevel="koulutustyyppi"/>

            <div>
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
import EpPerusteNotificationBar from '@/components/EpNotificationBar/EpPerusteNotificationBar.vue';
import EpPerusteHaku from '@/components/EpPerusteHaku.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';
import Sticky from 'vue-sticky-directive';
import { createPerusteMurupolku } from '@/utils/murupolku';
import { Route } from 'vue-router';
import { PerusteKaikkiDtoTyyppiEnum } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import EpOpsAiChat from '@/components/EpOpsAiChat/EpOpsAiChat.vue';

@Component({
  components: {
    EpSidebar,
    EpPerusteSidenav,
    EpHeader,
    EpPreviousNextNavigation,
    EpFormContent,
    EpField,
    EpPerusteNotificationBar,
    EpPerusteHaku,
    EpSearch,
    EpOpsAiChat,
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

  @Watch('$route', { deep: true, immediate: true })
  async routeChange() {
    await Vue.nextTick();
    const h2 = this.$el.querySelector('h2');
    h2?.setAttribute('tabindex', '-1');
    h2?.focus();
  }

  async mounted() {
    await this.perusteDataStore.getDokumentit();
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

  get oppaanKoulutustyyppi() {
    if (_.size(this.peruste?.oppaanKoulutustyypit) === 1) {
      return _.take((this.peruste?.oppaanKoulutustyypit as any[])).toString();
    }
  }

  @Meta
  getMetaInfo() {
    if (this.peruste) {
      return {
        title: this.$kaanna(this.peruste.nimi),
        meta: [
          {
            vmid: 'description',
            name: 'description',
            content: [
              this.$kaanna(this.peruste.nimi),
              ...(this.peruste.koulutustyyppi ? [this.$t(this.peruste.koulutustyyppi)] : []),
            ],
          },
        ],
      };
    }
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

  get ensimainenNavi() {
    return _.find(this.flattenedSidenav, navi => navi.type !== 'root');
  }

  @Watch('flattenedSidenav', { immediate: true })
  flattenedSidenavChange() {
    if (this.routeName === 'peruste') {
      if (this.ensimainenNavi) {
        this.$router.replace(this.ensimainenNavi.location!);
      }
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

  get julkaisut() {
    return this.perusteDataStore.julkaisut;
  }

  get scroll() {
    return !_.has(this.$route.query, 'noscroll');
  }

  get sisaltoHakuSrLabel() {
    if (this.peruste?.tyyppi === _.toLower(PerusteKaikkiDtoTyyppiEnum.DIGITAALINENOSAAMINEN)) {
      return this.$t('hae-digitaalisten-osaamisten-kuvauksista');
    }

    return this.$t('hae-perusteen-sisallosta');
  }

  get perusteId() {
    return this.$route.params.perusteId;
  }

  get dokumentti() {
    return this.perusteDataStore.dokumentti;
  }

  get revision() {
    if (this.$route.params.revision) {
      return _.toNumber(this.$route.params.revision);
    }

    return _.maxBy(this.perusteDataStore.julkaisut, 'revision')?.revision;
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
