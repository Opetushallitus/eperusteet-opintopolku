<template>
  <div
    aria-live="polite"
    tabindex="-1"
  >
    <slot>
      <div v-if="kokonaismaara">
        <template v-if="!piilotaNakyvaTulosmaara">
          <span
            aria-hidden="true"
            class="font-bold mr-1"
          >{{ kokonaismaara }}</span>
          <span aria-hidden="true">{{ $t('hakutulosta') }}</span>
        </template>
        <span
          v-if="naytaRuudunlukijaLkm"
          class="sr-only"
        >{{ kokonaismaara }} {{ $t('hakutulosta') }}</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import * as _ from 'lodash';

const props = defineProps({
  kokonaismaara: {
    type: Number,
    required: false,
    default: 0,
  },
  piilotaNakyvaTulosmaara: {
    type: Boolean,
    default: false,
  },
});

const naytaRuudunlukijaLkm = ref(false);

// Implementing debounce manually since the decorator is not directly compatible with setup
const naytaRuudunlukijaLkmDebounced = _.debounce(async () => {
  naytaRuudunlukijaLkm.value = true;
}, 500);

watch(() => props.kokonaismaara, async () => {
  naytaRuudunlukijaLkm.value = false;
  await naytaRuudunlukijaLkmDebounced();
}, { immediate: true });

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
