<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 v-if="perusteenOsa.nimi">
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <h2 v-else>
        {{ $t('nimeton-taito') }}
      </h2>

      <div class="mb-4">
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <hr>

      <div
        v-for="(kohdealue, index) in perusteenOsa.kohdealueet"
        :key="'kohdealue' + index"
        class="mb-4"
      >
        <h3 class="my-4">
          {{ $kaanna(kohdealue.kohdealueOtsikko) || $t('nimeton-kohdealue') }}
        </h3>

        <div
          v-if="kohdealue.tutkintovaatimukset && kohdealue.tutkintovaatimukset.length > 0"
          class="mb-3"
        >
          <h4>{{ $t('tutkintovaatimukset') }}</h4>
          <div class="mb-2">
            {{ $kaanna(perusteenOsa.valiotsikko) }}
          </div>
          <ul>
            <li
              v-for="(vaatimus, vIndex) in kohdealue.tutkintovaatimukset"
              :key="'vaatimus' + vIndex"
            >
              {{ $kaanna(vaatimus) }}
            </li>
          </ul>
        </div>

        <div v-if="kohdealue.arviointikriteerit && kohdealue.arviointikriteerit.length > 0">
          <h4>{{ $t('arviointikriteerit') }}</h4>
          <div class="mb-2">
            {{ $kaanna(perusteenOsa.valiotsikko) }}
          </div>
          <ul>
            <li
              v-for="(kriteeri, kIndex) in kohdealue.arviointikriteerit"
              :key="'kriteeri' + kIndex"
            >
              {{ $kaanna(kriteeri) }}
            </li>
          </ul>
        </div>

        <hr v-if="index < perusteenOsa.kohdealueet.length - 1">
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.kaantajataitoId);

const perusteenOsa = computed(() => {
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

