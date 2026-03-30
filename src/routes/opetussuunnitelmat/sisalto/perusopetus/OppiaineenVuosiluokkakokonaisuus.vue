<template>
  <div>
    <div v-if="perusteenVuosiluokkakokonaisuus">
      <ep-peruste-content
        :nayta-sisalto-tyhjana="false"
        :peruste-object="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="oppiaineenVuosiluokkakokonaisuus.tehtava"
        :pohja-object="oppiaineenPohjanVuosiluokkakokonaisuus.tehtava"
        :kuvat="kuvat"
        :termit="termit"
      >
        <template #otsikko>
          <h3
            v-if="!perusteenVuosiluokkakokonaisuus.tehtava"
            class="mb-3"
          >
            {{ $t('tehtava') }}
          </h3>
        </template>
      </ep-peruste-content>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.yleistavoitteet && oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti">
        <h3 class="mt-5">
          {{ $t('tavoitteet-ja-sisallot') }}
        </h3>
        <ep-content-viewer
          :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </template>

      <ep-peruste-content
        :nayta-sisalto-tyhjana="false"
        :peruste-object="perusteenVuosiluokkakokonaisuus.tyotavat"
        :object="oppiaineenVuosiluokkakokonaisuus.tyotavat"
        :pohja-object="oppiaineenPohjanVuosiluokkakokonaisuus.tyotavat"
        :kuvat="kuvat"
        :termit="termit"
      >
        <template #otsikko>
          <h3
            v-if="!perusteenVuosiluokkakokonaisuus.tyotavat"
            class="mb-3"
          >
            {{ $t('opiskeluymparisto-ja-tyotavat') }}
          </h3>
        </template>
      </ep-peruste-content>

      <ep-peruste-content
        :nayta-sisalto-tyhjana="false"
        :peruste-object="perusteenVuosiluokkakokonaisuus.ohjaus"
        :object="oppiaineenVuosiluokkakokonaisuus.ohjaus"
        :pohja-object="oppiaineenPohjanVuosiluokkakokonaisuus.ohjaus"
        :kuvat="kuvat"
        :termit="termit"
      >
        <template #otsikko>
          <h3
            v-if="!perusteenVuosiluokkakokonaisuus.ohjaus"
            class="mb-3"
          >
            {{ $t('oppiaine-osio-ohjaus') }}
          </h3>
        </template>
      </ep-peruste-content>

      <ep-peruste-content
        :nayta-sisalto-tyhjana="false"
        :peruste-object="perusteenVuosiluokkakokonaisuus.arviointi"
        :object="oppiaineenVuosiluokkakokonaisuus.arviointi"
        :pohja-object="oppiaineenPohjanVuosiluokkakokonaisuus.arviointi"
        :kuvat="kuvat"
        :termit="termit"
      >
        <template #otsikko>
          <h3
            v-if="!perusteenVuosiluokkakokonaisuus.arviointi"
            class="mb-3"
          >
            {{ $t('osaamisen-arviointi') }}
          </h3>
        </template>
      </ep-peruste-content>

      <template v-if="perusteenVuosiluokkakokonaisuus.vapaatTekstit">
        <div
          v-for="(vapaaTeksti, index) in perusteenVuosiluokkakokonaisuus.vapaatTekstit"
          :key="'vapaateksti'+index"
          class="mt-4"
        >
          <h4>{{ $kaanna(vapaaTeksti.nimi) }}</h4>
          <ep-content-viewer
            :value="$kaanna(vapaaTeksti.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </div>
      </template>
    </div>

    <div v-else>
      <div class="mt-4 font-600">
        {{ $t('vuosiluokat-joilla-esiintyy') }}
      </div>
      <ul>
        <li
          v-for="(vlk, index) in oppiaineenVuosiluokkakokonaisuus.vuosiluokat"
          :key="'vuosiluokkaes'+index"
        >
          {{ $t(vlk.vuosiluokka) }}
        </li>
      </ul>

      <template v-if="oppiaine">
        <div class="mt-4 font-600">
          {{ $t('laajuus') }}
        </div>
        <div>{{ oppiaine.laajuus }} {{ $t('vuosiviikkotuntia') }}</div>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tehtava') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tehtava')">
        <hr class="mt-5 mb-5">
        <h3>{{ $t('valinnaisen-tehtava') }}</h3>

        <ep-collapse
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tehtava')"
          class="mb-4 mt-3"
          :use-padding="false"
          tyyppi="pohjateksti"
          :border-bottom="false"
          :border-top="false"
        >
          <template #header>
            <h4>{{ $kaanna(pohjaNimi) }}</h4>
          </template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.tehtava.teksti)" />
        </ep-collapse>

        <EpPaikallinenTarkennus
          v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tehtava')"
          headerh4
        >
          <ep-content-viewer
            :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tehtava.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </EpPaikallinenTarkennus>
      </template>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.yleistavoitteet && oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti">
        <hr class="mt-5 mb-5">
        <h3>{{ $t('tavoitteet-ja-sisallot') }}</h3>
        <ep-content-viewer
          :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tyotavat') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tyotavat')">
        <hr class="mt-5 mb-5">
        <h3>{{ $t('oppiaine-tyotavat') }}</h3>

        <ep-collapse
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tyotavat')"
          class="mb-4 mt-3"
          :use-padding="false"
          tyyppi="pohjateksti"
          :border-bottom="false"
          :border-top="false"
        >
          <template #header>
            <h4>{{ $kaanna(pohjaNimi) }}</h4>
          </template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.tyotavat.teksti)" />
        </ep-collapse>

        <EpPaikallinenTarkennus
          v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tyotavat')"
          headerh4
        >
          <ep-content-viewer
            :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tyotavat.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </EpPaikallinenTarkennus>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'ohjaus') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'ohjaus')">
        <hr class="mt-5 mb-5">
        <h3>{{ $t('oppiaine-ohjaus') }}</h3>

        <ep-collapse
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'ohjaus')"
          class="mb-4 mt-3"
          :use-padding="false"
          tyyppi="pohjateksti"
          :border-bottom="false"
          :border-top="false"
        >
          <template #header>
            <h4>{{ $kaanna(pohjaNimi) }}</h4>
          </template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.ohjaus.teksti)" />
        </ep-collapse>

        <EpPaikallinenTarkennus
          v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'ohjaus')"
          headerh4
        >
          <ep-content-viewer
            :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.ohjaus.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </EpPaikallinenTarkennus>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'arviointi') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'arviointi')">
        <hr class="mt-5 mb-5">
        <h3>{{ $t('oppiaine-arviointi') }}</h3>

        <ep-collapse
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'arviointi')"
          class="mb-4 mt-3"
          :use-padding="false"
          tyyppi="pohjateksti"
          :border-bottom="false"
          :border-top="false"
        >
          <template #header>
            <h4>{{ $kaanna(pohjaNimi) }}</h4>
          </template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.arviointi.teksti)" />
        </ep-collapse>

        <EpPaikallinenTarkennus
          v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'arviointi')"
          headerh4
        >
          <ep-content-viewer
            :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.arviointi.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </EpPaikallinenTarkennus>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet')">
        <hr class="mt-5 mb-5">
        <h3>{{ $t('oppiaine-tavoitteista-johdetut-oppimisen-tavoitteet') }}</h3>

        <ep-collapse
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet')"
          class="mb-4 mt-3"
          :use-padding="false"
          tyyppi="pohjateksti"
          :border-bottom="false"
          :border-top="false"
        >
          <template #header>
            <h4>{{ $kaanna(pohjaNimi) }}</h4>
          </template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)" />
        </ep-collapse>

        <EpPaikallinenTarkennus
          v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet')"
          headerh4
        >
          <ep-content-viewer
            :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </EpPaikallinenTarkennus>
      </template>
    </div>

    <template v-if="vuosiluokat && vuosiluokat.length > 0">
      <hr class="mt-5 mb-5">

      <h3>{{ $t('tavoitteet-ja-sisallot-vuosiluokittain') }}</h3>

      <ep-tabs>
        <ep-tab
          v-for="(vuosiluokka,index) in vuosiluokat"
          :key="'vuosiluokka'+index"
          :title="$t(vuosiluokka.vuosiluokka)"
        >
          <oppiaineen-vuosiluokka
            :oppiaineen-vuosiluokka="vuosiluokka"
            :valinnainen="!perusteenVuosiluokkakokonaisuus"
            :pohja-oppiaineen-vuosiluokka="pohjanVuosiluokat[vuosiluokka.vuosiluokka]"
            :kuvat="kuvat"
            :termit="termit"
          />
        </ep-tab>
      </ep-tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, inject } from 'vue';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import OppiaineenVuosiluokka from './OppiaineenVuosiluokka.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $kaanna } from '@shared/utils/globals';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpTabs from '@shared/components/EpTabs/EpTabs.vue';
import EpTab from '@shared/components/EpTabs/EpTab.vue';

const props = defineProps({
  tietue: {
    type: Object,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
  termit: {
    type: Array,
    required: true,
  },
});

const opetussuunnitelma = inject('opetussuunnitelma') as any;

const perusteenVuosiluokkakokonaisuus = computed(() => {
  return props.tietue.perusteenOppiaineenVlk;
});

const oppiaineenVuosiluokkakokonaisuus = computed(() => {
  return props.tietue.oppiaineenVuosiluokkakokonaisuus;
});

const oppiaineenPohjanVuosiluokkakokonaisuus = computed(() => {
  return props.tietue.oppiaineenPohjanVuosiluokkakokonaisuus || {};
});

const pohjanVuosiluokat = computed(() => {
  return _.keyBy(oppiaineenPohjanVuosiluokkakokonaisuus.value.vuosiluokat, 'vuosiluokka');
});

const vuosiluokkakokonaisuus = computed(() => {
  return props.tietue.vuosiluokkakokonaisuus;
});

const oppiaine = computed(() => {
  return props.tietue.oppiaine;
});

const vuosiluokat = computed(() => {
  return _.sortBy(oppiaineenVuosiluokkakokonaisuus.value.vuosiluokat, 'vuosiluokka');
});

const pohjaNimi = computed(() => {
  return opetussuunnitelma?.pohja?.nimi;
});

const hasTekstiContent = (object: any, key: string) => {
  return object != null && object[key] != null && object[key].teksti != null;
};
</script>

<style scoped lang="scss">
  .font-600 {
    font-weight: 600;
  }
</style>
