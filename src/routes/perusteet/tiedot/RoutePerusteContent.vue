<template>
  <div class="content">
    <div>
      <h2 class="otsikko mb-4" slot="header">
        <slot name="header">
          {{ $t('englanninkieliset-sisallot') }}
        </slot>
      </h2>
    </div>

    <EpSpinner v-if="!peruste"></EpSpinner>
    <div v-else class="row">
      <div class="col-md-12 mt-3" v-if="peruste.osaamisalat && peruste.osaamisalat.length > 0">
        <EpFormContent name="osaamisalat" headerType="h3" headerClass="h6">
          <b-table striped
                   fixed
                   responsive
                   hover
                   :fields="osaamisalatFields"
                   :items="peruste.osaamisalat">
          </b-table>
        </EpFormContent>
      </div>

      <div class="col-md-12 mt-3" v-if="peruste.tutkintonimikkeet && peruste.tutkintonimikkeet.length > 0">
        <EpFormContent name="tutkintonimikkeet" headerType="h3" headerClass="h6">
          <b-table striped
                   fixed
                   responsive
                   hover
                   :fields="tutkintonimikkeetFields"
                   :items="peruste.tutkintonimikkeet">
          </b-table>
        </EpFormContent>
      </div>

      <div class="col-md-12 mt-3" v-if="peruste.suorittaneenOsaaminen">
        <EpFormContent name="suorittaneen-osaaminen" headerType="h3" headerClass="h6">
          <EpContentViewer :value="$kaanna(peruste.suorittaneenOsaaminen)"
                           :termit="termit"
                           :kuvat="kuvat" />
        </EpFormContent>
      </div>

      <div class="col-md-12 mt-3" v-if="peruste.tyotehtavatJoissaVoiToimia">
        <EpFormContent name="tyotehtavat-joissa-voi-toimia" headerType="h3" headerClass="h6">
          <EpContentViewer :value="$kaanna(peruste.tyotehtavatJoissaVoiToimia)"
                           :termit="termit"
                           :kuvat="kuvat" />
        </EpFormContent>
      </div>

      <div class="col-md-12 mt-3" v-if="tutkinnonOsaViitteet">
        <EpFormContent name="tutkinnon-osat" headerType="h3" headerClass="h6">
          <b-table striped hover responsive :items="tutkinnonOsaViitteet" :fields="tutkinnonOsaFields">
            <template v-slot:cell(nimi)="data">
              <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: data.item.id}}">
                {{ $kaanna(data.item.tutkinnonOsa.nimi) }}
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';

@Component({
  components: {
    GeneerinenArviointiTaulukko,
    EpAmmatillinenArvioinninKohdealueet,
    EpTutkinnonosaTutke,
    EpTutkinnonosaNormaali,
    EpContentViewer,
  },
})
export default class RoutePerusteContent extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get arviointiasteikot() {
    return this.perusteDataStore.arviointiasteikot;
  }

  get peruste() {
    return this.perusteDataStore.peruste;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get termit() {
    return this.perusteDataStore.termit;
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
        .sortBy('jarjestys')
        .map((tutkinnonosaViite, index) => ({
          ...tutkinnonosaViite,
          jarjestys: index + 1,
        }))
        .value();
    }
  }

  get geneerisetArvioinnit() {
    return _.chain(this.tutkinnonOsaViitteet)
      .map(viite => {
        return viite.tutkinnonOsa.geneerinenArviointiasteikko;
      })
      .filter(viite => !_.isEmpty(viite))
      .unionBy('id')
      .value();
  }

  get tutkinnonOsaFields() {
    let baseFields = [{
      key: 'jarjestys',
      label: this.$t('nro') as string,
      sortable: true,
    }, {
      key: 'nimi',
      sortable: true,
      sortByFormatted: true,
      label: this.$t('nimi') as string,
      formatter: (item: any) => {
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

  get osaamisalatFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
      thStyle: 'width: 75%',
      formatter: (value: any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'arvo',
      label: this.$t('koodi'),
      thStyle: 'width: 15%',
    }];
  }

  get tutkintonimikkeetFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
      thStyle: 'width: 75%',
      formatter: (value: any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'tutkintonimikeArvo',
      label: this.$t('koodi'),
      thStyle: 'width: 15%',
    }];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
}
</style>
