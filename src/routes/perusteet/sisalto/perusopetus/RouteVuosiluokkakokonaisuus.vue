<template>
  <div>
    <router-view v-if="oppiaine" />

    <div
      v-else
      class="content"
    >
      <ep-spinner v-if="!vuosiluokkakokonaisuus" />

      <div v-else>
        <h2>{{ $kaanna(vuosiluokkakokonaisuus.nimi) }}</h2>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.tehtava)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.tehtava.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.tehtava.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.siirtymaEdellisesta)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.siirtymaEdellisesta.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.siirtymaEdellisesta.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.siirtymaSeuraavaan)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.siirtymaSeuraavaan.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.siirtymaSeuraavaan.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.laajaalainenOsaaminen)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.laajaalainenOsaaminen.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.laajaalainenOsaaminen.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <template v-if="vuosiluokkakokonaisuus.vapaatTekstit && vuosiluokkakokonaisuus.vapaatTekstit.length > 0">
          <div
            v-for="(vapaaTeksti, index) in vuosiluokkakokonaisuus.vapaatTekstit"
            :key="'vapaateksti'+index"
            class="mt-4"
          >
            <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vapaaTeksti.teksti)"
              :kuvat="kuvat"
            />
          </div>
        </template>

        <div
          v-if="vuosiluokkakokonaisuus.laajaalaisetOsaamiset && vuosiluokkakokonaisuus.laajaalaisetOsaamiset.length > 0"
          class="mt-4"
        >
          <h3 class="mt-4">
            {{ $t('laaja-alaisen-osaamisen-alueet') }}
          </h3>

          <div
            v-for="(lao, index) in vuosiluokkakokonaisuus.laajaalaisetOsaamiset"
            :key="'lao'+index"
            class="mt-4"
          >
            <h4>{{ $kaanna(lao.nimi) }}</h4>
            <ep-content-viewer
              :value="$kaanna(lao.kuvaus)"
              :kuvat="kuvat"
            />
          </div>
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat.teksti)"
            :kuvat="kuvat"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Kielet } from '@shared/stores/kieli';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const route = useRoute();
const perusteDataStore = getCachedPerusteStore();

const oppiaine = computed(() => {
  return route.params.oppiaineId;
});

const vlkId = computed(() => {
  return _.toNumber(route.params.vlkId);
});

const laajaalaisetOsaamiset = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset') as any;
});

const laajaalaisetOsaamisetById = computed(() => {
  return _.keyBy(laajaalaisetOsaamiset.value, 'id');
});

const vuosiluokkakokonaisuus = computed(() => {
  let vuosiluokkakokonaisuus = perusteDataStore.getJulkaistuPerusteSisalto({ id: vlkId.value }) as any;
  return {
    ...vuosiluokkakokonaisuus,
    laajaalaisetOsaamiset: _.chain(vuosiluokkakokonaisuus.laajaalaisetOsaamiset)
      .map(lao => {
        return {
          ...lao,
          nimi: _.get(laajaalaisetOsaamisetById.value[_.get(lao, '_laajaalainenOsaaminen')], 'nimi'),
        };
      })
      .sortBy(lao => $kaanna(lao.nimi))
      .value(),
  };
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

function hasContent(obj: any) {
  return obj?.teksti && _.get(obj, 'teksti')[Kielet.getSisaltoKieli.value];
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }
</style>
