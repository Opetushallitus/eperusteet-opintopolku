<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header" />
    <ep-content-viewer
      v-if="sisaltoviite.naytaPerusteenTeksti && perusteenTeksti"
      :value="$kaanna(perusteenTeksti)"
      :kuvat="kuvat"
    />
    <ep-content-viewer
      :value="$kaanna(sisaltoviite.tuvaLaajaAlainenOsaaminen.teksti)"
      :kuvat="kuvat"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Matala } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => Matala,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
  opetussuunnitelmaDataStore: {
    type: Object as () => ToteutussuunnitelmaDataStore,
    required: true,
  },
});

const perusteenOsa = computed(() => {
  if (props.sisaltoviite.perusteenOsaId) {
    return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: props.sisaltoviite.perusteenOsaId });
  }

  return undefined;
});

const perusteenTeksti = computed((): any => {
  if (perusteenOsa.value) {
    return perusteenOsa.value.teksti;
  }

  return (props.sisaltoviite as any).perusteteksti;
});
</script>

<style scoped lang="scss">

</style>
