<template>
  <div v-if="$route.name === 'osaamismerkit'">
    <EpHeader
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template #header>
        {{ $t('kansalliset-perustaitojen-osaamismerkit') }}
      </template>
      <template #subheader>
        {{ $t('osaamismerkit-kuvaus') }}
      </template>

      <div class="osaamismerkit">
        <div class="flex lg:flex-row flex-col mb-5">
          <EpSearch
            v-model="query.nimi"
            :max-width="true"
            :sr-placeholder="$t('hae-osaamismerkkeja')"
            :placeholder="''"
            class="w-full mr-3"
          >
            <template #label>
              <span class="font-semibold">{{ $t('hae-osaamismerkkeja') }}</span>
            </template>
          </EpSearch>

          <EpMultiSelect
            v-model="query.kategoria"
            :is-editing="false"
            :options="osaamismerkkiKategoriaOptions"
            :placeholder="$t('kaikki')"
            class="multiselect"
            :searchable="false"
            track-by="value"
            label="text"
          >
            <template #label>
              <span class="font-semibold">{{ $t('teema') }}</span>
            </template>
          </EpMultiSelect>
        </div>

        <EpOsaamismerkit
          :osaamismerkit="osaamismerkit"
          :osaamismerkki-kategoriat="osaamismerkkiKategoriat"
        />
      </div>
    </EpHeader>
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import _ from 'lodash';
import { OsaamismerkitQuery } from '@shared/api/eperusteet';
import { useHead } from '@unhead/vue';
import { murupolkuOsaamismerkkiRoot } from '@/utils/murupolku';
import EpOsaamismerkit from '@/routes/osaamismerkit/EpOsaamismerkit.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { pinia } from '@/pinia';
import { Kielet } from '@shared/stores/kieli';

const route = useRoute();
const router = useRouter();
const osaamismerkitStore = useOsaamismerkitStore(pinia);
const mounted = ref(false);

const initQuery = () => {
  return {
    sivu: 0,
    sivukoko: 9999,
    nimi: '' as string | null,
    tila: ['JULKAISTU'],
    kategoria: undefined as object | undefined,
    voimassa: true,
    tuleva: false,
    poistunut: false,
  };
};

const query = ref(initQuery());
const kategoria = ref(null);

onMounted(async () => {
  await osaamismerkitStore.fetchKategoriat({ poistunut: false });
  await osaamismerkitStore.updateOsaamismerkitQuery(query.value);
  setQueryParams();
  mounted.value = true;
});

const setQueryParams = () => {
  query.value = {
    ...query.value,
    nimi: route?.query?.query as string || null,
    kategoria: _.find(osaamismerkkiKategoriaOptionsMapped.value, (kategoria) => kategoria.value === _.toNumber(route?.query?.category)) || null,
  };
};

const osaamismerkit = computed(() => {
  if (!osaamismerkitStore.osaamismerkit) {
    return undefined;
  }

  return _.chain(osaamismerkitStore.osaamismerkit)
    .filter(osaamismerkki => Kielet.search(query.value.nimi, osaamismerkki.nimi))
    .filter(osaamismerkki => query.value.kategoria ? osaamismerkki.kategoria?.id === query.value.kategoria.value : true)
    .value();
});

watch(query, async () => {
  if (mounted.value) {
    router.replace({
      query: {
        query: query.value.nimi,
        category: query.value.kategoria?.value,
      },
    }).catch(() => {});
  }
}, { deep: true });

const osaamismerkkiKategoriat = computed(() => {
  return osaamismerkitStore.kategoriat;
});

watch(kategoria, (newKategoria) => {
  query.value.kategoria = newKategoria ? newKategoria.value : null;
});

const koulutustyyppi = computed(() => {
  return _.get(route.params, 'koulutustyyppi') || 'vapaasivistystyo';
});

const osaamismerkkiKategoriaOptionsMapped = computed(() => {
  if (!osaamismerkitStore.kategoriat) {
    return null;
  }

  return _.chain(osaamismerkitStore.kategoriat)
    .map(kategoria => {
      return {
        text: $kaanna(kategoria.nimi),
        value: kategoria.id,
        data: kategoria,
      };
    })
    .uniqWith(_.isEqual)
    .sortBy('text')
    .filter('text')
    .value();
});

const osaamismerkkiKategoriaOptions = computed(() => {
  return [
    {
      text: $t('kaikki'),
      value: null,
    },
    ...(osaamismerkkiKategoriaOptionsMapped.value ? osaamismerkkiKategoriaOptionsMapped.value : []),
  ];
});

const murupolku = computed(() => {
  return murupolkuOsaamismerkkiRoot(koulutustyyppi.value);
});

useHead(() => {
  return {
    title: $t('osaamismerkit'),
  };
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

:deep(.filter) {
  max-width: 100%;
}

:deep(h4) {
  font-size: 1.25rem !important;
  font-weight: 500 !important;
}

@media(min-width: 992px){
  .multiselect {
    width: 300px;
  }
}
</style>
