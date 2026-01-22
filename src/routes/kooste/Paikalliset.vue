<template>
  <div
    v-if="julkaistutPerusteet && julkaistutPerusteet.length > 0"
    class="paikalliset"
  >
    <h2 class="otsikko">
      {{ $t('paikalliset-opetussuunnitelmat') }}
    </h2>
    <span>{{ $t('voit-hakea-opetussuunnitelman-yleissivistava') }}</span>
    <div class="flex lg:flex-row flex-col w-full">
      <ep-search
        v-model="query"
        class="flex-1 ml-0 mt-3 mb-3 mr-3"
        :max-width="true"
        :sr-placeholder="$t('hae-opetussuunnitelmaa')"
        :placeholder="''"
      >
        <template #label>
          <span class="font-semibold">{{ $t('hae-opetussuunnitelmaa') }}</span>
        </template>
      </ep-search>
      <EpMultiSelect
        v-if="julkaistutPerusteet"
        v-model="valittuPeruste"
        :is-editing="false"
        :options="perusteetOptions"
        :placeholder="$t('kaikki')"
        class="multiselect ml-0 mt-3 mb-3"
        :searchable="false"
      >
        <template #label>
          <span class="font-semibold">{{ $t('peruste') }}</span>
        </template>
        <template
          #singleLabel="{ option }"
        >
          {{ kaannaPerusteNimi(option) }}
        </template>
        <template
          #option="{ option }"
        >
          {{ kaannaPerusteNimi(option) }}
        </template>
      </EpMultiSelect>
    </div>

    <div class="opetussuunnitelma-container">
      <EpHakutulosmaara
        :kokonaismaara="opetussuunnitelmatLength"
        piilota-nakyva-tulosmaara
      />

      <ep-spinner v-if="isLoading" />
      <div v-else-if="opetussuunnitelmat.length === 0">
        <div class="alert alert-info">
          {{ $t('ei-hakutuloksia') }}
        </div>
      </div>

      <div
        v-else
        id="opetussuunnitelmat-lista"
      >
        <router-link
          v-for="(ops, idx) in opetussuunnitelmat"
          :key="idx"
          :to="ops.route"
          class="block"
        >
          <opetussuunnitelma-tile
            :ops="ops"
            :query="query"
            @mouseover="mouseOver(ops)"
          />
        </router-link>
        <EpBPagination
          v-model="page"
          :items-per-page="perPage"
          :total="opetussuunnitelmatKokonaismaara"
          aria-controls="opetussuunnitelmat-lista"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch, onMounted } from 'vue';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { Kielet } from '@shared/stores/kieli';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { ryhmanKoulutustyypit } from '@shared/utils/perusteet';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import { $t, $kaanna } from '@shared/utils/globals';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  paikallinenStore: {
    type: Object as () => IPaikallinenStore,
    required: true,
  },
  perusteKoosteStore: {
    type: Object as () => PerusteKoosteStore,
    required: true,
  },
  koulutustyyppi: {
    type: String,
    required: true,
  },
});

const query = ref('');
const page = ref(1);
const perPage = ref(10);
const valittuPeruste = ref(null);
const route = useRoute();
const router = useRouter();
const mounted = ref(false);

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const fetch = async () => {
  if (_.size(query.value) === 0 || _.size(query.value) > 2) {
    await props.paikallinenStore.fetchQuery!({
      query: query.value,
      peruste: valittuPeruste.value,
      ...(!valittuPeruste.value?.nimi && { koulutustyypit: ryhmanKoulutustyypit(props.koulutustyyppi) }),
      page: page.value - 1,
    });

    router.replace({
      query: {
        ...(query.value && { haku: query.value }),
        sivu: page.value,
        ...(valittuPeruste.value && { perustediaarinumero: valittuPeruste.value?.diaarinumero }),
      },
    }).catch(() => {});
  }
};

onMounted(async () => {
  setQueryParams();
  await fetch();
  mounted.value = true;
});

const setQueryParams = () => {
  query.value = route?.query?.haku as string || '';
  page.value = route?.query?.sivu as number || 1;
  valittuPeruste.value = _.find(julkaistutPerusteet.value, (peruste) => peruste.diaarinumero === route?.query?.perustediaarinumero as string) || null;
};

watch(() => props.koulutustyyppi, () => {
  valittuPeruste.value = null;
});

watch(query, async () => {
  if (mounted.value) {
    page.value = 1;
  }
  await fetch();
});

watch(page, async () => {
  await fetch();
  document.querySelector('.opetussuunnitelma-container a')?.focus();
});

watch(valittuPeruste, async () => {
  await fetch();
});

watch(kieli, async () => {
  await fetch();
});

const julkaistutPerusteet = computed(() => {
  if (props.perusteKoosteStore.perusteJulkaisut.value) {
    return _.chain(props.perusteKoosteStore.perusteJulkaisut.value)
      .map(julkaistuPeruste => ({
        ...julkaistuPeruste,
        kaannettyNimi: $kaanna(julkaistuPeruste.nimi!),
      }))
      .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
      .value();
  }
  return [];
});

const perusteetOptions = computed(() => {
  if (julkaistutPerusteet.value) {
    return [
      {},
      ...julkaistutPerusteet.value,
    ];
  }
  return [];
});

const isLoading = computed(() => {
  return !props.paikallinenStore.opetussuunnitelmatPaged!.value;
});

const opetussuunnitelmatLength = computed(() => {
  return props.paikallinenStore.opetussuunnitelmatPaged?.value?.kokonaismäärä;
});

const opetussuunnitelmatKokonaismaara = computed(() => {
  if (props.paikallinenStore.opetussuunnitelmatPaged?.value) {
    return props.paikallinenStore.opetussuunnitelmatPaged!.value['kokonaismäärä'];
  }
  return 0;
});

const opetussuunnitelmat = computed(() => {
  return _.chain(props.paikallinenStore.opetussuunnitelmatPaged?.value?.data)
    .map(ops => ({
      ...ops,
      toimijat: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Koulutustoimija')),
      oppilaitokset: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Oppilaitos')),
      route: {
        name: 'opetussuunnitelma',
        params: {
          opetussuunnitelmaId: _.toString(ops.id),
        },
      },
    }))
    .sortBy(ops => Kielet.sortValue(ops.nimi))
    .value();
});

const kaannaPerusteNimi = (option) => {
  if (option?.nimi) {
    return $kaanna(option.nimi);
  }
  return $t('kaikki');
};

const mouseOver = async (opetussuunnitelma) => {
  await props.paikallinenStore.addToCache!(opetussuunnitelma.id);
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.haku {
  width: 100%;
}

.hae-label {
  margin-top: 10px;
  padding-bottom: 0 !important;
  font-weight: 600;
}

.multiselect {
  width: 500px;
}

.paikalliset {

  .opetussuunnitelma-container {

    .peruste-nav {
      margin-bottom: 8px;
      overflow-x: auto;

      .peruste {

        @media (max-width: 767.98px) {
            margin-bottom:10px;
            border-left: #0143da 5px solid;
        }

        @media (max-width: 767.98px) {
          &.active {
            background-color: #F2F2F2;
          }
        }

        @media (min-width: 768px) {
          &.active{
            border-bottom: #0143da 5px solid;
          }
        }

        &.active {
          button, a {
            color: #0143da;
          }
        }

        .peruste-select {
          text-align: center;
          padding: 5px;

          button, a {
            font-weight: bold;
            color: #3367E3;
          }

          a:hover {
            color: #578aff;
          }
        }
      }
    }
  }

  @media (max-width: 767.98px) {
    .multiselect {
      width: 100%;
    }
  }
}

</style>
