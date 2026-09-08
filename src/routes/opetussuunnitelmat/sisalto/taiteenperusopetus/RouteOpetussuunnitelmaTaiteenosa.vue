<template>
  <div class="content">
    <EpSpinner v-if="!taiteenosa" />
    <template v-else>
      <h2>{{ $kaanna(perusteenTaiteenosa?.nimi) }}</h2>

      <div
        v-if="perusteenTaiteenosa"
        class="taiteenosa"
      >
        <ep-form-content
          v-if="perusteenTaiteenosa.laajuus"
          class="mt-4"
          name="laajuus"
        >
          {{ perusteenTaiteenosa.laajuus }} {{ $t('opintopiste-partitiivi') }}
        </ep-form-content>

        <ep-content-viewer
          v-if="perusteenTaiteenosa.kuvaus"
          class="mt-4"
          :value="$kaanna(perusteenTaiteenosa.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />

        <template v-if="tavoitteet.length > 0">
          <h3 class="mt-4 mb-3">
            {{ $t('tavoitteet') }}
          </h3>
          <ul>
            <li
              v-for="(tavoite, index) in tavoitteet"
              :key="'tavoite' + index"
            >
              {{ $kaanna(tavoite) }}
            </li>
          </ul>
        </template>

        <hr class="my-4" v-if="hasPaikallinenTarkennus">
      </div>

      <EpPaikallinenTarkennus v-if="hasPaikallinenTarkennus">
        <ep-content-viewer
          :value="$kaanna(taiteenosa.paikallinenTarkennus)"
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

const taiteenosaId = computed(() => _.toNumber(route.params.taiteenosaId));

const taiteenosa = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: taiteenosaId.value });
});

const perusteenTaiteenosa = computed(() => {
  const perusteenTaiteenosanId = taiteenosa.value?.perusteenTaiteenosanId;
  if (!perusteenTaiteenosanId || !opetussuunnitelmaDataStore.perusteKaikki?.tpo?.sisalto) {
    return null;
  }

  const taiteenOsat = _.flatMap(
    flattenTree(opetussuunnitelmaDataStore.perusteKaikki.tpo.sisalto, 'lapset'),
    node => node.perusteenOsa?.taiteenOsat || [],
  );

  return _.find(taiteenOsat, { id: perusteenTaiteenosanId }) || null;
});

const tavoitteet = computed(() => perusteenTaiteenosa.value?.tavoitteet || []);
const termit = computed(() => opetussuunnitelmaDataStore.kaikkiTermit);
const kuvat = computed(() => opetussuunnitelmaDataStore.kuvat);

const hasPaikallinenTarkennus = computed(() => {
  return _.some(UiKielet, kieli => !_.isEmpty(_.trim(_.get(taiteenosa.value?.paikallinenTarkennus, kieli))));
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
