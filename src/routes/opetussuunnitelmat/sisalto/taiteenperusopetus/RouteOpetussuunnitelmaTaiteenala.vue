<template>
  <div>
    <router-view
      v-if="vaiheId"
      v-slot="{ Component }"
    >
      <component
        :is="Component"
        v-if="Component"
      >
        <template #previous-next-navigation>
          <slot name="previous-next-navigation" />
        </template>
      </component>
    </router-view>

    <div
      v-else-if="taiteenala"
      class="content"
    >
      <h2>{{ $kaanna(taiteenala.nimi) || $t('nimeton-taiteenala') }}</h2>

      <div
        v-if="perusteSisalto?.teksti"
        class="mt-4"
      >
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <template
        v-for="osa in osat"
        :key="osa.key"
      >
        <div
          v-if="perusteSisalto?.[osa.key]?.teksti"
          class="mt-4"
        >
          <h3>{{ $kaanna(perusteSisalto[osa.key].nimi) || $t(osa.otsikkoKey) }}</h3>
          <ep-content-viewer
            :value="$kaanna(perusteSisalto[osa.key].teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </div>
      </template>

      <div
        v-for="(vapaaTeksti, index) in perusteSisalto?.vapaatTekstit"
        :key="'vapaateksti'+index"
        class="mt-4"
      >
        <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
        <ep-content-viewer
          :value="$kaanna(vapaaTeksti.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <EpPaikallinenTarkennus
        v-if="$kaanna(taiteenala.paikallinenTarkennus)"
        class="mt-4"
        headerh4
      >
        <ep-content-viewer
          :value="$kaanna(taiteenala.paikallinenTarkennus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </EpPaikallinenTarkennus>

      <div
        v-if="vaiheet.length > 0"
        class="mt-5"
      >
        <h3>{{ $t('vaiheet') }}</h3>
        <div
          v-for="vaihe in vaiheet"
          :key="'vaihe'+vaihe.id"
          class="taulukko-rivi-varitys px-2 py-3"
        >
          <router-link :to="vaihe.route">
            {{ $kaanna(vaihe.nimi) || $t('nimeton-vaihe') }}
          </router-link>
        </div>
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
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();
const route = useRoute();

const osat = [
  { key: 'aikuistenOpetus', otsikkoKey: 'taiteenala-aikuisten-opetus' },
  { key: 'kasvatus', otsikkoKey: 'taiteenala-kasvatus' },
  { key: 'oppimisenArviointiOpetuksessa', otsikkoKey: 'taiteenala-oppimisen-arvionti' },
  { key: 'teemaopinnot', otsikkoKey: 'taiteenala-teemaopinnot' },
  { key: 'tyotavatOpetuksessa', otsikkoKey: 'taiteenala-tyotavat' },
  { key: 'yhteisetOpinnot', otsikkoKey: 'taiteenala-yhteisetOpinnot' },
];

const taiteenalaId = computed(() => {
  return _.toNumber(route.params.taiteenalaId);
});

const vaiheId = computed(() => {
  return route.params.vaiheId;
});

const taiteenala = computed(() => {
  return _.find(opetussuunnitelmaDataStore.getJulkaistuSisalto('tpo.taiteenalat'), { id: taiteenalaId.value });
});

const perusteSisalto = computed(() => {
  return taiteenala.value?.perusteenTaiteenala;
});

const vaiheet = computed(() => {
  return _.map(taiteenala.value?.vaiheet, vaihe => {
    return {
      ...vaihe,
      route: {
        name: 'opetussuunnitelmataiteenalanvaihe',
        params: {
          taiteenalaId: _.toString(taiteenala.value.id),
          vaiheId: _.toString(vaihe.id),
        },
      },
    };
  });
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
