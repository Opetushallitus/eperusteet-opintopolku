<template>
  <div>
    <slot />
    <p class="kuvaus">
      {{ $t('kooste-kuvaus-jarjestajat') }}
    </p>

    <div v-if="!koulutustoimijat">
      <ep-spinner />
    </div>
    <div
      v-else
      class="haku"
    >
      <div class="search">
        <ep-search
          v-model="query"
          :sr-placeholder="$t('etsi-koulutuksen-jarjestajia')"
        />
      </div>
      <div class="content">
        <ep-ammatillinen-row
          v-for="(koulutustoimija, index) in koulutustoimijatPaged"
          :key="'koulutuksenjarjestaja' + index"
          :route="{name:'ammatillinenKoulutuksenjarjestaja', params: {koulutuksenjarjestajaId: koulutustoimija.id}}"
        >
          <div :class="{'pt-2 pb-2': !koulutustoimija.kuvaus}">
            <span class="nimi">{{ $kaanna(koulutustoimija.nimi) }}</span>
            <span
              class="kuvaus"
              v-html="$kaanna(koulutustoimija.kuvaus)"
            />
          </div>
        </ep-ammatillinen-row>

        <div class="pagination d-flex justify-content-center">
          <EpBPagination
            v-model="page"
            :items-per-page="perPage"
            :total="total"
            aria-controls="koulutuksenjarjestajat-lista"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useKoulutuksenJarjestajatStore } from '@/stores/KoulutuksenJarjestajatStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import EpAmmatillinenRow from '@/components/EpAmmatillinen/EpAmmatillinenRow.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { pinia } from '@/pinia';
import { useRoute, useRouter } from 'vue-router';
import { nextTick } from 'vue';

const route = useRoute();
const router = useRouter();

const query = ref('');
const page = ref(1);
const perPage = ref(10);
const mounted = ref(false);
const koulutuksenJarjestajatStore = useKoulutuksenJarjestajatStore(pinia);

onMounted(async () => {
  setQueryParams();
  await nextTick();
  mounted.value = true;
});

const setQueryParams = () => {
  query.value = route?.query?.haku as string || '';
  page.value = route?.query?.sivu as number || 1;
};


const koulutustoimijat = computed(() => {
  if (koulutuksenJarjestajatStore.koulutustoimijat) {
    return _.chain(koulutuksenJarjestajatStore.koulutustoimijat)
      .filter(koulutustoimija => Kielet.search(query.value, koulutustoimija.nimi))
      .value();
  }

  return [];
});

const koulutustoimijatPaged = computed(() => {
  if (koulutustoimijat.value) {
    return _.chain(koulutustoimijat.value)
      .drop(perPage.value * (page.value - 1))
      .take(perPage.value)
      .value();
  }

  return [];
});

watch(query, async () => {
  if (mounted.value) {
    page.value = 1;
    routerReplace();
  }
});

watch(page, async () => {
  if (mounted.value) {
    routerReplace();
  }
});

const routerReplace = () => {
  router.replace({
    query: {
      haku: query.value,
      sivu: page.value,
    },
  }).catch(() => {});
};

const total = computed(() => {
  return _.size(koulutustoimijat.value);
});

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile-hover;

.kuvaus {
  font-size: small;
  color: #555;
}

.content {
  margin-top: 20px;

  .nimi {
    font-weight: 600;
  }

  .kuvaus {
    font-size: 0.8rem;
  }
}

.pagination {
  margin-top: 10px;
}
</style>
