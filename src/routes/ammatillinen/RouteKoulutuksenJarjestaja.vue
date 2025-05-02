<template>
  <div>
    <ep-spinner v-if="!koulutustoimija" />
    <div v-else>
      <ep-header
        :murupolku="murupolku"
        :koulutustyyppi="koulutustyyppi"
      >
        <template #header>
          {{ $kaanna(koulutustoimija.nimi) }}
        </template>
      </ep-header>
      <div class="container-md mt-4">
        <div
          v-if="koulutustoimija.kuvaus"
          class="mb-5"
        >
          <h2>{{ $t('kuvaus') }}</h2>
          <div v-html="$kaanna(koulutustoimija.kuvaus)" />
        </div>

        <div
          v-if="!koulutustoimija.organisaatioRyhma"
          class="mb-5"
        >
          <h2>{{ $t('koulutuksen-jarjestajan-yhteinen-osuus') }}</h2>

          <ep-spinner v-if="!yhteisetOsuudet" />
          <div v-else-if="yhteisetOsuudet.length === 0">
            {{ $t('koulutuksen-jarjestaja-ei-ole-lisannyt-yhteista-osuutta') }}
          </div>
          <div v-else>
            <span v-if="yhteisetOsuudet.length === 1">{{ $t('koulutuksen-jarjestaja-otsikko-selite-lyhyt') }}</span>
            <div v-else>
              <span
                v-if="naytaOtsikkoKaikki"
                v-html="$t('koulutuksen-jarjestaja-otsikko-selite')"
              />
              <span
                v-else
                v-html="$t('koulutuksen-jarjestaja-otsikko-selite-vahemman')"
              />

              <ep-button
                v-if="naytaOtsikkoKaikki"
                variant="link"
                @click="naytaOtsikkoKaikki = !naytaOtsikkoKaikki"
              >
                {{ $t('nayta-vahemman') }}
              </ep-button>
              <ep-button
                v-else
                variant="link"
                @click="naytaOtsikkoKaikki = !naytaOtsikkoKaikki"
              >
                {{ $t('nayta-lisaa') }}
              </ep-button>
            </div>

            <ep-search
              v-model="query"
              class="mt-3 mb-3"
              :placeholder="$t('etsi-yhteista-osuutta')"
            />
            <ep-ammatillinen-row
              v-for="(yhteinenOsuus, idx) in yhteisetOsuudetPaginated"
              :key="'yhteinenOsuus' + idx"
              :route="yhteinenOsuus.route"
            >
              <div class="nimi">
                {{ $kaanna(yhteinenOsuus.nimi) }}
              </div>
            </ep-ammatillinen-row>
            <b-pagination
              v-model="page"
              class="mt-4"
              :total-rows="yhteisetOsuudetFiltered.length"
              :per-page="perPage"
              align="center"
              aria-controls="yhteisetosuudet-lista"
              :first-text="$t('alkuun')"
              prev-text="«"
              next-text="»"
              :last-text="$t('loppuun')"
            />
          </div>
        </div>

        <h2>{{ $t('toteutussuunnitelmat') }}</h2>

        <ep-spinner v-if="!toteutussuunnitelmat" />
        <div v-else>
          <ep-search
            v-model="opsQuery"
            class="mb-3"
            :placeholder="$t('etsi-toteutussuunnitelmaa')"
          />
          <div v-if="toteutussuunnitelmat.length === 0 && opsQuery === ''">
            <div class="alert alert-info">
              {{ $t('ei-paikallisia-opetussuunnitelmia') }}
            </div>
          </div>
          <div v-else-if="toteutussuunnitelmat.length === 0 && opsQuery !== ''">
            <div class="alert alert-info">
              {{ $t('ei-hakutuloksia') }}
            </div>
          </div>
          <div
            v-else
            :class="{'disabled-events': !toteutussuunnitelmat}"
          >
            <div
              v-for="(ops, idx) in toteutussuunnitelmat"
              :key="idx"
            >
              <router-link :to="ops.route">
                <opetussuunnitelma-tile
                  :ops="ops"
                  :query="opsQuery"
                />
              </router-link>
            </div>
            <EpBPagination
              v-model="opsPage"
              :items-per-page="perPage"
              :total="toteutussuunnitelmaTotal"
              aria-controls="toteutussuunnitelmat-lista"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { useKoulutuksenJarjestajaStore } from '@/stores/KoulutuksenJarjestajaStore';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';
import OpetussuunnitelmaTile from '@/routes/kooste/OpetussuunnitelmaTile.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { murupolkuKoulutuksenJarjestaja } from '@/utils/murupolku';
import { useHead } from '@unhead/vue';
import { pinia } from '@/pinia';

const koulutuksenJarjestajaStore = useKoulutuksenJarjestajaStore(pinia);

const naytaOtsikkoKaikki = ref(false);
const query = ref('');
const page = ref(1);

const opsQuery = ref('');
const opsPage = ref(1);
const perPage = ref(5);

onMounted(async () => {
  await koulutuksenJarjestajaStore.fetch();
  await doFetch();
});

const koulutustyyppi = computed(() => {
  return 'ammatillinen';
});

const koulutustoimija = computed(() => {
  return koulutuksenJarjestajaStore.koulutustoimija;
});

const yhteisetOsuudet = computed(() => {
  if (koulutuksenJarjestajaStore.yhteisetOsuudet) {
    return _.map(koulutuksenJarjestajaStore.yhteisetOsuudet, yhteinenOsuus => {
      return {
        ...yhteinenOsuus,
        route: { name: 'toteutussuunnitelma',
          params: {
            toteutussuunnitelmaId: _.toString(yhteinenOsuus.id),
            koulutustyyppi: koulutustyyppi.value,
          },
        },
      };
    });
  }

  return undefined;
});

const toteutussuunnitelmat = computed(() => {
  if (koulutuksenJarjestajaStore.toteutussuunnitelmat) {
    return _.map(koulutuksenJarjestajaStore.toteutussuunnitelmat.data, toteutussuunnitelma => {
      return {
        ...toteutussuunnitelma,
        route: {
          name: 'toteutussuunnitelma',
          params: {
            toteutussuunnitelmaId: _.toString(toteutussuunnitelma.id),
            koulutustyyppi: koulutustyyppi.value,
          },
        },
      };
    });
  }

  return undefined;
});

const toteutussuunnitelmaTotal = computed(() => {
  return koulutuksenJarjestajaStore.toteutussuunnitelmat?.kokonaismäärä;
});

const yhteisetOsuudetFiltered = computed(() => {
  return _.chain(yhteisetOsuudet.value)
    .filter(ops => Kielet.search(query.value, ops.nimi))
    .value();
});

const yhteisetOsuudetPaginated = computed(() => {
  return _.chain(yhteisetOsuudetFiltered.value)
    .drop(perPage.value * (page.value - 1))
    .take(perPage.value)
    .value();
});

watch(opsQuery, async () => {
  opsPage.value = 1;
  await doFetch();
});

watch(opsPage, async () => {
  await doFetch();
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

watch(kieli, async () => {
  await Promise.all([doFetch(), koulutuksenJarjestajaStore.fetch()]);
}, { immediate: true });

const doFetch = async () => {
  await koulutuksenJarjestajaStore.fetchToteutussuunnitelmat(opsQuery.value, opsPage.value - 1);
};

const murupolku = computed(() => {
  return murupolkuKoulutuksenJarjestaja(koulutustyyppi.value, koulutustoimija.value);
});

useHead({
  title: computed(() => koulutustoimija.value ? Kielet.kaanna(koulutustoimija.value.nimi) : ''),
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

:deep(.ep-button .btn-link), :deep(.ep-button .btn-link .teksti) {
  padding-left: 0px !important;
}

:deep(.ammatillinen-row .ammatillinen-data) {
  color: $paletti-blue;
}

.opetussuunnitelma {
  border: 1px solid #DADADA;
  border-radius: 2px;
  min-height: 80px;
  margin-bottom: 10px;
}
</style>
