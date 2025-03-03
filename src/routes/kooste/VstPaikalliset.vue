<template>
<div class="paikalliset">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>
  <span>{{ $t('voit-hakea-opetussuunnitelman') }}</span>
  <div class="d-flex flex-lg-row flex-column">
    <b-form-group :label="$t('hae')" class="flex-fill" :aria-label="$t('hakuosio')">
      <ep-search v-model="query.nimi"
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

  <EpVoimassaoloFilter v-model="query"></EpVoimassaoloFilter>

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
          <opetussuunnitelma-tile :ops="ops" :query="query.nimi" :voimassaoloTiedot="ops.voimassaoloTieto" showJotpaInfo/>
        </router-link>
      </div>
      <EpBPagination v-model="page"
                     :items-per-page="perPage"
                     :total="total"
                     aria-controls="opetussuunnitelmat-lista">
      </EpBPagination>
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
import { VapaasivistystyoPaikallisetStore } from '@/stores/VapaasivistystyoPaikallisetStore';
import { Ulkopuoliset } from '@shared/api/eperusteet';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import { voimassaoloTieto } from '@/utils/voimassaolo';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { isVstLukutaito } from '@shared/utils/perusteet';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';
import { JulkinenApi } from '@shared/api/amosaa';

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    OpetussuunnitelmaTile,
    EpMultiSelect,
    EpBPagination,
    EpVoimassaoloFilter,
  },
})
export default class VstPaikalliset extends Vue {
  @Prop({ required: true })
  private paikallinenStore!: VapaasivistystyoPaikallisetStore;

  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  private valittuPeruste = {};
  private perPage = 10;
  private query = this.initQuery();

  async mounted() {
    this.fetch();
  }

  async fetch() {
    await this.paikallinenStore.fetchQuery(this.query);
  }

  get perusteetOptions() {
    if (this.julkaistutPerusteet) {
      return [
        {
          nimi: null,
        },
        ...this.julkaistutPerusteet,
      ];
    }
    return [];
  }

  async setActivePeruste(perusteJulkaisu) {
    if (perusteJulkaisu?.id) {
      this.query.perusteId = _.toNumber(perusteJulkaisu.id);
      this.query.perusteenDiaarinumero = perusteJulkaisu.diaarinumero;
      this.query.sivu = 0;
    }
    else {
      this.query = this.initQuery();
    }
    await this.fetch();
  }

  get julkaistutPerusteet() {
    if (this.perusteKoosteStore.perusteJulkaisut) {
      return _.chain(this.perusteKoosteStore.perusteJulkaisut.value)
        .filter(julkaistuPeruste => !isVstLukutaito(julkaistuPeruste.koulutustyyppi))
        .map(julkaistuPeruste => ({
          ...julkaistuPeruste,
          kaannettyNimi: this.$kaanna(julkaistuPeruste.nimi!),
        }))
        .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
        .value();
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

  @Watch('kieli')
  kieliChange(val) {
    this.query = {
      ...this.query,
      kieli: val,
    };
  }

  get queryNimi() {
    return this.query.nimi;
  }

  @Watch('queryNimi')
  nimiChange() {
    this.query.sivu = 0;
  }

  @Watch('query', { deep: true })
  async queryChange() {
    if (this.query.oppilaitosTyyppiKoodiUri === 'kaikki') {
      this.query.oppilaitosTyyppiKoodiUri = null;
    }
    await this.fetch();
    (this.$el.querySelector('.opetussuunnitelma-container a') as any)?.focus();
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
        toimijat: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Koulutustoimija')),
        oppilaitokset: _.filter(ops.organisaatiot, org => _.includes(org.tyypit, 'Oppilaitos')),
        route: {
          name: 'toteutussuunnitelma',
          params: {
            toteutussuunnitelmaId: _.toString(ops.id),
            koulutustyyppi: 'vapaasivistystyo',
          },
        },
        voimassaoloTieto: voimassaoloTieto(ops),
      }))
      .sortBy(ops => Kielet.sortValue(ops.nimi))
      .value();
  }

  kaannaPerusteNimi(option) {
    if (option.nimi) {
      return this.$kaanna(option.nimi);
    }
    return this.$t('kaikki');
  }

  private initQuery() {
    return {
      perusteenDiaarinumero: null,
      perusteId: 0,
      koulutustyyppi: [
        Koulutustyyppi.vapaasivistystyo,
        Koulutustyyppi.vapaasivistystyolukutaito,
      ],
      oppilaitosTyyppiKoodiUri: null,
      nimi: null,
      sivu: 0,
      sivukoko: 10,
      kieli: this.kieli,
      tuleva: true,
      voimassaolo: true,
      poistunut: false,
      jotpatyyppi: [
        'NULL',
        'VST',
      ],
    };
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
