<template>
  <ep-spinner
    v-if="!peruste"
    full-screen
  />
  <div
    v-else
    class="peruste"
  >
    <ep-header
      v-sticky
      :koulutustyyppi="koulutustyyppi"
      :murupolku="murupolku"
      :tyyppi="peruste.tyyppi"
      sticky-side="top"
    >
      <template
        v-if="peruste.tyyppi ==='opas' && peruste.opasTyyppi !== 'tietoapalvelusta'"
        #header
      >
        {{ $t('ohjeet-ja-materiaalit') }}: {{ $kaanna(peruste.nimi) }}
      </template>
      <template
        v-else
        #header
      >
        {{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{ peruste.laajuus }} {{ $t('osaamispiste') }}</span>
      </template>
      <template #subheader>
        <div
          v-if="peruste.tyyppi !=='opas'"
          class="diaarinumero"
        >
          {{ peruste.diaarinumero }}
        </div>
        <ep-search
          v-model="query"
          class="query mt-3"
          :maxlength="100"
          :placeholder="$t('hae')"
          :sr-only-label-text="sisaltoHakuSrLabel"
        />
      </template>
    </ep-header>

    <EpPerusteNotificationBar
      :julkaisut="julkaisut"
      :peruste="peruste"
    />

    <div class="container mt-4">
      <div class="lower">
        <div v-if="sisaltohaku">
          <ep-peruste-haku
            :peruste-data-store="perusteDataStore"
            :query="query"
            @clear="suljeSisaltohaku"
          >
            <template #nimi="{ tulos }">
              <router-link
                :to="tulos.location"
                @click="sisaltohakuValinta(tulos.location)"
              >
                {{ tulos.nimi }}
              </router-link>
            </template>
          </ep-peruste-haku>
        </div>
        <template v-else>
          <div
            id="globalNavigation"
            ref="innerPortal"
          />
          <ep-sidebar :scroll-enabled="scrollEnabled">
            <template #bar>
              <div>
                <ep-peruste-sidenav
                  :peruste-data-store="perusteDataStore"
                />
              </div>
              <div class="tags">
                <span class="tag" />
              </div>
            </template>

            <template #view>
              <router-view :key="route.fullPath">
                <template
                  v-if="peruste.tyyppi ==='opas'"
                  #header
                >
                  {{ $t('oppaan-tiedot') }}
                </template>
                <template
                  v-if="peruste.tyyppi ==='opas'"
                  #nimi
                >
                  <ep-form-content
                    name="oppaan-nimi"
                    header-type="h3"
                    header-class="h6"
                  >
                    <ep-field v-model="peruste.nimi" />
                  </ep-form-content>
                </template>
                <template #previous-next-navigation>
                  <ep-previous-next-navigation
                    :active-node="current"
                    :flattened-sidenav="flattenedSidenav"
                  />
                </template>
              </router-view>
            </template>
          </ep-sidebar>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, provide, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import { NavigationNode, traverseNavigation } from '@shared/utils/NavigationBuilder';
import * as _ from 'lodash';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPerusteSidenav from '@/components/EpPerusteSidenav/EpPerusteSidenav.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpPerusteNotificationBar from '@/components/EpNotificationBar/EpPerusteNotificationBar.vue';
import EpPerusteHaku from '@/components/EpPerusteHaku.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';
import { createPerusteMurupolku } from '@/utils/murupolku';
import { PerusteKaikkiDtoTyyppiEnum } from '@shared/api/eperusteet';
import { $kaanna, $t } from '@shared/utils/globals';
import { getCachedPerusteStore, usePerusteCacheStore } from '@/stores/PerusteCacheStore';
import { pinia } from '@/pinia';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

const route = useRoute();
const router = useRouter();

const perusteCacheStore = usePerusteCacheStore(pinia);
const perusteDataStore = ref<any | null>(null);

const query = ref('');
const sisaltohaku = ref(false);
const browserStore = new BrowserStore();

// Replace debounce method
const queryImplDebounce = _.debounce((value) => {
  if (query.value.length > 2) {
    sisaltohaku.value = true;
    router.replace({
      query: {
        ...(value && { query: value }),
      },
    }).catch(() => {});
  }
}, 300);

onMounted(async () => {
  query.value = routeQuery.value;
  await init();
});

const init = async () => {
  perusteDataStore.value = null;
  await perusteCacheStore.addPerusteStore(route.params.perusteId, route.params.revision);
  perusteDataStore.value = perusteCacheStore.getPerusteStore(route.params.perusteId, route.params.revision);
  onRouteUpdate(route);
};

watch(() => route.params.perusteId + _.toString(route.params.revision), async () => {
  await init();
});

const routeQuery = computed(() => {
  return route.query.query as string || '';
});

const sidenav = computed(() => {
  return perusteDataStore.value?.sidenav;
});

const peruste = computed(() => {
  return perusteDataStore.value?.peruste;
});

const current = computed((): NavigationNode | null => {
  return perusteDataStore.value?.current;
});

const flattenedSidenav = computed(() => {
  return perusteDataStore.value?.flattenedSidenav;
});

const murupolku = computed(() => {
  if (peruste.value) {
    let currentPath = current.value ? current.value.path : [];
    return [
      ...createPerusteMurupolku(peruste.value, koulutustyyppi.value, routeKoulutustyyppi.value),
      ...currentPath,
    ];
  }
  return [];
});

const routeKoulutustyyppi = computed(() => {
  return route.params?.koulutustyyppi;
});

const oppaanKoulutustyyppi = computed(() => {
  if (_.size(peruste.value?.oppaanKoulutustyypit) === 1) {
    return _.take((peruste.value?.oppaanKoulutustyypit as any[])).toString();
  }
  return undefined;
});

const koulutustyyppi = computed(() => {
  return peruste.value?.koulutustyyppi || oppaanKoulutustyyppi.value;
});

const julkaisut = computed(() => {
  return perusteDataStore.value?.julkaisut;
});

const routeName = computed(() => {
  return route.name;
});

const ensimainenNavi = computed(() => {
  return _.find(flattenedSidenav.value, navi => navi.type !== 'root');
});

const scrollEnabled = computed(() => {
  return !browserStore.navigationVisible.value;
});

const sisaltoHakuSrLabel = computed(() => {
  if (peruste.value?.tyyppi === _.toLower(PerusteKaikkiDtoTyyppiEnum.DIGITAALINENOSAAMINEN)) {
    return $t('hae-digitaalisten-osaamisten-kuvauksista');
  }
  return $t('hae-perusteen-sisallosta');
});

// Methods
const suljeSisaltohaku = () => {
  query.value = '';
  sisaltohaku.value = false;
};

const sisaltohakuValinta = (location) => {
  router.push(location).catch(() => { });
  sisaltohaku.value = false;
  query.value = '';
  onRouteUpdate(route);
};

const onRouteUpdate = (currentRoute) => {
  perusteDataStore.value?.updateRoute(currentRoute);
};

// Watch handlers
watch(routeQuery, () => {
  query.value = routeQuery.value;
});

watch(query, (value) => {
  queryImplDebounce(value);
});

watch(route, async () => {
  onRouteUpdate(route);
  await nextTick();
  const h2 = document.querySelector('h2');
  h2?.setAttribute('tabindex', '-1');
  // h2?.focus();
}, { deep: true, immediate: true });

watch(flattenedSidenav, (newVal, oldVal) => {
  if (routeName.value === 'peruste') {
    if (ensimainenNavi.value && !oldVal) {
      router.replace(ensimainenNavi.value.location!);
    }
  }
}, { immediate: true });

// Provide 'linkkiHandler' for descendants
const linkkiHandler: ILinkkiHandler = {
  nodeToRoute(node) {
    return traverseNavigation(node, false).location;
  },
};

provide('linkkiHandler', linkkiHandler);

useHead({
  title: computed(() => $kaanna(peruste.value?.nimi)),
  meta: computed(() => {
    if (peruste.value) {
      return [
        {
          vmid: 'description',
          name: 'description',
          content: [
            $kaanna(peruste.value.nimi),
            ...(peruste.value.koulutustyyppi ? [$t(peruste.value.koulutustyyppi)] : []),
          ],
        },
      ];
    }
    return [];
  }),
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.peruste {
  .diaarinumero {
    font-weight: bold;
    font-size: small;
  }

  .query {
    max-width: 340px;
  }

  @media (max-width: 991.98px) {
    .query {
      max-width: 100%;
    }
  }
}

.sidebar {
  .search {
    padding: $sidenav-padding;
  }

  .navigation-tree {
    padding: $sidenav-padding;
  }
}
</style>
