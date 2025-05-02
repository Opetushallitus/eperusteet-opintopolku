<template>
  <div class="content">
    <div v-if="oppiaineet">
      <h2
        class="otsikko"
      >
        {{ $t('oppiaineet') }}
      </h2>
      <div class="teksti">
        <div
          v-for="(oppiaine, idx) in oppiaineet"
          :key="idx"
          class="oppiaine"
        >
          <router-link :to="oppiaine.location">
            {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
          </router-link>
        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

const props = defineProps<{
  perusteDataStore: PerusteDataStore;
}>();

const current = computed(() => {
  return props.perusteDataStore.current;
});

const oppiaineet = computed(() => {
  if (current.value) {
    return current.value.children;
  }
  return undefined;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
