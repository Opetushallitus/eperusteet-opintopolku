<template>
  <div class="navbar" v-sticky sticky-z-index="600">
    <div>
      <b-button v-b-toggle.sidebar-no-header variant="transparent">
        <div class="menu">
          <EpMaterialIcon v-if="isActive" icon-shape="outlined" size="30px">close</EpMaterialIcon>
          <EpMaterialIcon v-else icon-shape="outlined" size="30px">menu</EpMaterialIcon>
          <span class="text">{{ $t('valikko')}}</span>
        </div>
      </b-button>
      <img :src="navImage" :alt="$t('eperusteet')" class="ml-3" />
    </div>
    <b-sidebar id="sidebar-no-header"
               v-model="isActive"
               aria-labelledby="sidebar-no-header-title"
               no-header
               no-slide
               bg-variant="white"
               no-close-on-route-change>
      <template>
        <div class="p-4">
          <b-tabs content-class="mt-3" fill>
            <b-tab v-for="(item, idx) in kielet"
                   :key="idx"
                   :title="$t(item)"
                   :active="sisaltoKieli === item"
                   @click="valitseKieli(item)"></b-tab>
          </b-tabs>
          <nav class="mb-4">
            <b-nav vertical>
              <b-nav-item active :to="{ name: 'root'}" link-classes="navi navi-home">
                <EpMaterialIcon icon-shape="outlined" size="22px">home</EpMaterialIcon>
                {{ $t('etusivu') }}
              </b-nav-item>
            </b-nav>
          </nav>
          <div class="mb-2 navi-valiotsikko">
            <span>{{ $t('opetussuunnitelmat-ja-perusteet') }}</span>
          </div>
          <nav class="mb-5">
            <b-nav vertical v-for="(item, idx1) in koulutustyyppiItems" :key="idx1">
              <b-nav-item :to="item.route" link-classes="navi">{{ $t(item.name) }}</b-nav-item>
            </b-nav>
          </nav>
          <div class="mb-2 navi-valiotsikko">
            <span>{{ $t('osaaminen-ja-maaraykset') }}</span>
          </div>
          <nav class="mb-5">
            <b-nav vertical v-for="(item, idx2) in otherItems" :key="idx2">
              <b-nav-item :to="item.route" link-classes="navi">{{ $t(item.name) }}</b-nav-item>
            </b-nav>
          </nav>
          <div class="mb-2 navi-valiotsikko">
            <span>{{ $t('tietoa-palvelusta') }}</span>
          </div>
          <nav>
            <b-nav vertical v-for="(item, idx2) in muutLinkit" :key="idx2">
              <b-nav-item :href="$kaanna(item.link)"  link-classes="navi">{{ $t(item.name) }}</b-nav-item>
            </b-nav>
          </nav>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import Sticky from 'vue-sticky-directive';
import { koulutustyyppiLinks, osaaminenJaMaarayksetLinks, otherLinks } from '@/utils/navigointi';
import { RawLocation, VueRouter } from 'vue-router/types/router';
import { Route } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';
import logo from '@assets/img/images/logo.png';
import { createLogger } from '@shared/utils/logger';
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

  private active: boolean = false;

  get koulutustyyppiItems() {
    return koulutustyyppiLinks();
  }

  get otherItems() {
    return osaaminenJaMaarayksetLinks(this.digitaalinenOsaaminenPeruste?.id);
  }

  get muutLinkit() {
    return otherLinks();
  }

  get digitaalinenOsaaminenPeruste() {
    return _.first(this.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
  }

  get isActive() {
    return this.active;
  }

  set isActive(value) {
    this.active = value;
    this.$emit('setVisibility', value);
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

  async valitseKieli(kieli) {
    // Vaihdetaan kieli päivittämällä route
    const router: VueRouter = this.$router;
    const current: Route = router.currentRoute;

    // Replacella ei muodostu historiatietoa
    // Muut parametrit ja tiedot näyttäisi säilyvän replacella
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
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

::v-deep .b-sidebar {
  margin-top: 70px;
  width: 400px;
  box-shadow: 0 1rem 0.5rem rgba(0, 0, 0, 0.5) !important;

  @media (max-width: 900px) {
    width: 100%;
  }
}

::v-deep .tabs .nav-tabs .nav-item .active {
  color: $black;
  font-weight: unset;
  border-image: linear-gradient(to right, #70ff00, #0033ff, #ff0000) 1;
  border-width: 0 0 3px 0;
  border-style: solid;
}

::v-deep .nav.nav-tabs .nav-link {
  color: $black;
}

.navbar {
  height: 70px;
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
  border-bottom: 0
}

.navi-valiotsikko {
  color: $green;
  font-size: 15px;
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
</style>
