<template>
  <b-navbar
    id="navigation-bar"
    type="light"
    role="navigation"
    toggleable="lg"
    class="navbar-ep"
    :sticky="true"
  >
    <b-navbar-brand
      :to="{ name: 'root' }"
      :aria-label="$t('etusivu')"
    >
      <img
        src="../../../public/img/images/eperusteet-logo.svg"
        :alt="$t('eperusteet')"
        aria-hidden="true"
      >
    </b-navbar-brand>

    <b-navbar-toggle
      target="nav-collapse"
      :aria-label="$t('koulutustyyppi-valikko')"
    />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav class="d-flex justify-content-center w-100">
        <EpSpinner v-if="loading" />
        <div
          v-else
          class="d-flex flex-wrap"
        >
          <b-nav-item
            v-for="(item, idx) in items"
            :key="idx"
            active
            :active-class="activeClass"
            :class="item.activeClass"
            :to="item.route"
          >
            {{ $t('navi-'+item.name) }}
          </b-nav-item>
        </div>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav
        class="ml-auto align-self-start"
        :aria-label="$t('kielivalinta')"
      >
        <b-nav-item-dropdown right>
          <template #button-content>
            <EpMaterialIcon class="mr-2">
              language
            </EpMaterialIcon>
            <span>{{ $t(sisaltoKieli) }}</span>
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
    </b-collapse>
  </b-navbar>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  koulutustyyppiTheme,
  stateToKoulutustyyppi,
  yleissivistavat as yleissivistavatPerusteet,
  ammatilliset as ammatillisetPerusteet,
  vapaasivistystyo as vapaasivistystyoPerusteet,
  tutkintoonvalmentava as tutkintoonvalmentavaPerusteet,
  kotoutumiskoulutus as kotoutumiskoulutusPerusteet,
  muuKoulutus as muuKoulutusPerusteet,
  digitaalinenOsaaminen as digitaalinenOsaaminenPerusteet,
} from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { createLogger } from '@shared/utils/logger';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import { Kieli } from '@shared/tyypit';

const logger = createLogger('EpNavigation');
const router = useRouter();
const route = useRoute();

const props = defineProps({
  julkaistutKoulutustyypitStore: {
    type: Object,
    required: true,
  },
});

const loading = computed(() => {
  return _.isNil(props.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value)
  || _.isNil(props.julkaistutKoulutustyypitStore.muuLukumaarat.value)
  || _.isNil(props.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
});

const julkaistutKoulutustyypit = computed(() => {
  return [
    ...(props.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value || []),
    ...(muuLukumaarat.value > 0 ? ['koulutustyyppi_muu'] : []),
    ...(digitaalinenOsaaminenLkm.value > 0 ? ['koulutustyyppi_digi'] : []),
  ];
});

const digitaalinenOsaaminenLkm = computed(() => {
  return _.size(props.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
});

const digitaalinenOsaaminenPeruste = computed(() => {
  return _.first(props.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
});

const muuLukumaarat = computed((): number => {
  if (props.julkaistutKoulutustyypitStore.muuLukumaarat.value) {
    return props.julkaistutKoulutustyypitStore.muuLukumaarat.value as number;
  }

  return 0;
});

const valittuKieli = computed(() => {
  return Kielet.getUiKieli;
});

const kielet = computed(() => {
  return [
    'fi',
    'sv',
    'en',
  ];
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const routeAmmatillinen = computed(() => {
  if (route) {
    return route.name === 'ammatillinenkooste';
  }
  return false;
});

const activeClass = computed(() => {
  if (routeAmmatillinen.value) {
    return 'router-link-active koulutustyyppi-ammatillinen';
  }
  else if (route && route.params.koulutustyyppi) {
    const koulutustyyppi = stateToKoulutustyyppi(route.params.koulutustyyppi as string) || route.params.koulutustyyppi;
    return 'router-link-active koulutustyyppi-' + koulutustyyppiTheme(koulutustyyppi);
  }
  else if (route?.name === 'maaraykset' || route?.name === 'maarays') {
    return 'router-link-active oph-maaraykset';
  }
  else {
    return 'router-link-active';
  }
});

const isActiveRoute = (kt) => {
  if (route) {
    return kt.name === route.params.koulutustyyppi
      || (routeAmmatillinen.value && kt.name === 'ammatillinen');
  }
  return false;
};

const setActiveClass = (kt) => {
  if ((isActiveRoute(kt))) {
    return {
      activeClass: activeClass.value,
    };
  }
  return {};
};

const ammatilliset = computed(() => {
  return _.map(ammatillisetPerusteet(), am => {
    return {
      ...am,
      ...setActiveClass({ name: 'ammatillinen' }),
    };
  });
});

const yleissivistavat = computed(() => {
  return _.map(yleissivistavatPerusteet(), kt => ({
    ...kt,
    ...setActiveClass(kt),
  }));
});

const vapaasivistystyo = computed(() => {
  return _.map(vapaasivistystyoPerusteet(), kt => ({
    ...kt,
    ...setActiveClass(kt),
  }));
});

const tutkintoonvalmentava = computed(() => {
  return _.map(tutkintoonvalmentavaPerusteet(), kt => ({
    ...kt,
    ...setActiveClass(kt),
  }));
});

const kotoutumiskoulutus = computed(() => {
  return _.map(kotoutumiskoulutusPerusteet(), kt => ({
    ...kt,
    ...setActiveClass(kt),
  }));
});

const muuKoulutus = computed(() => {
  return _.map(muuKoulutusPerusteet(), kt => ({
    ...kt,
    ...setActiveClass(kt),
  }));
});

const digitaalinenOsaaminen = computed(() => {
  return digitaalinenOsaaminenPerusteet(digitaalinenOsaaminenPeruste.value?.id);
});

const maarayskokoelma = computed(() => {
  if (sisaltoKieli.value === Kieli.en) {
    return [];
  }

  return [{
    name: 'opetushallituksen-maaraykset',
    route: {
      name: 'maaraykset',
    },
  }];
});

const items = computed(() => {
  return [
    ..._.filter([
      ...yleissivistavat.value,
      ...ammatilliset.value,
      ...vapaasivistystyo.value,
      ...tutkintoonvalmentava.value,
      ...kotoutumiskoulutus.value,
      ...muuKoulutus.value,
      ...digitaalinenOsaaminen.value,
    ], ylanavi => _.some(ylanavi.alityypit, alityyppi => _.includes(julkaistutKoulutustyypit.value, alityyppi))),
    ...maarayskokoelma.value,
  ];
});

const valitseKieli = async (kieli) => {
  // Vaihdetaan kieli päivittämällä route
  const current = router.currentRoute;

  // Replacella ei muodostu historiatietoa
  // Muut parametrit ja tiedot näyttäisi säilyvän replacella
  try {
    await router.replace({
      name: current.name,
      params: {
        ...current.params,
        lang: kieli || 'fi',
      },
    });
  }
  catch (e: any) {
    if (e.name === 'NavigationDuplicated') {
      logger.warn('Uusi kieli on sama kuin nykyinen');
    }
    else {
      throw e;
    }
  }
};
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
    :deep(.nav-link.dropdown-toggle) {
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
    :deep(.nav-link) {
      padding: 0.5rem 0rem 0.5rem 0rem !important;
      margin-left: 1rem;
      margin-right: 1rem;
    }
    :deep(.dropdown-menu) {
      border-radius: 0;
      border: 0;
      .dropdown-item {
        padding: 0.5rem 1rem !important;
      }
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
      &.koulutustyyppi-lukiokoulutus {
        border-bottom-color: $koulutustyyppi-lukiokoulutus-color;
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

      &.koulutustyyppi-muukoulutus {
        border-bottom-color: $koulutustyyppi-muu-color;
      }

      &.koulutustyyppi-digiosaaminen {
        border-bottom-color: $digitaalinen-osaaminen-color;
      }

      &.oph-maaraykset {
        border-bottom-color: $oph-maaraykset-color;
      }
    }

  }

  // Tätä ei tarvittaisi, jos nav-itemin alielementin router-link tilan voisi asettaa proppina
  .navbar-nav .nav-item.router-link-active {
    :deep(.nav-link) {
      padding-bottom: 0.25rem;
      border-bottom: #001A58 0.25rem solid;
    }
    &.koulutustyyppi-ammatillinen {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-ammatillinen-color;
      }
    }
    &.koulutustyyppi-esiopetus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-esiopetus-color;
      }
    }
    &.koulutustyyppi-lukiokoulutus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-lukiokoulutus-color;
      }
    }
    &.koulutustyyppi-perusopetus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-perusopetus-color;
      }
    }
    &.koulutustyyppi-varhaiskasvatus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-varhaiskasvatus-color;
      }
    }
    &.koulutustyyppi-taiteenperusopetus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-taiteenperusopetus-color;
      }
    }
    &.koulutustyyppi-vapaasivistystyo {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-vapaasivistystyo-color;
      }
    }
    &.koulutustyyppi-tutkintoonvalmentava {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-tutkintoonvalmentava-color;
      }
    }

    &.koulutustyyppi-kotoutumiskoulutus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-kotoutumiskoulutus-color;
      }
    }

    &.koulutustyyppi-muukoulutus {
      :deep(.nav-link) {
        border-bottom-color: $koulutustyyppi-muu-color;
      }
    }
  }
}
</style>
