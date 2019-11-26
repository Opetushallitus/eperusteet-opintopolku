<template>
<div class="paikalliset">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>
  <div class="search">
    <ep-search v-model="query" />
  </div>
  <div>
    <div class="peruste-nav">
      <div class="d-flex">
        <div class="peruste" v-for="(peruste, idx) in perusteet" :key="idx">
          <div class="peruste-select" :class="{ active: activePeruste === peruste.id}">
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
      <div class="opetussuunnitelma shadow-tile"
           v-for="(ops, idx) in opetussuunnitelmatPaginated"
           :key="idx">

        <router-link v-if="!ops.ulkoinenlinkki" :to="{ name: 'opetussuunnitelma', params: { 'opetussuunnitelmaId': ops.id } }">
          <opetussuunnitelma-tile :ops="ops" />
        </router-link>

        <ep-external-link v-else :url="ops.ulkoinenlinkki" :showIcon="false">
          <opetussuunnitelma-tile :ops="ops" />
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { Kielet } from '@shared/stores/kieli';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import { koulutustyyppiUrlShortParamName } from '../../../eperusteet-frontend-utils/vue/src/utils/perusteet';
import { KoulutustyyppiToteutus } from '../../../eperusteet-frontend-utils/vue/src/tyypit';
import { ENV_PREFIX } from '@shared/utils/defaults';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile';

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
  private perusteKoosteStore!: PerusteKoosteStore;

  private query = '';
  private page = 1;
  private perPage = 10;

  get total() {
    return _.size(this.opetussuunnitelmatFiltered);
  }

  get activePeruste() {
    return this.perusteKoosteStore.perusteId;
  }

  setActivePeruste(peruste) {
    this.query = '';
    this.perusteKoosteStore.setPerusteId(peruste.id);
  }

  get perusteet() {
    return this.perusteKoosteStore.perusteet;
  }

  get isLoading() {
    return !this.perusteKoosteStore.opetussuunnitelmat;
  }

  get opetussuunnitelmat() {
    return _.chain(this.perusteKoosteStore.opetussuunnitelmat)
      .map(ops => ({
        ...ops,
        toimijat: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Koulutustoimija')),
        oppilaitokset: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Oppilaitos')),
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
        ulkoinenlinkki: this.ulkoinenlinkki(ops)
      }))
      .value();
  }

  ulkoinenlinkki(ops) {

    if (!this.perusteKoosteStore.activePeruste || this.perusteKoosteStore.activePeruste.toteutus === KoulutustyyppiToteutus.yksinkertainen.valueOf()
        || this.perusteKoosteStore.activePeruste.toteutus === KoulutustyyppiToteutus.lops2019.valueOf()) {
      return undefined;
    }

    return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/ops/${ops.id}/${koulutustyyppiUrlShortParamName(ops.koulutustyyppi)}/tiedot`;
  }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.paikalliset {
  .search {
    margin: 20px 0;
  }

  .peruste-nav {
    margin-bottom: 8px;
    overflow-x: auto;

    .peruste {
      .peruste-select {
        text-align: center;
        margin: 8px;
        button, a {
          font-weight: bold;
          color: #3367E3;
        }

        a:hover {
          color: #578aff;
        }

        &.active {
          border-bottom: #0143da 5px solid;
          padding-bottom: 15px;
          button, a {
            color: #0143da;
          }
        }
      }
    }
  }

  .opetussuunnitelma {
    border: 1px solid #DADADA;
    border-radius: 2px;
    min-height: 80px;
    margin-bottom: 10px;

  }
}

</style>

