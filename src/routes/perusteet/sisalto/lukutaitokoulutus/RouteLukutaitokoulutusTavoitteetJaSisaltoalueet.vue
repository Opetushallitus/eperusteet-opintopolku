<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4!"
      >
        {{ $kaanna(perusteenOsa.nimi) || $t('nimeton-tavoitteet-ja-sisaltoalueet') }}
      </h2>

      <div
        v-for="(tavoitealue, tavoitealueIndex) in perusteenOsa.tavoitealueet"
        :key="'tavoitealue' + tavoitealueIndex"
        class="mb-5"
      >
        <h3 class="mb-2!">
          {{ $kaanna(tavoitealue.nimi) }}
        </h3>
        <template v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0">
          <div class="font-semibold mb-1">
            {{ $t('opiskelija-osaa') }}
          </div>
          <ul class="mb-0">
            <li
              v-for="(tavoite, index) in tavoitealue.tavoitteet"
              :key="'tavoite' + tavoitealueIndex + '-' + index"
            >
              {{ $kaanna(tavoite) }}
            </li>
          </ul>
        </template>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <EpSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.tavoitteetJaSisaltoalueetId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa as any;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
