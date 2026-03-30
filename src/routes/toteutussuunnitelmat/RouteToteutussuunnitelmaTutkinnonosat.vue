<template>
  <div class="content">
    <ep-spinner v-if="!tutkinnonosat" />

    <div v-else>
      <h2>{{ $t('tutkinnonosat') }}</h2>
      <EpSearch
        v-model="queryNimi"
        class="mt-3 mb-3"
        :placeholder="$t('etsi')"
      />

      <EpTable
        striped
        hover
        responsive
        :items="tutkinnonosat"
        :fields="fields"
      >
        <template #cell(nimi)="data">
          <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: data.item.id}}">
            {{ $kaanna(data.item.tekstiKappale.nimi) }}
          </router-link>
        </template>
      </EpTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed } from 'vue';
import { TutkinnonosatStore } from '@/stores/TutkinnonosatStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { $t, $kaanna } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import EpTable from '@shared/components/EpTable/EpTable.vue';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const queryNimi = ref('');

const julkaistuTutkinnonosaViitteet = computed(() => {
  return _.filter(_.get(opetussuunnitelmaDataStore.getJulkaistuSisalto({ 'tyyppi': 'tutkinnonosat' }), 'lapset'), viite => viite.tyyppi === 'tutkinnonosa');
});

const julkaistutTutkinnonOsat = computed(() => {
  return _.filter(opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat'), tosa => tosa.tyyppi === 'tutkinnonosa');
});

const perusteenTutkinnonosaViite = (tutkinnonosa) => {
  const perusteenTutkinnonOsanId = tutkinnonosa.tosa.vierastutkinnonosa?.tosaId || tutkinnonosa.tosa.perusteentutkinnonosa;
  return _.find(opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, perusteTosaViite =>
    _.get(perusteTosaViite, '_tutkinnonOsa') === _.toString(perusteenTutkinnonOsanId));
};

const tutkinnonosat = computed(() => {
  return _.chain(julkaistuTutkinnonosaViitteet.value)
    .map(tutkinnonosaViite => {
      const tutkinnonosa = _.find(julkaistutTutkinnonOsat.value, tutkinnonosa => tutkinnonosa.tosa.id === tutkinnonosaViite.tosa.id);
      return {
        ...tutkinnonosaViite,
        perusteenTutkinnonosaViite: perusteenTutkinnonosaViite(tutkinnonosa),
        tosa: tutkinnonosa.tosa,
      };
    })
    .filter(tutkinnonosaViite => Kielet.search(queryNimi.value, tutkinnonosaViite.tekstiKappale.nimi))
    .sortBy('perusteenTutkinnonosaViite.jarjestys')
    .map((tutkinnonosaViite, index) => ({
      ...tutkinnonosaViite,
      jarnro: index + 1,
    }))
    .sortBy('jarnro')
    .value();
});

const fields = computed(() => {
  return [{
    key: 'jarnro',
    label: $t('nro'),
    sortable: true,
  }, {
    key: 'nimi',
    sortable: true,
    sortByFormatted: true,
    label: $t('nimi'),
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(value);
    },
  }, {
    key: 'perusteenTutkinnonosaViite.laajuus',
    sortable: true,
    label: $t('laajuus'),
    formatter: (value: any, key: string, item: any) => {
      if (item.perusteenTutkinnonosaViite) {
        return item.perusteenTutkinnonosaViite.laajuus + ' ' + $t('osaamispiste');
      }
      else if (item.tosa.omatutkinnonosa) {
        return item.tosa.omatutkinnonosa.laajuus + ' ' + $t('osaamispiste');
      }
    },
  }];
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
