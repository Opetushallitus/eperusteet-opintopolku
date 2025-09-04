<template>
  <div v-if="perusteenOsa">
    <ep-content-viewer
      :value="$kaanna(perusteenOsa.kuvaus)"
      :kuvat="kuvat"
    />
    <hr class="my-4">

    <EpKotoTaitotasot
      :taitotaso-tyyppi="taitotasoTyyppi"
      :model-value="perusteenOsa.taitotasot"
      :kuvat="kuvat"
    >
      <template #paikallinentarkennus="{ taitotaso }">
        <template v-if="taitotaso && taitotaso.nimi && kotoTaitotasotByUri[taitotaso.nimi.uri]">
          <ep-content-viewer
            :value="$kaanna(kotoTaitotasotByUri[taitotaso.nimi.uri].tavoiteTarkennus)"
            :kuvat="kuvat"
          />
          <ep-content-viewer
            :value="$kaanna(kotoTaitotasotByUri[taitotaso.nimi.uri].sisaltoTarkennus)"
            :kuvat="kuvat"
          />
        </template>
      </template>
    </EpKotoTaitotasot>

    <div v-if="laajaAlaisetOsaamiset && laajaAlaisetOsaamiset.length > 0">
      <hr class="my-4">
      <h2 class="mb-4">
        {{ $t('laaja-alainen-osaaminen') }}
      </h2>
      <div
        v-for="(lao, index) in laajaAlaisetOsaamiset"
        :key="'lao' + index"
        :class="{'mt-4': index > 0}"
      >
        <h3>{{ $kaanna(perusteenLaotByUri[lao.koodiUri].koodi.nimi) }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteenLaotByUri[lao.koodiUri].kuvaus)"
          :kuvat="kuvat"
        />
        <ep-content-viewer
          :value="$kaanna(lao.teksti)"
          :kuvat="kuvat"
        />
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
</template>

<script setup lang="ts">
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import * as _ from 'lodash';
import { computed } from 'vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpKotoTaitotasot from '@shared/components/EpKotoTaitotasot/EpKotoTaitotasot.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => SisaltoViiteExportDto,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
  sisaltoViiteSisalto: {
    type: String as () => 'kotoKielitaitotaso' | 'kotoOpinto',
    required: true,
  },
});

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const taitotasoTyyppi = computed(() => {
  return props.sisaltoViiteSisalto === 'kotoKielitaitotaso' ? 'kielitaitotaso' : 'opintokokonaisuus';
});

const perusteenOsa = computed(() => {
  return props.sisaltoviite[props.sisaltoViiteSisalto]!.perusteenOsa;
});

const kotoTaitotasotByUri = computed(() => {
  return _.keyBy(props.sisaltoviite[props.sisaltoViiteSisalto]!.taitotasot, 'koodiUri');
});

const laajaAlaisetOsaamiset = computed(() => {
  return props.sisaltoviite[props.sisaltoViiteSisalto]!.laajaAlaisetOsaamiset;
});

const perusteenLaajaAlaisetOsaamiset = computed(() => {
  return _.get(opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ 'osanTyyppi': 'koto_laajaalainenosaaminen' }), 'osaamisAlueet');
});

const perusteenLaotByUri = computed(() => {
  return _.keyBy(perusteenLaajaAlaisetOsaamiset.value, 'koodi.uri');
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
