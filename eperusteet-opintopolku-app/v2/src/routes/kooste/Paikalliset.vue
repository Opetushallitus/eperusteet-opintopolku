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
            <button class="btn btn-link" @click="setActivePeruste(peruste)">
              {{ $kaanna(peruste.nimi) }}
            </button>
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
    <div v-else>
      <div class="opetussuunnitelma"
           v-for="(ops, idx) in opetussuunnitelmatPaginated"
           :key="idx"
           id="opetussuunnitelmat-lista">
        <div class="d-flex align-items-center">
          <div class="opsicon-wrapper">
            <div class="opsicon"></div>
          </div>
          <div class="nimi flex-fill">
            <div class="ops">
              <router-link :to="{ name: 'opetussuunnitelma', params: { 'opetussuunnitelmaId': ops.id } }">
                {{ $kaanna(ops.nimi) }}
              </router-link>
            </div>
            <div class="organisaatiot">
              <div v-if="ops.toimijat.length > 0">
                <span class="otsikko">{{ $t('toimijat') }}</span>
                <span class="mr-1">:</span>
                <span class="toimijat" v-for="(toimija, tidx) in ops.toimijat" :key="tidx">
                  {{ $kaanna(toimija.nimi) }}<span v-if="tidx < ops.toimijat.length - 1">, </span>
                </span>
              </div>
              <div v-if="ops.oppilaitokset.length > 0">
                <span class="otsikko">{{ $t('oppilaitokset') }}</span>
                <span class="mr-1">:</span>
                <span class="toimijat" v-for="(oppilaitos, tidx) in ops.oppilaitokset" :key="tidx">
                  {{ $kaanna(oppilaitos.nimi) }}<span v-if="tidx < ops.oppilaitokset.length - 1">, </span>
                </span>
              </div>
            </div>
          </div>
          <div class="perusteen-nimi">
          </div>
        </div>
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

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
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
      .value();
  }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.paikalliset {
  .search {
    margin: 20px 0;
  }

  h2.otsikko {
    font-weight: bolder;
  }

  .peruste-nav {
    margin-bottom: 8px;
    overflow-x: auto;

    .peruste {
      .peruste-select {
        margin: 8px;
        button {
          font-weight: bold;
          color: #575757;
        }

        &.active {
          border-bottom: #0143da 5px solid;
          button {
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

    .opsicon-wrapper {
      padding: 20px 25px 20px 25px;

      .opsicon {
        height: 40px;
        width: 40px;
        background: url('../../../public/img/icons/opskortti.svg');
        background-size: 40px 40px;
      }
    }

    .nimi {
      padding: 0px;

      .ops {
        margin-bottom: 8px;
      }
    }

    .perusteen-nimi {
      padding: 20px;
    }

    .organisaatiot {
      .toimijat {
        color: #555;
        font-size: smaller;
      }

      .otsikko {
        color: #2B2B2B;
        font-size: smaller;
      }
    }
  }
}

</style>

