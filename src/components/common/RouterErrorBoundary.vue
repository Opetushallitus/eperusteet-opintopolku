<template>
  <EpErrorPage
    v-if="hasError"
    :virhekoodi="virhekoodi"
  />
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import EpErrorPage from '@shared/components/EpErrorPage/EpErrorPage.vue';
import { Virheet } from '@shared/stores/virheet';

const route = useRoute();
const hasError = ref(false);

watch(() => route.fullPath, () => {
  hasError.value = false;
  Virheet.clearVirheet();
});

const virhekoodi = computed(() => {
  return ((Virheet.virheet() as any)?.[0]?.state as any)?.error?.status || '500';
});

onErrorCaptured((err, instance, info) => {
  console.error('RouterErrorBoundary: Error captured!', err, info);
  hasError.value = true;
  return false;
});
</script>
