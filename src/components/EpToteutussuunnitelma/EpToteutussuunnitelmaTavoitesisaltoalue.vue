<template>
  <div v-if="perusteenOsa">
    <slot name="sisalto-nimi" />

    <div class="mb-4">
      <ep-content-viewer
        :value="$kaanna(perusteenOsa.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <h3 class="mb-4">
      {{ $t('tavoitteet-ja-keskeiset-sisaltoalueet') }}
    </h3>
    <EpTavoitesisaltoalueTavoitealueet
      :model-value="perusteenOsa.tavoitealueet || []"
      :is-editing="false"
    />

    <EpPaikallinenTarkennus
      v-if="sisaltoviite.tavoitesisaltoalue?.paikallinenTarkennus"
      class="mt-3"
    >
      <template #header>
        <h3>
          {{ $t('paikallinen-tarkennus') }}
        </h3>
      </template>
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.tavoitesisaltoalue.paikallinenTarkennus)"
        :kuvat="kuvat"
      />
    </EpPaikallinenTarkennus>
  </div>
</template>

<script setup lang="ts">
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import { computed } from 'vue';
import { $kaanna, $t } from '@shared/utils/globals';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpTavoitesisaltoalueTavoitealueet from '@shared/components/EpTavoitesisaltoalue/EpTavoitesisaltoalueTavoitealueet.vue';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => SisaltoViiteExportDto,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
});

const perusteenOsa = computed(() => {
  return props.sisaltoviite.tavoitesisaltoalue?.perusteenOsa;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
