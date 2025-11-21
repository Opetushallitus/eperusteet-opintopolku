<template>
  <ep-spinner v-if="!opetussuunnitelma" />
  <div v-else class="opetussuunnitelma">
    <ep-header
      :koulutustyyppi="koulutustyyppi"
      :tyyppi="tyyppi"
      :murupolku="murupolku"
    >
      <template #header>
        {{ $kaanna(opetussuunnitelma.nimi) }}
      </template>
      <template #subheader>
        <div class="diaarinumero">
          {{ diaariNumero }}
        </div>
      </template>
    </ep-header>

    <EpNotificationBar :has-sisalto-kielelle="hasSisaltoKielelle" />

    <div class="container pt-4">
      <div class="lower">
        <div
          id="globalNavigation"
          ref="innerPortal"
        />
        <ep-sidebar :scroll-enabled="scrollEnabled">
          <template #bar>
            <ep-opetussuunnitelma-sidenav />
          </template>
          <template #view>
            <router-view :key="$route.fullPath">
              <template #previous-next-navigation>
                <ep-previous-next-navigation
                  :active-node="current"
                  :flattened-sidenav="flattenedSidenav"
                />
              </template>
            </router-view>
          </template>
        </ep-sidebar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, nextTick, onMounted, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import { NavigationNode, traverseNavigation } from '@shared/utils/NavigationBuilder';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSidebar from '@shared/components/EpSidebar/EpSidebar.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpOpetussuunnitelmaSidenav from '@/components/EpOpetussuunnitelmaSidenav/EpOpetussuunnitelmaSidenav.vue';
import EpNotificationBar from '@/components/EpNotificationBar/EpNotificationBar.vue';
import { OpetussuunnitelmaKevytDtoTilaEnum } from '@shared/api/ylops';
import * as _ from 'lodash';
import { ILinkkiHandler } from '@shared/components/EpContent/LinkkiHandler';
import { createOpetussuunnitelmaMurupolku } from '@/utils/murupolku';
import { Kielet } from '@shared/stores/kieli';
import { $kaanna } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

const route = useRoute();
const innerPortal = useTemplateRef('innerPortal');
const browserStore = new BrowserStore();
const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const opetussuunnitelma = computed(() => {
  return opetussuunnitelmaDataStore.opetussuunnitelma;
});

const koulutustyyppi = computed(() => {
  if (opetussuunnitelmaDataStore?.opetussuunnitelma?.jotpatyyppi === 'MUU') {
    return 'koulutustyyppi_muu';
  }
  return tyyppi.value === 'yhteinen' ? 'koulutustyyppi_1' : opetussuunnitelmaDataStore.koulutustyyppi;
});

const tyyppi = computed(() => {
  return opetussuunnitelmaDataStore.opetussuunnitelma?.tyyppi;
});

const current = computed((): NavigationNode | null => {
  return opetussuunnitelmaDataStore.current;
});

const flattenedSidenav = computed(() => {
  return opetussuunnitelmaDataStore.flattenedSidenav;
});

const murupolku = computed(() => {
  if (opetussuunnitelma.value && current.value) {
    return [
      ...createOpetussuunnitelmaMurupolku(opetussuunnitelma.value, koulutustyyppi.value),
      ...current.value.path,
    ];
  }
  return [];
});

const diaariNumero = computed((): string => {
  return opetussuunnitelma.value?.peruste?.diaarinumero || '';
});

const scrollEnabled = computed(() => {
  return !browserStore.navigationVisible.value;
});

const onRouteUpdate = async (newRoute) => {
  opetussuunnitelmaDataStore.updateRoute(newRoute);

  await nextTick();
  const h2 = document.querySelector('h2');
  h2?.setAttribute('tabindex', '-1');
  h2?.focus();
};

// Watch for route changes
watch(() => route, onRouteUpdate, { deep: true, immediate: true });

// Meta information
const getMetaInfo = computed(() => {
  if (opetussuunnitelma.value) {
    return {
      title: $kaanna(opetussuunnitelma.value?.nimi),
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: [
            $kaanna(opetussuunnitelma.value?.nimi),
            opetussuunnitelma.value?.koulutustyyppi,
          ],
        },
      ],
    };
  }
  return {};
});

useHead(getMetaInfo);

const opetussuunnitelmaEsikatselussa = computed(() => {
  return opetussuunnitelmaDataStore?.tila !== _.toLower(OpetussuunnitelmaKevytDtoTilaEnum.JULKAISTU) || _.has(route.query, 'esikatselu');
});

const hasSisaltoKielelle = computed(() => {
  return _.includes(opetussuunnitelma.value?.julkaisukielet, _.toString(Kielet.getSisaltoKieli.value));
});

const linkkiHandler = {
  nodeToRoute(node) {
    return traverseNavigation(node, true).location;
  },
} as ILinkkiHandler;

provide('linkkiHandler', linkkiHandler);
provide('opetussuunnitelma', opetussuunnitelma.value);
</script>

<style scoped lang="scss">
.opetussuunnitelma {
  .diaarinumero {
    font-size: small;
  }
}

:deep(.sidenav .view) {
  border: 0;
}

</style>
