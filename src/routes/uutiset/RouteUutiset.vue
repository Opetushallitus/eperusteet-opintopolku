<template>
  <div>
    <div>
      <ep-header :murupolku="murupolku">
        <template #header>
          {{ $t('ajankohtaista') }}
        </template>
        <div class="flex flex-col lg:flex-row w-full justify-between mb-3 px-4">
          <ep-search
            v-model="query"
            class="w-full lg:w-7/12 p-0 mr-2 mb-2"
            :placeholder="''"
          >
            <template #label>
              <span class="font-semibold">{{ $t('hae-ajankohtaista') }}</span>
            </template>
          </ep-search>

          <div class="w-full lg:w-5/12 p-0">
            <label class="font-semibold">{{ $t('koulutus-tai-tutkinto') }}</label>
            <EpKoulutustyyppiRyhmaSelect v-model="koulutusryypiRyhmat" />
          </div>
        </div>
        <div v-if="tiedotteet.tiedotteet">
          <div v-if="!isTiedotteetEmpty">
            <div
              id="tiedotteet-lista"
              class="p-4"
            >
              <div
                v-for="(tiedote, idx) in tiedotteet.tiedotteet"
                :key="idx"
                class="mb-5"
              >
                <div>
                  <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
                    {{ $kaanna(tiedote.otsikko) }}
                  </router-link>
                </div>
                <div class="text-gray-600 font-light">
                  {{ $sd(tiedote.luotu) }}
                </div>
              </div>
            </div>
            <EpBPagination
              v-model="page"
              :total="tiedotteet.amount"
              :items-per-page="tiedotteet.filter.sivukoko"
              aria-controls="tiedotteet-lista"
            />
          </div>
          <div v-else>
            {{ $t('ei-hakutuloksia') }}
          </div>
        </div>
        <ep-spinner v-else />
      </ep-header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { useTiedoteStore } from '@/stores/TiedoteStore';
import { pinia } from '@/pinia';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { Kielet } from '@shared/stores/kieli';
import { $kaanna, $sd, $t } from '@shared/utils/globals';
import { useRoute, useRouter } from 'vue-router';
import EpKoulutustyyppiRyhmaSelect from '@shared/components/forms/EpKoulutustyyppiRyhmaSelect.vue';
import { KoulutustyyppiRyhma, koulutustyyppiRyhmat } from '@shared/utils/perusteet';
import _ from 'lodash';

const page = ref(1);
const query = ref('');
const route = useRoute();
const router = useRouter();
const mounted = ref(false);
const koulutusryypiRyhmat = ref<KoulutustyyppiRyhma[]>([]);

const tiedoteStore = useTiedoteStore(pinia);

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const tiedotteet = computed(() => {
  return {
    tiedotteet: tiedoteStore.tiedotteet,
    filter: tiedoteStore.filter,
    amount: tiedoteStore.amount,
  };
});

const isTiedotteetEmpty = computed(() => {
  return tiedotteet.value.amount === 0;
});

const murupolku = computed(() => {
  return [{
    label: 'ajankohtaista',
    location: {
      name: 'uutiset',
    },
  }];
});

onMounted(async () => {
  setQueryParams();
  await fetch();
  mounted.value = true;
});

const setQueryParams = () => {
  query.value = route?.query?.haku as string || '';
  page.value = (route?.query?.sivu as unknown as number) || 1;
  const koulutusArray = _.castArray(route?.query?.koulutus || []).filter(Boolean) as string[];
  koulutusryypiRyhmat.value = _.compact(_.map(koulutusArray, ryhma =>
    koulutustyyppiRyhmat().find(k => k.ryhma === ryhma),
  ));
};

watch(sisaltoKieli, async () => {
  if (mounted.value) {
    page.value = 1;
    await fetch();
  }
});

watch(query, async () => {
  if (mounted.value) {
    page.value = 1;
    await fetch();
  }
});

watch(koulutusryypiRyhmat, async () => {
  if (mounted.value) {
    page.value = 1;
    await fetch();
  }
});

watch(page, async () => {
  if (mounted.value) {
    await fetch();
  }
});

const fetch = async () => {
  await tiedoteStore.updateFilter({
    nimi: query.value,
    kieli: Kielet.getSisaltoKieli.value,
    sivu: page.value - 1,
    koulutustyypit: _.chain(koulutusryypiRyhmat.value).map('koulutustyypit')
      .flatten()
      .value(),
    koulutustyypiton: koulutusryypiRyhmat.value.length === 0,
  });

  router.replace({
    query: {
      haku: query.value,
      sivu: page.value,
      koulutus: _.map(koulutusryypiRyhmat.value, 'ryhma'),
    },
  }).catch(() => {});
};

// Meta information
useHead({
  title: $t('ajankohtaista'),
});
</script>

