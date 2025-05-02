<template>
  <div>
    <router-view v-if="oppiaine" />

    <div
      v-else
      class="content"
    >
      <h2>{{ $kaanna(vuosiluokkakokonaisuus.nimi) }}</h2>

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.tehtava"
        :pohja-object="pohjanVuosiluokkakokonaisuus.tehtava"
        :object="vuosiluokkakokonaisuus.tehtava"
      />

      <template v-if="perusteVlkVapaatTekstit">
        <div
          v-for="(vapaaTeksti, index) in perusteVlkVapaatTekstit"
          :key="'vapaateksti'+index"
          class="mt-5"
        >
          <h4>{{ $kaanna(vapaaTeksti.nimi) }}</h4>
          <EpContentViewer
            :value="$kaanna(vapaaTeksti.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />

          <EpPaikallinenTarkennus
            v-if="vapaaTeksti.vlkVapaaTeksti.paikallinenTarkennus"
            headerh4
          >
            <EpContentViewer
              :value="$kaanna(vapaaTeksti.vlkVapaaTeksti.paikallinenTarkennus)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </EpPaikallinenTarkennus>
        </div>
      </template>

      <h2
        v-if="siirtymia"
        class="mt-5"
      >
        {{ $t('siirtymavaiheet') }}
      </h2>

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.siirtymaEdellisesta"
        :pohja-object="pohjanVuosiluokkakokonaisuus.siirtymaEdellisesta"
        :object="vuosiluokkakokonaisuus.siirtymaEdellisesta"
      />

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.siirtymaSeuraavaan"
        :pohja-object="pohjanVuosiluokkakokonaisuus.siirtymaSeuraavaan"
        :object="vuosiluokkakokonaisuus.siirtymaSeuraavaan"
      />

      <h2
        v-if="laajaaAlainenOsaaminen"
        class="mt-5"
      >
        {{ $t('laaja-alainen-osaaminen') }}
      </h2>

      <ep-peruste-content
        :peruste-object="perusteenVuosiluokkakokonaisuus.laajaalainenOsaaminen"
        :pohja-object="pohjanVuosiluokkakokonaisuus.laajaalainenOsaaminen"
        :object="vuosiluokkakokonaisuus.laajaalainenosaaminen"
      />

      <h2 class="mt-5">
        {{ $t('laaja-alaisen-osaamisen-alueet') }}
      </h2>

      <div
        v-for="(laajaalainen, index) in laajaalaisetOsaamiset"
        :key="index"
        class="mb-5"
      >
        <h3 class="mb-3">
          {{ $kaanna(laajaalainen.nimi) }}
        </h3>

        <ep-collapse
          v-if="laajaalainen.opetussuunnitelmanLao.naytaPerusteenPaatasonLao || laajaalainen.opetussuunnitelmanLao.naytaPerusteenVlkTarkennettuLao"
          tyyppi="perusteteksti"
          :border-bottom="false"
          :border-top="false"
          :use-padding="false"
          class="mb-4"
        >
          <template #header>
            <h4>{{ $t('perusteen-teksti') }}</h4>
          </template>
          <ep-content-viewer
            v-if="laajaalainen.opetussuunnitelmanLao.naytaPerusteenPaatasonLao"
            :value="$kaanna(laajaalainen.kuvaus)"
          />

          <template v-if="perusteenVlkByLaoId[laajaalainen.id] && laajaalainen.opetussuunnitelmanLao.naytaPerusteenVlkTarkennettuLao">
            <h5 v-if="laajaalainen.opetussuunnitelmanLao.naytaPerusteenPaatasonLao">
              {{ $t('laaja-alaisen-osaamisen-alueen-vuosiluokkakokonaisuuden-kuvaus') }}
            </h5>
            <ep-content-viewer :value="$kaanna(perusteenVlkByLaoId[laajaalainen.id].kuvaus)" />
          </template>
        </ep-collapse>

        <template
          v-if="laajaalainen.pohjanLao
            && laajaalainen.pohjanLao.kuvaus
            && (!laajaalainen.opetussuunnitelmanLao.kuvaus || $kaanna(laajaalainen.pohjanLao.kuvaus) !== $kaanna(laajaalainen.opetussuunnitelmanLao.kuvaus))"
        >
          <h4>{{ $kaanna(pohjaNimi) }}</h4>
          <ep-content-viewer :value="$kaanna(laajaalainen.pohjanLao.kuvaus)" />
        </template>

        <EpPaikallinenTarkennus
          v-if="laajaalainen.opetussuunnitelmanLao.kuvaus"
          headerh4
        >
          <ep-content-viewer :value="$kaanna(laajaalainen.opetussuunnitelmanLao.kuvaus)" />
        </EpPaikallinenTarkennus>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna } from '@shared/utils/globals';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const opetussuunnitelma = inject('opetussuunnitelma') as any;
const route = useRoute();

const vlkId = computed(() => {
  return _.toNumber(route.params.vlkId);
});

const oppiaine = computed(() => {
  return route.params.oppiaineId;
});

const vuosiluokkakokonaisuus = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: vlkId.value });
});

const pohjanVuosiluokkakokonaisuus = computed(() => {
  const opsVlk = _.find(opetussuunnitelmaDataStore.getJulkaistuSisalto('vuosiluokkakokonaisuudet'),
    opsVlk => opsVlk?.pohjanVuosiluokkakokonaisuus?._tunniste === vuosiluokkakokonaisuus.value._tunniste);
  return (opsVlk && opsVlk.pohjanVuosiluokkakokonaisuus) ?? {};
});

const perusteenVuosiluokkakokonaisuus = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: vuosiluokkakokonaisuus.value._tunniste });
});

const vuosiluokanLaot = computed(() => {
  return _.keyBy(vuosiluokkakokonaisuus.value.laajaalaisetosaamiset, '_laajaalainenosaaminen');
});

const pohjanVuosiluokanLaot = computed(() => {
  return _.keyBy(pohjanVuosiluokkakokonaisuus.value.laajaalaisetosaamiset, '_laajaalainenosaaminen');
});

const laajaalaisetOsaamiset = computed(() => {
  return _.chain(opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset'))
    .map(lao => {
      return {
        ...lao,
        opetussuunnitelmanLao: vuosiluokanLaot.value[lao.tunniste!],
        pohjanLao: pohjanVuosiluokanLaot.value[lao.tunniste!],
      };
    })
    .sortBy(lao => $kaanna(lao.nimi))
    .value();
});

const siirtymia = computed(() => {
  return (perusteenVuosiluokkakokonaisuus.value && (perusteenVuosiluokkakokonaisuus.value.siirtymaEdellisesta || perusteenVuosiluokkakokonaisuus.value.siirtymaSeuraavaan))
    || (vuosiluokkakokonaisuus.value && (vuosiluokkakokonaisuus.value.siirtymaEdellisesta || vuosiluokkakokonaisuus.value.siirtymaSeuraavaan));
});

const laajaaAlainenOsaaminen = computed(() => {
  return (perusteenVuosiluokkakokonaisuus.value && perusteenVuosiluokkakokonaisuus.value.laajaalainenOsaaminen)
    || (vuosiluokkakokonaisuus.value && vuosiluokkakokonaisuus.value.laajaalainenosaaminen);
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
});

const perusteVlkVapaatTekstit = computed(() => {
  return _.map(perusteenVuosiluokkakokonaisuus.value.vapaatTekstit, pVlkVt => {
    return {
      ...pVlkVt,
      vlkVapaaTeksti: _.find(vuosiluokkakokonaisuus.value.vapaatTekstit, vlkVt => _.toString(pVlkVt.id) === _.toString(vlkVt.perusteenVapaaTekstiId)) || {},
    };
  });
});

const perusteenVlkByLaoId = computed(() => {
  return _.keyBy(_.map(perusteenVuosiluokkakokonaisuus.value.laajaalaisetOsaamiset, lao => {
    return {
      ...lao,
      _laajaalainenOsaaminen: Number(lao._laajaalainenOsaaminen),
    };
  }), '_laajaalainenOsaaminen');
});

const pohjaNimi = computed(() => {
  return opetussuunnitelma?.pohja?.nimi;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
