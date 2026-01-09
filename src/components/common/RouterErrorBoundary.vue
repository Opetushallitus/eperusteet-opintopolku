<!-- RouterErrorBoundary.vue -->
<template>
  <EpErrorPage v-if="hasError" />
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import EpErrorPage from '@shared/components/EpErrorPage/EpErrorPage.vue'

const route = useRoute()
const hasError = ref(false)

// Clear error when route changes
watch(() => route.fullPath, () => {
  hasError.value = false
})

// Catch errors from child components
onErrorCaptured((err, instance, info) => {
  console.error('RouterErrorBoundary: Error captured!', err, info)
  hasError.value = true
  return false
})
</script>
