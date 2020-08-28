<template>
  <div class="content">

    <ep-spinner v-if="!sisaltoviite || !suorituspolut"></ep-spinner>

    <div v-else>
      <h2>{{$t('suorituspolut')}}</h2>
      <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>

       <b-table striped hover responsive :items="suorituspolut" :fields="fields">
        <template v-slot:cell(nimi)="data">
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
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { SisaltoviiteStore } from '@/stores/SisaltoviiteStore';
import { SuorituspolutStore } from '@/stores/SuorituspolutStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
  },
})
export default class RouteToteutussuunnitelmaSuorituspolut extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  private sisaltoviiteStore: SisaltoviiteStore | null = null;
  private suorituspolutStore: SuorituspolutStore | null = null;

  async mounted() {
    this.sisaltoviiteStore = new SisaltoviiteStore(this.opetussuunnitelmaDataStore.opetussuunnitelma!, _.toNumber(this.$route.params.sisaltoviiteId));
    this.suorituspolutStore = new SuorituspolutStore(this.opetussuunnitelmaDataStore.opetussuunnitelma!);
  }

  get sisaltoviite() {
    if (this.sisaltoviiteStore) {
      return this.sisaltoviiteStore.sisaltoviite.value;
    }
  }

  get suorituspolut() {
    if (this.suorituspolutStore) {
      return this.suorituspolutStore.suorituspolut.value;
    }
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get fields() {
    return [{
      key: 'nimi',
      sortable: true,
      sortByFormatted: true,
      label: this.$t('nimi') as string,
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(item.tekstiKappale.nimi);
      },
    }, {
      key: 'laajuus',
      sortable: true,
      label: this.$t('laajuus') as string,
      formatter: (value: any, key: string, item: any) => {
        if (item.tyyppi === 'osasuorituspolku') {
          return item.suorituspolku.osasuorituspolkuLaajuus + ' ' + this.$t('osaamispiste');
        }
        else if (item.tyyppi === 'suorituspolku' && item.perusteenLaajuus) {
          return item.perusteenLaajuus.laajuus.maksimi + ' ' + this.$t('osaamispiste');
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
