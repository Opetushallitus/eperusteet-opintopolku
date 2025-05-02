<template>
  <div>
    <slot />
    <p class="kuvaus">
      {{ $t('kooste-kuvaus-ohjeet') }}
    </p>
    <peruste-ammatillinen-haku
      :peruste-haku-store="perusteHakuStoreOhjeet"
      tyyppi="opas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { AmmatillinenOpasHakuStore } from '@/stores/AmmatillinenOpasHakuStore';

const perusteHakuStoreOhjeet = new AmmatillinenOpasHakuStore();
</script>

<style scoped lang="scss">
.kuvaus {
  font-size: small;
  color: #555;
}
</style>
