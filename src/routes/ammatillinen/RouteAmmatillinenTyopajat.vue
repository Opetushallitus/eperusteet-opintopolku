<template>
  <div>
    <slot />
    <p class="kuvaus">
      {{ $t('kooste-kuvaus-tyopajat') }}
    </p>

    <div class="search mb-4">
      <ep-search
        v-model="query"
        :placeholder="$t('etsi')"
        :sr-placeholder="$t('etsi-tyopajoja')"
      />
    </div>
    <ep-spinner v-if="!opetussuunnitelmat" />
    <div v-else-if="opetussuunnitelmat.length === 0">
      <div class="alert alert-info">
        {{ $t('ei-toteutettuja-tyopajoja') }}
      </div>
    </div>
    <div v-else-if="opetussuunnitelmatFiltered.length === 0">
      <div class="alert alert-info">
        {{ $t('ei-hakutuloksia') }}
      </div>
    </div>
    <div
      v-else
      id="opetussuunnitelmat-lista"
    >
      <div
        v-for="(ops, idx) in opetussuunnitelmatPaginated"
        :key="idx"
      >
        <router-link :to="ops.route">
          <opetussuunnitelma-tile
            :ops="ops"
            :query="query"
          >
            <template #icon>
              <div>
                <EpMaterialIcon class="icon">
                  decription
                </EpMaterialIcon>
              </div>
            </template>
          </opetussuunnitelma-tile>
        </router-link>
      </div>
      <EpBPagination
        v-model="page"
        :items-per-page="perPage"
        :total="opetussuunnitelmatFiltered.length"
        aria-controls="opetussuunnitelmat-lista"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { TyopajatStore } from '@/stores/TyopajatStore';
import OpetussuunnitelmaTile from '../kooste/OpetussuunnitelmaTile.vue';
import { Kielet } from '@shared/stores/kieli';
import * as _ from 'lodash';
import { OpetussuunnitelmaDto } from '@shared/api/amosaa';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

const tyopajatStore = new TyopajatStore();
const query = ref('');
const page = ref(1);
const perPage = ref(10);

onMounted(async () => {
  await tyopajatStore.fetch();
});

watch(query, () => {
  page.value = 1;
});

const opetussuunnitelmat = computed(() => {
  if (tyopajatStore.opetussuunnitelmat.value) {
    return _.map(tyopajatStore.opetussuunnitelmat.value, (opetussuunnitelma: OpetussuunnitelmaDto) => (
      {
        ...opetussuunnitelma,
        route: {
          name: 'toteutussuunnitelma',
          params: {
            toteutussuunnitelmaId: _.toString(opetussuunnitelma.id),
            koulutustyyppi: 'ammatillinen',
          },
        },
      }
    ));
  }

  return undefined;
});

const opetussuunnitelmatFiltered = computed(() => {
  return _.chain(opetussuunnitelmat.value)
    .filter(ops => Kielet.search(query.value, ops.nimi))
    .value();
});

const opetussuunnitelmatPaginated = computed(() => {
  return _.chain(opetussuunnitelmatFiltered.value)
    .drop(perPage.value * (page.value - 1))
    .take(perPage.value)
    .value();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.kuvaus {
  font-size: small;
  color: #555;
}

.icon {
  height: 40px;
  width: 40px;
  color: $green-lighten-2;
}
</style>
