<template>
  <div>
    <ep-spinner v-if="!peruste" />
    <ep-header
      v-else
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template #header>
        {{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{ peruste.laajuus }} {{ $t('osaamispiste') }}</span>
      </template>
      <div class="selaus">
        <div class="w-full">
          <div class="flex flex-wrap mb-0">
            <div
              class="w-full lg:w-1/2 tile mb-5"
            >
              <h2 class="otsikko mb-4">
                {{ $t('peruste') }}
              </h2>
              <router-link :to="perusteRoute">
                <peruste-tile
                  :julkaisu="peruste"
                  :koulutustyyppi="koulutustyyppi"
                />
              </router-link>
            </div>
            <div
              class="w-full lg:w-1/2 mb-5"
            >
              <h2 class="mb-4">
                {{ $t('ajankohtaista') }}
              </h2>
              <ep-spinner v-if="!tiedotteet" />
              <ep-julki-lista
                v-else
                :tiedot="tiedotteet"
                @avaa-tieto="avaaTiedote"
              >
                <template #lisaaBtnText>
                  <div class="mt-2">
                    {{ $t('katso-lisaa-ajankohtaisia') }}
                  </div>
                </template>
                <template #eiTietoja>
                  <div class="mt-2">
                    {{ $t('ei-tiedotteita') }}
                  </div>
                </template>
              </ep-julki-lista>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full">
              <h2 class="otsikko mb-2">
                {{ $t('paikalliset-toteutussuunnitelmat') }}
              </h2>
              <div class="search mb-2">
                <div class="mb-2">
                  {{ $t('voit-hakea-toteutussuunnitelmaa-nimella-tutkinnon-osalla-tai-organisaatiolla') }}
                </div>
                <ep-search
                  v-model="query"
                  :placeholder="''"
                  class="my-3"
                >
                  <template #label>
                    <span class="font-semibold">{{ $t('hae-toteutussuunnitelmaa') }}</span>
                  </template>
                </ep-search>
              </div>
              <ep-spinner v-if="!opetussuunnitelmatPage" />
              <div v-else-if="opetussuunnitelmat.length === 0 && !query">
                <div class="alert alert-info">
                  {{ $t('perusteen-pohjalta-ei-toteutettu-toteutussuunnitelmia') }}
                </div>
              </div>
              <div v-else-if="opetussuunnitelmat.length === 0 && query">
                <div class="alert alert-info">
                  {{ $t('ei-hakutuloksia') }}
                </div>
              </div>
              <div
                v-else
                id="opetussuunnitelmat-lista"
                class="opetussuunnitelma-container"
              >
                <EpHakutulosmaara
                  :kokonaismaara="opetussuunnitelmatPage.kokonaismäärä"
                  piilota-nakyva-tulosmaara
                />

                <div
                  v-for="(ops, idx) in opetussuunnitelmat"
                  :key="idx"
                >
                  <router-link
                    :to="ops.route"
                    class="block"
                  >
                    <opetussuunnitelma-tile
                      :ops="ops"
                      :query="query"
                    />
                  </router-link>
                </div>
                <EpBPagination
                  v-model="page"
                  :items-per-page="perPage"
                  :total="opetussuunnitelmatPage.kokonaismäärä"
                  aria-controls="opetussuunnitelmat-lista"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ep-header>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import PerusteTile from './PerusteTile.vue';
import * as _ from 'lodash';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { useAmmatillinenPerusteKoosteStore } from '@/stores/AmmatillinenPerusteKoosteStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import { OpetussuunnitelmaDto } from '@shared/api/amosaa';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { murupolkuAmmatillinenRoot } from '@/utils/murupolku';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import { useHead  } from '@unhead/vue';
import { $t, $kaanna } from '@shared/utils/globals';
import { pinia } from '@/pinia';

const route = useRoute();
const router = useRouter();
const ammatillinenPerusteKoosteStore = useAmmatillinenPerusteKoosteStore(pinia);
const mounted = ref(false);
const page = ref(1);

const query = ref('');

onMounted(async () => {
  setQueryParams();
  await nextTick();
  mounted.value = true;
});

const setQueryParams = () => {
  query.value = route?.query?.haku as string || null;
  page.value = _.parseInt(route?.query?.sivu as unknown as string || '1');
};

const koulutustyyppi = computed(() => {
  return 'ammatillinen';
});

const peruste = computed(() => {
  if (ammatillinenPerusteKoosteStore?.peruste) {
    return {
      ...ammatillinenPerusteKoosteStore.peruste,
      laajuus: _.get(ammatillinenPerusteKoosteStore.peruste, 'suoritustavat[0].rakenne.muodostumisSaanto.laajuus.minimi'),
    } as any;
  }

  return undefined;
});

const murupolku = computed(() => {
  return [
    murupolkuAmmatillinenRoot(koulutustyyppi.value),
    {
      label: peruste.value!.nimi!,
      location: {
        ...route,
      },
    },
  ];
});

const tiedotteet = computed(() => {
  if (ammatillinenPerusteKoosteStore.tiedotteet) {
    return _.chain(ammatillinenPerusteKoosteStore.tiedotteet)
      .sortBy('luotu')
      .reverse()
      .value();
  }

  return undefined;
});

const perusteRoute = computed(() => {
  return { name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: _.toString(peruste.value!.id) } };
});

const opetussuunnitelmatPage = computed(() => {
  return ammatillinenPerusteKoosteStore.opetussuunnitelmat;
});

const opetussuunnitelmat = computed(() => {
  if (opetussuunnitelmatPage.value) {
    return _.map(opetussuunnitelmatPage.value.data, (opetussuunnitelma: OpetussuunnitelmaDto) => (
      {
        ...opetussuunnitelma,
        route: {
          name: 'toteutussuunnitelma',
          params: {
            toteutussuunnitelmaId: _.toString(opetussuunnitelma.id),
            koulutustyyppi: 'ammatillinen',
          },
        },
      }
    ));
  }
  return [];
});

const perPage = computed(() => {
  return opetussuunnitelmatPage.value!.sivukoko;
});


watch(page, async () => {
  await fetch();
});

watch(query, async (oldVal, newVal) => {
  if (mounted.value) {
    page.value = 1;
    await fetch();
  }
}, { deep: true });

const fetch = async () => {
  if (_.size(query.value) === 0 || _.size(query.value) > 2) {
    await ammatillinenPerusteKoosteStore.fetchOpetussuunnitelmat({ nimi: query.value, sivu: page.value - 1 });

    router.replace({
      query: {
        haku: query.value,
        sivu: page.value,
      },
    }).catch(() => {});

    document.querySelector('.opetussuunnitelma-container a')?.focus();

  }
};

const avaaTiedote = (tiedote: TiedoteDto) => {
  router.push({
    name: 'uutinen',
    params: {
      tiedoteId: '' + tiedote.id,
    },
  });
};

// Meta information for the page
useHead(() => {
  if (peruste.value) {
    return {
      title: $kaanna(peruste.value.nimi),
    };
  }
  return {};
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

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
}

.search {
  .placeholder {
    font-size: small;
    color: $gray;
  }
}

@media (max-width: 991.98px) {
  .selaus {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
}
</style>
