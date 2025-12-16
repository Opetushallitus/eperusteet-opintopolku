<template>
  <div>
    <EpJulkinenSidenav />
    <main role="main">
      <router-view />
    </main>
    <ep-footer />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, onMounted, onUnmounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import EpFooter from '@/components/EpFooter/EpFooter.vue';
import { useJulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { Kielet } from '@shared/stores/kieli';
import EpJulkinenSidenav from '@/components/EpJulkinenSidenav/EpJulkinenSidenav.vue';
import { useTietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { $t } from '@shared/utils/globals';
import { pinia } from '@/pinia';
import { useHead } from '@unhead/vue';
import { onBeforeUnmount } from 'vue';

const route = useRoute();
const julkaistutKoulutustyypitStore = useJulkaistutKoulutustyypitStore(pinia);
const tietoapalvelustaStore = useTietoapalvelustaStore(pinia);
const osaamismerkitStore = useOsaamismerkitStore(pinia);
let observer: MutationObserver | null = null;

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const julkaistutKoulutustyypit = computed(() => {
  return julkaistutKoulutustyypitStore.julkaistutKoulutustyypit;
});

const titleTemplate = computed(() => {
  return '%s - ' + $t('eperusteet');
});

const sisaltoKieliChange = async () => {
  await julkaistutKoulutustyypitStore.fetch(sisaltoKieli.value);
};

const getMetaInfo = () => {
  const lang = _.get(route, 'params.lang');
  return {
    titleTemplate: titleTemplate.value,
    htmlAttrs: {
      lang: lang || 'fi',
    },
    meta: [
      {
        vmid: 'description',
        name: 'description',
        content: $t('eperusteet-kuvaus'),
      },
      {
        vmid: 'keywords',
        name: 'keywords',
        content: $t('avainsanalista'),
      },
      {
        vmid: 'author',
        name: 'author',
        content: $t('opetushallitus'),
      },
      {
        vmid: 'og:site_name',
        property: 'og:site_name',
        content: $t('eperusteet'),
      },
      {
        vmid: 'og:description',
        property: 'og:description',
        content: $t('eperusteet-kuvaus'),
      },
      {
        vmid: 'og:locale',
        property: 'og:locale',
        content: lang + '_FI',
      },
    ],
  };
};

useHead(getMetaInfo);

// Watch for sisaltoKieli changes
watch(sisaltoKieli, async () => {
  await sisaltoKieliChange();
}, { immediate: false });

onMounted(async () => {
  await Promise.all([sisaltoKieliChange(), tietoapalvelustaStore.fetch()]);
  observeTitle();
});

const observeTitle = () => {
  observer = new MutationObserver(() => {
    const title = document.title;
    const pag = (window as any)._paq;

    if (pag) {
      pag.push(['setDocumentTitle', title]);
      pag.push(['trackPageView']);
    }
  });

  const titleEl = document.querySelector('title');
  if (titleEl) {
    observer?.observe(titleEl, { childList: true });
  }
};

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style lang="scss">
@import '@shared/styles/_variables.scss';

.skip-to-content {
  position: absolute !important;
  z-index: 1030;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 0.6875rem !important;
  border: 1px solid gray !important;
}
</style>
