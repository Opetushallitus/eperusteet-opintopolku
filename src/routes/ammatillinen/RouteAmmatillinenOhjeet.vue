<template>
  <div>
    <slot />
    <p class="kuvaus">
      {{ $t('kooste-kuvaus-ohjeet') }}
    </p>
    <peruste-ammatillinen-haku
      tyyppi="opas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';

</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>
