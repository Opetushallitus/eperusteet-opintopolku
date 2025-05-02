<template>
  <router-view v-if="oppiaine" />

  <div
    v-else
    class="content"
  >
    <h2>{{ $kaanna(vaihe.nimi) }}</h2>

    <div
      v-if="vaihe.siirtymaEdellisesta"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.siirtymaEdellisesta.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.siirtymaEdellisesta.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="vaihe.tehtava"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.tehtava.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.tehtava.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="vaihe.siirtymaSeuraavaan"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.siirtymaSeuraavaan.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.siirtymaSeuraavaan.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="vaihe.paikallisestiPaatettavatAsiat"
      class="mt-4"
    >
      <h3>{{ $kaanna(vaihe.paikallisestiPaatettavatAsiat.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(vaihe.paikallisestiPaatettavatAsiat.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaineet && oppiaineet.length > 0"
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

    <div
      v-if="tavoitealueet && tavoitealueet.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('opetuksen-tavoitealueet') }}</h3>
      <div
        v-for="tavoitealue in tavoitealueet"
        :key="'tavoitealue'+tavoitealue.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        {{ $kaanna(tavoitealue.nimi) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();

const vaiheId = computed(() => {
  return _.toNumber(route.params.vaiheId);
});

const vaihe = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: vaiheId.value });
});

const oppiaineet = computed(() => {
  if (vaihe.value) {
    return _.map(vaihe.value.oppiaineet, oppiaine => {
      return {
        ...oppiaine,
        route: { name: 'aipeoppiaine', params: { oppiaineId: _.toString(oppiaine.id) } },
      };
    });
  }
  return [];
});

const tavoitealueet = computed(() => {
  if (vaihe.value) {
    return vaihe.value.opetuksenKohdealueet;
  }
  return [];
});

const oppiaine = computed(() => {
  return route.params.oppiaineId;
});

const fields = computed(() => {
  return [{
    key: 'nimi',
    thStyle: {
      display: 'none',
    },
  }];
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
