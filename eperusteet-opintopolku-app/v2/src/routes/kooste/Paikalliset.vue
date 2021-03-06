<template>
<div class="paikalliset" v-if="perusteet && perusteet.length > 0">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>
  <div class="search">
    <ep-search v-model="query" />
  </div>
  <div class="opetussuunnitelma-container">
    <div class="peruste-nav">
      <div class="d-md-flex">
        <div class="peruste" v-for="(peruste, idx) in perusteet" :key="idx" :class="{ active: activePeruste === peruste.id}">
          <div class="peruste-select">
            <a href="javascript:;" @click="setActivePeruste(peruste)">
              <div>
                {{ $kaanna(peruste.nimi) }}
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
      <div v-for="(ops, idx) in opetussuunnitelmatPaginated"
           :key="idx">

        <router-link v-if="!ops.ulkoinenlinkki" :to="ops.route">
          <opetussuunnitelma-tile :ops="ops" :query="query"/>
        </router-link>

        <ep-external-link v-else :url="ops.ulkoinenlinkki" :showIcon="false">
          <opetussuunnitelma-tile :ops="ops" :query="query"/>
        </ep-external-link>

      </div>
      <b-pagination v-model="page"
                    :total-rows="total"
                    :per-page="perPage"
                    align="center"
                    aria-controls="opetussuunnitelmat-lista"
                    :first-text="$t('alkuun')"
                    prev-text="«"
                    next-text="»"
                    :last-text="$t('loppuun')" />
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
import { koulutustyyppiStateName, koulutustyyppiUrlShortParamName } from '@shared/utils/perusteet';
import { ENV_PREFIX } from '@shared/utils/defaults';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import { uusiJulkinenToteutus } from '@/utils/peruste';

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    EpExternalLink,
    OpetussuunnitelmaTile,
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

  @Watch('perusteet', { immediate: true })
  async perusteetChange() {
    if (_.size(this.perusteKoosteStore.perusteet) > 0) {
      await this.paikallinenStore.fetch(this.perusteKoosteStore.perusteet![0].id!);
    }
  }

  get total() {
    return _.size(this.opetussuunnitelmatFiltered);
  }

  get activePeruste() {
    return this.paikallinenStore.perusteId?.value;
  }

  setActivePeruste(peruste) {
    this.query = '';
    this.paikallinenStore.fetch!(peruste.id);
  }

  get perusteet() {
    return this.perusteKoosteStore.perusteet;
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
      .map(ops => ({
        ...ops,
        ulkoinenlinkki: this.ulkoinenlinkki(ops),
      }))
      .value();
  }

  get currentPeruste() {
    return _.find(this.perusteet, ['id', this.paikallinenStore.perusteId?.value]);
  }

  ulkoinenlinkki(ops) {
    if (this.currentPeruste && uusiJulkinenToteutus(this.currentPeruste)) {
      return undefined;
    }

    return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/ops/${ops.id}/${koulutustyyppiUrlShortParamName(ops.koulutustyyppi)}/tiedot`;
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
