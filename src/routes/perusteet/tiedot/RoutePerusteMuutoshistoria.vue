<template>
  <div class="content">
    <h2 class="otsikko mb-2">
      {{ $t('muutoshistoria') }}
    </h2>

    <div>
      {{ $t('peruste-muutoshistoria-kuvaus') }}
      <router-link :to="{ name: 'perusteTiedot' }">
        {{ $t('palaa-perusteen-tietoihin') }}
      </router-link>
    </div>

    <div
      v-if="julkaisut && julkaisut.length > 0"
      class="mt-2"
    >
      <EpJulkaisuHistoriaJulkinen
        :julkaisut="julkaisut"
        nayta-kaikki
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import EpJulkaisuHistoriaJulkinen from '@shared/components/EpJulkaisuHistoriaJulkinen/EpJulkaisuHistoriaJulkinen.vue';
import { $t } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const perusteDataStore = getCachedPerusteStore();

const router = useRouter();

const julkaisut = computed(() => {
  return perusteDataStore.julkaisut;
});

const palaaTietoihin = () => {
  router.replace({ name: 'perusteTiedot' }).catch(() => {});
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
}
</style>
