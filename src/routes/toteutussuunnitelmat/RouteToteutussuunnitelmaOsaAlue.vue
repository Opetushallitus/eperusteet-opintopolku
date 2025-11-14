<template>
  <div class="content">
    <ep-spinner v-if="!osaalue" />
    <div v-else>
      <h2 class="otsikko mb-4">
        <span v-if="perusteOsaAlue">{{ $kaanna(perusteOsaAlue.nimi) }}</span>
        <span v-else>{{ $kaanna(osaalue.nimi) }}</span>
        <span
          v-if="koodi"
          class="ml-1"
        >({{ koodi }})</span>
      </h2>

      <ep-form-content
        v-if="tutkinnonOsa"
        class="mt-4"
        name="tutkinnon-osa"
      >
        <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: {sisaltoviiteId: tutkinnonOsa.id }}">
          {{ $kaannaOlioTaiTeksti(tutkinnonOsa.nimi) }}
        </router-link>
      </ep-form-content>

      <ep-form-content
        v-if="osaalue.paikallinenTarkennus"
        class="col-md-12 mt-4"
        name="koulutuksen-jarjestajan-tarkennus"
      >
        <ep-content-viewer
          :value="$kaanna(osaalue.paikallinenTarkennus)"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <ep-form-content
        v-for="(vapaa, index) in osaalue.vapaat"
        :key="'osaaluevapaa'+index"
        class="col-md-12 mt-4"
      >
        <template #header>
          <label>{{ $kaanna(vapaa.nimi) }}</label>
        </template>
        <ep-content-viewer
          :value="$kaanna(vapaa.teksti)"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <ep-form-content
        v-if="osaalue.toteutukset && osaalue.toteutukset.length > 0"
        class="mt-4"
      >
        <template #header>
          <h3>{{ $t('koulutuksen-jarjestajan-toteutus') }}</h3>
        </template>
        <EpToteutukset
          :toteutukset="osaalue.toteutukset"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <ep-form-content class="mt-4">
        <template #header>
          <h3
            v-if="perusteOsaAlue"
            class="mb-4"
          >
            {{ $t('perusteen-sisalto') }}
          </h3>
          <h3
            v-else
            class="mb-4"
          >
            {{ $t('sisalto') }}
          </h3>
        </template>

        <h4>{{ osaamistavoitteetNimi }}</h4>

        <Osaamistavoite
          :model-value="osaamistavoite"
          :is-valinnainen="false"
          :show-laajuus="false"
          :show-koodi-arvo="false"
        >
          <template #osaamistavoitteet>
            <div />
          </template>
        </Osaamistavoite>

        <Arviointi2020Taulukko
          v-if="arviointi"
          :arviointi="arviointi"
          class="mt-4"
        >
          <template #header>
            <h4>{{ $t('arviointi') }}</h4>
          </template>
        </Arviointi2020Taulukko>
      </ep-form-content>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToteutukset from '@/components/EpToteutussuunnitelma/EpToteutukset.vue';
import Osaamistavoite from '@shared/components/EpOsaamistavoite/Osaamistavoite.vue';
import Arviointi2020Taulukko from '@shared/components/EpTutkinnonosa/Arviointi2020Taulukko.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $t, $kaanna, $kaannaOlioTaiTeksti } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const route = useRoute();
const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const osaalueId = computed(() => {
  return _.toNumber(route.params.osaalueId);
});

const sisaltoviiteId = computed(() => {
  return _.toNumber(route.params.sisaltoviiteId);
});

const osaalue = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: osaalueId.value });
});

const tutkinnonOsa = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: sisaltoviiteId.value });
});

const perusteOsaAlue = computed(() => {
  return _.chain(opetussuunnitelmaDataStore.perusteidenTutkinnonOsat)
    .map(tosa => tosa.osaAlueet as any[])
    .flatten()
    .find(perusteenOsaAlue => perusteenOsaAlue.id === osaalue.value.perusteenOsaAlueId)
    .value();
});

const koodi = computed(() => {
  return osaalue.value.perusteenOsaAlueKoodi?.split('_')[1].toUpperCase();
});

const kuvat = computed(() => {
  return [
    ...opetussuunnitelmaDataStore.kuvat,
    ...opetussuunnitelmaDataStore.perusteKuvat,
  ];
});

const osaamistavoitteetNimi = computed(() => {
  if (!perusteOsaAlue.value) {
    return $t('osaamistavoitteet') + ', ' + osaalue.value.laajuus + ' ' + $t('osaamispiste-lyhenne');
  }

  const nimi = osaalue.value.tyyppi === 'pakollinen'
    ? $t('pakolliset-osaamistavoitteet')
    : $t('valinnaiset-osaamistavoitteet');

  if (osaamistavoite.value?.laajuus) {
    const laajuusosa = ', ' + osaamistavoite.value.laajuus + ' ' + $t('osaamispiste-lyhenne');
    return nimi + laajuusosa;
  }
  else {
    return nimi;
  }
});

const osaamistavoite = computed(() => {
  if (!perusteOsaAlue.value) {
    return { tavoitteet: osaalue.value.osaamistavoitteet };
  }
  else {
    if (perusteOsaAlue.value) {
      if (osaalue.value.tyyppi === 'pakollinen') {
        return perusteOsaAlue.value.pakollisetOsaamistavoitteet;
      }
      else if (osaalue.value.tyyppi === 'valinnainen') {
        return perusteOsaAlue.value.valinnaisetOsaamistavoitteet;
      }
    }
  }
  return null;
});

const arviointi = computed(() => {
  return perusteOsaAlue.value?.arviointi || osaalue.value.geneerinenArviointiasteikko;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
