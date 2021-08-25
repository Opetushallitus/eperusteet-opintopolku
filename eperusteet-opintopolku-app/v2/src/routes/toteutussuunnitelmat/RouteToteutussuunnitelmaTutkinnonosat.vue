<template>
  <div class="content">

    <ep-spinner v-if="!tutkinnonosat"></ep-spinner>

    <div v-else>
      <h2>{{$t('tutkinnonosat')}}</h2>
      <EpSearch class="mt-3 mb-3" v-model="queryNimi" :placeholder="$t('etsi')"/>

      <b-table striped hover responsive :items="tutkinnonosat" :fields="fields">
        <template v-slot:cell(tekstiKappale.nimi)="data">
          <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: data.item.id}}">
            {{ $kaanna(data.item.tekstiKappale.nimi) }}
          </router-link>
        </template>
      </b-table>
    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TutkinnonosatStore } from '@/stores/TutkinnonosatStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';

@Component({
  components: {
    EpSearch,
    EpSpinner,
  },
})
export default class RouteToteutussuunnitelmaTutkinnonosat extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  private queryNimi = '';

  get julkaistuTutkinnonosaViitteet() {
    return _.get(this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ 'tyyppi': 'tutkinnonosat' }), 'lapset');
  }

  get julkaistutTutkinnonOsat() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat');
  }

  get tutkinnonosat() {
    return _.chain(this.julkaistuTutkinnonosaViitteet)
      .map(tutkinnonosaViite => {
        const tutkinnonosa = _.find(this.julkaistutTutkinnonOsat, tutkinnonosa => tutkinnonosa.tosa.id === tutkinnonosaViite.tosa.id);
        return {
          ...tutkinnonosaViite,
          perusteenTutkinnonosaViite: this.perusteenTutkinnonosaViite(tutkinnonosa.tosa.perusteentutkinnonosa),
          tosa: tutkinnonosa.tosa,
        };
      })
      .filter(tutkinnonosaViite => Kielet.search(this.queryNimi, tutkinnonosaViite.tekstiKappale.nimi))
      .sortBy('perusteenTutkinnonosaViite.jarjestys')
      .value();
  }

  perusteenTutkinnonosaViite(perusteenTutkinnonosaId) {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ '_tutkinnonOsa': _.toString(perusteenTutkinnonosaId) });
  }

  get fields() {
    return [{
      key: 'perusteenTutkinnonosaViite.jarjestys',
      label: this.$t('nro') as string,
      sortable: true,
    }, {
      key: 'tekstiKappale.nimi',
      sortable: true,
      sortByFormatted: true,
      label: this.$t('nimi') as string,
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'perusteenTutkinnonosaViite.laajuus',
      sortable: true,
      label: this.$t('laajuus') as string,
      formatter: (value: any, key: string, item: any) => {
        if (item.perusteenTutkinnonosaViite) {
          return item.perusteenTutkinnonosaViite.laajuus + ' ' + this.$t('osaamispiste');
        }
        else if (item.tosa.omatutkinnonosa) {
          return item.tosa.omatutkinnonosa.laajuus + ' ' + this.$t('osaamispiste');
        }
      },
    }];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
