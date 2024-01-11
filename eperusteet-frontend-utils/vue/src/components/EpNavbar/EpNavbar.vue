<template>
<div class="topbar">
  <b-sidebar id="sisaltobar">
    <PortalTarget ref="innerPortal" name="globalNavigation"></PortalTarget>
  </b-sidebar>

  <b-navbar id="navigation-bar"
            class="ep-navbar"
            type="dark"
            toggleable="lg">

    <b-navbar-nav v-if="showNavigation">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link id="nav-admin" :to="rootNavigation">
              <EpMaterialIcon size="20px">home</EpMaterialIcon>
            </router-link>
          </li>
          <li class="breadcrumb-item" v-for="(route, idx) in routePath" :key="idx">
            <router-link v-if="route.muru && route.muru.location" :to="route.muru.location">
              {{ route.muru.name }}
            </router-link>
            <span v-else-if="route.muru">
              {{ route.muru.name }}
            </span>
            <span v-else>{{ $t('route-' + route.name) }}</span>
          </li>
        </ol>
      </nav>
    </b-navbar-nav>
    <b-button class="text-white" v-else v-b-toggle.sisaltobar variant="icon">
      <EpMaterialIcon>menu</EpMaterialIcon>
    </b-button>

    <b-navbar-nav class="ml-auto">

      <!-- Sisällön kieli-->
      <b-nav-item-dropdown id="content-lang-selector" right no-caret>
        <template slot="button-content">
          <div class="d-flex flex-row">
            <div class="kieli-valikko d-flex flex-column">
              <span class="kielivalitsin text-right">{{ $t("kieli-sisalto") }}</span>
              <small class="valittu-kieli text-right">{{ $t(sisaltoKieli) }}</small>
            </div>
            <EpMaterialIcon class="mx-2 my-1">expand_more</EpMaterialIcon>
          </div>
        </template>
        <div class="kielet">
          <b-dd-item @click="valitseSisaltoKieli(kieli)"
            v-for="kieli in sovelluksenKielet"
            :key="kieli"
            :disabled="kieli === sisaltoKieli">
            <EpMaterialIcon v-if="kieli === sisaltoKieli" class="mr-3 valittu">check</EpMaterialIcon>
            {{ $t(kieli) }}
          </b-dd-item>
        </div>
      </b-nav-item-dropdown>

      <ep-kayttaja :tiedot="kayttaja"
                   :koulutustoimijat="koulutustoimijat"
                   :koulutustoimija="koulutustoimija"
                   :sovellusOikeudet="sovellusOikeudet"
                   :logoutHref="logoutHref"/>

    </b-navbar-nav>
  </b-navbar>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Sticky from 'vue-sticky-directive';
import { Kieli } from '../../tyypit';
import { Kielet, UiKielet } from '../../stores/kieli';
import { Murupolku } from '../../stores/murupolku';
import EpButton from '../../components/EpButton/EpButton.vue';
import { Location } from 'vue-router';
import EpKayttaja from '../../components/EpKayttaja/EpKayttaja.vue';
import { BrowserStore } from '../../stores/BrowserStore';
import { SovellusOikeus } from '@shared/plugins/oikeustarkastelu';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

interface Breadcrumb {
  label: string;
  route: Location;
}

@Component({
  directives: {
    Sticky,
  },
  components: {
    EpButton,
    EpKayttaja,
    EpMaterialIcon,
  },
})
export default class EpNavbar extends Vue {
  private browserStore = new BrowserStore();

  @Prop({ required: true })
  private kayttaja!: any;

  @Prop({ default: true })
  private sticky!: boolean;

  @Prop({ default: 'normaali' })
  private tyyli!: string;

  @Prop({ required: false })
  private koulutustoimijat!: any;

  @Prop({ required: false })
  private koulutustoimija!: any;

  @Prop({ required: false, type: Object, default: () => ({ name: 'root' }) })
  private rootNavigation!:any;

  @Prop({ required: false })
  private sovellusOikeudet!: SovellusOikeus[];

  @Prop({ required: false })
  private logoutHref!: string;

  get showNavigation() {
    return this.browserStore.navigationVisible.value;
  }

  get murut() {
    return Murupolku.murut;
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get sovelluksenKielet() {
    return UiKielet;
  }

  get matched() {
    return this.$route?.matched;
  }

  get routePath() {
    return _(this.$route?.matched)
      .filter('name')
      .map(route => {
        const computeds = _.get(route, 'instances.default');
        const result = {
          ...route,
          muru: this.murut[route!.name!],
          // breadname: computeds && computeds.breadcrumb,
        };
        return result;
      })
      .uniqBy('muru.name')
      .value();
  }

  private valitseSisaltoKieli(kieli: Kieli) {
    Kielet.setSisaltoKieli(kieli);
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.topbar {

  .navbar {
    top: 0;
    font-weight: 600;

    .kielivalitsin {
      color: white;
    }

    .breadcrumb {
      margin-bottom: 0;
      background: rgba(0, 0, 0, 0);

      .breadcrumb-item {
        color: white;
        &::before {
          color: white;
        }
        a {
          color: white;
        }
      }
    }
  }

  .kieli-valikko {
    color: white;
  }

  .valittu-koulutustoimija {
    font-size: 0.75rem;
  }

  .ep-navbar {

    .kysymysmerkki {
      color: white;
      cursor: pointer;
    }

    .kielet {
      text-align: right;

      .valittu {
        color: #3467E3;
        vertical-align: -0.25em;
      }
    }

    /deep/ .dropdown-menu {
      padding: 0;
      color: #000000;
      min-width: initial;
    }

    /deep/ .dropdown-item {
      padding: 0.5rem 1rem;
      color: #000000;
    }

    /deep/ .dropdown-item:hover {
      background-color: inherit;
    }

  }
}

</style>
