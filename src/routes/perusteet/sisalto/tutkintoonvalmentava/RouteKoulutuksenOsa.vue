<template>
  <div class="content">
    <template v-if="perusteenOsa">
      <h2 class="mb-4">
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(nimi) }}
      </h2>
      <div class="flex flex-wrap">
        <div
          class="w-full lg:w-1/2 md:w-full"
        >
          <ep-form-content
            name="koulutuksen-osan-nimi"
            header-type="h4"
          >
            <span>{{ $kaanna(nimi) }}</span>
          </ep-form-content>
        </div>
        <div
          class="w-full lg:w-1/2 md:w-full"
        >
          <ep-form-content
            name="laajuus"
            header-type="h4"
          >
            <span>{{ perusteenOsa.laajuusMinimi }} - {{ perusteenOsa.laajuusMaksimi }} {{ $t('viikkoa') }}</span>
          </ep-form-content>
        </div>
      </div>
      <div
        v-if="perusteenOsa.kuvaus"
        class="flex flex-wrap"
      >
        <div class="w-full">
          <h4>{{ $t('kuvaus') }}</h4>
          <ep-content-viewer
            name="kuvaus"
            :value="$kaanna(perusteenOsa.kuvaus)"
            :kuvat="kuvat"
          />
        </div>
      </div>
      <template v-if="perusteenOsa.tavoitteet.length > 0">
        <hr>
        <div class="flex flex-wrap">
          <div class="w-full">
            <h3 class="mt-3 mb-4">
              {{ $t('tavoitteet') }}
            </h3>
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="w-full">
            <h4>{{ $t('opiskelija') }}</h4>
            <ul>
              <li
                v-for="tavoite in perusteenOsa.tavoitteet"
                :key="tavoite._id"
              >
                {{ $kaanna(tavoite) }}
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-if="perusteenOsa.laajaAlaisenOsaamisenKuvaus">
        <hr>
        <div class="flex flex-wrap">
          <div class="w-full">
            <h3 class="mt-3 mb-4">
              {{ $t('laaja-alainen-osaaminen') }}
            </h3>
            <ep-content-viewer
              :value="$kaanna(perusteenOsa.laajaAlaisenOsaamisenKuvaus)"
              :kuvat="kuvat"
            />
          </div>
        </div>
      </template>
      <template v-if="perusteenOsa.keskeinenSisalto">
        <hr>
        <div class="flex flex-wrap">
          <div class="w-full">
            <h3 class="mt-3 mb-4">
              {{ $t('keskeinen-sisalto') }}
            </h3>
            <ep-content-viewer
              :value="$kaanna(perusteenOsa.keskeinenSisalto)"
              :kuvat="kuvat"
            />
          </div>
        </div>
      </template>
      <template v-if="perusteenOsa.arvioinninKuvaus">
        <hr>
        <div class="flex flex-wrap">
          <div class="w-full">
            <h3 class="mt-3 mb-4">
              {{ $t('arviointi') }}
            </h3>
            <ep-content-viewer
              :value="$kaanna(perusteenOsa.arvioinninKuvaus)"
              :kuvat="kuvat"
            />
          </div>
        </div>
      </template>

      <EpOpasKiinnitysLinkki :koodi-uri="koulutuksenosaKoodiUri" />

      <slot name="previous-next-navigation" />
    </template>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import _ from 'lodash';
import { $kaanna, $t } from '@shared/utils/globals';
import { useRoute } from 'vue-router';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const route = useRoute();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.koulutuksenosaId);

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const current = computed(() => {
  return perusteDataStore.current || null;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const koulutuksenosaKoodiUri = computed(() => {
  return (perusteenOsa.value as any)?.nimiKoodi?.uri;
});

const nimi = computed(() => {
  return _.get(perusteenOsa.value, 'nimiKoodi') ? _.get(perusteenOsa.value, 'nimiKoodi.nimi') : _.get(perusteenOsa.value, 'nimi');
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
