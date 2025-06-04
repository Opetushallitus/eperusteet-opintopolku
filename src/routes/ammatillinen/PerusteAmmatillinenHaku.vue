<template>
  <div class="haku">
    <div class="search">
      <div v-if="tyyppi === 'peruste'">
        <div class="placeholderText">
          <span class="pr-1">{{ searchPlaceholder }}</span>
          <span class="pr-1">{{ $t('voit-hakea-tutkinnon-osia') }}</span>
          <EpSpinner
            v-if="!valmisteillaOlevat"
            small
          />
          <span v-else-if="valmisteillaOlevat.data.length > 0">{{ $t('katso-myos') }}
            <router-link
              class="w-100"
              :to="{name: 'ammatillinenValmisteillaOlevat'}"
            >
              {{ $t('valmisteilla-olevien-perusteiden-julkaisuaikataulu') }}
            </router-link>
          </span>
        </div>

        <div
          class="d-flex flex-lg-row flex-column"
          :class="{'disabled-events': !perusteetJaTutkinnonosat}"
        >
          <EpSearch
            v-model="query"
            class="flex-fill ml-0 mt-3 mb-3 mr-3"
            :sr-placeholder="$t('tutkinnon-peruste-tai-tutkinnon-osa')"
            :placeholder="$t('')"
          >
            <template #label>
              <span class="font-weight-600">{{ $t('tutkinnon-peruste-tai-tutkinnon-osa') }}</span>
            </template>
          </EpSearch>
          <EpMultiSelect
            v-model="tutkintotyyppi"
            class="multiselect ml-0 mt-3 mb-3"
            :enable-empty-option="true"
            :placeholder="$t('kaikki')"
            :is-editing="true"
            :options="tutkintotyypit"
            :searchable="false"
          >
            <template #label>
              <span class="font-weight-600">{{ $t('tutkintotyyppi') }}</span>
            </template>

            <template
              #singleLabel="{ option }"
            >
              {{ $t(option) }}
            </template>

            <template
              #option="{ option }"
            >
              {{ $t(option) }}
            </template>
          </EpMultiSelect>
        </div>
      </div>

      <div
        v-else
        class="mb-3"
      >
        <EpSearch
          v-model="query"
          :class="{'disabled-events': !perusteetJaTutkinnonosat}"
        />
      </div>
      <EpSisaltotyyppiFilter
        v-if="tyyppi === 'peruste'"
        v-model="toggleQuery"
      />
    </div>

    <EpHakutulosmaara
      :kokonaismaara="total"
      piilota-nakyva-tulosmaara
    />

    <div v-if="!perusteetJaTutkinnonosat">
      <EpSpinner />
    </div>

    <div
      v-else
      class="content"
    >
      <div
        id="perusteet-lista"
        class="perusteet"
      >
        <EpAmmatillinenRow
          v-for="(sisalto, idx) in perusteetJaTutkinnonosat"
          :key="idx"
          :route="sisalto.route"
          :class="sisalto.voimassaoloTieto[0].tyyppi"
        >
          <div class="list-item-header">
            <div class="nimi">
              {{ $kaanna(sisalto.nimi) }}
              <div class="d-inline-flex">
                <span v-if="sisalto.laajuus">{{ sisalto.laajuus }} {{ $t('osaamispiste') }}</span>
              </div>
              <span
                v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'"
                class="koodi"
              >({{ sisalto.tutkinnonosa.koodiArvo }})</span>
            </div>
            <div v-if="sisalto.tutkintotag">
              <span
                class="tutkinto w-40"
                :class="sisalto.sisaltotyyppi"
              >{{ $t(sisalto.tutkintotag) }}</span>
            </div>
          </div>
          <EpAmmatillinenTutkinnonosaItem
            v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'"
            :sisalto="sisalto"
          />
          <EpAmmatillinenPerusteItem
            v-else
            :sisalto="sisalto"
          />
        </EpAmmatillinenRow>
      </div>
      <div class="pagination d-flex justify-content-center">
        <EpBPagination
          v-model="page"
          :items-per-page="perPage"
          :total="total"
          aria-controls="perusteet-lista"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import _ from 'lodash';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { useValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import { voimassaoloTieto } from '@/utils/voimassaolo';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpSisaltotyyppiFilter from '@shared/components/EpSisaltotyyppiFilter/EpSisaltotyyppiFilter.vue';
import EpAmmatillinenPerusteItem from '@/components/EpAmmatillinen/EpAmmatillinenPerusteItem.vue';
import EpAmmatillinenTutkinnonosaItem from '@/components/EpAmmatillinen/EpAmmatillinenTutkinnonosaItem.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import { useAmmatillinenPerusteHakuStore } from '@/stores/AmmatillinenPerusteHakuStore';
import { useAmmatillinenOpasHakuStore } from '@/stores/AmmatillinenOpasHakuStore';
import { pinia } from '@/pinia';

const props = defineProps({
  tyyppi: {
    type: String as () => 'peruste' | 'opas',
    required: true,
  },
});

const valmisteillaOlevatStore = useValmisteillaOlevatStore(pinia);
const tutkintotyyppi = ref('kaikki');
const query = ref('');
const toggleQuery = ref<any>({});
const perusteHakuStore = props.tyyppi === 'peruste' ? useAmmatillinenPerusteHakuStore(pinia) : useAmmatillinenOpasHakuStore(pinia);

const initQuery = () => {
  filters.value.nimiTaiKoodi = undefined;
  toggleQuery.value = {
    tuleva: true,
    voimassaolo: true,
    siirtyma: false,
    poistunut: false,
    perusteet: true,
    tutkinnonosat: false,
  };
};

const updateFilters = async (filters) => {
  if (_.size(filters.nimiTaiKoodi) === 0 || _.size(filters.nimiTaiKoodi) > 2) {
    await perusteHakuStore.updateFilters(filters);
  }
};

onMounted(async () => {
  initQuery();
  page.value = 1;
  await valmisteillaOlevatStore.fetch(0, 1, AmmatillisetKoulutustyypit);

  if (!perusteHakuStore.perusteet) {
    await perusteHakuStore.fetch();
  }
});

const tutkintotyypit = computed(() => {
  return [
    'kaikki',
    'koulutustyyppi_1',
    'koulutustyyppi_11',
    'koulutustyyppi_12',
  ];
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

watch(kieli, async () => {
  await updateFilters({ kieli: kieli.value });
});

watch(tutkintotyyppi, async () => {
  if (tutkintotyyppi.value === 'kaikki') {
    await updateFilters({ koulutustyyppi: [
      'koulutustyyppi_1',
      'koulutustyyppi_11',
      'koulutustyyppi_12',
      'koulutustyyppi_5',
      'koulutustyyppi_18',
    ] });
  }
  else {
    await updateFilters({ koulutustyyppi: [tutkintotyyppi.value] });
  }
});

watch(query, async () => {
  page.value = 1;
  await updateFilters({ nimiTaiKoodi: query.value });
});

const page = computed({
  get: () => {
    return perusteHakuStore.page + 1;
  },
  set: (value) => {
    perusteHakuStore.page = value - 1;
  },
});

watch(page, async () => {
  await updateFilters({ sivu: perusteHakuStore.page });

  // Wait for DOM update
  await nextTick();
  const firstRowLink = document.querySelector('.ammatillinen-row a') as HTMLElement;
  if (firstRowLink) {
    firstRowLink.focus();
  }
});

watch(toggleQuery, async () => {
  await updateFilters(toggleQuery.value);
  page.value = 1;
}, { deep: true });

const searchPlaceholder = computed(() => {
  if (props.tyyppi === 'opas') {
    return Kielet.t('ohjeen-tai-materiaalin-nimi');
  }
  else {
    return Kielet.t('voit-hakea-tutkintoa-nimella');
  }
});

const perusteTutkinnonosaRoute = (perusteTaiTutkinnonosa) => {
  if (perusteTaiTutkinnonosa.sisaltotyyppi === 'tutkinnonosa' && perusteTaiTutkinnonosa.tutkinnonosa?.tyyppi === 'normaali' && perusteTaiTutkinnonosa.perusteet?.length > 1) {
    return null;
  }
  if (perusteTaiTutkinnonosa.tutkinnonosa?.tyyppi === 'reformi_tutke2') {
    return {
      name: 'yhteinentutkinnonosa',
      params: {
        koodi: perusteTaiTutkinnonosa.tutkinnonosa.koodiUri,
      },
    };
  }
  if (perusteTaiTutkinnonosa.perusteet?.length === 1) {
    return {
      name: 'tutkinnonosa',
      params: {
        perusteId: perusteTaiTutkinnonosa.perusteet[0].id,
        tutkinnonOsaViiteId: perusteTaiTutkinnonosa.id,
      },
      query: { redirect: 'true' },
    };
  }
  if (props.tyyppi === 'opas') {
    return {
      name: 'peruste',
      params: {
        koulutustyyppi: 'ammatillinen',
        perusteId: _.toString(perusteTaiTutkinnonosa.id || perusteTaiTutkinnonosa.perusteId),
      },
    };
  }
  else {
    return {
      name: 'ammatillinenkooste',
      params: {
        perusteId: _.toString(perusteTaiTutkinnonosa.id),
      },
    };
  }
};

const mapPerusteet = (perusteet) => {
  return _.chain(perusteet)
    .map(sisalto => ({
      ...sisalto,
      route: perusteTutkinnonosaRoute(sisalto),
      voimassaoloTieto: voimassaoloTieto(sisalto),
      koulutuskoodit: _.join(_.map(sisalto.koulutukset, 'koulutuskoodiArvo'), ', '),
      perusteet: sisalto.perusteet ? mapPerusteet(sisalto.perusteet) : null,
      ...(sisalto.sisaltotyyppi === 'peruste' && sisalto.tyyppi !== 'opas' && { tutkintotag: 'tutkinnon-peruste' }),
      ...(sisalto.sisaltotyyppi === 'tutkinnonosa' && { tutkintotag: 'tutkinnon-osa' }),

    }))
    .value();
};

const perusteetJaTutkinnonosat = computed(() => {
  if (perusteHakuStore.perusteet) {
    return mapPerusteet(perusteHakuStore.perusteet);
  }
  return undefined;
});

const total = computed(() => {
  return perusteHakuStore.total;
});

const pages = computed(() => {
  return perusteHakuStore.pages;
});

const perPage = computed(() => {
  return perusteHakuStore.perPage;
});

const filters = computed(() => {
  return perusteHakuStore.filters;
});

const valmisteillaOlevat = computed(() => {
  return valmisteillaOlevatStore.perusteet;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.placeholderText {
  font-size: small;
}

@media(min-width: 992px){
  .multiselect {
    width: 400px;
  }
}

.list-item-header {
  display: flex;

  @media(max-width: 992px){
    justify-content: space-between;
  }
}

.haku {
  width: 100%;

  :deep(.filter) {
    max-width: 100%;
  }

  .nimi {
    font-weight: 600;
    margin-bottom: 5px;
    margin-right: 10px;

    @media(max-width: 992px){
      width: 60%;
    }
  }

  .pagination {
    margin-top: 10px;
  }
}

.tutkinto {
  padding: 3px 12px;
  color: $white;
  border-radius: 12px;
  font-size: 12px;

  &.peruste {
    background: $blue-darken-1;
  }
  &.tutkinnonosa {
    background: $green;
  }
}

.koodi {
  margin-left: 5px;
  font-weight: 300;
  color: $gray;
}
</style>
