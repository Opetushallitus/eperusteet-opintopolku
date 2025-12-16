<template>
  <h2
    v-if="sisaltoviite.nimi"
    class="mb-4"
  >
    <span v-if="numerointi">{{ numerointi }}</span>
    {{ $kaanna(sisaltoviite.nimi) }}
  </h2>
</template>

<script setup lang="ts">
import { $kaanna } from '@shared/utils/globals';

defineProps({
  sisaltoviite: {
    type: Object,
    required: true,
  },
  numerointi: {
    type: String,
    required: false,
    default: undefined,
  },
});
</script>

