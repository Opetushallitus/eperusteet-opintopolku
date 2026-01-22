<template>
  <EpHeader
    :murupolku="murupolku"
    :koulutustyyppi="koulutustyyppi"
  >
    <template #header>
      {{ $kaanna(osaamismerkki.nimi) }}
    </template>
    <div class="flex lg:flex-row flex-col mt-5">
      <div class="m-3">
        <div class="tile tile-background-shadow-selected shadow-tile">
          <div class="img">
            <img
              :src="imageUrl"
              width="200"
              height="200"
            >
          </div>
          <div class="nimi">
            <span>{{ $kaanna(osaamismerkki.nimi) }}</span>
          </div>
        </div>
      </div>
      <div class="m-3">
        <div
          v-if="isVanhentunut"
          class="mb-3"
        >
          <h2 class="header">
            {{ $t('voimassaolo') }}
          </h2>
          <div class="mt-1 flex">
            <span class="mr-1">{{ $t('voimassaolo-paattynyt') }}</span>
            <span class="mr-2">{{ $sd(osaamismerkki.voimassaoloLoppuu) }}</span>
            <EpVoimassaolo :voimassaolo="osaamismerkki" />
          </div>
        </div>
        <div class="mb-3">
          <h2 class="header">
            {{ $t('teema') }}
          </h2>
          <div class="mt-1">
            <span>{{ $kaanna(osaamismerkki.kategoria.nimi) }}</span>
          </div>
        </div>
        <div
          v-if="osaamismerkki.kuvaus"
          class="mb-3"
        >
          <h2 class="header">
            {{ $t('kuvaus') }}
          </h2>
          <div class="mt-1">
            <span>{{ $kaanna(osaamismerkki.kuvaus) }}</span>
          </div>
        </div>
        <div>
          <h2 class="header">
            {{ $t('osaamistavoitteet') }}
          </h2>
          <span>{{ $t('osaamismerkin-suorittaja') }}</span>
          <ul class="mt-1">
            <li
              v-for="(tavoite, index) in osaamismerkki.osaamistavoitteet"
              :key="'tavoite'+index"
            >
              {{ $kaanna(tavoite.osaamistavoite) }}
            </li>
          </ul>
        </div>
        <div>
          <h2 class="header">
            {{ $t('arviointikriteerit') }}
          </h2>
          <span>{{ $t('osaamismerkin-suorittaja') }}</span>
          <ul class="mt-1">
            <li
              v-for="(kriteeri, index) in osaamismerkki.arviointikriteerit"
              :key="'kriteeri'+index"
            >
              {{ $kaanna(kriteeri.arviointikriteeri) }}
            </li>
          </ul>
        </div>
        <div>
          <h2 class="header">
            {{ $t('osaamisen-arviointi') }}
          </h2>
          <span>{{ $t('osaamismerkin-osaamisen-arviointi') }}</span>
        </div>
      </div>
    </div>
  </EpHeader>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import _ from 'lodash';
import { useOsaamismerkkiStore } from '@/stores/OsaamismerkkiStore';
import { useHead } from '@unhead/vue';
import { murupolkuOsaamismerkkiTiedot } from '@/utils/murupolku';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import { $t } from '@shared/utils/globals';
import { pinia } from '@/pinia';

const route = useRoute();
const osaamismerkkiStore = useOsaamismerkkiStore(pinia);

const koulutustyyppi = computed(() => {
  return _.get(route.params, 'koulutustyyppi') || 'vapaasivistystyo';
});

const osaamismerkki = computed(() => {
  return osaamismerkkiStore.osaamismerkki;
});

const kategoria = computed(() => {
  return osaamismerkki.value?.kategoria;
});

const imageUrl = computed(() => {
  return kategoria.value ? 'data:' + kategoria.value.liite?.mime + ';base64,' + kategoria.value.liite?.binarydata : null;
});

const murupolku = computed(() => {
  return murupolkuOsaamismerkkiTiedot(koulutustyyppi.value, osaamismerkki.value);
});

const isVanhentunut = computed(() => {
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return osaamismerkki.value?.voimassaoloLoppuu && _.toNumber(osaamismerkki.value.voimassaoloLoppuu) < currentDate.getTime();
});

useHead(() => {
  return {
    title: $t('osaamismerkki'),
  };
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tile {
  color: #212529;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  width: 320px;
  height: 350px;
  padding: 20px;
  align-items: center;

  @media(max-width: 767.98px) {
    width: 100%;
    height: 100%;
  }
}

.nimi {
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}

.img {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.header {
  font-size: 1rem;
  font-weight: 600;
}
</style>
