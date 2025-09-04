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

    <div class="d-flex flex-column flex-lg-row">
      <div class="w-100 mr-2 mb-3">
        <EpSearch
          v-model="filters.nimi"
          :placeholder="$t('')"
        >
          <template #label>
            <span class="font-weight-600">{{ $t('hae-maarayksia') }}</span>
          </template>
        </EpSearch>
      </div>

      <div class="w-100 mr-2 mb-3">
        <EpMultiSelect
          v-model="filters.tyyppi"
          :enable-empty-option="true"
          :placeholder="$t('kaikki')"
          :is-editing="true"
          :options="tyyppiVaihtoehdot"
          :search-identity="searchIdentity"
          :close-on-select="false"
        >
          <template #label>
            <span class="font-weight-600">{{ $t('tyyppi') }}</span>
          </template>

          <template
            #singleLabel="{ option }"
          >
            {{ $t('maarays-tyyppi-' + option.toLowerCase()) }}
          </template>
          <template
            #option="{ option }"
          >
            {{ $t('maarays-tyyppi-' + option.toLowerCase()) }}
          </template>
        </EpMultiSelect>
      </div>

      <div class="w-100 mb-3">
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

    <ep-spinner v-if="!maaraykset" />

    <div
      v-else-if="maaraykset.length === 0"
      class="mt-4"
    >
      {{ $t('ei-maarayksia') }}
    </div>

    <div
      v-else
      class="maaraykset"
    >
      <div class="jarjestys d-flex justify-content-end align-items-center mb-2">
        <a
          class="clickable"
          href="javascript:void(0)"
          @click="vaihdaJarjestys()"
        >
          <span v-if="filters.jarjestys === 'DESC'">{{ $t('uusimmat-ensin') }} <EpMaterialIcon icon-shape="outlined">arrow_drop_down</EpMaterialIcon></span>
          <span v-if="filters.jarjestys === 'ASC'">{{ $t('vanhimmat-ensin') }} <EpMaterialIcon icon-shape="outlined">arrow_drop_up</EpMaterialIcon></span>
        </a>
      </div>

      <router-link
        v-for="maarays in maaraykset"
        :key="maarays.id"
        class="maarays d-flex shadow-tile"
        :to="{name: 'maarays', params: {maaraysId: maarays.id}}"
      >
        <img
          :src="kuva"
          :alt="$t('maarays')"
          class="kuva"
        >
        <div class="tiedot">
          <div class="nimi font-weight-bold mb-2">
            {{ $kaanna(maarays.nimi) }}
          </div>
          <div class="alatiedot d-flex">
            <div class="mr-2">
              {{ $t('voimaantulo') }}: {{ $sd(maarays.voimassaoloAlkaa) }}
            </div>
            <EpVoimassaolo :voimassaolo="maarays" />
            <div
              v-if="maarays.asiasanat[kieli].asiasana.length > 0"
              class="mx-2 valiviiva"
            >
              |
            </div>
            <div v-if="maarays.asiasanat[kieli].asiasana.length > 0">
              {{ $t('asiasana') }}:
              <span
                v-for="(asiasana, index) in maarays.asiasanat[kieli].asiasana"
                :key="'asiasana' + index"
              >
                {{ asiasana }}<span v-if="index < maarays.asiasanat[kieli].asiasana.length -1">, </span>
              </span>
            </div>
          </div>
        </div>
      </router-link>

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
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { MaaraysDtoTyyppiEnum } from '@shared/api/eperusteet';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import { MaarayksetStore } from '@shared/stores/MaarayksetStore';
import maaraysDocSmall from '@assets/img/images/maarays_doc_small.svg';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import EpMaarayskokoelmaKoulutustyyppiSelect from '@shared/components/EpMaarayskokoelmaKoulutustyyppiSelect/EpMaarayskokoelmaKoulutustyyppiSelect.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';

const route = useRoute();
const router = useRouter();

const maarayksetStore = new MaarayksetStore();
const perPage = ref(10);
const page = ref(1);
const filters = ref({
  nimi: '',
  julkaistu: true,
  laadinta: false,
  jarjestysTapa: 'voimassaoloAlkaa',
  jarjestys: 'DESC',
  koulutustyypit: [],
  tyyppi: null,
  tuleva: true,
  voimassaolo: true,
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
    const firstMaarays = document.querySelector('.maarays') as HTMLElement;
    if (firstMaarays) {
      firstMaarays.setAttribute('tabindex', '-1');
      firstMaarays.focus();
      await nextTick();
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
        tyyppi: filters.value.tyyppi === 'kaikki' ? null : filters.value.tyyppi,
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

useHead({
  title: $t('route-maarayskokoelma'),
});

const tyyppiVaihtoehdot = [
  'kaikki',
  MaaraysDtoTyyppiEnum.OPETUSHALLITUKSENMUU,
  MaaraysDtoTyyppiEnum.AMMATILLINENMUU,
  MaaraysDtoTyyppiEnum.PERUSTE,
];

const voimasssaVaihtoehdot = [
  'KAIKKI',
  'TULEVA',
  'VOIMASSAOLO',
  'POISTUNUT',
];

const koulutustyyppiVaihtoehdot = computed(() => {
  return maarayksetStore?.koulutustyypit.value;
});

const kuva = computed(() => {
  return maaraysDocSmall;
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

function searchIdentity(kt: string) {
  return _.toLower($t(kt) as any);
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.maaraykset {
  .maarays {
    border: 1px solid $gray-lighten-9;
    border-radius: 2px;
    padding: 12px 15px;
    margin-bottom: 10px;
    color: $black;

    .kuva {
      height: 55px;
    }

    .tiedot {
      margin-left: 15px;

      .valiviiva {
        color: $gray-lighten-1;
      }
    }
  }
}

:deep(.toggles) {
  margin-bottom: 0;
  padding-bottom: 0;
}

.maarayskokoelma-koulutustyyppi-select {
  max-width: 400px;
  width: 400px;
}
</style>
