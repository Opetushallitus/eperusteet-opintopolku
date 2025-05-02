<template>
  <div class="container">
    <ep-spinner v-if="!haku" />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { SisaltoviiteOpintokokonaisuusExternalDto, ExternalApi } from '@shared/api/amosaa';

const route = useRoute();
const router = useRouter();

const haku = ref<SisaltoviiteOpintokokonaisuusExternalDto | null>(null);

const koodiArvo = computed(() => {
  return route.params.koodiarvo as string;
});

onMounted(async () => {
  try {
    haku.value = (await ExternalApi.getPublicOpintokokonaisuusKoodilla(koodiArvo.value)).data;
    router.push({
      name: 'toteutussuunnitelmaSisalto',
      params: {
        toteutussuunnitelmaId: _.toString(haku.value.opetussuunnitelmaId),
        sisaltoviiteId: _.toString(haku.value.id),
        koulutustyyppi: 'vapaasivistystyo',
      },
    });
  }
  catch {
    router.push({
      name: 'virhe',
      params: {
        lang: 'fi',
        virhekoodi: '404',
      },
    });
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
</style>
