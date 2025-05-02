<template>
  <div>
    <ep-spinner v-if="!peruste" />
  </div>
</template>

<script setup lang="ts">
import { Perusteet } from '@shared/api/eperusteet';
import { koulutustyypinRyhma } from '@shared/utils/perusteet';
import * as _ from 'lodash';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

const router = useRouter();
const route = useRoute();

const peruste = ref(<null | any> null);

const perusteId = computed(() => {
  return _.toNumber(route.params.perusteId);
});

onMounted(async () => {
  peruste.value = (await Perusteet.getKokoSisalto(perusteId.value)).data;
  if (koulutustyypinRyhma(peruste.value.koulutustyyppi!) === 'ammatillinen') {
    router.push({
      name: 'ammatillinenkooste',
      params: {
        perusteId: _.toString(perusteId.value),
      },
    });
  }
  else {
    router.push({
      name: 'kooste',
      params: {
        perusteId: _.toString(perusteId.value),
        koulutustyyppi: koulutustyypinRyhma(peruste.value.koulutustyyppi!)!,
      },
    });
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
