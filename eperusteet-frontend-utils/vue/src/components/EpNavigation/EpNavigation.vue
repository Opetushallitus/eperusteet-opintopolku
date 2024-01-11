<template>
<div class="topbar" v-sticky="sticky" sticky-z-index="600">
  <b-navbar id="navigation-bar"
            class="ep-navbar"
            type="dark"
            toggleable="md"
            :class="'navbar-style-' + tyyli"
            :style="{ 'background-attachment': sticky ? 'fixed' : '' }">
    <b-navbar-nav>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link id="nav-admin" :to="{ name: 'root' }">
              <EpMaterialIcon size="20px">home</EpMaterialIcon>
            </router-link>
          </li>
          <li class="breadcrumb-item" v-for="(route, idx) in routePath" :key="idx">
            <router-link v-if="route.muru && route.muru.location" :to="route.muru.location">
              {{ $kaanna(route.muru.name) }}
            </router-link>
            <span v-else-if="route.muru">
              {{ $kaanna(route.muru.name) }}
            </span>
            <span v-else>{{ $t('route-' + route.name) }}</span>
          </li>
        </ol>
      </nav>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-form v-if="tutoriaalistore && naytettaviaTutoriaaleja">
        <b-button variant="primary" size="sm" @click="kaynnistaTutoriaali" class="mr-2">
          {{ $t('tutorial-avaa') }}
        </b-button>
      </b-nav-form>

      <!-- Sisällön kieli-->
      <b-nav-item-dropdown id="content-lang-selector" right>
        <template slot="button-content">
          <span class="kielivalitsin">{{ $t("kieli-sisalto") }}: {{ $t(sisaltoKieli) }}</span>
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

      <ep-kayttaja :tiedot="tiedot" />

    </b-navbar-nav>
  </b-navbar>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Sticky from 'vue-sticky-directive';
import { Kieli } from '@shared/tyypit';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { Murupolku } from '@shared/stores/murupolku';
import { TutoriaaliStore } from '@shared/stores/tutoriaali';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKayttaja from '@shared/components/EpKayttaja/EpKayttaja.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

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
export default class EpNavigation extends Vue {
  @Prop({ default: true })
  private sticky!: boolean;

  @Prop({ default: 'normaali' })
  private tyyli!: string;

  @Prop({ required: false })
  private tutoriaalistore!: TutoriaaliStore | undefined;

  @Prop({ required: false })
  private tiedot!: string | undefined;

  get murut() {
    return Murupolku.murut;
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get sovelluksenKielet() {
    return UiKielet;
  }

  get naytettaviaTutoriaaleja() {
    return !_.isEmpty(this.tutoriaalistore!.avaimet);
  }

  get routePath() {
    return _(this.$route.matched)
      .filter('name')
      .map(route => {
        const computeds = _.get(route, 'instances.default');
        const result = {
          ...route,
          muru: this.murut[route!.name!],
          breadname: computeds && computeds.breadcrumb,
        };
        return result;
      })
      .value();
  }

  private kaynnistaTutoriaali() {
    this.tutoriaalistore!.setActive(true);
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

  .ep-navbar {
    height: 50px;
    background-color: $etusivu-header-background;
    background-image: url('~@assets/img/banners/header.svg');
    background-position: 100% 0;
    background-repeat: no-repeat;

    @media only screen and (min-width: 2503px)  {
      background-size: 100%;
    }

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
