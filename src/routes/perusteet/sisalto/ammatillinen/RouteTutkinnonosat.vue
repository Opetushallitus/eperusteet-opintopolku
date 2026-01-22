<template>
  <div class="content">
    <ep-spinner v-if="!tutkinnonOsaViitteet" />

    <div v-else>
      <h2>{{ $t(otsikko) }}</h2>
      <EpSearch
        v-model="queryNimi"
        class="mt-3 mb-3"
        :placeholder="$t('etsi')"
      />
      <EpTable
        striped
        hover
        responsive
        :items="tutkinnonOsaViitteet"
        :fields="fields"
      >
        <template #cell(nimi)="data">
          <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: data.item.id}}">
            {{ $kaanna(data.item.tutkinnonOsa.nimi) }}
          </router-link>
        </template>
      </EpTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed } from 'vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

import { Koulutustyyppi } from '@shared/tyypit';
import { $kaanna, $t } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import EpTable from '@shared/components/EpTable/EpTable.vue';

const perusteDataStore = getCachedPerusteStore();

const queryNimi = ref('');

const perusteenKoulutustyyppi = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto('koulutustyyppi');
});

const otsikko = computed(() => {
  if (perusteenKoulutustyyppi.value === Koulutustyyppi.telma || perusteenKoulutustyyppi.value === Koulutustyyppi.valma) {
    return 'koulutuksenosat';
  }

  return 'tutkinnonosat';
});

const perusteenTutkinnonosatById = computed(() => {
  return _.keyBy(perusteDataStore.getJulkaistuPerusteSisalto('tutkinnonOsat'), 'id');
});

const perusteenTutkinnonosaViitteet = computed(() => {
  return _.chain(perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat'))
    .map(st => st.tutkinnonOsaViitteet)
    .flatMap()
    .value();
});

const tutkinnonOsaViitteet = computed(() => {
  if (perusteenTutkinnonosaViitteet.value) {
    return _.chain(perusteenTutkinnonosaViitteet.value)
      .map(viite => {
        return {
          ...viite,
          tutkinnonOsa: perusteenTutkinnonosatById.value[viite._tutkinnonOsa],
        };
      })
      .filter(tutkinnonosa =>
        _.includes(
          _.toLower(_.get(tutkinnonosa.tutkinnonOsa, 'nimi.' + Kielet.getSisaltoKieli.value)),
          _.toLower(queryNimi.value),
        ))
      .sortBy('jarjestys')
      .map((tutkinnonosaViite, index) => ({
        ...tutkinnonosaViite,
        jarjestys: index + 1,
      }))
      .value();
  }

  return undefined;
});

const fields = computed(() => {
  let baseFields = [{
    key: 'jarjestys',
    label: $t('nro') as string,
    sortable: true,
  }, {
    key: 'nimi',
    sortable: true,
    sortByFormatted: true,
    label: $t('nimi') as string,
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(item?.tutkinnonOsa?.nimi);
    },
  }];
  let showLaajuusColumn = _.some(tutkinnonOsaViitteet.value, viite => _.has(viite, 'laajuus'));
  if (showLaajuusColumn) {
    return [...baseFields, {
      key: 'laajuus',
      sortable: true,
      label: $t('laajuus') as string,
      formatter: (value: any, key: string, item: any) => {
        if (value) {
          return value + ' ' + $t('osaamispiste');
        }
        if (_.isNumber(item.laajuus) && _.isNumber(item.laajuusMaksimi)) {
          return item.laajuus + ' - ' + item.laajuusMaksimi + ' ' + $t('osaamispiste');
        }
      },
    }];
  }
  return baseFields;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
