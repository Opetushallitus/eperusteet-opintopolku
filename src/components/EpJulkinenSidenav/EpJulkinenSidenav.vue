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
          <template #button-content>
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
      :visible="active"
      aria-labelledby="sidebar-no-header-title"
      no-header
      bg-variant="white"
      no-close-on-route-change
      @change="active = $event"
    >
      <div class="pl-3 pr-3 pb-3">
        <div class="mt-3 mb-4">
          <router-link
            :to="{ name: 'root'}"
          >
            <span
              class="navi-home"
              @click="closeSidebar()"
            >
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
    </b-sidebar>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { navigoitavatKoulutustyyppiRyhmat, navigoitavatMuutRyhmat, otherLinks } from '@/utils/navigointi';
import { Kielet } from '@shared/stores/kieli';
import logo from '@assets/img/banners/opintopolku/logo.svg';
import { createLogger } from '@shared/utils/logger';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { $kaanna } from '@shared/utils/globals';
import { useTietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { useJulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { pinia } from '@/pinia';
import { Kieli } from '@shared/tyypit';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

const logger = createLogger('EpJulkinenSidenav');

const julkaistutKoulutustyypitStore = useJulkaistutKoulutustyypitStore(pinia);
const tietoapalvelustaStore = useTietoapalvelustaStore(pinia);
const osaamismerkitStore = useOsaamismerkitStore(pinia);

// Setup router
const router = useRouter();

// Define reactive state
const active = ref(false);

// Computed properties
const koulutustyyppiItems = computed(() => {
  return navigoitavatKoulutustyyppiRyhmat(julkaistutKoulutustyypitStore.julkaistutKoulutustyypit as any);
});

const otherItems = computed(() => {
  return navigoitavatMuutRyhmat(osaamismerkitStore.kategoriat as any, digitaalinenOsaaminenPeruste.value);
});

const tietoapalvelusta = computed(() => {
  return tietoapalvelustaStore.tietoapalvelusta;
});

const muutLinkit = computed(() => {
  return [
    ...(tietoapalvelusta.value ? [tietoapalvelusta.value] : []),
    ...otherLinks(),
  ];
});

const digitaalinenOsaaminenPeruste = computed(() => {
  return _.first(julkaistutKoulutustyypitStore.digitaalinenOsaaminen);
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const kielet = computed(() => {
  return [
    'fi',
    'sv',
    'en',
  ];
});

const navImage = computed(() => {
  return logo;
});

const icon = computed(() => {
  return active.value ? 'close' : 'menu';
});

// Methods
const valitseKieli = async (kieli: string) => {
  const current = router.currentRoute.value;

  // Resolve the new route with updated language
  const newRoute = router.resolve({
    name: current.name,
    params: {
      ...current.params,
      lang: kieli,
    },
    query: current.query,
  });

  // Force full page reload with new language
  window.location.href = newRoute.href;
  window.location.reload();
};

const closeSidebar = () => {
  active.value = false;
};

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

:deep(.b-sidebar) {
  margin-top: 70px;
  padding-bottom: 70px;
  width: 400px;
  box-shadow: 0 1rem 0.5rem rgba(0, 0, 0, 0.5) !important;

  @media (max-width: 900px) {
    width: 100%;
  }
}

:deep(.tabs .nav-tabs .nav-item .nav-link:hover:not(.active)) {
  background: unset;
  border-color: $oph-green;
  border-width: 0 0 2px 0;
  border-style: solid;
}

:deep(.nav.nav-tabs .nav-link) {
  color: $black;
}

:deep(.nav-link) {
  color: $black;
}

.navbar {
  height: 75px;
  background-color: $white;
  padding: 0.25rem 1rem;
  // position: sticky;
}

:deep(.navi) {
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
