<template>
<div class="paikalliset" v-if="julkaistutPerusteet && julkaistutPerusteet.length > 0">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>
  <div class="search">
    <ep-search v-model="query" />
  </div>
  <div class="opetussuunnitelma-container">
    <div class="peruste-nav">
      <div class="d-md-flex">
        <div class="peruste" v-for="(julkaisu, idx) in julkaistutPerusteet" :key="idx" :class="{ active: activePeruste === julkaisu.id}">
          <div class="peruste-select">
            <a href="javascript:;" @click="setActivePeruste(julkaisu)">
              <div>
                {{ $kaanna(julkaisu.nimi) }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <ep-spinner v-if="isLoading" />
    <div v-else-if="opetussuunnitelmat.length === 0">
      <div class="alert alert-info">
        {{ $t('perusteen-pohjalta-ei-toteutettu-opetussuunnitelmia') }}
      </div>
    </div>
    <div v-else-if="opetussuunnitelmatFiltered.length === 0">
      <div class="alert alert-info">
        {{ $t('ei-hakutuloksia') }}
      </div>
    </div>
    <div v-else id="opetussuunnitelmat-lista">
      <div v-for="(ops, idx) in opetussuunnitelmatPaginated" :key="idx">
        <router-link :to="ops.route">
          <opetussuunnitelma-tile :ops="ops" :query="query"/>
        </router-link>
      </div>
      <EpBPagination v-model="page"
                     :items-per-page="perPage"
                     :total="opetussuunnitelmatFiltered.length"
                     aria-controls="opetussuunnitelmat-lista"
                     @pageChanged="handlePageChange">
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

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    OpetussuunnitelmaTile,
    EpBPagination,
  },
})
export default class Paikalliset extends Vue {
  @Prop({ required: true })
  private paikallinenStore!: IPaikallinenStore;

  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  private query = '';
  private page = 1;
  private perPage = 10;

  @Watch('julkaistutPerusteet', { immediate: true })
  async perusteetChange() {
    if (_.size(this.perusteKoosteStore.perusteJulkaisut) > 0) {
      const peruste = _.find(this.julkaistutPerusteet, peruste => _.get(peruste, 'id') === _.toNumber(_.get(this.$route.params, 'perusteId'))) || this.julkaistutPerusteet![0];
      await this.setActivePeruste(peruste);
    }
  }

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }

  handlePageChange(value) {
    this.page = value;
  }

  get total() {
    return _.size(this.opetussuunnitelmatFiltered);
  }

  get activePeruste() {
    return this.paikallinenStore.perusteId?.value;
  }

  async setActivePeruste(perusteJulkaisu) {
    this.query = '';
    await this.paikallinenStore.fetch!(perusteJulkaisu.id, perusteJulkaisu.diaarinumero);
  }

  get julkaistutPerusteet() {
    if (this.perusteKoosteStore.perusteJulkaisut) {
      return _.chain(this.perusteKoosteStore.perusteJulkaisut)
        .map(julkaistuPeruste => ({
          ...julkaistuPeruste,
          kaannettyNimi: this.$kaanna(julkaistuPeruste.nimi!),
        }))
        .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
        .value();
    }
  }

  get isLoading() {
    return !this.paikallinenStore.opetussuunnitelmat.value;
  }

  get opetussuunnitelmat() {
    return _.chain(this.paikallinenStore.opetussuunnitelmat.value)
      .map(ops => ({
        ...ops,
        toimijat: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Koulutustoimija')),
        oppilaitokset: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Oppilaitos')),
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

  get opetussuunnitelmatFiltered() {
    return _.chain(this.opetussuunnitelmat)
      .filter(ops => Kielet.search(this.query, ops.nimi))
      .value();
  }

  get opetussuunnitelmatPaginated() {
    return _.chain(this.opetussuunnitelmatFiltered)
      .drop(this.perPage * (this.page - 1))
      .take(this.perPage)
      .value();
  }

  get currentPeruste() {
    return _.find(this.julkaistutPerusteet, ['id', this.paikallinenStore.perusteId?.value]);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.paikalliset {
  .search {
    margin: 20px 0;
  }

  .opetussuunnitelma-container {
    min-height: 700px;

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

}

</style>
