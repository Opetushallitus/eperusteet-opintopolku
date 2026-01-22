<template>
  <div v-if="perusteenOsa">
    <slot name="sisalto-nimi" />

    <div class="mb-4">
      <ep-content-viewer
        :value="$kaanna(perusteenOsa.yleiskuvaus)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="perusteenOsa.osaamisAlueet.length > 0"
      class="flex flex-wrap mt-4"
    >
      <div class="w-full">
        <div
          v-for="(osaamisalue, index) in perusteenOsa.osaamisAlueet"
          :key="index+'kotoLaajaAlainenOsaaminen'"
        >
          <h3 class="mt-4">
            {{ $kaanna(osaamisalue.koodi.nimi) }}
          </h3>
          <ep-content-viewer :value="$kaanna(osaamisalue.kuvaus)" />
        </div>
      </div>
    </div>

    <EpPaikallinenTarkennus
      v-if="sisaltoviite.kotoLaajaAlainenOsaaminen.teksti"
      class="mt-3"
    >
      <template #header>
        <h3>
          {{ $t('laaja-alaisen-osaamisen-paikallinen-tarkennus') }}
        </h3>
      </template>
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.kotoLaajaAlainenOsaaminen.teksti)"
        :kuvat="kuvat"
      />
    </EpPaikallinenTarkennus>
  </div>
</template>

<script setup lang="ts">
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import * as _ from 'lodash';
import { computed } from 'vue';
import { $kaanna } from '@shared/utils/globals';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';

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
  return props.sisaltoviite.kotoLaajaAlainenOsaaminen?.perusteenOsa;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
