<template>
  <div
    id="navigation-bar"
    v-sticky
    class="navbar"
    sticky-z-index="600"
  >
    <div>
      <b-button
        v-b-toggle.sidebar-no-header
        variant="transparent"
      >
        <div class="menu">
          <EpMaterialIcon
            icon-shape="outlined"
            size="30px"
          >
            {{ icon }}
          </EpMaterialIcon>
          <span class="text">{{ $t('valikko') }}</span>
        </div>
      </b-button>
      <router-link :to="{ name: 'root'}">
        <img
          :src="navImage"
          :alt="$t('eperusteet')"
          class="ml-3"
        >
      </router-link>
    </div>
    <div class="d-inline-flex ml-auto">
      <b-navbar-nav :aria-label="$t('kielivalinta')">
        <b-nav-item-dropdown
          class="kielivalikko"
          right
        >
          <template slot="button-content">
            <EpMaterialIcon>language</EpMaterialIcon>
            <span class="ml-2 dropdown-text mr-2">{{ $t(sisaltoKieli) }}</span>
          </template>
          <b-dropdown-item
            v-for="(kieli, idx) in kielet"
            :key="idx"
            @click="valitseKieli(kieli)"
          >
            {{ $t(kieli) }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </div>
    <b-sidebar
      id="sidebar-no-header"
      v-model="isActive"
      aria-labelledby="sidebar-no-header-title"
      no-header
      bg-variant="white"
      no-close-on-route-change
    >
      <template>
        <div class="pl-3 pr-3 pb-3">
          <div class="mt-3 mb-4">
            <router-link
              :to="{ name: 'root'}"
              @click.native="closeSidebar()"
            >
              <span class="navi-home">
                <EpMaterialIcon
                  icon-shape="outlined"
                  size="22px"
                >home</EpMaterialIcon>
                {{ $t('etusivu') }}
              </span>
            </router-link>
          </div>
          <div class="mb-2 navi-valiotsikko">
            <span>{{ $t('valtakunnalliset-perusteet-ja-paikalliset-opetussuunnitelmat') }}</span>
          </div>
          <nav class="mb-5">
            <EpSpinner v-if="!koulutustyyppiItems" />
            <b-nav
              v-for="(item, idx1) in koulutustyyppiItems"
              :key="idx1"
              vertical
            >
              <b-nav-item
                :to="item.route"
                link-classes="navi nav-btn"
                active
                active-class="active-item"
                @click="closeSidebar()"
              >
                <div class="ml-3">
                  {{ $t(item.name) }}
                </div>
              </b-nav-item>
            </b-nav>
          </nav>
          <div class="mb-2 navi-valiotsikko">
            <span>{{ $t('osaaminen-ja-maaraykset') }}</span>
          </div>
          <nav class="mb-5">
            <EpSpinner v-if="!otherItems" />
            <b-nav
              v-for="(item, idx2) in otherItems"
              :key="idx2"
              vertical
            >
              <b-nav-item
                :to="item.route"
                link-classes="navi nav-btn"
                active
                active-class="active-item"
                @click="closeSidebar()"
              >
                <div class="ml-3">
                  {{ $t(item.name) }}
                </div>
              </b-nav-item>
            </b-nav>
          </nav>
          <div class="mb-2 navi-valiotsikko">
            <span>{{ $t('tietoa-palvelusta') }}</span>
          </div>
          <nav>
            <b-nav
              v-for="(item, idx3) in muutLinkit"
              :key="idx3"
              vertical
            >
              <b-nav-item
                v-if="item.link"
                :href="$kaanna(item.link)"
                link-classes="navi nav-btn"
                active
                active-class="active-item"
                target="_blank"
              >
                <div class="ml-3">
                  {{ $t(item.name) }}
                </div>
              </b-nav-item>
              <b-nav-item
                v-else
                :to="item.route"
                link-classes="navi nav-btn"
                active
                active-class="active-item"
                @click="closeSidebar()"
              >
                <div class="ml-3">
                  {{ $t(item.name) }}
                </div>
              </b-nav-item>
            </b-nav>
          </nav>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import Sticky from 'vue-sticky-directive';
import { kansallisetOsaamismerkitRoute, koulutustyyppiLinks, navigoitavatKoulutustyyppiRyhmat, navigoitavatMuutRyhmat, ophMaarayksetRoute, otherLinks } from '@/utils/navigointi';
import { RawLocation, VueRouter } from 'vue-router/types/router';
import { Route } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';
import logo from '@assets/img/banners/opintopolku/logo.svg';
import { createLogger } from '@shared/utils/logger';
import { digitaalinenOsaaminen } from '@shared/utils/perusteet';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
const logger = createLogger('EpJulkinenSidenav');

@Component({
  directives: {
    Sticky,
  },
  components: {
    EpMaterialIcon,
  },
})
export default class EpJulkinenSidenav extends Vue {
  @Prop({ required: true })
  private julkaistutKoulutustyypitStore!: JulkaistutKoulutustyypitStore;

  @Prop({ required: true })
  private tietoapalvelustaStore!: TietoapalvelustaStore;

  @Prop({ required: true })
  private osaamismerkitStore!: OsaamismerkitStore;

  private active: boolean = false;

  get koulutustyyppiItems() {
    return navigoitavatKoulutustyyppiRyhmat(this.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value as any);
  }

  get otherItems() {
    return navigoitavatMuutRyhmat(this.osaamismerkitStore.kategoriat.value as any, this.digitaalinenOsaaminenPeruste);
  }
  
  get muutLinkit() {
    return [
      ...(this.tietoapalvelusta ? [this.tietoapalvelusta] : []),
      ...otherLinks(),
    ];
  }

  get tietoapalvelusta() {
    return this.tietoapalvelustaStore.tietoapalvelusta.value;
  }

  get digitaalinenOsaaminenPeruste() {
    return _.first(this.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
  }

  get isActive() {
    return this.active;
  }

  set isActive(value) {
    this.active = value;
  }

  async valitseKieli(kieli) {
    const router: VueRouter = this.$router;
    const current: Route = router.currentRoute;

    try {
      await router.replace({
        name: current.name,
        params: {
          ...current.params,
          lang: kieli || this.$i18n.fallbackLocale,
        },
      } as RawLocation);
    }
    catch (e: any) {
      if (e.name === 'NavigationDuplicated') {
        logger.warn('Uusi kieli on sama kuin nykyinen');
      }
      else {
        throw e;
      }
    }
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get kielet() {
    return [
      'fi',
      'sv',
      'en',
    ];
  }

  get navImage() {
    return logo;
  }

  get icon() {
    return this.isActive ? 'close' : 'menu';
  }

  closeSidebar() {
    this.active = false;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

::v-deep .b-sidebar {
  margin-top: 70px;
  padding-bottom: 70px;
  width: 400px;
  box-shadow: 0 1rem 0.5rem rgba(0, 0, 0, 0.5) !important;

  @media (max-width: 900px) {
    width: 100%;
  }
}

::v-deep .tabs .nav-tabs .nav-item .nav-link:hover:not(.active) {
  background: unset;
  border-color: $oph-green;
  border-width: 0 0 2px 0;
  border-style: solid;
}

::v-deep .nav.nav-tabs .nav-link {
  color: $black;
}

::v-deep .nav-link {
  color: $black;
}

.navbar {
  height: 75px;
  background-color: $white;
  padding: 0.25rem 1rem
}

.navi {
  color: $black;
  font-weight: 500;
  font-size: 15px;
  border-bottom: 1px solid $gray-lighten-8;
  padding: 15px 0;
}

.navi-home {
  color: $oph-green;
  border-bottom: 0
}

.navi-valiotsikko {
  color: $oph-green;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.btn:focus {
  box-shadow: unset;
}

.menu {
  display: grid;

  .text {
    font-size: small;
  }
}

.active-item {
  font-weight: 600;
  background-color: $gray-lighten-5;
}

.nav-btn:hover {
  background-color: $gray-lighten-5;
}

.btn:focus {
  color: white;
  background-color: $oph-green;;
}

.dropdown-text {
  @media (max-width: 400px) {
    display: none;
  }
}

.kielivalikko {
  z-index: 2000;
}
</style>
