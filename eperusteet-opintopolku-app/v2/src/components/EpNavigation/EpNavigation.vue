<template>
<div class="container">
  <b-navbar type="light"
            role="navigation"
            toggleable="lg"
            class="navbar-ep">
    <b-navbar-brand href="#">
      <b-link :to="{ name: 'root' }">
        <img src="../../../public/img/icons/eperusteet-logo.svg" :alt="$t('eperusteet')">
      </b-link>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="flex-wrap">
        <b-nav-item v-for="(item, idx) in items"
                    :key="idx"
                    active
                    :active-class="activeClass"
                    :class="item.activeClass"
                    :to="item.route">
          {{ $t(item.name) }}
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
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { koulutustyyppiTheme, koulutustyyppiStateName, stateToKoulutustyyppi,
  koulutustyyppiRelaatiot, ryhmat } from '@/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { Route } from 'vue-router';
import { VueRouter } from 'vue-router/types/router';
import { createLogger } from '@shared/stores/logger';

const logger = createLogger('EpNavigation');

@Component
export default class EpNavigation extends Vue {
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
    return Kielet.getSisaltoKieli;
  }

  get activeClass() {
    if (this.$route && this.$route.params.koulutustyyppi) {
      const koulutustyyppi = stateToKoulutustyyppi(this.$route.params.koulutustyyppi);
      return 'router-link-active koulutustyyppi-' + koulutustyyppiTheme(koulutustyyppi);
    }
    else if (this.$route && this.$route.name === 'ammatillinenSelaus') {
      return 'router-link-active koulutustyyppi-ammatillinen';
    }
    else {
      return 'router-link-active';
    }
  }

  private isActiveRoute(kt) {
    if (this.$route) {
      const koulutustyyppi = stateToKoulutustyyppi(this.$route.params.koulutustyyppi);
      return _.includes(ryhmat(kt.koulutustyyppi), koulutustyyppi);
    }
    return false;
  }

  private setActiveClass(kt) {
    if (this.isActiveRoute(kt)) {
      return {
        activeClass: this.activeClass,
      };
    }
  }

  get ammatilliset() {
    return [{
      name: 'ammatillinen-koulutus',
      route: {
        name: 'ammatillinenSelaus',
      },
    }];
  }

  get yleissivistavat() {
    return _.map(koulutustyyppiRelaatiot(), kt => {
      return {
        ...kt,
        name: koulutustyyppiStateName(kt.koulutustyyppi),
        route: {
          name: 'kooste',
          params: {
            koulutustyyppi: koulutustyyppiStateName(kt.koulutustyyppi),
          },
        },
        ...this.setActiveClass(kt)
      };
    });
  }

  get items() {
    return [
      ...this.yleissivistavat,
      ...this.ammatilliset];
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
        }
      });
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
@import '../../styles/_variables.scss';

.navbar-ep {
  padding-left: 15px;
  padding-right: 15px;
  .navbar-nav .nav-item {
    white-space: nowrap;
    color: #000;
    font-weight: bold;
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
}
@media (min-width: 992px) {
  .navbar-ep {
    .navbar-nav .nav-link {
      padding-right: 1rem;
      padding-left: 1rem;
      &:not(.router-link-active) {
        padding-bottom: 0.5rem;
      }
      &.router-link-active {
        padding-bottom: 0.25rem;
        border-bottom: #001A58 0.25rem solid;

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
    }
  }
}

</style>
