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
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { VapaasivistystyoKoulutustyypit } from '@shared/utils/perusteet';

const props = defineProps({
  opetussuunnitelmaDataStore: {
    type: Object as () => ToteutussuunnitelmaDataStore,
    required: true,
  },
});

const isVapaasivistystyo = computed(() => {
  return _.includes(VapaasivistystyoKoulutustyypit, props.opetussuunnitelmaDataStore.koulutustyyppi);
});
</script>

<style scoped lang="scss">
</style>
