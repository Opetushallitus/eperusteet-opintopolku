<template>
<ep-spinner v-if="!koulutustyyppi && !julkaistutPerusteet" />
<ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
  <template slot="header">
    {{ $t(koulutustyyppi) }}
  </template>
  <template slot="subheader">
    {{ $t(subheader) }}
  </template>
  <div>
    <b-container fluid>
      <b-row class="mb-5" v-if="kuvaus">
        <b-col cols="12" xl="auto" class="tile">
          <h2 class="otsikko">{{ $t('kuvaus')}}</h2>
          <div>{{$t(kuvaus)}}</div>
        </b-col>
      </b-row>

      <b-row v-if="perusteKoosteStore">
        <b-col cols="12" xl="auto" class="tile">
          <h2 class="otsikko">{{ $t(perusteetHeader) }}</h2>
          <div class="perustebox d-md-flex flex-wrap justify-content-start" v-if="julkaistutPerusteet">
            <div v-if="julkaistutPerusteet.length === 0">
              {{ $t('perusteita-ei-saatavilla') }}
            </div>
            <template v-else>
              <router-link :to="{ name: 'peruste', params: { perusteId: julkaisu.id } }" v-for="(julkaisu, idx) in visibleJulkaistutPerusteet" :key="idx" class="my-2 mr-2">
                <peruste-tile :julkaisu="julkaisu" :koulutustyyppi="koulutustyyppi"></peruste-tile>
              </router-link>
            </template>
            <router-link :to="route.route" v-for="(route, idx) in muutTilet" :key="'muut' + idx">
              <component :is="route.komponentti" :koulutustyyppi="koulutustyyppi"/>
            </router-link>
          </div>
          <ep-spinner v-else />
        </b-col>
        <b-col v-if="julkaistutEraantyneetPerusteet && julkaistutEraantyneetPerusteet.length > 0">
          <b-button @click="toggleEraantyneet()" variant="link">
            <span v-if="showEraantyneet">{{$t('piilota-ei-voimassa-olevat-perusteet')}}</span>
            <span v-else>{{$t('nayta-ei-voimassa-olevat-perusteet')}}</span>
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="paikallinenStore">
        <b-col>
          <component :is="paikallinenComponent" :perusteKoosteStore="perusteKoosteStore" :paikallinenStore="paikallinenStore" :koulutustyyppi="koulutustyyppi"/>
        </b-col>
      </b-row>

      <b-row>
        <div class="list-section">
          <div class="list">
            <h2>{{ $t('ajankohtaista') }}</h2>
            <ep-spinner-slot :is-loading="!tiedotteet">
              <ep-julki-lista :tiedot="tiedotteet" @avaaTieto="avaaTiedote">
                <template v-slot:lisaaBtnText>
                  {{$t('nayta-lisaa')}}
                </template>
                <template v-slot:eiTietoja>
                  {{$t('ei-tiedotteita')}}
                </template>
              </ep-julki-lista>
            </ep-spinner-slot>
          </div>

          <div class="list">
            <h2>{{$t('ohjeet-ja-materiaalit')}}</h2>
            <ep-spinner-slot :is-loading="!ohjeet">
              <ep-julki-lista :tiedot="ohjeet" @avaaTieto="avaaOpas">
                <template v-slot:lisaaBtnText>
                  <div class="mt-2">
                    {{$t('nayta-lisaa')}}
                  </div>
                </template>
                <template v-slot:eiTietoja>
                  <div class="mt-2">
                    {{$t('ei-ohjeita')}}
                  </div>
                </template>
                <template v-slot:muokkausaika="{ tieto }">
                  {{$sd(tieto.julkaistu)}}
                </template>
              </ep-julki-lista>
            </ep-spinner-slot>
          </div>
        </div>
      </b-row>
    </b-container>
  </div>
</ep-header>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import Paikalliset from './Paikalliset.vue';
import PerusteTile from './PerusteTile.vue';
import { MurupolkuOsa } from '@/tyypit';
import { Meta } from '@shared/utils/decorators';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import _ from 'lodash';
import { RawLocation } from 'vue-router';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista, { JulkiRivi } from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { OpasStore } from '@/stores/OpasStore';
import { KoosteTiedotteetStore } from '@/stores/KoosteTiedotteetStore';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';
import { julkisivuPerusteKoosteJarjestys } from '@shared/utils/perusteet';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    Paikalliset,
    EpExternalLink,
    PerusteTile,
    EpJulkiLista,
    EpSpinnerSlot,
  },
})
export default class RouteKooste extends Vue {
  @Prop({ required: false })
  private perusteKoosteStore!: IPerusteKoosteStore;

  @Prop({ required: true })
  private paikallinenStore!: IPaikallinenStore;

  @Prop({ required: false })
  private opasStore!: OpasStore;

  @Prop({ required: true })
  private tiedotteetStore!: KoosteTiedotteetStore;

  @Prop({ required: true })
  private paikallinenComponent!: any;

  @Prop({ required: false })
  private kuvaus!: string;

  @Prop({ required: false })
  private subheader!: string;

  @Prop({ required: false })
  private perusteetHeader!: string;

  private showEraantyneet: boolean = false;

  async mounted() {
    await Vue.nextTick();
    const h1 = this.$el.querySelector('h1');
    h1?.setAttribute('tabindex', '-1');
    h1?.focus();
  }

  @Watch('koulutustyyppi', { immediate: true })
  async koulutustyyppiChange() {
    if (this.perusteKoosteStore) {
      await this.perusteKoosteStore.fetch();
      await this.tiedotteetStore.fetch(this.perusteKoosteStore?.perusteJulkaisut?.value);
    }
    else {
      await this.tiedotteetStore.fetch();
    }
  }

  get koulutustyyppi() {
    return this.perusteKoosteStore?.koulutustyyppi?.value || _.get(this.$route.params, 'koulutustyyppi');
  }

  get tiedotteet() {
    if (this.tiedotteetStore?.tiedotteet?.value) {
      return _.chain(this.tiedotteetStore.tiedotteet?.value)
        .sortBy('luotu')
        .reverse()
        .value();
    }
  }

  get ohjeet() {
    if (this.opasStore?.oppaat?.value) {
      return _.chain(this.opasStore.oppaat?.value)
        .map(opas => {
          return {
            ...opas,
            otsikko: opas.nimi,
          } as JulkiRivi;
        })
        .sortBy('muokattu')
        .reverse()
        .value();
    }
  }

  get julkaistutPerusteet() {
    if (!this.perusteKoosteStore) {
      return [];
    }

    if (this.perusteKoosteStore?.perusteJulkaisut?.value) {
      return _.chain(this.perusteKoosteStore.perusteJulkaisut?.value)
        .map(julkaisu => ({
          ...julkaisu,
          perusteId: _.toString(julkaisu.id),
          kaannettyNimi: this.$kaanna(julkaisu.nimi!),
          julkisivuJarjestysNro: _.find(this.perusteJarjestykset, jarjestys => jarjestys.id === julkaisu.id)?.julkisivuJarjestysNro,
        }))
        .orderBy(julkisivuPerusteKoosteJarjestys.keys, julkisivuPerusteKoosteJarjestys.sortby)
        .value();
    }
  }

  get perusteJarjestykset() {
    return this.perusteKoosteStore.perusteJarjestykset?.value;
  }

  get visibleJulkaistutPerusteet() {
    if (this.showEraantyneet) {
      return [...this.julkaistutVoimassaolevatPerusteet, ...this.julkaistutEraantyneetPerusteet];
    }
    return this.julkaistutVoimassaolevatPerusteet;
  }

  get julkaistutVoimassaolevatPerusteet() {
    return _.filter(this.julkaistutPerusteet, (peruste) => (!peruste.voimassaoloLoppuu || Date.now() < peruste.voimassaoloLoppuu)
      && !_.find(this.perusteJarjestykset, jarjestys => jarjestys.id === peruste.id)?.piilotaJulkisivulta);
  }

  get julkaistutEraantyneetPerusteet() {
    return _.filter(this.julkaistutPerusteet, (peruste) => (peruste.voimassaoloLoppuu && Date.now() > peruste.voimassaoloLoppuu)
      || _.find(this.perusteJarjestykset, jarjestys => jarjestys.id === peruste.id)?.piilotaJulkisivulta);
  }

  get muutTilet() {
    return this.perusteKoosteStore.muutTilet?.value;
  }

  toggleEraantyneet() {
    this.showEraantyneet = !this.showEraantyneet;
  }

  avaaTiedote(tiedote: TiedoteDto) {
    this.$router.push({
      name: 'uutinen',
      params: {
        tiedoteId: '' + tiedote.id,
      },
    });
  }

  avaaOpas(ohje: any) {
    this.$router.push({
      name: 'peruste',
      params: {
        koulutustyyppi: 'opas',
        perusteId: ohje.id,
      },
    });
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t(this.koulutustyyppi),
    };
  }

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: this.koulutustyyppi,
      location: {
        ...this.$route,
      } as RawLocation,
    }];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

::v-deep .ep-collapse .header {
  color: #3367E3;
}

.container {
  .tile {
    // Todo: käytä muuttujia
    @media (max-width: 1199.98px) {
      &:not(:first-child) {
        margin-top: 30px;
      }
    }

    .perustebox {
      margin-top: 30px;
      margin-bottom: 30px;
    }

    .tiedotebox {
      margin-top: 30px;

      .tiedote {
        padding: 5px;
        margin-bottom: 1rem;

        &:nth-child(odd) {
          background-color: #F9F9F9;
        }

        .aikaleima {
          font-size: smaller;
          color: #555;
        }

        a {
            color: #2B2B2B;
        }

        a:hover {
          color: #0070f4;
        }
      }
    }
  }
}

.row {
  margin-bottom: 2rem;
  display: block;
}

.list {
  padding-left: 15px;
  padding-right: 15px;
  width: 50%;
}

@media (min-width: 991.98px) {
  .list-section {
    display: flex;
  }
}

@media (max-width: 991.98px) {
  .row {
    margin: 25px 0 0 0;
  }

  .list {
    padding-top: 20px;
    width: 100%;
  }
}
</style>
