<template>
  <div>
    <ep-toteutussuunnitelma-tiedot
      v-if="!isVapaasivistystyo"
      :store="opetussuunnitelmaDataStore"
    />
    <ep-opetussuunnitelma-tiedot
      v-if="isVapaasivistystyo"
      :store="opetussuunnitelmaDataStore"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import EpToteutussuunnitelmaTiedot from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTiedot.vue';
import EpOpetussuunnitelmaTiedot from '@/components/EpToteutussuunnitelma/EpOpetussuunnitelmaTiedot.vue';
import { VapaasivistystyoKoulutustyypit } from '@shared/utils/perusteet';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const isVapaasivistystyo = computed(() => {
  return _.includes(VapaasivistystyoKoulutustyypit, opetussuunnitelmaDataStore.koulutustyyppi);
});
</script>

<style scoped lang="scss">
</style>
