<template>
  <div>
    <EpSearch
      v-model="queryNimi"
      :placeholder="$t('')"
    >
      <template #label>
        <span class="header">{{ $t('hae-opetus-ja-toteutussuunnitelmia-tai-valtakunnallisia-perusteita') }}</span>
      </template>
    </EpSearch>
    <EpHakutulosmaara
      :kokonaismaara="kokonaismaara"
      class="my-3"
    />
    <div
      v-for="(item, idx) in opsitJaPerusteet"
      :key="idx"
      class="mb-3"
    >
      <div class="list-item p-1 tile-background-shadow-selected shadow-tile">
        <router-link
          :to="item.route"
          class="peruste-ops-linkki d-block"
        >
          <div class="d-flex align-items-center">
            <div class="mx-2 my-2">
              <div :class="item.theme" />
            </div>
            <div class="my-2 mr-3">
              <div class="nimi">
                {{ $kaanna(item.nimi) }}
              </div>
              <div
                v-if="item.voimassaoloAlkaa"
                class="meta"
              >
                {{ $t('voimaantulo-pvm') }}: {{ $sd(item.voimassaoloAlkaa) }}
              </div>
              <div
                v-if="item.organisaatiot && item.organisaatiot.length > 0"
                class="meta mr-2"
              >
                <span class="mr-1">{{ $t('oppilaitokset') }}:</span>
                <span
                  v-for="(oppilaitos, tidx) in item.organisaatiot"
                  :key="tidx"
                >
                  <span>{{ $kaanna(oppilaitos.nimi) }}</span>
                  <span v-if="tidx < item.organisaatiot.length - 1">, </span>
                </span>
              </div>
              <div
                v-if="item.koulutustoimija"
                class="meta"
              >
                <span class="mr-1">{{ $t('organisaatiot') }}:</span>
                <span>{{ $kaanna(item.koulutustoimija.nimi) }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div
      v-if="kokonaismaara > 0"
      class="mt-4"
    >
      <EpBPagination
        v-model="sivu"
        :total="kokonaismaara"
        :items-per-page="sivukoko"
        aria-controls="opetussuunnitelmat-ja-perusteet-lista"
      />
    </div>
    <EpSpinner
      v-if="isLoading"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { koulutustyyppiStateName, koulutustyyppiTheme, yleissivistavatKoulutustyypit } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { JulkiEtusivuDtoEtusivuTyyppiEnum } from '@shared/api/eperusteet';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { $kaanna, $sd } from '@shared/utils/globals';
import { usePerusteStore } from '@/stores/PerusteStore';

const perusteStore = usePerusteStore();
const route = useRoute();
const router = useRouter();

const queryNimi = ref('');
const sivu = ref(1);
const sivukoko = ref(10);
const isLoading = ref(false);

const queryChange = async () => {
  queryNimi.value = route?.query?.query as string || '';
};

onMounted(() => {
  clear();
  queryChange();
});

const query = computed(() => {
  return route?.query?.query;
});

watch(query, () => {
  queryChange();
}, { immediate: true });

watch(queryNimi, async () => {
  if (_.size(queryNimi.value) > 2) {
    page.value = 1;
    await fetchOpsitJaPerusteet();
  }
  else {
    perusteStore.clearOpsitJaPerusteet();
  }
}, { immediate: true });

const kieli = computed(() => {
  return Kielet.getUiKieli.value;
});

watch(kieli, async () => {
  clear();
});

const clear = () => {
  queryNimi.value = '';
  perusteStore.clearOpsitJaPerusteet();
};

const page = computed({
  get: () => sivu.value,
  set: (value) => {
    sivu.value = value;
  },
});

watch(sivu, async (value) => {
  page.value = value;
  await fetchOpsitJaPerusteet();
  (document.querySelector('.peruste-ops-linkki') as any)?.focus();
});

const fetchOpsitJaPerusteet = async () => {
  isLoading.value = true;
  try {
    await perusteStore.getOpsitJaPerusteet({
      nimi: queryNimi.value,
      kieli: sisaltoKieli.value,
      sivu: sivu.value - 1,
      sivukoko: sivukoko.value,
    });

    router.replace({
      query: {
        query: queryNimi.value,
      },
    }).catch(() => {});
  }
  catch (e) {
    console.error(e);
  }
  isLoading.value = false;
};

const opsitJaPerusteet = computed(() => {
  return _.chain(perusteStore.opsitJaPerusteet?.data)
    .map(resultItem => {
      return {
        ...resultItem,
        theme: {
          ['koulutustyyppi-' + koulutustyyppiTheme(resultItem.koulutustyyppi!)]: true,
          ['tyyppi-' + resultItem.etusivuTyyppi?.toLocaleLowerCase()]: true,
          'raita': resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.PERUSTE
          || resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.DIGITAALINENOSAAMINEN,
          'icon': resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.OPETUSSUUNNITELMA
          || resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.TOTEUTUSSUUNNITELMA
          || resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.OPAS,
        },
        koulutustyyppi: resultItem.jotpatyyppi === 'MUU' ? 'koulutustyyppi_muu' : resultItem.koulutustyyppi,
      };
    })
    .map(resultItem => {
      return {
        ...resultItem,
        route: generateRoute(resultItem),
      };
    })
    .value();
});

const generateRoute = (resultItem) => {
  if (resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.OPAS) {
    return {
      name: 'peruste',
      params: {
        koulutustyyppi: 'opas',
        perusteId: _.toString(resultItem.id),
      },
    };
  }
  if (resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.PERUSTE) {
    return {
      name: 'peruste',
      params: {
        koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
        perusteId: _.toString(resultItem.id),
      },
    };
  }

  if (resultItem.etusivuTyyppi === JulkiEtusivuDtoEtusivuTyyppiEnum.DIGITAALINENOSAAMINEN) {
    return {
      name: 'peruste',
      params: {
        koulutustyyppi: 'digiosaaminen',
        perusteId: _.toString(resultItem.id),
      },
    };
  }

  if (_.includes(yleissivistavatKoulutustyypit, resultItem.koulutustyyppi)) {
    return {
      name: 'opetussuunnitelma',
      params: {
        koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
        opetussuunnitelmaId: _.toString(resultItem.id),
      },
    };
  }

  if (!_.includes(yleissivistavatKoulutustyypit, resultItem.koulutustyyppi)) {
    return {
      name: 'toteutussuunnitelma',
      params: {
        koulutustyyppi: koulutustyyppiStateName(resultItem.koulutustyyppi),
        toteutussuunnitelmaId: _.toString(resultItem.id),
      },
    };
  }

  return {};
};

const kokonaismaara = computed(() => {
  return perusteStore.opsitJaPerusteet?.kokonaismäärä;
});

const hasResults = computed(() => {
  return _.isNumber(kokonaismaara.value);
});

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

:deep(.filter .form-control) {
  padding: 20px 20px 20px 45px;
  height: 60px;
}

:deep(.filter .form-control-feedback) {
  padding-top: 10px;
  padding-left: 10px;
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: $gray;
}

:deep(.page-item.disabled .page-link) {
  color: $gray-lighten-3;
}

:deep(.b-pagination li.page-item .page-link) {
  background-color: unset;
  color: $white;
}

:deep(.b-pagination li.page-item.active .page-link) {
  background: $white;
  color: $oph-green;
}

.list-item {
  border: 1px solid #DADADA;
  margin-bottom: 10px;
  border-radius: 2px;
  background: $white;

  .nimi {
    font-weight: 600;
    color: $black;
    overflow-x: auto;

    :deep(a), div.linkki a {
      color: $black;
    }
  }

  .raita {
    min-height: 60px;
    background-color: #368715;
    border-radius: 3px;
    width: 6px;

    &.koulutustyyppi-ammatillinen {
      background-color: $koulutustyyppi-ammatillinen-color;
    }
    &.koulutustyyppi-esiopetus {
      background-color: $koulutustyyppi-esiopetus-color;
    }
    &.koulutustyyppi-lukiokoulutus {
      background-color: $koulutustyyppi-lukiokoulutus-color;
    }
    &.koulutustyyppi-perusopetus {
      background-color: $koulutustyyppi-perusopetus-color;
    }
    &.koulutustyyppi-varhaiskasvatus {
      background-color: $koulutustyyppi-varhaiskasvatus-color;
    }
    &.koulutustyyppi-taiteenperusopetus {
      background-color: $koulutustyyppi-taiteenperusopetus-color;
    }
    &.koulutustyyppi-vapaasivistystyo {
      background-color: $koulutustyyppi-vapaasivistystyo-color;
    }
    &.koulutustyyppi-tutkintoonvalmentava {
      background-color: $koulutustyyppi-tutkintoonvalmentava-color;
    }
    &.koulutustyyppi-kotoutumiskoulutus {
      background-color: $koulutustyyppi-kotoutumiskoulutus-color;
    }

    &.tyyppi-digitaalinen_osaaminen {
      background-color: $digitaalinen-osaaminen-color;
    }

  }

  .icon {
    height: 40px;
    width: 40px;
    background-size: 40px 40px;
    background-repeat: no-repeat;

    &.tyyppi-opetussuunnitelma {
      background-image: url('../../../public/img/images/opskortti.svg');
    }

    &.tyyppi-toteutussuunnitelma {
      background-image: url('../../../public/img/images/totsukortti.svg');
    }

    &.tyyppi-opas {
      background-image: url('../../../public/img/images/opas_ikoni.svg');
    }
  }

  .meta {
    color: $black;
    font-size: 80%;
  }
}

.opsicon-wrapper {
  padding: 25px;

  .opsicon {
    height: 40px;
    width: 40px;
    background: url('../../../public/img/images/opskortti.svg') no-repeat;
    background-size: 40px 40px;
  }
}

:deep(.spinner .oph-bounce) {
  background-color: $white !important;
}

.header {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}
</style>
