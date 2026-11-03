<template>
  <div>
    <router-view
      v-if="opintokokonaisuusId"
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
      v-else-if="vaihe"
      class="content"
    >
      <h2>{{ $kaanna(vaihe.nimi) || $t('nimeton-vaihe') }}</h2>

      <div
        v-if="perusteSisalto?.laajuus"
        class="mt-4"
      >
        <h3>{{ $t('laajuus') }}</h3>
        <div>{{ perusteSisalto.laajuus }} {{ $t('opintopiste') }}</div>
      </div>

      <div
        v-if="perusteSisalto?.kuvaus"
        class="mt-4"
      >
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.kuvaus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <template v-if="perusteSisalto?.tavoitealueet?.length > 0">
        <h3 class="mt-4 mb-4">
          {{ $t('tavoitteet-ja-keskeiset-sisaltoalueet') }}
        </h3>
        <TpoTavoitealueet :tavoitealueet="perusteSisalto.tavoitealueet" />
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
        <EpPaikallinenTarkennus
          v-if="$kaanna(paikallinenTarkennus(vapaaTeksti.id))"
          class="mt-3"
          headerh4
        >
          <ep-content-viewer
            :value="$kaanna(paikallinenTarkennus(vapaaTeksti.id))"
            :kuvat="kuvat"
            :termit="termit"
          />
        </EpPaikallinenTarkennus>
      </div>

      <div
        v-if="opintokokonaisuudet.length > 0"
        class="mt-5"
      >
        <h3>{{ $t('opintokokonaisuudet') }}</h3>
        <div
          v-for="opintokokonaisuus in opintokokonaisuudet"
          :key="'opintokokonaisuus'+opintokokonaisuus.id"
          class="taulukko-rivi-varitys px-2 py-3 flex justify-between"
        >
          <router-link :to="opintokokonaisuus.route">
            {{ $kaanna(opintokokonaisuus.nimi) || $t('nimeton-opintokokonaisuus') }}
          </router-link>
          <span v-if="opintokokonaisuus.laajuus">{{ opintokokonaisuus.laajuus }} {{ $t('opintopiste') }}</span>
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
  return route.params.opintokokonaisuusId;
});

const taiteenala = computed(() => {
  return _.find(opetussuunnitelmaDataStore.getJulkaistuSisalto('tpo.taiteenalat'), { id: taiteenalaId.value });
});

const vaihe = computed(() => {
  return _.find(taiteenala.value?.vaiheet, { id: vaiheId.value });
});

const perusteSisalto = computed(() => {
  return vaihe.value?.perusteenVaihe;
});

const paikallinenTarkennus = (perusteenVapaaTekstiId: number) => {
  return _.find(vaihe.value?.vapaatTekstit, { perusteenVapaaTekstiId })?.paikallinenTarkennus;
};

const opintokokonaisuudet = computed(() => {
  return _.map(vaihe.value?.opintokokonaisuudet, opintokokonaisuus => {
    return {
      ...opintokokonaisuus,
      route: {
        name: 'opetussuunnitelmataiteenopintokokonaisuus',
        params: {
          taiteenalaId: _.toString(taiteenalaId.value),
          vaiheId: _.toString(vaihe.value.id),
          opintokokonaisuusId: _.toString(opintokokonaisuus.id),
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
