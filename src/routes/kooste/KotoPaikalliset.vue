<template>
  <div class="paikalliset">
    <h2 class="otsikko">
      {{ $t('paikalliset-opetussuunnitelmat') }}
    </h2>
    <span>{{ $t('voit-hakea-opetussuunnitelman') }}</span>
    <ep-search
      v-model="query.nimi"
      class="my-3"
      max-width="true"
      :sr-placeholder="$t('hae-opetussuunnitelmaa')"
      :placeholder="$t('')"
    >
      <template #label>
        <span class="font-weight-600">{{ $t('hae-opetussuunnitelmaa') }}</span>
      </template>
    </ep-search>

    <div class="opetussuunnitelma-container">
      <EpHakutulosmaara
        :kokonaismaara="total"
        piilota-nakyva-tulosmaara
      />

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
            class="d-block"
          >
            <opetussuunnitelma-tile
              :ops="ops"
              :query="query.nimi"
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
import { YleisetPaikallisetStore } from '@/stores/YleisetPaikallisetStore';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';

const props = defineProps({
  paikallinenStore: {
    type: Object as () => YleisetPaikallisetStore,
    required: true,
  },
});

const instance = getCurrentInstance();
const perPage = ref(10);
const kieli = computed(() => Kielet.getSisaltoKieli.value);
const query = ref({
  koulutustyyppi: Koulutustyyppi.maahanmuuttajienkotoutumiskoulutus,
  nimi: null as string | null,
  sivu: 0,
  sivukoko: 10,
  kieli: kieli.value,
});

const queryNimi = computed(() => query.value.nimi);

onMounted(async () => {
  if (props.paikallinenStore) {
    await fetch();
  }
});

const fetch = async () => {
  if (_.size(queryNimi.value) === 0 || _.size(queryNimi.value) > 2) {
    await props.paikallinenStore.fetchQuery(query.value);
  }
};

const page = computed({
  get: () => opetussuunnitelmatPaged.value?.sivu! + 1,
  set: (page) => {
    query.value = {
      ...query.value,
      sivu: page - 1,
    };
  }
});

watch(() => queryNimi.value, () => {
  query.value.sivu = 0;
});

watch(() => kieli.value, (val) => {
  query.value = {
    ...query.value,
    kieli: val,
  };
});

watch(() => query.value, async (newVal, oldVal) => {
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
      route: {
        name: 'toteutussuunnitelma',
        params: {
          toteutussuunnitelmaId: _.toString(ops.id),
          koulutustyyppi: 'kotoutumiskoulutus',
        },
      },
    }))
    .sortBy(ops => Kielet.sortValue(ops.nimi))
    .value();
});
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
      width: 300px;
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
