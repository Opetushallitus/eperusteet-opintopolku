<template>
  <div class="content">
    <EpSpinner v-if="!taiteenala" />
    <template v-else>
      <h2>{{ $kaanna(taiteenala.nimi) }}</h2>

      <div
        v-if="perusteenTaiteenala"
        class="taiteenala"
      >
        <ep-form-content
          v-if="perusteenTaiteenala.laajuus"
          class="mt-4"
          name="laajuus"
        >
          {{ perusteenTaiteenala.laajuus }} {{ $t('opintopiste-partitiivi') }}
        </ep-form-content>

        <ep-content-viewer
          v-if="perusteenTaiteenala.teksti"
          class="mt-4"
          :value="$kaanna(perusteenTaiteenala.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />

        <hr class="my-4" v-if="hasPaikallinenTarkennus">
      </div>

      <EpPaikallinenTarkennus v-if="hasPaikallinenTarkennus">
        <ep-content-viewer
          :value="$kaanna(taiteenala.paikallinenTarkennus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </EpPaikallinenTarkennus>

      <slot name="previous-next-navigation" />
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { UiKielet } from '@shared/stores/kieli';
import { flattenTree } from '@shared/utils/helpers';
import { $kaanna } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();
const route = useRoute();

const taiteenalaId = computed(() => _.toNumber(route.params.taiteenalaId));

const taiteenala = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: taiteenalaId.value });
});

const perusteenTaiteenala = computed(() => {
  const koodi = taiteenala.value?.koodi;
  if (!koodi || !opetussuunnitelmaDataStore.perusteKaikki?.tpo?.sisalto) {
    return null;
  }

  return _.find(
    flattenTree(opetussuunnitelmaDataStore.perusteKaikki.tpo.sisalto, 'lapset'),
    node => node.perusteenOsa?.osanTyyppi === 'taiteenala' && node.perusteenOsa?.koodi?.uri === koodi,
  )?.perusteenOsa || null;
});

const termit = computed(() => opetussuunnitelmaDataStore.kaikkiTermit);
const kuvat = computed(() => opetussuunnitelmaDataStore.kuvat);

const hasPaikallinenTarkennus = computed(() => {
  return _.some(UiKielet, kieli => !_.isEmpty(_.trim(_.get(taiteenala.value?.paikallinenTarkennus, kieli))));
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
