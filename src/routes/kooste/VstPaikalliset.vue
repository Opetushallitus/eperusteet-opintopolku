<template>
  <div class="paikalliset">
    <h2 class="otsikko">
      {{ $t('paikalliset-opetussuunnitelmat') }}
    </h2>
    <span>{{ $t('voit-hakea-opetussuunnitelman') }}</span>
    <div class="flex lg:flex-row flex-col w-full">
      <ep-search
        v-model="query.nimi"
        class="flex-1 ml-0 mt-3 mb-3 mr-3"
        max-width="true"
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
        @update:model-value="setActivePeruste($event)"
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

    <EpVoimassaoloFilter v-model="query" />

    <div class="opetussuunnitelma-container">
      <ep-spinner v-if="!opetussuunnitelmat" />
      <div v-else-if="opetussuunnitelmat.length === 0">
        <div class="alert alert-info">
          {{ $t('ei-hakutuloksia') }}
        </div>
      </div>
      <div
        v-else
        id="opetussuunnitelmat-lista"
      >
        <div
          v-for="(ops, idx) in opetussuunnitelmatMapped"
          :key="idx"
        >
          <router-link
            :to="ops.route"
            class="block"
          >
            <opetussuunnitelma-tile
              :ops="ops"
              :query="query.nimi"
              :voimassaolo-tiedot="ops.voimassaoloTieto"
              show-jotpa-info
            />
          </router-link>
        </div>
        <EpBPagination
          v-model="page"
          :items-per-page="perPage"
          :total="total"
          aria-controls="opetussuunnitelmat-lista"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { Koulutustyyppi } from '@shared/tyypit';
import { VapaasivistystyoPaikallisetStore } from '@/stores/VapaasivistystyoPaikallisetStore';
import { voimassaoloTieto } from '@/utils/voimassaolo';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { isVstLukutaito } from '@shared/utils/perusteet';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import { $kaanna } from '@shared/utils/globals';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  paikallinenStore: {
    type: Object as () => VapaasivistystyoPaikallisetStore,
    required: true,
  },
  perusteKoosteStore: {
    type: Object as () => PerusteKoosteStore,
    required: true,
  },
});

const instance = getCurrentInstance();
const valittuPeruste = ref(null);
const perPage = ref(10);
const kieli = computed(() => Kielet.getSisaltoKieli.value);
const route = useRoute();
const router = useRouter();
const mounted = ref(false);

const initQuery = () => {
  return {
    perusteenDiaarinumero: null,
    perusteId: 0,
    koulutustyyppi: [
      Koulutustyyppi.vapaasivistystyo,
      Koulutustyyppi.vapaasivistystyolukutaito,
    ],
    oppilaitosTyyppiKoodiUri: null,
    nimi: null as string | null,
    sivu: 0,
    sivukoko: 10,
    kieli: kieli.value,
    tuleva: true,
    voimassaolo: true,
    poistunut: false,
    jotpatyyppi: [
      'NULL',
      'VST',
    ],
  };
};

const query = ref(initQuery());

onMounted(async () => {
  setQueryParams();
  await fetch();

  mounted.value = true;
});

const setQueryParams = () => {

  const peruste = _.find(julkaistutPerusteet.value, (peruste) => peruste.diaarinumero === route?.query?.perustediaarinumero as string);

  query.value = {
    ...query.value,
    nimi: route?.query?.haku as string || null,
    sivu: (route?.query?.sivu as number || 1) - 1,
    perusteId: peruste?.id || 0,
    voimassaolo: _.has(route?.query, 'voimassaolo') ? route?.query?.voimassaolo === 'true' ? true : false : true,
    poistunut: _.has(route?.query, 'poistunut') ? route?.query?.poistunut === 'true' ? true : false : false,
    tuleva: _.has(route?.query, 'tuleva') ? route?.query?.tuleva === 'true' ? true : false : true,
  };

  valittuPeruste.value = peruste || null;
};

const fetch = async () => {
  if (_.size(queryNimi.value) === 0 || _.size(queryNimi.value) > 2) {
    await props.paikallinenStore.fetchQuery(query.value);

    router.replace({
      query: {
        ...(query.value.nimi && { haku: query.value.nimi }),
        sivu: query.value.sivu + 1,
        ...(query.value.perusteId && { perustediaarinumero: _.find(julkaistutPerusteet.value, (peruste) => peruste.id === query.value.perusteId)?.diaarinumero }),
        voimassaolo: query.value.voimassaolo ? 'true' : 'false',
        poistunut: query.value.poistunut ? 'true' : 'false',
        tuleva: query.value.tuleva ? 'true' : 'false',
      },
    }).catch(() => {});
  }
};

const julkaistutPerusteet = computed(() => {
  if (props.perusteKoosteStore.perusteJulkaisut) {
    return _.chain(props.perusteKoosteStore.perusteJulkaisut.value)
      .filter(julkaistuPeruste => !isVstLukutaito(julkaistuPeruste.koulutustyyppi))
      .map(julkaistuPeruste => ({
        ...julkaistuPeruste,
        kaannettyNimi: $kaanna(julkaistuPeruste.nimi!),
      }))
      .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
      .value();
  }
  return undefined;
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

const setActivePeruste = async (perusteJulkaisu) => {
  if (perusteJulkaisu?.id) {
    query.value.perusteId = _.toNumber(perusteJulkaisu.id);
    query.value.perusteenDiaarinumero = perusteJulkaisu.diaarinumero;
    query.value.sivu = 0;
  }
  else {
    query.value = initQuery();
  }
  await fetch();
};

const page = computed({
  get: () => (opetussuunnitelmatPaged.value?.sivu ?? 0) + 1,
  set: (page) => {
    query.value = {
      ...query.value,
      sivu: page - 1,
    };
  },
});

const queryNimi = computed(() => query.value.nimi);

watch(() => kieli.value, (val) => {
  query.value = {
    ...query.value,
    kieli: val,
  };
});

watch(() => queryNimi.value, () => {
  if (mounted.value) {
    query.value.sivu = 0;
  }
});

watch(() => query.value, async (newVal, oldVal) => {
  if (query.value.oppilaitosTyyppiKoodiUri === 'kaikki') {
    query.value.oppilaitosTyyppiKoodiUri = null;
  }
  await fetch();

  if (oldVal.sivu !== newVal.sivu && instance?.proxy?.$el) {
    (instance?.proxy?.$el.querySelector('.opetussuunnitelma-container a') as any)?.focus();
  }
}, { deep: true });

const opetussuunnitelmat = computed(() => {
  return props.paikallinenStore.opetussuunnitelmat.value;
});

const opetussuunnitelmatPaged = computed(() => {
  return props.paikallinenStore.opetussuunnitelmatPaged.value;
});

const total = computed(() => {
  return opetussuunnitelmatPaged.value?.kokonaismäärä;
});

const opetussuunnitelmatMapped = computed(() => {
  return _.chain(opetussuunnitelmat.value)
    .map(ops => ({
      ...ops,
      toimijat: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Koulutustoimija')),
      oppilaitokset: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Oppilaitos')),
      route: {
        name: 'toteutussuunnitelma',
        params: {
          toteutussuunnitelmaId: _.toString(ops.id),
          koulutustyyppi: 'vapaasivistystyo',
        },
      },
      voimassaoloTieto: voimassaoloTieto(ops),
    }))
    .sortBy(ops => Kielet.sortValue(ops.nimi))
    .value();
});

const kaannaPerusteNimi = (option) => {
  if (option.nimi) {
    return $kaanna(option.nimi);
  }
  return instance?.proxy?.$t('kaikki');
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.paikalliset {

  :deep(.filter) {
    max-width: 100%;
  }

  @media(min-width: 992px){
    .multiselect {
      width: 500px;
    }
  }

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
}
</style>
