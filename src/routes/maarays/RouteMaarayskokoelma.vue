<template>
  <ep-header
    tyyppi="maarayskokoelma"
    :murupolku="murupolku"
  >
    <template #header>
      {{ $t('opetushallituksen-maaraykset') }}
    </template>
    <template #subheader>
      {{ $t('opetushallituksen-maaraykset-alaotsikko') }}
    </template>

    <div
      class="hakuehdot"
      :class="{ 'disabled': filters.maaraysId > 0 }">
      <div class="mb-4">
        <h3 class="mb-3">
          {{ $t('aihe') }}
        </h3>
        <div class="d-flex justify-content-between flex-column flex-lg-row aihe-boxes">
          <div
            v-for="vaihtoehto in tyyppiVaihtoehdot"
            :key="vaihtoehto.tyyppi"
            class="aihe-box py-4 px-3 flex-fill"
            :class="{ 'active': filters.tyyppi === vaihtoehto.tyyppi }"
            @click="toggleTyyppi(vaihtoehto.tyyppi)"
          >
            <EpMaterialIcon
              icon-shape="outlined"
              class="mr-2"
            >
              {{ vaihtoehto.icon }}
            </EpMaterialIcon>
            {{ $t(vaihtoehto.translationKey) }}
          </div>
        </div>
      </div>

      <div class="d-flex flex-column flex-lg-row justify-content-between">
        <div class="flex-fill mr-2 mb-3 col-12 col-lg-8 p-0">
          <EpSearch
            v-model="filters.nimi"
            :placeholder="''"
          >
            <template #label>
              <span class="font-weight-600">{{ $t('hae-maarayksia') }}</span>
            </template>
          </EpSearch>
        </div>

        <div class="mb-3 col-12 col-lg-4 p-0">
          <label class="font-weight-600">{{ $t('koulutus-tai-tutkinto') }}</label>
          <EpMaarayskokoelmaKoulutustyyppiSelect
            v-if="koulutustyyppiVaihtoehdot"
            v-model="filters.koulutustyypit"
            class="maarayskokoelma-koulutustyyppi-select"
            :is-editing="true"
            :koulutustyypit="koulutustyyppiVaihtoehdot"
          />
        </div>
      </div>

      <EpVoimassaoloFilter
        v-model="filters"
        class="mb-0"
      />

      <EpHakutulosmaara
        :kokonaismaara="maarayksetCount"
        piilota-nakyva-tulosmaara
      />

    </div>

    <ep-spinner v-if="!maaraykset" />

    <div
      v-else-if="maaraykset.length === 0"
      class="mt-4"
    >
      {{ $t('ei-maarayksia') }}
    </div>

    <div
      v-else
      class="maaraykset mt-3"
    >
      <div class="jarjestys d-flex align-items-center mb-2">
        <div v-if="maarayksetCount > 0">
          <span class="font-weight-600">{{ maarayksetCount }}</span> {{ $t('maaraysta') }}
        </div>
        <div v-if="filters.maaraysId && maarayksetCount === 1">
          <ep-button
            link
            @click="filters.maaraysId = undefined"
          >
            {{ $t('tyhjenna-hakuehdot') }}
          </ep-button>
        </div>
        <a
          class="clickable ml-auto"
          href="javascript:void(0)"
          @click="vaihdaJarjestys()"
        >
          <span v-if="filters.jarjestys === 'DESC'">{{ $t('uusimmat-ensin') }} <EpMaterialIcon icon-shape="outlined">arrow_drop_down</EpMaterialIcon></span>
          <span v-if="filters.jarjestys === 'ASC'">{{ $t('vanhimmat-ensin') }} <EpMaterialIcon icon-shape="outlined">arrow_drop_up</EpMaterialIcon></span>
        </a>
      </div>

      <EpMaarayskokoelmaMaarays
        v-for="maarays in maaraykset"
        :key="maarays.id"
        :maarays="maarays"
        :expanded-by-default="_.toNumber(filters.maaraysId) === maarays.id"
      />

      <EpBPagination
        v-if="maarayksetCount > perPage"
        v-model="page"
        :items-per-page="perPage"
        :total="maarayksetCount"
        aria-controls="maarayskokoelma-lista"
      />
    </div>
  </ep-header>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import { $kaanna, $sd, $t } from '@shared/utils/globals';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import { MaarayksetStore } from '@shared/stores/MaarayksetStore';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import EpMaarayskokoelmaKoulutustyyppiSelect from '@shared/components/EpMaarayskokoelmaKoulutustyyppiSelect/EpMaarayskokoelmaKoulutustyyppiSelect.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import EpMaarayskokoelmaMaarays from '@/components/EpMaarayskokoelmaMaarays/EpMaarayskokoelmaMaarays.vue';
import { MaaraysDtoTyyppiEnum } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const route = useRoute();
const router = useRouter();

const maarayksetStore = new MaarayksetStore();
const perPage = ref(10);
const page = ref(1);
const filters = ref<{
  nimi: string;
  julkaistu: boolean;
  laadinta: boolean;
  jarjestysTapa: string;
  jarjestys: string;
  koulutustyypit: any[];
  tyyppi: string | null;
  tuleva: boolean;
  voimassaolo: boolean;
  maaraysId: number | undefined;
}>({
  nimi: '',
  julkaistu: true,
  laadinta: false,
  jarjestysTapa: 'voimassaoloAlkaa',
  jarjestys: 'DESC',
  koulutustyypit: [],
  tyyppi: MaaraysDtoTyyppiEnum.PERUSTE,
  tuleva: true,
  voimassaolo: true,
  maaraysId: undefined,
});
const mounted = ref(false);

const filterToQueryParams = {
  nimi: 'haku',
  tyyppi: 'tyyppi',
  koulutustyypit: 'koulutustyypit',
  tuleva: 'tuleva',
  voimassaolo: 'voimassaolo',
  poistunut: 'poistunut',
  sivu: 'sivu',
  jarjestys: 'jarjestys',
  maaraysId: 'maaraysId',
};

const queryParamsToFilter = _.invert(filterToQueryParams);

onMounted(async () => {
  setQueryParams();

  await maarayksetStore.init();
  await fetch();
  mounted.value = true;
});

const setQueryParams = () => {
  filters.value = {
    ...filters.value,
    ..._.mapKeys(_.pickBy(route?.query, (value, key) => key in queryParamsToFilter), (value, key) => queryParamsToFilter[key as keyof typeof queryParamsToFilter]),
  };
  page.value = (route?.query?.sivu as number || 1);
};

watch(page, async () => {
  if (mounted.value) {
    await fetch();
    await nextTick();
    const firstMaarays = document.querySelector('.ep-maarayskokoelma-maarays') as HTMLElement;
    if (firstMaarays) {
      firstMaarays.setAttribute('tabindex', '-1');
      firstMaarays.focus();
    }
  }
});

watch(filters, async () => {
  if (mounted.value) {
    page.value = 1;
    await fetch();
  }
}, { deep: true });

async function fetch() {
  if (_.size(filters.value.nimi) === 0 || _.size(filters.value.nimi) > 2) {
    await maarayksetStore?.fetch(
      {
        ...filters.value,
        tyyppi: (filters.value.tyyppi || undefined) as any,
        kieli: kieli.value,
        sivu: page.value - 1,
        sivukoko: perPage.value,
      });

    router.replace({
      query: {
        ..._.mapKeys(_.pickBy(filters.value, (value, key) => key in filterToQueryParams), (value, key) => filterToQueryParams[key as keyof typeof filterToQueryParams]),
        sivu: page.value,
      },
    }).catch(() => {});
  }
}

const maaraykset = computed(() => {
  return maarayksetStore?.maaraykset?.value?.data;
});

const maarayksetCount = computed(() => {
  return maarayksetStore?.maaraykset?.value?.kokonaismäärä;
});

watch(maaraykset, async () => {
  if (mounted.value && filters.value.maaraysId && maarayksetCount.value === 1) {
    await nextTick();
    const maarays = document.querySelector('.ep-maarayskokoelma-maarays') as HTMLElement;
    if (maarays) {
      maarays.setAttribute('tabindex', '-1');
      maarays.scrollTo();
      maarays.focus();
    }
  }
});

useHead({
  title: $t('route-maarayskokoelma'),
});

const tyyppiVaihtoehdot = [
  {
    tyyppi: MaaraysDtoTyyppiEnum.PERUSTE,
    icon: 'school',
    translationKey: 'maarayskokoelma-tyyppi-peruste',
  },
  {
    tyyppi: MaaraysDtoTyyppiEnum.OPETUSHALLITUKSENMUU,
    icon: 'gavel',
    translationKey: 'maarayskokoelma-tyyppi-opetushallituksenmuu',
  },
  {
    tyyppi: MaaraysDtoTyyppiEnum.AMMATILLINENMUU,
    icon: 'construction',
    translationKey: 'maarayskokoelma-tyyppi-ammatillinenmuu',
  },
];

const koulutustyyppiVaihtoehdot = computed(() => {
  return maarayksetStore?.koulutustyypit.value;
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const murupolku = [
  {
    label: 'route-maarayskokoelma',
    location: { name: 'maaraykset' },
  },
];

async function vaihdaJarjestys() {
  filters.value.jarjestys = filters.value.jarjestys === 'DESC' ? 'ASC' : 'DESC';
  await fetch();
}

function toggleTyyppi(tyyppi: string) {
  filters.value.tyyppi = tyyppi;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.hakuehdot.disabled {
  opacity: 0.5;
  pointer-events: none;
}

:deep(.toggles) {
  margin-bottom: 0;
  padding-bottom: 0;
}

.maarayskokoelma-koulutustyyppi-select {
  max-width: 400px;
  // width: 400px;
}

.aihe-boxes {
  gap: 1rem;
}

.aihe-box {
  @include tile-background-shadow;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $blue-lighten-3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background-color: $green;
    color: white;
  }

}
</style>
