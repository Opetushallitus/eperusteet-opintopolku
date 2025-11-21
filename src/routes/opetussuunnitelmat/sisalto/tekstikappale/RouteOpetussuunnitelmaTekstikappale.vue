<template>
  <div class="content">
    <div v-if="istekstiKappaleAllLoaded">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(tekstiKappale.nimi) }}
      </h2>

      <!-- Perusteen teksti -->
      <ep-collapse
        v-if="tekstiKappaleViite && tekstiKappaleViite.naytaPerusteenTeksti && perusteTekstikappale && perusteTekstikappale.teksti"
        tyyppi="perusteteksti"
      >
        <template #header>
          <div
            class="collapse-header"
          >
            {{ $t('perusteen-teksti') }}
          </div>
        </template>
        <ep-content-viewer
          v-if="perusteTekstikappale"
          :value="$kaanna(perusteTekstikappale.teksti)"
          :termit="perusteTermit"
          :kuvat="perusteKuvat"
        />
      </ep-collapse>

      <template v-if="tekstiKappaleViite && tekstiKappaleViite.naytaPerusteenTeksti && laajaAlaisetOsaamiset">
        <EpCollapse
          v-for="lao in laajaAlaisetOsaamiset"
          :key="'lao' + lao.id"
        >
          <template #header>
            <h3>
              {{ $kaanna(lao.nimi) }}
            </h3>
          </template>
          <div v-html="$kaanna(lao.kuvaus)" />
        </EpCollapse>
      </template>

      <!-- Pohjan teksti -->
      <ep-collapse
        v-if="tekstiKappaleViite && tekstiKappaleViite.naytaPohjanTeksti && hasTekstikappaleOriginalsTeksteja"
        tyyppi="pohjateksti"
      >
        <template #header>
          <div
            class="collapse-header"
          >
            {{ $kaanna(pohjaNimi) }}
          </div>
        </template>
        <ep-content-viewer
          v-for="(tekstiKappaleOriginal, index) in tekstiKappaleOriginals"
          :key="'tekstiKappaleOriginal'+index"
          :value="$kaanna(tekstiKappaleOriginal.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </ep-collapse>

      <!-- Opetussuunnitelman teksti -->
      <EpPaikallinenTarkennus
        v-if="tekstiKappale && tekstiKappale.teksti"
        :noheader="!perusteTekstikappale"
      >
        <ep-content-viewer
          :value="$kaanna(tekstiKappale.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </EpPaikallinenTarkennus>

      <!-- Alikappaleet -->
      <div v-if="alikappaleet">
        <div
          v-for="(alikappaleViite, idx) in alikappaleet"
          :key="idx"
        >
          <ep-heading
            class="aliotsikko"
            :level="alikappaleViite.level + 2"
          >
            <span v-if="alikappaleNumeroinnitById[alikappaleViite.id]">{{ alikappaleNumeroinnitById[alikappaleViite.id] }}</span>
            {{ $kaanna(alikappaleViite.tekstiKappale.nimi) }}
          </ep-heading>

          <!-- Perusteen teksti -->
          <ep-collapse
            v-if="alikappaleViite.naytaPerusteenTeksti && perusteAlikappaleetObj && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId] && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId].teksti"
            tyyppi="perusteteksti"
          >
            <template #header>
              <div
                class="collapse-header"
              >
                {{ $t('perusteen-teksti') }}
              </div>
            </template>
            <ep-content-viewer
              v-if="alikappaleViite.naytaPerusteenTeksti && perusteAlikappaleetObj && perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId]"
              :value="$kaanna(perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId].teksti)"
              :termit="perusteTermit"
              :kuvat="perusteKuvat"
            />
          </ep-collapse>

          <!-- Pohjan teksti -->
          <ep-collapse
            v-if="alikappaleViite.naytaPohjanTeksti && alikappaleViite.original && alikappaleViite.original.tekstiKappale && alikappaleViite.original.tekstiKappale.teksti"
            tyyppi="pohjateksti"
          >
            <template #header>
              <div
                class="collapse-header"
              >
                {{ $kaanna(pohjaNimi) }}
              </div>
            </template>
            <ep-content-viewer
              :value="$kaanna(alikappaleViite.original.tekstiKappale.teksti)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </ep-collapse>

          <!-- Opetussuunnitelman teksti -->

          <EpPaikallinenTarkennus
            v-if="alikappaleViite.tekstiKappale.teksti"
            :noheader="!perusteAlikappaleetObj || !perusteAlikappaleetObj[alikappaleViite.perusteTekstikappaleId]"
          >
            <ep-content-viewer
              :value="$kaanna(alikappaleViite.tekstiKappale.teksti)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </EpPaikallinenTarkennus>
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
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { Puu } from '@shared/api/ylops';
import { $kaanna } from '@shared/utils/globals';
import { useRoute } from 'vue-router';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';

const route = useRoute();
const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const tekstikappaleId = computed(() => {
  return _.toNumber(route.params.viiteId);
});

const tekstiKappaleViite = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: tekstikappaleId.value });
});

const tekstiKappale = computed(() => {
  return tekstiKappaleViite.value?.tekstiKappale || {};
});

const perusteTekstikappaleViite = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ _perusteenOsa: _.toString(tekstiKappaleViite.value.perusteTekstikappaleId) });
});

const perusteTekstikappale = computed(() => {
  if (perusteTekstikappaleViite.value) {
    return perusteTekstikappaleViite.value.perusteenOsa;
  }
  return undefined;
});

const istekstiKappaleAllLoaded = computed(() => {
  return !!tekstiKappaleViite.value;
});

const tekstiKappaleOriginals = computed(() => {
  return _.map([
    ...(tekstiKappaleViite.value.original ? [tekstiKappaleViite.value.original] : []),
    ...(tekstiKappaleViite.value.original && tekstiKappaleViite.value.original.original && tekstiKappaleViite.value.original.naytaPohjanTeksti ? [tekstiKappaleViite.value.original.original] : []),
  ], 'tekstiKappale');
});

const hasTekstikappaleOriginalsTeksteja = computed(() => {
  return _.size(_.filter(tekstiKappaleOriginals.value, 'teksti')) > 0;
});

const perusteAlikappaleetObj = computed(() => {
  if (!_.isEmpty(perusteTekstikappaleViite.value)) {
    const viitteet: any[] = [];
    const stack = [perusteTekstikappaleViite.value!];

    while (!_.isEmpty(stack)) {
      const head: any = stack.shift()!;

      if (head.perusteenOsa) {
        viitteet.push(head.perusteenOsa);
      }

      stack.unshift(..._.map(head.lapset, (viite: any) => ({
        ...viite,
      })));
    }

    // Poistetaan nykyinen viite alikappaleista
    return _.keyBy(_.slice(viitteet, 1), 'id');
  }

  return undefined;
});

const alikappaleet = computed(() => {
  if (!_.isEmpty(tekstiKappaleViite.value)) {
    const viitteet: Puu[] = [];
    const stack: Puu[] = [tekstiKappaleViite.value!];

    while (!_.isEmpty(stack)) {
      const head: any = stack.shift()!;

      if (head.tekstiKappale) {
        viitteet.push(head);
      }

      stack.unshift(..._.map(head.lapset, (viite: any) => ({
        ...viite,
        level: (head.level || 0) + 1,
      })));
    }

    // Poistetaan nykyinen viite alikappaleista
    return _.slice(_.reject(viitteet, 'piilotettu'), 1);
  }
  else {
    return [];
  }
});

const perusteTermit = computed(() => {
  return opetussuunnitelmaDataStore.perusteTermit;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.termit;
});

const perusteKuvat = computed(() => {
  return opetussuunnitelmaDataStore.perusteKuvat;
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const current = computed(() => {
  return opetussuunnitelmaDataStore.current || null;
});

const pohjaNimi = computed(() => {
  return opetussuunnitelmaDataStore.opetussuunnitelma?.pohja?.nimi;
});

const laajaAlaisetOsaamiset = computed(() => {
  if (perusteTekstikappale.value?.tunniste === 'laajaalainenosaaminen') {
    return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('aipe.laajaalaisetosaamiset');
  }
  return undefined;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});

const alikappaleNumeroinnitById = computed(() => {
  if (current.value?.children) {
    return current.value?.children?.reduce((acc: any, child: any) => {
      acc[child.id] = child?.meta?.numerointi;
      return acc;
    }, {});
  }

  return {};
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  .aliotsikko {
    margin-top: 42px;
  }

  .collapse-header {
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
  }
}
</style>
