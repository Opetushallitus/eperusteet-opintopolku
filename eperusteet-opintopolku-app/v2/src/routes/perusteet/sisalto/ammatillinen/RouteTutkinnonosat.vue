<template>
  <div class="content">

    <ep-spinner v-if="!tutkinnonOsaViitteet"></ep-spinner>

    <div v-else>
      <h2>{{$t(otsikko)}}</h2>
      <EpSearch class="mt-3 mb-3" v-model="queryNimi" :placeholder="$t('etsi')"/>
      <b-table striped hover responsive :items="tutkinnonOsaViitteet" :fields="fields">
        <template v-slot:cell(nimi)="data">
          <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: data.item.id}}">
            {{ $kaanna(data.item.tutkinnonOsa.nimi) }}
          </router-link>
        </template>
      </b-table>
    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { Koulutustyyppi } from '@shared/tyypit';

@Component({
  components: {
    EpSearch,
    EpSpinner,
  },
})
export default class RouteTutkinnonosat extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private queryNimi = '';

  get otsikko() {
    if (this.perusteenKoulutustyyppi === Koulutustyyppi.telma || this.perusteenKoulutustyyppi === Koulutustyyppi.valma) {
      return 'koulutuksenosat';
    }

    return 'tutkinnonosat';
  }

  get perusteenKoulutustyyppi() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto('koulutustyyppi');
  }

  get perusteenTutkinnonosatById() {
    return _.keyBy(this.perusteDataStore.getJulkaistuPerusteSisalto('tutkinnonOsat'), 'id');
  }

  get perusteenTutkinnonosaViitteet() {
    return _.chain(this.perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat'))
      .map(st => st.tutkinnonOsaViitteet)
      .flatMap()
      .value();
  }

  get tutkinnonOsaViitteet() {
    if (this.perusteenTutkinnonosaViitteet) {
      return _.chain(this.perusteenTutkinnonosaViitteet)
        .map(viite => {
          return {
            ...viite,
            tutkinnonOsa: this.perusteenTutkinnonosatById[viite._tutkinnonOsa],
          };
        })
        .filter(tutkinnonosa =>
          _.includes(
            _.toLower(_.get(tutkinnonosa.tutkinnonOsa, 'nimi.' + Kielet.getSisaltoKieli.value)),
            _.toLower(this.queryNimi),
          ))
        .sortBy('jarjestys')
        .map((tutkinnonosaViite, index) => ({
          ...tutkinnonosaViite,
          jarjestys: index + 1,
        }))
        .value();
    }
  }

  get fields() {
    let baseFields = [{
      key: 'jarjestys',
      label: this.$t('nro') as string,
      sortable: true,
    }, {
      key: 'nimi',
      sortable: true,
      sortByFormatted: true,
      label: this.$t('nimi') as string,
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(item?.tutkinnonOsa?.nimi);
      },
    }];
    let showLaajuusColumn = _.some(this.tutkinnonOsaViitteet, viite => _.has(viite, 'laajuus'));
    if (showLaajuusColumn) {
      return [...baseFields, {
        key: 'laajuus',
        sortable: true,
        label: this.$t('laajuus') as string,
        formatter: (value: any, key: string, item: any) => {
          if (value) {
            return value + ' ' + this.$t('osaamispiste');
          }
          if (_.isNumber(item.laajuus) && _.isNumber(item.laajuusMaksimi)) {
            return item.laajuus + ' - ' + item.laajuusMaksimi + ' ' + this.$t('osaamispiste');
          }
        },
      }];
    }
    return baseFields;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
