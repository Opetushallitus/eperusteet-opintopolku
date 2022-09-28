<template>
  <div class="paikalliset">
    <h2 class="otsikko">{{ $t('kuvaus')}}</h2>
    <div class="mb-5">{{$t('jotpa-paikalliset-kuvaus')}}</div>

    <h2 class="otsikko">{{ $t('opetussuunnitelmat') }}</h2>

    <div class="d-flex flex-lg-row flex-column">
      <b-form-group :label="$t('hae')" class="flex-fill">
        <ep-search v-model="query.nimi"/>
      </b-form-group>
    </div>

    <div class="opetussuunnitelma-container">

      <ep-spinner v-if="!opetussuunnitelmat" />
      <div v-else-if="opetussuunnitelmat.length === 0">
        <div class="alert alert-info">
          {{ $t('ei-hakutuloksia') }}
        </div>
      </div>
      <div v-else id="opetussuunnitelmat-lista">
        <div v-for="(ops, idx) in opetussuunnitelmatMapped" :key="idx">
          <router-link :to="ops.route">
            <opetussuunnitelma-tile :ops="ops" :query="query.nimi"/>
          </router-link>
        </div>
        <b-pagination
          class="mt-4"
          v-model="page"
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
import { Kielet } from '@shared/stores/kieli';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import { Koulutustyyppi } from '@shared/tyypit';
import { YleisetPaikallisetStore } from '@/stores/YleisetPaikallisetStore';

  @Component({
    components: {
      EpHeader,
      EpSearch,
      EpSpinner,
      OpetussuunnitelmaTile,
      EpMultiSelect,
    },
  })
export default class JotpaPaikalliset extends Vue {
    @Prop({ required: true })
    private paikallinenStore!: YleisetPaikallisetStore;

    private perPage = 10;
    private query = {
      nimi: null,
      sivu: 0,
      sivukoko: 10,
      kieli: this.kieli,
      jotpatyyppi: ['VST', 'MUU'],
    };

    async mounted() {
      if (this.paikallinenStore) {
        await this.paikallinenStore.fetchQuery(this.query);
      }
    }

    get kieli() {
      return Kielet.getSisaltoKieli.value;
    }

    get page() {
      return this.opetussuunnitelmatPaged?.sivu! + 1;
    }

    set page(page) {
      this.query = {
        ...this.query,
        sivu: page - 1,
      };
    }

    get queryNimi() {
      return this.query.nimi;
    }

    @Watch('queryNimi')
    nimiChange() {
      this.query.sivu = 0;
    }

    @Watch('kieli')
    kieliChange(val) {
      this.query = {
        ...this.query,
        kieli: val,
      };
    }

    @Watch('query', { deep: true })
    async queryChange() {
      await this.paikallinenStore.fetchQuery(this.query);
    }

    get total() {
      return this.opetussuunnitelmatPaged?.kokonaismäärä;
    }

    get opetussuunnitelmat() {
      return this.paikallinenStore.opetussuunnitelmat.value;
    }

    get opetussuunnitelmatPaged() {
      return this.paikallinenStore.opetussuunnitelmatPaged.value;
    }

    get opetussuunnitelmatMapped() {
      return _.chain(this.opetussuunnitelmat)
        .map(ops => ({
          ...ops,
          route: {
            name: 'toteutussuunnitelma',
            params: {
              toteutussuunnitelmaId: _.toString(ops.id),
              koulutustyyppi: ops.jotpatyyppi === 'MUU' ? 'muukoulutus' : 'vapaasivistystyo',
            },
          },
        }))
        .sortBy(ops => Kielet.sortValue(ops.nimi))
        .value();
    }
}
</script>

  <style scoped lang="scss">
  @import '@shared/styles/_variables.scss';
  @import '@shared/styles/_mixins.scss';

  .paikalliset {

    ::v-deep .filter {
      max-width: 100%;
    }

    @media(min-width: 992px){
      .multiselect {
        width: 300px;
      }
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
