<template>
  <div>
    <ep-header
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template #header>
        <div v-if="tiedote">
          {{ $kaanna(tiedote.otsikko) }}
        </div>
        <ep-spinner v-else />
      </template>
      <template #subheader>
        <div v-if="tiedote">
          <div class="aikaleima">
            {{ $sd(tiedote.luotu) }}
          </div>
        </div>
        <ep-spinner v-else />
      </template>
      <div
        v-if="tiedote"
        class="tiedote"
      >
        <div class="sisalto pb-4">
          <ep-content-viewer :value="$kaanna(tiedote.sisalto)" />
        </div>

        <div
          v-if="tiedoteMapped.perusteet.length > 0 || tiedoteMapped.tutkinnonosat.length > 0 || tiedoteMapped.osaamisalat.length > 0"
          class="tiedote-lisainfo p-3"
        >
          <h3>{{ $t('tiedotteeseen-liittyy') }}</h3>

          <div
            v-if="tiedoteMapped.perusteet.length > 0"
            class="mt-4"
          >
            <h4>{{ $t('perusteet') }}</h4>
            <span
              v-for="(peruste, index) in tiedoteMapped.perusteet"
              :key="'peruste'+peruste.id"
              class="peruste"
            >
              <span v-if="index > 0">, </span>
              <router-link :to="peruste.route">{{ $kaanna(peruste.nimi) }}</router-link>
            </span>
          </div>

          <ep-spinner v-if="!tutkinnonosienPerusteet" />
          <uutisen-koodit
            v-else
            :koodit-perusteilla="tutkinnonosienPerusteet"
            class="mt-4"
          >
            <template #header>
              <h4>{{ $t('tutkinnonosat') }}</h4>
            </template>
            <template #popover-header>
              <h4>{{ $t('perusteet-joissa-tutkinnon-osia-on') }}</h4>
            </template>
          </uutisen-koodit>

          <ep-spinner v-if="!osaamisalojenPerusteet" />
          <uutisen-koodit
            v-else
            :koodit-perusteilla="osaamisalojenPerusteet"
            class="mt-4"
          >
            <template #header>
              <h4>{{ $t('osaamisalat') }}</h4>
            </template>
            <template #popover-header>
              <h4>{{ $t('perusteet-joissa-osaamisaloja-on') }}</h4>
            </template>
          </uutisen-koodit>
        </div>
      </div>
      <ep-spinner v-else />
    </ep-header>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { useTiedoteStore } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { koulutustyyppiStateName } from '@shared/utils/perusteet';
import UutisenKoodit from './UutisenKoodit.vue';
import { useJulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { $kaanna, $sd, $t } from '@shared/utils/globals';
import { pinia } from '@/pinia';

const route = useRoute();
const page = ref(1);
const query = ref('');
const tiedoteStore = useTiedoteStore(pinia);
const julkaistutKoulutustyypitStore = useJulkaistutKoulutustyypitStore(pinia);

const tiedote = computed(() => {
  return tiedoteStore.tiedote;
});

const julkaistutKoulutustyypit = computed(() => {
  return julkaistutKoulutustyypitStore.julkaistutKoulutustyypit;
});

const perusteet = computed(() => {
  return _.filter(tiedoteStore.tiedote?.perusteet, peruste =>
    _.includes(julkaistutKoulutustyypit.value, peruste.koulutustyyppi as any));
});

const perusteRoutes = (perusteet) => {
  return _.map(perusteet, peruste => {
    return {
      ...peruste,
      route: {
        name: 'peruste',
        params: {
          perusteId: peruste.id,
          koulutustyyppi: koulutustyyppiStateName(peruste.koulutustyyppi!),
        },
      },
    };
  });
};

const tiedoteMapped = computed(() => {
  return {
    ...tiedote.value,
    perusteet: perusteRoutes(perusteet.value),
  };
});

const osaamisalojenPerusteet = computed(() => {
  return tiedoteStore.tiedotteenOsaamisalaPerusteet;
});

const tutkinnonosienPerusteet = computed(() => {
  return tiedoteStore.tiedotteenTutkinnonosaPerusteet;
});

const koulutustyyppi = computed(() => {
  if (tiedote.value && tiedote.value.peruste) {
    return tiedote.value.peruste.koulutustyyppi;
  }
  return undefined;
});

const murupolku = computed(() => {
  const murut = [{
    label: 'ajankohtaista',
    location: {
      name: 'uutiset',
    },
  }];

  if (tiedote.value) {
    murut.push({
      label: tiedote.value.otsikko,
      location: {
        name: 'uutinen',
        params: {
          tiedoteId: tiedote.value.id,
        },
      },
    } as any);
  }

  return murut;
});

// Meta information
useHead(() => {
  if (tiedote.value) {
    return {
      title: $kaanna(tiedote.value.otsikko),
    };
  }
  return {};
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.aikaleima {
  font-weight: bold;
  font-size: small;
}

.tiedote {
  padding-left: 15px;
  padding-right: 15px;

  .sisalto {
    @include teksti-sisalto;
  }

  .tiedote-lisainfo {
    border: 1px solid $grey300;
    border-radius: 3px;
  }
}
</style>
