<template>
<div class="paikalliset" v-if="julkaistutPerusteet && julkaistutPerusteet.length > 0">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>
  <span>{{ $t('voit-hakea-opetussuunnitelman-yleissivistava') }}</span>
  <div class="d-flex flex-lg-row flex-column">
    <b-form-group :label="$t('hae')" class="flex-fill" :aria-label="$t('hakuosio')">
      <ep-search v-model="query"
                 :max-width="true"
                 :sr-placeholder="$t('hae-opetussuunnitelmaa')"
                 :placeholder="$t('hae-opetussuunnitelmaa')"/>
    </b-form-group>
    <b-form-group :label="$t('peruste')">
      <EpMultiSelect v-if="julkaistutPerusteet"
                     :is-editing="false"
                     :options="perusteetOptions"
                     :placeholder="$t('kaikki')"
                     class="multiselect"
                     v-model="valittuPeruste"
                     :searchable="false">
        <template slot="singleLabel" slot-scope="{ option }">
          {{ kaannaPerusteNimi(option) }}
        </template>
        <template slot="option" slot-scope="{ option }">
          {{ kaannaPerusteNimi(option) }}
        </template>
      </EpMultiSelect>
    </b-form-group>
  </div>

  <div class="opetussuunnitelma-container">
    <ep-spinner v-if="isLoading" />
    <div v-else-if="opetussuunnitelmat.length === 0">
      <div class="alert alert-info">
        {{ $t('ei-hakutuloksia') }}
      </div>
    </div>
    <div v-else id="opetussuunnitelmat-lista">
      <router-link :to="ops.route" v-for="(ops, idx) in opetussuunnitelmat" :key="idx">
        <opetussuunnitelma-tile
          :ops="ops"
          :query="query"
          @mouseover="mouseOver(ops)"/>
      </router-link>
      <EpBPagination v-model="page"
                     :items-per-page="perPage"
                     :total="opetussuunnitelmatKokonaismaara"
                     aria-controls="opetussuunnitelmat-lista">
      </EpBPagination>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { Kielet } from '@shared/stores/kieli';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { ryhmanKoulutustyypit } from '@shared/utils/perusteet';
import { Page } from '@shared/tyypit';

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    OpetussuunnitelmaTile,
    EpBPagination,
    EpMultiSelect,
  },
})
export default class Paikalliset extends Vue {
  @Prop({ required: true })
  private paikallinenStore!: IPaikallinenStore;

  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  @Prop({ required: true })
  private koulutustyyppi!: string;

  private query = '';
  private page = 1;
  private perPage = 10;
  private valittuPeruste: any | null = null;

  async mounted() {
    this.fetch();
  }

  @Watch('koulutustyyppi')
  onKoulutustyyppiChanged() {
    this.valittuPeruste = null;
  }

  @Watch('query')
  async onQueryChanged() {
    this.page = 1;
    await this.fetch();
  }

  @Watch('page')
  async onPageChanged() {
    await this.fetch();
  }

  @Watch('valittuPeruste')
  async onPerusteChange() {
    await this.fetch();
  }

  @Watch('kieli')
  async onKieliChange() {
    await this.fetch();
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  async fetch() {
    await this.paikallinenStore.fetchQuery!({
      query: this.query,
      peruste: this.valittuPeruste,
      ...(!this.valittuPeruste?.nimi && { koulutustyypit: ryhmanKoulutustyypit(this.koulutustyyppi) }),
      page: this.page - 1,
    });
  }

  get julkaistutPerusteet() {
    if (this.perusteKoosteStore.perusteJulkaisut) {
      return _.chain(this.perusteKoosteStore.perusteJulkaisut.value)
        .map(julkaistuPeruste => ({
          ...julkaistuPeruste,
          kaannettyNimi: this.$kaanna(julkaistuPeruste.nimi!),
        }))
        .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
        .value();
    }
  }

  get perusteetOptions() {
    if (this.julkaistutPerusteet) {
      return [
        {},
        ...this.julkaistutPerusteet,
      ];
    }
    return [];
  }

  get isLoading() {
    return !this.paikallinenStore.opetussuunnitelmatPaged!.value;
  }

  get opetussuunnitelmatKokonaismaara() {
    if (this.paikallinenStore.opetussuunnitelmatPaged?.value) {
      return this.paikallinenStore.opetussuunnitelmatPaged!.value['kokonaismäärä'];
    }
    return 0;
  }

  get opetussuunnitelmat() {
    return _.chain(this.paikallinenStore.opetussuunnitelmatPaged?.value?.data)
      .map(ops => ({
        ...ops,
        toimijat: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Koulutustoimija')),
        oppilaitokset: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Oppilaitos')),
        route: {
          name: 'opetussuunnitelma',
          params: {
            opetussuunnitelmaId: _.toString(ops.id),
          },
        },
      }))
      .sortBy(ops => Kielet.sortValue(ops.nimi))
      .value();
  }

  kaannaPerusteNimi(option) {
    if (option?.nimi) {
      return this.$kaanna(option.nimi);
    }
    return this.$t('kaikki');
  }

  async mouseOver(opetussuunnitelma) {
    await this.paikallinenStore.addToCache!(opetussuunnitelma.id);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.haku {
  width: 100%;
}

.hae-label {
  margin-top: 10px;
  padding-bottom: 0 !important;
  font-weight: 600;
}

.multiselect {
  width: 500px;
}

.paikalliset {

  .opetussuunnitelma-container {

    .peruste-nav {
      margin-bottom: 8px;
      overflow-x: auto;

      .peruste {

        @media (max-width: 767.98px) {
            margin-bottom:10px;
            border-left: #0143da 5px solid;
        }

        @media (max-width: 767.98px) {
          &.active {
            background-color: #F2F2F2;
          }
        }

        @media (min-width: 768px) {
          &.active{
            border-bottom: #0143da 5px solid;
          }
        }

        &.active {
          button, a {
            color: #0143da;
          }
        }

        .peruste-select {
          text-align: center;
          padding: 5px;

          button, a {
            font-weight: bold;
            color: #3367E3;
          }

          a:hover {
            color: #578aff;
          }
        }
      }
    }
  }

  @media (max-width: 767.98px) {
    .multiselect {
      width: 100%;
    }
  }
}

</style>
