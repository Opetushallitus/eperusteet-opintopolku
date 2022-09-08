<template>
<div class="paikalliset">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>

  <div class="d-flex flex-lg-row flex-column">
    <b-form-group :label="$t('hae')" class="flex-fill">
      <ep-search v-model="query.nimi"/>
    </b-form-group>
    <b-form-group :label="$t('oppilaitoksen-tyyppi')">
      <EpMultiSelect
        class="multiselect"
        v-model="query.oppilaitosTyyppiKoodiUri"
        :enable-empty-option="true"
        :placeholder="$t('kaikki')"
        :is-editing="true"
        :options="oppilaitostyypit">

        <template slot="singleLabel" slot-scope="{ option }">
          {{ kaannaOppilaitosNimi(option) }}
        </template>

        <template slot="option" slot-scope="{ option }">
          {{ kaannaOppilaitosNimi(option) }}
        </template>
      </EpMultiSelect>
    </b-form-group>
    <b-form-group :label="$t('oppilaitos')">
      <EpMultiSelect
        class="multiselect"
        v-model="organisaatio"
        :enable-empty-option="true"
        :placeholder="$t('kaikki')"
        :is-editing="true"
        :options="oppilaitokset">

        <template slot="singleLabel" slot-scope="{ option }">
          {{ $kaanna(option.nimi) }}
        </template>

        <template slot="option" slot-scope="{ option }">
          {{ $kaanna(option.nimi) }}
        </template>
      </EpMultiSelect>
    </b-form-group>

  </div>

  <div class="d-flex align-self-center flex-wrap flex-lg-row flex-column toggles">
    <EpColoredToggle v-model="query.tuleva" class="haku-toggle tuleva">
      {{ $t('switch-tuleva') }}
    </EpColoredToggle>
    <EpColoredToggle v-model="query.voimassaolo" class="haku-toggle voimassaolo">
      {{ $t('switch-voimassaolo') }}
    </EpColoredToggle>
    <EpColoredToggle v-model="query.poistunut" class="haku-toggle poistunut">
      {{ $t('switch-poistunut') }}
    </EpColoredToggle>
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
          <opetussuunnitelma-tile :ops="ops" :query="query.nimi" :voimassaoloTieto="ops.voimassaoloTieto"/>
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
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
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
import EpColoredToggle from '@shared/components/forms/EpColoredToggle.vue';
import { voimassaoloTieto } from '@/utils/voimassaolo';

@Component({
  components: {
    EpHeader,
    EpSearch,
    EpSpinner,
    OpetussuunnitelmaTile,
    EpMultiSelect,
    EpColoredToggle,
  },
})
export default class VstPaikalliset extends Vue {
  @Prop({ required: true })
  private paikallinenStore!: VapaasivistystyoPaikallisetStore;

  private oppilaitostyyppi: string | null = null;
  private perPage = 10;
  private query = {
    koulutustyyppi: [
      Koulutustyyppi.vapaasivistystyo,
      Koulutustyyppi.vapaasivistystyolukutaito,
    ],
    oppilaitosTyyppiKoodiUri: null,
    nimi: null,
    sivu: 0,
    sivukoko: 10,
    organisaatio: null,
    kieli: this.kieli,
    tuleva: true,
    voimassaolo: true,
    poistunut: true,
  };

  private readonly oppilaitostyyppiKoodisto = new KoodistoSelectStore({
    async query(query: string, sivu = 0) {
      return (await Ulkopuoliset.getKoodisto('vapaasivistystyooppilaitostyyppi', query, {
        params: {
          sivu,
          sivukoko: 50,
        },
      })).data as any;
    },
  });

  async mounted() {
    if (this.paikallinenStore) {
      await this.paikallinenStore.fetchQuery(this.query);
    }

    await this.oppilaitostyyppiKoodisto.query();
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
        toimijat: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Koulutustoimija')),
        oppilaitokset: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Oppilaitos')),
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

  get oppilaitostyypit() {
    return ['kaikki',
      ..._.chain(_.get(this.oppilaitostyyppiKoodisto.data.value, 'data'))
        .map(koodi => koodi.koodiUri)
        .value()];
  }

  get oppilaitostyypitNimi() {
    return _.chain(_.get(this.oppilaitostyyppiKoodisto.data.value, 'data'))
      .map(koodi => {
        return {
          koodiUri: koodi.koodiUri,
          nimi: _.mapValues(_.keyBy(koodi.metadata, v => _.toLower(v.kieli)), v => v.nimi),
        };
      })
      .keyBy('koodiUri')
      .value();
  }

  kaannaOppilaitosNimi(koodiUri) {
    if (this.oppilaitostyypitNimi[koodiUri]) {
      return this.$kaanna(this.oppilaitostyypitNimi[koodiUri].nimi);
    }

    return this.$t(koodiUri);
  }

  get oppilaitokset() {
    return [{
      organisaatio: 'kaikki',
      nimi: {
        [Kielet.getSisaltoKieli.value]: this.$t('kaikki'),
      } },
    ...(this.paikallinenStore?.oppilaitokset.value ? this.paikallinenStore?.oppilaitokset.value : []),
    ];
  }

  get organisaatio() {
    return _.find(this.oppilaitokset, oppilaitos => oppilaitos.organisaatio === this.query.organisaatio);
  }

  set organisaatio(value) {
    if (value?.organisaatio === 'kaikki') {
      this.query.organisaatio = null;
    }
    else {
      this.query.organisaatio = value?.organisaatio as any;
    }
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

  $tuleva-color: $green-lighten-2;
  $voimassa-color: $green;
  $paattynyt-color: $red-1;

  .toggles {

    padding-bottom: 20px;
    padding-left: 10px;

    .haku-toggle {
      padding: 0px 5px;

      ::v-deep .toggle {
        border: 0px;
      }

      &.tuleva ::v-deep .toggle{
        background-color: $tuleva-color;
      }

      &.voimassaolo ::v-deep .toggle{
        background-color: $green;
      }

      &.poistunut ::v-deep .toggle{
        background-color: $paattynyt-color;
      }

    }
  }

}

</style>
