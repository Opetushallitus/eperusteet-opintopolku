<template>
  <b-navbar type="light"
            role="navigation"
            toggleable="lg"
            class="navbar-ep"
            :sticky="true"
            id="navigation-bar">
    <b-navbar-brand :to="{ name: 'root' }">
      <img src="../../../public/img/images/eperusteet-logo.svg" :alt="$t('eperusteet')">
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav >
      <b-navbar-nav class="flex-wrap">
        <EpSpinner v-if="!julkaistutKoulutustyypit" />
        <b-nav-item v-else v-for="(item, idx) in items"
                    :key="idx"
                    active
                    :active-class="activeClass"
                    :class="item.activeClass"
                    :to="item.route">
          {{ $t('navi-'+item.name) }}
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            <fas fixed-width icon="language" class="mr-2"></fas>
            <span>{{ $t(sisaltoKieli) }}</span>
          </template>
          <b-dropdown-item v-for="(kieli, idx) in kielet"
                           :key=idx
                           @click="valitseKieli(kieli)">{{ $t(kieli) }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { koulutustyyppiTheme, stateToKoulutustyyppi,
  ryhmat, yleissivistavat, ammatilliset, vapaasivistystyo, tutkintoonvalmentava, kotoutumiskoulutus } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { Route } from 'vue-router';
import { VueRouter, RawLocation } from 'vue-router/types/router';
import { createLogger } from '@shared/utils/logger';
import { Perusteet } from '@shared/api/eperusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';

const logger = createLogger('EpNavigation');

@Component({
  components: {
    EpSpinner,
  },
})
export default class EpNavigation extends Vue {
  @Prop({ required: true })
  private julkaistutKoulutustyypitStore!: JulkaistutKoulutustyypitStore;

  get julkaistutKoulutustyypit() {
    return this.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value;
  }

  get valittuKieli() {
    return Kielet.getUiKieli;
  }

  get kielet() {
    return [
      'fi',
      'sv',
      'en',
    ];
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get activeClass() {
    if (this.routeAmmatillinen) {
      return 'router-link-active koulutustyyppi-ammatillinen';
    }
    else if (this.$route && this.$route.params.koulutustyyppi) {
      const koulutustyyppi = stateToKoulutustyyppi(this.$route.params.koulutustyyppi) || this.$route.params.koulutustyyppi;
      return 'router-link-active koulutustyyppi-' + koulutustyyppiTheme(koulutustyyppi);
    }
    else {
      return 'router-link-active';
    }
  }

  get routeAmmatillinen() {
    if (this.$route) {
      return this.$route.name === 'ammatillinenkooste';
    }
  }

  private isActiveRoute(kt) {
    if (this.$route) {
      return kt.name === this.$route.params.koulutustyyppi || (this.routeAmmatillinen && kt.name === 'ammatillinen');
    }
    return false;
  }

  private setActiveClass(kt) {
    if ((this.isActiveRoute(kt))) {
      return {
        activeClass: this.activeClass,
      };
    }
  }

  get ammatilliset() {
    return _.map(ammatilliset(), am => {
      return {
        ...am,
        ...this.setActiveClass({ name: 'ammatillinen' }),
      };
    });
  }

  get yleissivistavat() {
    return _.map(yleissivistavat(), kt => ({
      ...kt,
      ...this.setActiveClass(kt),
    }));
  }

  get vapaasivistystyo() {
    return _.map(vapaasivistystyo(), kt => ({
      ...kt,
      ...this.setActiveClass(kt),
    }));
  }

  get tutkintoonvalmentava() {
    return _.map(tutkintoonvalmentava(), kt => ({
      ...kt,
      ...this.setActiveClass(kt),
    }));
  }

  get kotoutumiskoulutus() {
    return _.map(kotoutumiskoulutus(), kt => ({
      ...kt,
      ...this.setActiveClass(kt),
    }));
  }

  get items() {
    return _.filter([
      ...this.yleissivistavat,
      ...this.ammatilliset,
      ...this.vapaasivistystyo,
      ...this.tutkintoonvalmentava,
      ...this.kotoutumiskoulutus,
    ], ylanavi => _.some(ylanavi.alityypit, alityyppi => _.includes(this.julkaistutKoulutustyypit, alityyppi)));
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
          lang: kieli || this.$i18n.fallbackLocale,
        },
      } as RawLocation);
    }
    catch (e) {
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

.navbar-ep {

  background-color: #fff;

  .navbar-nav .nav-item {
    white-space: nowrap;
    color: #000;
    font-weight: 600;
  }

  .nav-item:hover {
    background-color:#F2F2F2;
  }

  .navbar-nav.ml-auto .nav-item.dropdown {
    /deep/ .nav-link.dropdown-toggle {
      color: #001A58;
    }
  }
}
// Mobiilivalikko auki kun alle 992px
// Todo: käytä muuttujia
@media (max-width: 991.98px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: 100% !important;
  }
  .navbar-ep {
    padding: 0;
    .navbar-brand {
      padding: 10px 15px;
      margin: 0;
    }
    .navbar-toggler {
      padding: 15px;
    }
    /deep/ .nav-link {
      padding: 0.5rem 0rem 0.5rem 0rem !important;
      margin-left: 1rem;
      margin-right: 1rem;
    }
    /deep/ .dropdown-menu {
      border-radius: 0;
      border: 0;
      .dropdown-item {
        padding: 0.5rem 1rem !important;
      }
    }
  }
}

@media (min-width: 1300px) {
  .navbar-ep {
    .navbar-nav.flex-wrap {
      margin-left: calc((100% - 1140px) / 2);
    }
  }
}

.navbar-ep {

  @media (min-width: 1200px) {
    padding-left: 50px;
    padding-right: 50px;
  }

  .navbar-nav .nav-link {
    &:not(.router-link-active) {
      padding-bottom: 0.5rem;
    }
    &.router-link-active {
      padding-bottom: 0.25rem;
      border-bottom: #001A58 0.25rem solid;
      transition: all .3s ease;

      &.koulutustyyppi-ammatillinen {
        border-bottom-color: $koulutustyyppi-ammatillinen-color;
      }
      &.koulutustyyppi-esiopetus {
        border-bottom-color: $koulutustyyppi-esiopetus-color;
      }
      &.koulutustyyppi-lukio {
        border-bottom-color: $koulutustyyppi-lukio-color;
      }
      &.koulutustyyppi-perusopetus {
        border-bottom-color: $koulutustyyppi-perusopetus-color;
      }
      &.koulutustyyppi-varhaiskasvatus {
        border-bottom-color: $koulutustyyppi-varhaiskasvatus-color;
      }
      &.koulutustyyppi-taiteenperusopetus {
        border-bottom-color: $koulutustyyppi-taiteenperusopetus-color;
      }
      &.koulutustyyppi-vapaasivistystyo {
        border-bottom-color: $koulutustyyppi-vapaasivistystyo-color;
      }
      &.koulutustyyppi-tutkintoonvalmentava {
        border-bottom-color: $koulutustyyppi-tutkintoonvalmentava-color;
      }

      &.koulutustyyppi-kotoutumiskoulutus {
        border-bottom-color: $koulutustyyppi-kotoutumiskoulutus-color;
      }
    }
  }

  // Tätä ei tarvittaisi, jos nav-itemin alielementin router-link tilan voisi asettaa proppina
  .navbar-nav .nav-item.router-link-active {
    /deep/ .nav-link {
      padding-bottom: 0.25rem;
      border-bottom: #001A58 0.25rem solid;
    }
    &.koulutustyyppi-ammatillinen {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-ammatillinen-color;
      }
    }
    &.koulutustyyppi-esiopetus {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-esiopetus-color;
      }
    }
    &.koulutustyyppi-lukio {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-lukio-color;
      }
    }
    &.koulutustyyppi-perusopetus {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-perusopetus-color;
      }
    }
    &.koulutustyyppi-varhaiskasvatus {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-varhaiskasvatus-color;
      }
    }
    &.koulutustyyppi-taiteenperusopetus {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-taiteenperusopetus-color;
      }
    }
    &.koulutustyyppi-vapaasivistystyo {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-vapaasivistystyo-color;
      }
    }
    &.koulutustyyppi-tutkintoonvalmentava {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-tutkintoonvalmentava-color;
      }
    }

    &.koulutustyyppi-kotoutumiskoulutus {
      /deep/ .nav-link {
        border-bottom-color: $koulutustyyppi-kotoutumiskoulutus-color;
      }
    }
  }
}

</style>
