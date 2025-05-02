<template>
  <div>
    <div>
      <ep-header :murupolku="murupolku">
        <template #header>
          {{ $t('ajankohtaista') }}
        </template>
        <div class="search">
          <ep-search
            :value="query"
            @input="setValue"
          />
        </div>
        <div v-if="tiedotteet.tiedotteet">
          <div v-if="!isTiedotteetEmpty">
            <div
              id="tiedotteet-lista"
              class="tiedotteet"
            >
              <div
                v-for="(tiedote, idx) in tiedotteet.tiedotteet"
                :key="idx"
                class="tiedote"
              >
                <div class="otsikko">
                  <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
                    {{ $kaanna(tiedote.otsikko) }}
                  </router-link>
                </div>
                <div class="aikaleima">
                  {{ $sd(tiedote.luotu) }}
                </div>
                <div class="tiedote-sisalto">
                  <ep-content-viewer :value="$kaanna(tiedote.sisalto)" />
                </div>
              </div>
            </div>
            <b-pagination
              :value="page"
              :total-rows="tiedotteet.amount"
              :per-page="tiedotteet.filter.sivukoko"
              align="center"
              aria-controls="tiedotteet-lista"
              :first-text="$t('alkuun')"
              prev-text="«"
              next-text="»"
              :last-text="$t('loppuun')"
              @change="updatePage"
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
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { Kielet } from '@shared/stores/kieli';
import { $kaanna, $sd, $t } from '@shared/utils/globals';
import { useJulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { pinia } from '@/pinia';

const page = ref(1);
const query = ref('');
const tiedoteStore = useTiedoteStore(pinia);
const julkaistutKoulutustyypitStore = useJulkaistutKoulutustyypitStore(pinia);

const julkaistutKoulutustyypit = computed(() => {
  return julkaistutKoulutustyypitStore.julkaistutKoulutustyypit;
});

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

onMounted(() => {
  tiedoteStore.updateFilter({
    nimi: query.value,
    koulutustyypit: julkaistutKoulutustyypit.value,
    kieli: Kielet.getSisaltoKieli.value,
  });
});

watch(sisaltoKieli, async () => {
  await tiedoteStore.updateFilter({
    kieli: [Kielet.getSisaltoKieli.value],
  });
});

const updatePage = (value) => {
  page.value = value;
  tiedoteStore.updateFilter({
    sivu: value - 1,
  });
};

const setValue = (value) => {
  page.value = 1;
  tiedoteStore.updateFilter({
    nimi: value,
    sivu: 0,
  });
};

// Meta information
useHead({
  title: $t('ajankohtaista'),
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.search {
  margin-bottom: 40px;
  padding: 0 15px;
}

.tiedotteet {
  padding: 15px;

  .tiedote {
    margin-bottom: 50px;

    .otsikko {
      color: #001A58;
      font-size: 1.5rem;
    }

    .aikaleima {
      color: #555;
      font-weight: lighter;
    }

    .tiedote-sisalto {
      margin-top: 10px;
    }
  }
}
</style>
