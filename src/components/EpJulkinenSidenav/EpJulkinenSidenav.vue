<template>
  <div
    v-sticky
    class="navbar flex items-center"
    sticky-z-index="600"
  >
    <div class="flex items-center">
      <ep-button
        class="valikko-button"
        variant="link"
        @click="active = !active"
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
      </ep-button>
      <router-link :to="{ name: 'root'}">
        <img
          :src="navImage"
          :alt="$t('eperusteet')"
          class="ml-4"
        >
      </router-link>
    </div>
    <div class="inline-flex items-center ml-auto">
      <EpKielivalinta
        julkinen
        @change="valitseKieli"
      />
    </div>
    <Drawer
      v-model:visible="active"
      position="left"
      :show-close-icon="false"
      :header="null"
    >
      <div class="pb-3 pl-3 pr-3">
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
          <router-link
            v-for="(item, idx1) in koulutustyyppiItems"
            :key="idx1"
            :to="item.route"
            class="navi nav-btn"
            active-class="active-item"
            @click="closeSidebar()"
          >
            <div class="ml-3">
              {{ $t(item.name) }}
            </div>
          </router-link>
        </nav>
        <div class="mb-2 navi-valiotsikko">
          <span>{{ $t('osaaminen-ja-maaraykset') }}</span>
        </div>
        <nav class="mb-5">
          <EpSpinner v-if="!otherItems" />
          <router-link
            v-for="(item, idx2) in otherItems"
            :key="idx2"
            :to="item.route"
            class="navi nav-btn"
            active-class="active-item"
            @click="closeSidebar()"
          >
            <div class="ml-3">
              {{ $t(item.name) }}
            </div>
          </router-link>
        </nav>
        <div class="mb-2 navi-valiotsikko">
          <span>{{ $t('tietoa-palvelusta') }}</span>
        </div>
        <nav>
          <template
            v-for="(item, idx3) in muutLinkit"
            :key="idx3"
          >
            <a
              v-if="item.link"
              :href="$kaanna(item.link)"
              class="navi nav-btn"
              target="_blank"
            >
              <div class="ml-3">
                {{ $t(item.name) }}
              </div>
            </a>
            <router-link
              v-else
              :to="item.route"
              class="navi nav-btn"
              active-class="active-item"
              @click="closeSidebar()"
            >
              <div class="ml-3">
                {{ $t(item.name) }}
              </div>
            </router-link>
          </template>
        </nav>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
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
import Drawer from 'primevue/drawer';
import EpKielivalinta from '@shared/components/EpKielivalinta/EpKielivalinta.vue';

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

.navbar {
  height: 75px;
  background-color: $white;
  padding: 0.25rem 1rem;

  :deep(.p-drawer) {
    .p-drawer-content {
      padding: 0 !important;
    }
  }
}

:deep(.ep-button button) {
  color: $black !important;
  text-decoration: none !important;
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


:deep(.navi) {
  color: $black;
  font-weight: 500;
  font-size: 15px;
  border-bottom: 1px solid $grey200;
  padding: 15px 0;
}

.navi {
  display: block;
  text-decoration: none;
  color: $black;
  font-weight: 500;
  font-size: 15px;
  border-bottom: 1px solid $grey200;
  padding: 15px 0;

  &:hover {
    text-decoration: none;
    color: $black;
  }
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
  background-color: $grey50;
}

.nav-btn:hover {
  background-color: $grey50;
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
