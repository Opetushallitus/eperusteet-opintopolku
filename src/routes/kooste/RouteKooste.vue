<template>
  <ep-spinner v-if="!koulutustyyppi || (perusteKoosteStore && !julkaistutPerusteet)" />
  <ep-header
    v-else
    :murupolku="murupolku"
    :koulutustyyppi="koulutustyyppi"
  >
    <template #header>
      {{ $t(koulutustyyppi) }}
    </template>
    <template #subheader>
      {{ $t(subheader) }}
    </template>
    <div>
      <b-container fluid>
        <b-row
          v-if="kuvaus"
          class="mb-5"
        >
          <b-col
            cols="12"
            xl="auto"
            class="tile"
          >
            <h2 class="otsikko">
              {{ $t('kuvaus') }}
            </h2>
            <div>{{ $t(kuvaus) }}</div>
          </b-col>
        </b-row>

        <b-row v-if="perusteKoosteStore">
          <b-col
            cols="12"
            xl="auto"
            class="tile"
          >
            <h2 class="otsikko">
              {{ $t(perusteetHeader) }}
            </h2>
            <div
              v-if="julkaistutPerusteet"
              class="perustebox d-md-flex flex-wrap justify-content-start"
            >
              <div v-if="julkaistutPerusteet.length === 0">
                {{ $t('perusteita-ei-saatavilla') }}
              </div>
              <template v-else>
                <router-link
                  v-for="(julkaisu, idx) in visibleJulkaistutPerusteet"
                  :key="idx"
                  :to="{ name: 'peruste', params: { perusteId: julkaisu.id } }"
                  class="my-2 mr-2"
                >
                  <peruste-tile
                    :julkaisu="julkaisu"
                    :koulutustyyppi="koulutustyyppi"
                  />
                </router-link>
              </template>
              <router-link
                v-for="(route, idx) in muutTilet"
                :key="'muut' + idx"
                :to="route.route"
              >
                <component
                  :is="route.komponentti"
                  :koulutustyyppi="koulutustyyppi"
                />
              </router-link>
            </div>
            <ep-spinner v-else />
          </b-col>
          <b-col v-if="julkaistutEraantyneetPerusteet && julkaistutEraantyneetPerusteet.length > 0">
            <b-button
              variant="link"
              @click="toggleEraantyneet()"
            >
              <span v-if="showEraantyneet">{{ $t('piilota-ei-voimassa-olevat-perusteet') }}</span>
              <span v-else>{{ $t('nayta-ei-voimassa-olevat-perusteet') }}</span>
            </b-button>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <h2>{{ $t('ajankohtaista') }}</h2>
            <ep-spinner-slot :is-loading="!tiedotteet">
              <ep-julki-lista
                :tiedot="tiedotteet"
                :tieto-maara="2"
                @avaa-tieto="avaaTiedote"
              >
                <template #lisaaBtn>
                  <EpSecondaryButton
                    class="mt-2"
                    :to="{ name: 'uutiset', query: { koulutustyypit: koulutustyyppi } }"
                  >
                    {{ $t('kaikki-ajankohtaiset') }}
                  </EpSecondaryButton>
                </template>
              </ep-julki-lista>
            </ep-spinner-slot>
          </b-col>
        </b-row>

        <b-row v-if="paikallinenStore">
          <b-col>
            <component
              :is="paikallinenComponent"
              :peruste-kooste-store="perusteKoosteStore"
              :paikallinen-store="paikallinenStore"
              :koulutustyyppi="koulutustyyppi"
            />
          </b-col>
        </b-row>

        <b-row>
          <div class="list-section">
            <div
              v-if="opasStore"
              class="list"
            >
              <h2>{{ $t('ohjeet-ja-materiaalit') }}</h2>
              <ep-spinner-slot :is-loading="!ohjeet">
                <ep-julki-lista
                  :tiedot="ohjeet"
                  :tieto-maara="3"
                  @avaa-tieto="avaaOpas"
                >
                  <template #lisaaBtnText>
                    {{ $t('nayta-lisaa') }}
                  </template>
                  <template #eiTietoja>
                    <div class="mt-2">
                      {{ $t('ei-ohjeita') }}
                    </div>
                  </template>
                  <template #muokkausaika="{ tieto }">
                    {{ $sd(tieto.julkaistu) }}
                  </template>
                </ep-julki-lista>
              </ep-spinner-slot>
            </div>
          </div>
        </b-row>
      </b-container>
    </div>
  </ep-header>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, getCurrentInstance, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import PerusteTile from './PerusteTile.vue';
import { MurupolkuOsa } from '@/tyypit';
import _ from 'lodash';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista, { JulkiRivi } from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import EpSecondaryButton from '@shared/components/EpSecondaryButton/EpSecondaryButton.vue';
import { $t, $kaanna } from '@shared/utils/globals';
import {
  getKoosteKuvaus,
  getKoosteOpasStore,
  getKoostePaikallinenComponent,
  getKoostePaikallinenStore,
  getKoostePerusteHeader,
  getKoostePerusteStore,
  getKoosteSubheader,
  getKoosteTiedotteetStore,
} from '@/utils/toteutustypes';
import { julkisivuPerusteKoosteJarjestys, stateToKoulutustyyppi } from '@shared/utils/perusteet';

const route = useRoute();
const perusteKoosteStore = getKoostePerusteStore(stateToKoulutustyyppi(route.params.koulutustyyppi));
const opasStore = getKoosteOpasStore(stateToKoulutustyyppi(route.params.koulutustyyppi));
const tiedotteetStore = getKoosteTiedotteetStore(stateToKoulutustyyppi(route.params.koulutustyyppi));
const paikallinenStore = getKoostePaikallinenStore(route.params.koulutustyyppi);
const paikallinenComponent = getKoostePaikallinenComponent(route.params.koulutustyyppi);
const kuvaus = getKoosteKuvaus(route.params.koulutustyyppi);
const subheader = getKoosteSubheader(route.params.koulutustyyppi);
const perusteetHeader = getKoostePerusteHeader(route.params.koulutustyyppi);

const router = useRouter();
const instance = getCurrentInstance();

const showEraantyneet = ref(false);

onMounted(async () => {
  await fetch();
  await nextTick();
  const h1 = instance?.proxy?.$el.querySelector('h1');
  h1?.setAttribute('tabindex', '-1');
  h1?.focus();
});

const koulutustyyppi = computed(() => {
  return perusteKoosteStore?.koulutustyyppi.value || _.get(route.params, 'koulutustyyppi');
});

const routeKoulutustyyppi = computed(() => {
  return route.params.koulutustyyppi;
});

const tiedotteet = computed(() => {
  if (tiedotteetStore?.tiedotteet?.value) {
    return _.chain(tiedotteetStore.tiedotteet?.value)
      .sortBy('luotu')
      .reverse()
      .value();
  }

  return undefined;
});

const ohjeet = computed(() => {
  if (opasStore?.oppaat?.value) {
    return _.chain(opasStore.oppaat?.value)
      .map(opas => {
        return {
          ...opas,
          otsikko: opas.nimi,
        } as JulkiRivi;
      })
      .sortBy('muokattu')
      .reverse()
      .value();
  }

  return undefined;
});

const perusteJarjestykset = computed(() => {
  return perusteKoosteStore.perusteJarjestykset?.value;
});

const julkaistutPerusteet = computed(() => {
  if (!perusteKoosteStore?.perusteJulkaisut?.value) {
    return undefined;
  }

  return _.chain(perusteKoosteStore.perusteJulkaisut?.value)
    .map(julkaisu => ({
      ...julkaisu,
      perusteId: _.toString(julkaisu.id),
      kaannettyNimi: $kaanna(julkaisu.nimi!),
      julkisivuJarjestysNro: _.find(perusteJarjestykset.value, jarjestys => jarjestys.id === julkaisu.id)?.julkisivuJarjestysNro,
    }))
    .orderBy(julkisivuPerusteKoosteJarjestys.keys, julkisivuPerusteKoosteJarjestys.sortby)
    .value();
});

const julkaistutVoimassaolevatPerusteet = computed(() => {
  return _.filter(julkaistutPerusteet.value, (peruste) => (!peruste.voimassaoloLoppuu || Date.now() < peruste.voimassaoloLoppuu)
      && !_.find(perusteJarjestykset.value, jarjestys => jarjestys.id === peruste.id)?.piilotaJulkisivulta);
});

const julkaistutEraantyneetPerusteet = computed(() => {
  return _.filter(julkaistutPerusteet.value, (peruste) => (peruste.voimassaoloLoppuu && Date.now() > peruste.voimassaoloLoppuu)
      || _.find(perusteJarjestykset.value, jarjestys => jarjestys.id === peruste.id)?.piilotaJulkisivulta);
});

const visibleJulkaistutPerusteet = computed(() => {
  if (showEraantyneet.value) {
    return [...julkaistutVoimassaolevatPerusteet.value, ...julkaistutEraantyneetPerusteet.value];
  }
  return julkaistutVoimassaolevatPerusteet.value;
});

const muutTilet = computed(() => {
  return perusteKoosteStore?.muutTilet?.value;
});

const murupolku = computed((): Array<MurupolkuOsa> => {
  return [{
    label: koulutustyyppi.value,
    location: {
      ...route,
    },
  }];
});

const toggleEraantyneet = () => {
  showEraantyneet.value = !showEraantyneet.value;
};

const avaaTiedote = (tiedote: TiedoteDto) => {
  router.push({
    name: 'uutinen',
    params: {
      tiedoteId: '' + tiedote.id,
    },
  });
};

const avaaOpas = (ohje: any) => {
  router.push({
    name: 'peruste',
    params: {
      koulutustyyppi: 'opas',
      perusteId: ohje.id,
    },
  });
};

const fetch = async () => {
  if (perusteKoosteStore) {
    await perusteKoosteStore.fetch();
    await tiedotteetStore.fetch(perusteKoosteStore?.perusteJulkaisut?.value);
  }
  else {
    await tiedotteetStore.fetch();
  }
};

// Watch for changes to koulutustyyppi
watch(koulutustyyppi, async () => {
  await fetch();
});

// Replace @Meta decorator with useHead
useHead({
  title: computed(() => $t(koulutustyyppi.value)),
});

watch(routeKoulutustyyppi, async () => {
  window.location.reload();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

:deep(.ep-collapse .header) {
  color: #3367E3;
}

.container {
  .tile {
    // Todo: käytä muuttujia
    @media (max-width: 1199.98px) {
      &:not(:first-child) {
        margin-top: 30px;
      }
    }

    .perustebox {
      margin-top: 30px;
      margin-bottom: 30px;
    }

    .tiedotebox {
      margin-top: 30px;

      .tiedote {
        padding: 5px;
        margin-bottom: 1rem;

        &:nth-child(odd) {
          background-color: #F9F9F9;
        }

        .aikaleima {
          font-size: smaller;
          color: #555;
        }

        a {
            color: #2B2B2B;
        }

        a:hover {
          color: #0070f4;
        }
      }
    }
  }
}

.row {
  margin-bottom: 2rem;
  display: block;
}

.list {
  padding-left: 15px;
  padding-right: 15px;
  width: 50%;
}

@media (min-width: 991.98px) {
  .list-section {
    display: flex;
  }
}

@media (max-width: 991.98px) {
  .row {
    margin: 25px 0 0 0;
  }

  .list {
    padding-top: 20px;
    width: 100%;
  }
}
</style>
