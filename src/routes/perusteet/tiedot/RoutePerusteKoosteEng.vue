<template>
  <div class="content">
    <div>
      <h2
        slot="header"
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
export default class RoutePerusteKoosteEng extends Vue {
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
      label: this.$t('nro', 'en') as string,
      sortable: true,
    }, {
      key: 'nimi',
      sortable: true,
      sortByFormatted: true,
      label: this.$t('nimi', 'en') as string,
      formatter: (item: any) => {
        return this.$kaanna(item?.tutkinnonOsa?.nimi, false, true, 'en');
      },
    }];
    let showLaajuusColumn = _.some(this.tutkinnonOsaViitteet, viite => _.has(viite, 'laajuus'));
    if (showLaajuusColumn) {
      return [...baseFields, {
        key: 'laajuus',
        sortable: true,
        label: this.$t('laajuus', 'en') as string,
        formatter: (value: any, key: string, item: any) => {
          if (value) {
            return value + ' ' + this.$t('osaamispiste', 'en');
          }
          if (_.isNumber(item.laajuus) && _.isNumber(item.laajuusMaksimi)) {
            return item.laajuus + ' - ' + item.laajuusMaksimi + ' ' + this.$t('osaamispiste', 'en');
          }
        },
      }];
    }
    return baseFields;
  }

  get osaamisalatFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi', 'en'),
      thStyle: 'width: 75%',
      formatter: (value: any) => {
        return this.$kaanna(value, false, true, 'en');
      },
    }, {
      key: 'arvo',
      label: this.$t('koodi', 'en'),
      thStyle: 'width: 15%',
    }];
  }

  get tutkintonimikkeetFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi', 'en'),
      thStyle: 'width: 75%',
      formatter: (value: any) => {
        return this.$kaanna(value, false, true, 'en');
      },
    }, {
      key: 'tutkintonimikeArvo',
      label: this.$t('koodi', 'en'),
      thStyle: 'width: 15%',
    }];
  }

  get koulutuskooditFields() {
    return [{
      key: 'koulutuskoodiArvo',
      label: this.$t('koodi', 'en'),
      thStyle: 'width: 15%',
    }, {
      key: 'nimi',
      label: this.$t('koulutuksen-nimi', 'en'),
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(value, false, true, 'en');
      },
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
