<template>
  <div>
    <router-view
      v-if="oppiaineId"
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
      <h2>{{ $kaanna(vaiheNimi) || $t('nimeton') }}</h2>

      <div
        v-if="perusteSisalto?.siirtymaEdellisesta"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.siirtymaEdellisesta.otsikko) || $t('siirtyma-edellisesta') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.siirtymaEdellisesta.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.tehtava"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.tehtava.otsikko) || $t('tehtava') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.tehtava.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.siirtymaSeuraavaan"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.siirtymaSeuraavaan.otsikko) || $t('siirtyma-seuraavaan') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.siirtymaSeuraavaan.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.laajaalainenOsaaminen"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.laajaalainenOsaaminen.otsikko) || $t('laaja-alainen-osaaminen') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.laajaalainenOsaaminen.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.paikallisestiPaatettavatAsiat"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.paikallisestiPaatettavatAsiat.otsikko) || $t('paikallisesti-paatettavat-asiat') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.paikallisestiPaatettavatAsiat.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <template v-if="perusteSisalto?.vapaatTekstit?.length">
        <div
          v-for="(vapaaTeksti, index) in perusteSisalto.vapaatTekstit"
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
      </template>

      <div
        v-if="tavoitealueet.length > 0"
        class="mt-5"
      >
        <h3 class="mb-3">{{ $t('opetuksen-tavoitealueet') }}</h3>
        <div
          v-for="tavoitealue in tavoitealueet"
          :key="'tavoitealue'+tavoitealue.id"
          class="taulukko-rivi-varitys px-2 py-3"
        >
          {{ $kaanna(tavoitealue.nimi) }}
        </div>
      </div>

      <EpPaikallinenTarkennus
        v-if="$kaanna(vaihe.paikallinenTarkennus)"
        class="mt-4"
        headerh4
      >
        <ep-content-viewer
          :value="$kaanna(vaihe.paikallinenTarkennus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </EpPaikallinenTarkennus>

      <div
        v-if="oppiaineet.length > 0"
        class="mt-5"
      >
        <h3>{{ $t('oppiaineet') }}</h3>
        <div
          v-for="oppiaine in oppiaineet"
          :key="'oppiaine'+oppiaine.id"
          class="taulukko-rivi-varitys px-2 py-3"
        >
          <router-link :to="oppiaine.route">
            {{ $kaanna(oppiaine.nimi) }}
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

const vaiheId = computed(() => {
  return _.toNumber(route.params.vaiheId);
});

const oppiaineId = computed(() => {
  return route.params.oppiaineId;
});

const vaihe = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: vaiheId.value });
});

const perusteSisalto = computed(() => {
  return vaihe.value?.perusteSisalto;
});

const vaiheNimi = computed(() => {
  return perusteSisalto.value?.nimi;
});

const oppiaineet = computed(() => {
  return _.map(vaihe.value?.oppiaineet, oppiaine => {
    return {
      ...oppiaine,
      route: {
        name: 'opetussuunnitelmaaipeoppiaine',
        params: {
          vaiheId: _.toString(vaihe.value.id),
          oppiaineId: _.toString(oppiaine.id),
        },
      },
    };
  });
});

const tavoitealueet = computed(() => {
  return perusteSisalto.value?.opetuksenKohdealueet || [];
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
