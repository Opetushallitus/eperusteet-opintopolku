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
      <b-navbar-nav>
        <b-nav-item v-for="(item, idx) in items"
                    :key="idx"
                    active
                    :active-class="activeClass"
                    :class="item.activeClass"
                    :to="item.route">
          {{ $t(item.nimi) }}
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            <fas icon="language" class="mr-2"></fas>
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { koulutustyyppiTheme, koulutustyyppiStateName, stateToKoulutustyyppi,
  koulutustyyppiRelaatiot, ryhmat } from '@/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import _ from 'lodash';

@Component
export default class EpNavigation extends Vue {
  get valittuKieli() {
    return Kielet.getUiKieli();
  }

  get kielet() {
    return [
      'fi',
      'sv',
      'en',
    ];
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli();
  }

  get activeClass() {
    if (this.$route && this.$route.params.koulutustyyppi) {
      const koulutustyyppi = stateToKoulutustyyppi(this.$route.params.koulutustyyppi);
      return 'router-link-active koulutustyyppi-' + koulutustyyppiTheme(koulutustyyppi);
    }
    else {
      return 'router-link-active';
    }
  }

  private isActiveRoute(kt) {
    if (this.$route && this.$route.params.koulutustyyppi) {
      const koulutustyyppi = stateToKoulutustyyppi(this.$route.params.koulutustyyppi);
      return koulutustyyppi === kt.koulutustyyppi || _.includes(ryhmat(kt.alityypit), koulutustyyppi);
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

  get items() {
    return _.map(koulutustyyppiRelaatiot(), kt => {
      return {
        ...kt,
        nimi: koulutustyyppiStateName(kt.koulutustyyppi),
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

  valitseKieli(kieli) {
    Kielet.setUiKieli(kieli);
    Kielet.setSisaltoKieli(kieli);
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
