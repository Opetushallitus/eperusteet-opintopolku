<template>
  <div class="content">
    <ep-spinner v-if="!sisaltoviite || !suorituspolut" />

    <div v-else>
      <h2>{{ $t('suorituspolut') }}</h2>
      <ep-content-viewer
        :value="$kaanna(sisaltoviite.tekstiKappale.teksti)"
        :kuvat="kuvat"
      />

      <b-table
        striped
        hover
        responsive
        :items="suorituspolut"
        :fields="fields"
      >
        <template #cell(nimi)="data">
          <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: data.item.id}}">
            {{ $kaanna(data.item.tekstiKappale.nimi) }}
          </router-link>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { SisaltoviiteStore } from '@/stores/SisaltoviiteStore';
import { SuorituspolutStore } from '@/stores/SuorituspolutStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { $t, $kaanna } from '@shared/utils/globals';

const props = defineProps({
  opetussuunnitelmaDataStore: {
    type: Object as () => ToteutussuunnitelmaDataStore,
    required: true,
  },
});

const route = useRoute();

const sisaltoviiteId = computed(() => {
  return _.toNumber(route.params.sisaltoviiteId);
});

const sisaltoviite = computed(() => {
  return props.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: sisaltoviiteId.value });
});

const perusteLaajuus = computed(() => {
  return _.get(_.head(props.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('suoritustavat')), 'rakenne.muodostumisSaanto');
});

const suorituspolut = computed(() => {
  return _.map(_.get(props.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: sisaltoviiteId.value }), 'lapset'), suorituspolku => {
    return {
      ...suorituspolku,
      perusteenLaajuus: perusteLaajuus.value,
    };
  });
});

const kuvat = computed(() => {
  return props.opetussuunnitelmaDataStore.kuvat;
});

const fields = computed(() => {
  return [{
    key: 'nimi',
    sortable: true,
    sortByFormatted: true,
    label: $t('nimi'),
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(item.tekstiKappale.nimi);
    },
  }, {
    key: 'laajuus',
    sortable: true,
    label: $t('laajuus'),
    formatter: (value: any, key: string, item: any) => {
      if (item.tyyppi === 'osasuorituspolku' && item.suorituspolku.osasuorituspolkuLaajuus) {
        return item.suorituspolku.osasuorituspolkuLaajuus + ' ' + $t('osaamispiste');
      }
      else if (item.tyyppi === 'suorituspolku' && item.perusteenLaajuus) {
        return item.perusteenLaajuus.laajuus.maksimi + ' ' + $t('osaamispiste');
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
