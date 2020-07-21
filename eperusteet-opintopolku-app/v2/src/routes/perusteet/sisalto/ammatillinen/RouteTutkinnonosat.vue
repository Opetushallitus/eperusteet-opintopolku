<template>
  <div class="content">

    <ep-spinner v-if="!tutkinnonosat"></ep-spinner>

    <div v-else>
      <h2>{{$t('tutkinnonosat')}}</h2>
      <EpSearch class="mt-3 mb-3" v-model="queryNimi" :placeholder="$t('etsi')"/>
      <b-table striped hover responsive :items="tutkinnonosat" :fields="fields">
        <template v-slot:cell(nimi)="data">
          <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: data.item.id}}">
            {{ $kaanna(data.item.nimi) }}
          </router-link>
        </template>
      </b-table>
    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenTutkinnonosatStore } from '@/stores/PerusteenTutkinnonosatStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSearch,
    EpSpinner,
  },
})
export default class RouteTutkinnonosat extends Vue {
  @Prop({ required: true })
  private tutkinnonosatStore!: PerusteenTutkinnonosatStore;

  private queryNimi = '';

  get tutkinnonosat() {
    if (this.tutkinnonosatStore.tutkinnonosat.value) {
      return _.chain(this.tutkinnonosatStore.tutkinnonosat.value)
        .filter(tutkinnonosa => _.includes(
          _.toLower(_.get(tutkinnonosa, 'nimi.' + Kielet.getSisaltoKieli.value)),
          _.toLower(this.queryNimi)
        ))
        .value();
    }
  }

  get fields() {
    return [{
      key: 'jarjestys',
      label: this.$t('nro') as string,
      sortable: true,
    }, {
      key: 'nimi',
      sortable: true,
      sortByFormatted: true,
      label: this.$t('nimi') as string,
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'laajuus',
      sortable: true,
      label: this.$t('laajuus') as string,
      formatter: (value: any, key: string, item: any) => {
        return value + ' ' + this.$t('osaamispiste');
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
