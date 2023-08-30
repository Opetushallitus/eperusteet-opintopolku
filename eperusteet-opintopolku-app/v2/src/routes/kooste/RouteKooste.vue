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

      <b-row class="mb-5" v-if="perusteKoosteStore">
        <b-col cols="12" xl="auto" class="tile">
          <h2 class="otsikko">{{ $t('tile-perusteet') }}</h2>
          <div class="perustebox d-md-flex flex-wrap justify-content-start" v-if="julkaistutPerusteet">
            <div v-if="julkaistutPerusteet.length === 0">
              {{ $t('perusteita-ei-saatavilla') }}
            </div>
            <div v-else v-for="(julkaisu, idx) in julkaistutVoimassaolevatPerusteet" :key="idx">
              <router-link :to="{ name: 'peruste', params: { perusteId: julkaisu.id } }">
                <peruste-tile :julkaisu="julkaisu" :koulutustyyppi="koulutustyyppi"></peruste-tile>
              </router-link>
            </div>
          </div>
          <ep-spinner v-else />
        </b-col>
        <b-col v-if="julkaistutEraantyneetPerusteet.length > 0" cols="12" xl="auto" class="tile">
          <EpCollapse :borderBottom="false"
                      :expandedByDefault="false"
                      :chevronLocation="''"
                      :use-padding="false"
                      :content-first="true">
            <template v-slot:header="{ toggled }">
              <template v-if="toggled">{{$t('piilota-ei-voimassa-olevat-perusteet')}}</template>
              <template v-if="!toggled">{{$t('nayta-ei-voimassa-olevat-perusteet')}}</template>
            </template>
            <div class="perustebox d-md-flex flex-wrap justify-content-start">
              <div v-for="(julkaisu, idx) in julkaistutEraantyneetPerusteet" :key="idx">
                <router-link :to="{ name: 'peruste', params: { perusteId: julkaisu.id } }">
                  <peruste-tile :julkaisu="julkaisu" :koulutustyyppi="koulutustyyppi"></peruste-tile>
                </router-link>
              </div>
            </div>
          </EpCollapse>
        </b-col>
      </b-row>

      <b-row v-if="paikallinenStore">
        <b-col>
          <component :is="paikallinenComponent" :perusteKoosteStore="perusteKoosteStore" :paikallinenStore="paikallinenStore"/>
        </b-col>
      </b-row>

      <b-row>
        <b-col md class="mb-4">
          <h2 class="mb-4">{{$t('ajankohtaista')}}</h2>
          <ep-spinner v-if="!tiedotteet"/>
          <ep-julki-lista :tiedot="tiedotteet" @avaaTieto="avaaTiedote" v-else>
            <template v-slot:lisaaBtnText>
              <div class="mt-2">
                {{$t('katso-lisaa-ajankohtaisia')}}
              </div>
            </template>
            <template v-slot:eiTietoja>
              <div class="mt-2">
                {{$t('ei-tiedotteita')}}
              </div>
            </template>
          </ep-julki-lista>
        </b-col>
        <b-col md class="mb-4">
          <h2 class="mb-4">{{$t('ohjeet-ja-materiaalit')}}</h2>
          <ep-spinner v-if="!ohjeet"/>
          <ep-julki-lista :tiedot="ohjeet" @avaaTieto="avaaOpas" v-else>
            <template v-slot:lisaaBtnText>
              <div class="mt-2">
                {{$t('katso-lisaa-ohjeita')}}
              </div>
            </template>
            <template v-slot:eiTietoja>
              <div class="mt-2">
                {{$t('ei-ohjeita')}}
              </div>
            </template>
            <template v-slot:muokkausaika="{ tieto }">
              {{$sdt(tieto.julkaistu)}}
            </template>
          </ep-julki-lista>
        </b-col>
      </b-row>
    </b-container>
  </div>
</ep-header>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import Paikalliset from './Paikalliset.vue';
import PerusteTile from './PerusteTile.vue';
import { MurupolkuOsa } from '@/tyypit';
import { Meta } from '@shared/utils/decorators';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import _ from 'lodash';
import { RawLocation } from 'vue-router';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista, { JulkiRivi } from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { OpasStore } from '@/stores/OpasStore';
import { KoosteTiedotteetStore } from '@/stores/KoosteTiedotteetStore';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    Paikalliset,
    EpExternalLink,
    PerusteTile,
    EpJulkiLista,
    EpCollapse,
  },
})
export default class RouteKooste extends Vue {
  @Prop({ required: false })
  private perusteKoosteStore!: PerusteKoosteStore;

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

  @Watch('koulutustyyppi', { immediate: true })
  async fetch() {
    await this.tiedotteetStore?.fetch(this.perusteKoosteStore?.perusteJulkaisut);
  }

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: this.koulutustyyppi,
      location: {
        ...this.$route,
      } as RawLocation,
    }];
  }

  get koulutustyyppi() {
    return this.perusteKoosteStore?.koulutustyyppi || _.get(this.$route.params, 'koulutustyyppi');
  }

  get tiedotteet() {
    if (this.tiedotteetStore?.tiedotteet.value) {
      return _.chain(this.tiedotteetStore.tiedotteet.value)
        .sortBy('luotu')
        .reverse()
        .value();
    }
  }

  get ohjeet() {
    if (this.opasStore?.oppaat.value) {
      return _.chain(this.opasStore.oppaat.value)
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

    if (this.perusteKoosteStore?.perusteJulkaisut) {
      return _.chain(this.perusteKoosteStore.perusteJulkaisut)
        .map(julkaisu => ({
          ...julkaisu,
          perusteId: _.toString(julkaisu.id),
          kaannettyNimi: this.$kaanna(julkaisu.nimi!),
        }))
        .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
        .value();
    }
  }

  get julkaistutVoimassaolevatPerusteet() {
    return _.filter(this.julkaistutPerusteet, (peruste) => !peruste.voimassaoloLoppuu || Date.now() < peruste.voimassaoloLoppuu);
  }

  get julkaistutEraantyneetPerusteet() {
    return _.filter(this.julkaistutPerusteet, (peruste) => peruste.voimassaoloLoppuu && Date.now() > peruste.voimassaoloLoppuu);
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t(this.koulutustyyppi),
    };
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
  margin-bottom: 3rem;
  display: block;
}

@media (max-width: 991.98px) {
  .row {
    margin: 0;
  }
}
</style>
