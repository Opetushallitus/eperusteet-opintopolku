<template>
  <div class="content">
    <div v-if="kurssi">
      <h2>{{ $kaanna(kurssiNimi) || $t('nimeton-kurssi') }}</h2>

      <div
        v-if="perusteSisalto?.koodi"
        class="mt-4"
      >
        <h3>{{ $t('koodi') }}</h3>
        <span>{{ perusteSisalto.koodi.arvo }}</span>
      </div>

      <div
        v-if="perusteSisalto?.kuvaus"
        class="mt-4"
      >
        <h3>{{ $t('tavoitteisiin-liittyvat-keskeiset-sisaltoalueet') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.kuvaus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="tavoitteet.length > 0"
        class="mt-5"
      >
        <h3>{{ $t('liitetyt-tavoitteet') }}</h3>
        <div
          v-for="tavoite in tavoitteet"
          :key="'tavoite'+tavoite.id"
          class="taulukko-rivi-varitys px-2 py-3"
        >
          {{ $kaanna(tavoite.tavoite) }}
        </div>
      </div>

      <EpPaikallinenTarkennus
        v-if="$kaanna(kurssi.paikallinenTarkennus)"
        class="mt-4"
        headerh4
      >
        <ep-content-viewer
          :value="$kaanna(kurssi.paikallinenTarkennus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </EpPaikallinenTarkennus>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { getTavoiteNumero } from '@shared/utils/perusteet';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();
const route = useRoute();

const kurssiId = computed(() => {
  return _.toNumber(route.params.kurssiId);
});

const kurssi = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: kurssiId.value });
});

const perusteSisalto = computed(() => {
  return kurssi.value?.perusteSisalto;
});

const kurssiNimi = computed(() => {
  return perusteSisalto.value?.koodi?.nimi
    || kurssi.value?.nimi
    || perusteSisalto.value?.nimi;
});

const tavoitteet = computed(() => {
  return _.chain(perusteSisalto.value?.tavoitteet)
    .filter(tavoite => tavoite?.tavoite)
    .sortBy(tavoite => getTavoiteNumero(tavoite.tavoite))
    .value();
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
