<template>
  <div class="content">

    <ep-spinner v-if="!tutkinnonosat"></ep-spinner>

    <div v-else>
      <h2>{{$t('tutkinnonosat')}}</h2>
      <EpSearch class="mt-3 mb-3" v-model="queryNimi" :placeholder="$t('etsi')"/>

      <b-table striped hover responsive :items="tutkinnonosat" :fields="fields">
        <template v-slot:cell(tutkinnonosaViite.tekstiKappale.nimi)="data">
          <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: data.item.tutkinnonosaViite.id}}">
            {{ $kaanna(data.item.tutkinnonosaViite.tekstiKappale.nimi) }}
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

  private tutkinnonosatStore: TutkinnonosatStore | null = null;
  private queryNimi = '';

  async mounted() {
    this.tutkinnonosatStore = new TutkinnonosatStore(this.opetussuunnitelmaDataStore.opetussuunnitelma!);
  }

  get tutkinnonosat() {
    if (this.tutkinnonosatStore && this.tutkinnonosatStore.tutkinnonosat.value) {
      return _.chain(this.tutkinnonosatStore.tutkinnonosat.value)
        .filter(tutkinnonosa => _.includes(
          _.toLower(_.get(tutkinnonosa, 'tutkinnonosaViite.tekstiKappale.nimi.' + Kielet.getSisaltoKieli.value)),
          _.toLower(this.queryNimi)
        ))
        .value();
    }
  }

  get fields() {
    return [{
      key: 'jarjestysnro',
      label: this.$t('nro') as string,
      sortable: true,
    }, {
      key: 'tutkinnonosaViite.tekstiKappale.nimi',
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
        else if (item.tutkinnonosaViite.tosa.omatutkinnonosa) {
          return item.tutkinnonosaViite.tosa.omatutkinnonosa.laajuus + ' ' + this.$t('osaamispiste');
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
