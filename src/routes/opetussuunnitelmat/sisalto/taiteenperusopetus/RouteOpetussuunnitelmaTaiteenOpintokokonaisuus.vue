<template>
  <div class="content">
    <div v-if="opintokokonaisuus">
      <h2>{{ $kaanna(opintokokonaisuus.nimi) || $t('nimeton-opintokokonaisuus') }}</h2>

      <div
        v-if="opintokokonaisuus.laajuus"
        class="mt-4"
      >
        <h3>{{ $t('laajuus') }}</h3>
        <div>{{ opintokokonaisuus.laajuus }} {{ $t('opintopiste') }}</div>
      </div>

      <div
        v-if="$kaanna(opintokokonaisuus.kuvaus)"
        class="mt-4"
      >
        <ep-content-viewer
          :value="$kaanna(opintokokonaisuus.kuvaus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <template v-if="valitutTavoitealueet.length > 0">
        <h3 class="mt-4 mb-4">
          {{ $t('tavoitteet-ja-keskeiset-sisaltoalueet') }}
        </h3>
        <TpoTavoitealueet :tavoitealueet="valitutTavoitealueet" />
      </template>

      <div
        v-if="opintokokonaisuus.osaamisenArviointi"
        class="mt-4"
      >
        <h3>{{ $t('osaamisen-arviointi') }}</h3>
        <ep-content-viewer
          :value="$kaanna(opintokokonaisuus.osaamisenArviointi)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import TpoTavoitealueet from './TpoTavoitealueet.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();
const route = useRoute();

const taiteenalaId = computed(() => {
  return _.toNumber(route.params.taiteenalaId);
});

const vaiheId = computed(() => {
  return _.toNumber(route.params.vaiheId);
});

const opintokokonaisuusId = computed(() => {
  return _.toNumber(route.params.opintokokonaisuusId);
});

const taiteenala = computed(() => {
  return _.find(opetussuunnitelmaDataStore.getJulkaistuSisalto('tpo.taiteenalat'), { id: taiteenalaId.value });
});

const vaihe = computed(() => {
  return _.find(taiteenala.value?.vaiheet, { id: vaiheId.value });
});

const opintokokonaisuus = computed(() => {
  return _.find(vaihe.value?.opintokokonaisuudet, { id: opintokokonaisuusId.value });
});

const valitutTavoitealueet = computed(() => {
  const alueet = opintokokonaisuus.value?.tavoitealueet || [];
  const valinnat = opintokokonaisuus.value?.tavoitealueValinnat;
  if (_.isEmpty(valinnat)) {
    return alueet;
  }
  return _.chain(alueet)
    .map(alue => {
      const urit = new Set(_.map(_.filter(valinnat, { tavoitealueId: alue.id }), 'koodiUri'));
      if (urit.size === 0) {
        return null;
      }
      return {
        ...alue,
        tavoitteet: _.filter(alue.tavoitteet, tavoite => urit.has(tavoite?.uri)),
      };
    })
    .filter()
    .value();
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
