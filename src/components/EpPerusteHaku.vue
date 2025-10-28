<template>
  <div class="haku">
    <EpButton
      link
      class="mb-2"
      no-padding
      @click="emit('clear')"
    >
      <span class="font-weight-bold">&#60;</span> {{ $t('takaisin-edelliseen-nakymaan') }}
    </EpButton>

    <EpHakutulosmaara
      class="tulos font-weight-600 mt-2"
      :kokonaismaara="kokonaismaara"
    />

    <ep-spinner v-if="!tulokset" />
    <div
      v-else-if="tulokset.length === 0"
      class="alert alert-info"
    >
      {{ $t('ei-hakutuloksia') }}
    </div>

    <template v-else>
      <div class="tulokset mt-4">
        <div
          v-for="(tulos,index) in tuloksetSorted"
          :key="'tulos' + index"
          class="tulos"
        >
          <div class="osantyyppi">
            {{ $t(tulos.target.perusteenOsa.osanTyyppi) }}
          </div>
          <div class="nimi">
            <div v-if="!tulos.location || !tulos.location.name">
              {{ $kaanna(tulos.target.perusteenOsa.nimi) }}
            </div>
            <slot
              v-else
              name="nimi"
              :tulos="tulos"
            >
              <router-link
                :to="tulos.location"
              >
                <span @click="clear">{{ tulos.nimi }}</span>
              </router-link>
            </slot>
          </div>
          <div
            v-if="tulos.type === 'sisalto'"
            class="osuma"
            v-html="tulos.result[0]"
          />
        </div>

        <EpBPagination
          v-model="sivu"
          :items-per-page="sivukoko"
          :total="tulokset.length"
          aria-controls="sisaltohakutulos-lista"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, watch } from 'vue';

import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { deepFind, typeSort } from '@/utils/sisaltohaku';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';
import { useSlots } from 'vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const props = defineProps<{
  query: string;
}>();

const perusteDataStore = getCachedPerusteStore();
const emit = defineEmits(['clear']);
const tulokset = ref<any[] | null>(null);
const sivu = ref(1);
const sivukoko = ref(10);

const queryImplDebounce = _.debounce(queryImpl, 300);

async function queryImpl(query: string) {
  if (query.length > 2) {
    tulokset.value = null;
    const julkaisu = await perusteDataStore.peruste;
    const result: any[] = [];
    deepFind(julkaisu, [], result, _.toLower(query));
    tulokset.value = result;
  }
}

function clear() {
  emit('clear');
}

const tuloksetSorted = computed(() => {
  return _.chain(tulokset.value)
    .map(tulos => {
      var numerointi = _.find(perusteDataStore.flattenedSidenav, { location: tulos.location })?.meta?.numerointi;
      return {
        ...tulos,
        numerointi,
        nimi: (numerointi || '') + ' '
              + ($kaanna(tulos.target.perusteenOsa.nimi) || $t(tulos.osanTyyppi))
              + (tulos.target.perusteenOsa?.meta?.nimi ? ', ' + $t(tulos.target.perusteenOsa.meta?.nimi) : ''),
      };
    })
    .sortBy(tulos => tulos.target.perusteenOsa?.meta?.nimi || 99)
    .sortBy(tulos => typeSort[tulos.type])
    .slice((sivu.value - 1) * sivukoko.value, sivu.value * sivukoko.value)
    .value();
});

const kokonaismaara = computed(() => {
  return tulokset.value?.length;
});

watch(() => props.query, (newValue) => {
  queryImplDebounce(newValue);
}, { immediate: true });
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.haku {
  padding: $sidenav-padding;

  .tulokset {
    .tulos {
      margin-bottom: 16px;

      .osantyyppi {
        font-weight: lighter;
      }

      .nimi {
        font-weight: bolder;
      }

    }
  }

}
</style>
