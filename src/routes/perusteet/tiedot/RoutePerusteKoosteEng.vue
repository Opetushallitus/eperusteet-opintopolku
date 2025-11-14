<template>
  <div class="content">
    <div>
      <h2
        class="otsikko mb-4"
      >
        <slot name="header">
          {{ $t('englanninkieliset-sisallot') }}
        </slot>
      </h2>
    </div>

    <EpSpinner v-if="!peruste" />
    <div
      v-else
      class="row"
    >
      <div
        v-if="peruste.koulutukset && peruste.koulutukset.length > 0"
        class="col-md-12 mt-3"
      >
        <ep-form-content
          name="koulutuskoodit"
          header-type="h3"
          header-class="h6"
          kieli="en"
        >
          <b-table
            striped
            fixed
            responsive
            hover
            :fields="koulutuskooditFields"
            :items="peruste.koulutukset"
          />
        </ep-form-content>
      </div>

      <div
        v-if="peruste.osaamisalat && peruste.osaamisalat.length > 0"
        class="col-md-12 mt-3"
      >
        <EpFormContent
          name="osaamisalat"
          header-type="h3"
          header-class="h6"
          kieli="en"
        >
          <b-table
            striped
            fixed
            responsive
            hover
            :fields="osaamisalatFields"
            :items="peruste.osaamisalat"
          />
        </EpFormContent>
      </div>

      <div
        v-if="peruste.tutkintonimikkeet && peruste.tutkintonimikkeet.length > 0"
        class="col-md-12 mt-3"
      >
        <EpFormContent
          name="tutkintonimikkeet"
          header-type="h3"
          header-class="h6"
          kieli="en"
        >
          <b-table
            striped
            fixed
            responsive
            hover
            :fields="tutkintonimikkeetFields"
            :items="peruste.tutkintonimikkeet"
          />
        </EpFormContent>
      </div>

      <div
        v-if="peruste.suorittaneenOsaaminen"
        class="col-md-12 mt-3"
      >
        <EpFormContent
          name="suorittaneen-osaaminen"
          header-type="h3"
          header-class="h6"
          kieli="en"
        >
          <EpContentViewer
            :value="$kaanna(peruste.suorittaneenOsaaminen, false, true, 'en')"
            :termit="termit"
            :kuvat="kuvat"
          />
        </EpFormContent>
      </div>

      <div
        v-if="peruste.tyotehtavatJoissaVoiToimia"
        class="col-md-12 mt-3"
      >
        <EpFormContent
          name="tyotehtavat-joissa-voi-toimia"
          header-type="h3"
          header-class="h6"
          kieli="en"
        >
          <EpContentViewer
            :value="$kaanna(peruste.tyotehtavatJoissaVoiToimia, false, true, 'en')"
            :termit="termit"
            :kuvat="kuvat"
          />
        </EpFormContent>
      </div>

      <div
        v-if="tutkinnonOsaViitteet"
        class="col-md-12 mt-3"
      >
        <EpFormContent
          name="tutkinnon-osat"
          header-type="h3"
          header-class="h6"
          kieli="en"
        >
          <b-table
            striped
            hover
            responsive
            :items="tutkinnonOsaViitteet"
            :fields="tutkinnonOsaFields"
          >
            <template #cell(nimi)="data">
              <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: data.item.id}}">
                {{ $kaanna(data.item.tutkinnonOsa.nimi, false, true, 'en') }}
              </router-link>
            </template>
          </b-table>
        </EpFormContent>
      </div>

      <!--      <div class="col-md-12 mt-3" v-if="geneerisetArvioinnit">-->
      <!--        <div v-for="(arviointi, idx) in geneerisetArvioinnit" :key="'arv-'+idx">-->
      <!--          <GeneerinenArviointiTaulukko :arviointi="arviointi" />-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';

import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { $t, $kaanna } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const arviointiasteikot = computed(() => {
  return perusteDataStore.arviointiasteikot;
});

const peruste = computed(() => {
  return perusteDataStore.peruste;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const termit = computed(() => {
  return perusteDataStore.termit;
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
      .sortBy('jarjestys')
      .map((tutkinnonosaViite, index) => ({
        ...tutkinnonosaViite,
        jarjestys: index + 1,
      }))
      .value();
  }
  return [];
});

const geneerisetArvioinnit = computed(() => {
  return _.chain(tutkinnonOsaViitteet.value)
    .map(viite => {
      return viite.tutkinnonOsa.geneerinenArviointiasteikko;
    })
    .filter(viite => !_.isEmpty(viite))
    .unionBy('id')
    .value();
});

const tutkinnonOsaFields = computed(() => {
  let baseFields = [{
    key: 'jarjestys',
    label: $t('nro', 'en'),
    sortable: true,
  }, {
    key: 'nimi',
    sortable: true,
    sortByFormatted: true,
    label: $t('nimi', 'en'),
    formatter: (item: any) => {
      return $kaanna(item?.tutkinnonOsa?.nimi, false, true, 'en');
    },
  }];

  let showLaajuusColumn = _.some(tutkinnonOsaViitteet.value, viite => _.has(viite, 'laajuus'));

  if (showLaajuusColumn) {
    return [...baseFields, {
      key: 'laajuus',
      sortable: true,
      label: $t('laajuus', 'en'),
      formatter: (value: any, key: string, item: any) => {
        if (value) {
          return value + ' ' + $t('osaamispiste', 'en');
        }
        if (_.isNumber(item.laajuus) && _.isNumber(item.laajuusMaksimi)) {
          return item.laajuus + ' - ' + item.laajuusMaksimi + ' ' + $t('osaamispiste', 'en');
        }
      },
    }];
  }
  return baseFields;
});

const osaamisalatFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi', 'en'),
    thStyle: 'width: 75%',
    formatter: (value: any) => {
      return $kaanna(value, false, true, 'en');
    },
  }, {
    key: 'arvo',
    label: $t('koodi', 'en'),
    thStyle: 'width: 15%',
  }];
});

const tutkintonimikkeetFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi', 'en'),
    thStyle: 'width: 75%',
    formatter: (value: any) => {
      return $kaanna(value, false, true, 'en');
    },
  }, {
    key: 'tutkintonimikeArvo',
    label: $t('koodi', 'en'),
    thStyle: 'width: 15%',
  }];
});

const koulutuskooditFields = computed(() => {
  return [{
    key: 'koulutuskoodiArvo',
    label: $t('koodi', 'en'),
    thStyle: 'width: 15%',
  }, {
    key: 'nimi',
    label: $t('koulutuksen-nimi', 'en'),
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(value, false, true, 'en');
    },
  }];
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
}
</style>
