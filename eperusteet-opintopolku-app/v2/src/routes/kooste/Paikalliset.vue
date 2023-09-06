<template>
<div class="paikalliset" v-if="julkaistutPerusteet && julkaistutPerusteet.length > 0">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>
  <span>{{ $t('voit-hakea-opetussuunnitelman-yleissivistava') }}</span>
  <div class="search d-flex flex-lg-row flex-column">
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
                     @input="setActivePeruste($event)"
                     v-model="valittuPeruste">
        <template slot="singleLabel" slot-scope="{ option }">
          {{ $kaanna(option.nimi) }}
        </template>
        <template slot="option" slot-scope="{ option }">
          {{ $kaanna(option.nimi) }}
        </template>
      </EpMultiSelect>
    </b-form-group>
  </div>

  <div class="opetussuunnitelma-container">
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
  private valittuPeruste = { nimi: this.$t('kaikki') };

  @Watch('julkaistutPerusteet', { immediate: true })
  async perusteetChange() {
    if (_.size(this.perusteKoosteStore.perusteJulkaisut) > 0) {
      if (_.get(this.valittuPeruste, 'id')) {
        const peruste = _.find(this.julkaistutPerusteet, peruste => _.get(peruste, 'id') === _.toNumber(_.get(this.$route.params, 'perusteId'))) || this.julkaistutPerusteet![0];
        await this.setActivePeruste(peruste);
      }
      else {
        await this.setActivePeruste(null);
      }
    }
  }

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }

  get total() {
    return _.size(this.opetussuunnitelmatFiltered);
  }

  get activePeruste() {
    return this.paikallinenStore.perusteId?.value;
  }

  async setActivePeruste(perusteJulkaisu) {
    this.query = '';
    if (perusteJulkaisu?.id) {
      await this.paikallinenStore.fetch!(perusteJulkaisu.id, perusteJulkaisu.diaarinumero);
    }
    else {
      await this.paikallinenStore.fetch!(undefined, undefined, ryhmanKoulutustyypit(this.koulutustyyppi));
    }
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

  get perusteetOptions() {
    if (this.julkaistutPerusteet) {
      return [
        {
          nimi: this.$t('kaikki'),
        },
        ...this.julkaistutPerusteet,
      ];
    }
    return [];
  }

  get isLoading() {
    return !this.paikallinenStore.opetussuunnitelmat.value;
  }

  get opetussuunnitelmat() {
    this.page = 1;
    return _.chain(this.paikallinenStore.opetussuunnitelmat.value)
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

  get opetussuunnitelmatFiltered() {
    return _.chain(this.opetussuunnitelmat)
      .filter(ops => this.filterByQuery(ops))
      .value();
  }

  filterByQuery(ops) {
    if (Kielet.search(this.query, ops.nimi)) {
      return true;
    }
    for (const oppilaitos of ops.oppilaitokset || []) {
      if (Kielet.search(this.query, oppilaitos.nimi)) {
        return true;
      }
    }
    for (const organisaatio of ops.organisaatiot || []) {
      if (Kielet.search(this.query, organisaatio.nimi)) {
        return true;
      }
    }
    for (const kunta of ops.kunnat || []) {
      if (Kielet.search(this.query, kunta.nimi)) {
        return true;
      }
    }
    return false;
  }

  get opetussuunnitelmatPaginated() {
    return _.chain(this.opetussuunnitelmatFiltered)
      .drop(this.perPage * (this.page - 1))
      .take(this.perPage)
      .value();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.paikalliset {
  .search {
    margin: 10px 0;
  }

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
}

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

</style>
