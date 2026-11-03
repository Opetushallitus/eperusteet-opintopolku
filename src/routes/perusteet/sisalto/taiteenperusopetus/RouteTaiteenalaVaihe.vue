<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4"
      >
        <template v-if="perusteenOsa.koodi">
          {{ $kaanna(perusteenOsa.koodi.nimi) }}
        </template>
        <template v-else>
          {{ $t('nimeton-vaihe') }}
        </template>
      </h2>

      <div
        v-if="perusteenOsa.laajuus"
        class="mb-4"
      >
        <h3>{{ $t('laajuus') }}</h3>
        <div>{{ perusteenOsa.laajuus }} {{ $t('opintopiste') }}</div>
      </div>

      <div
        v-if="perusteenOsa.kuvaus"
        class="mb-4"
      >
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <template v-if="perusteenOsa.tavoitealueet && perusteenOsa.tavoitealueet.length > 0">
        <hr>
        <h3 class="mb-4">
          {{ $t('tavoitteet-ja-keskeiset-sisaltoalueet') }}
        </h3>
        <EpTavoitesisaltoalueTavoitealueet :model-value="perusteenOsa.tavoitealueet" />
      </template>

      <div
        v-for="(vapaaTeksti, index) in perusteenOsa.vapaatTekstit"
        :key="'vapaateksti'+index"
        class="mt-4"
      >
        <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
        <ep-content-viewer
          :value="$kaanna(vapaaTeksti.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpTavoitesisaltoalueTavoitealueet from '@shared/components/EpTavoitesisaltoalue/EpTavoitesisaltoalueTavoitealueet.vue';
import { $kaanna, $t } from '@shared/utils/globals';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.taiteenalaVaiheId);

const perusteenOsa = computed<any>(() => {
  return perusteenOsaStore.perusteenOsa;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
