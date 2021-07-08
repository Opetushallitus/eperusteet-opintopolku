<template>
<ep-spinner v-if="!koulutustyyppi && !julkaistutPerusteet" />
<ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
  <template slot="header">
    {{ $t(koulutustyyppi) }}
  </template>
  <div>
    <b-container fluid>
      <b-row class="mb-5">
        <b-col cols="12" xl="auto" class="tile">
          <h2 class="otsikko">{{ $t('perusteet') }}</h2>
          <div class="perustebox d-md-flex flex-wrap justify-content-start" v-if="julkaistutPerusteet">
            <div v-if="julkaistutPerusteet.length === 0">
              {{ $t('perusteita-ei-saatavilla') }}
            </div>
              <div v-else v-for="(julkaisu, idx) in julkaistutPerusteet" :key="idx">
                <router-link :to="{ name: 'peruste', params: { perusteId: julkaisu.peruste.id } }">
                  <peruste-tile :julkaisu="julkaisu" :koulutustyyppi="koulutustyyppi"></peruste-tile>
                </router-link>
              </div>
          </div>
          <ep-spinner v-else />
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
          <ep-spinner v-if="!tiedotteet"/>
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
          </ep-julki-lista>
        </b-col>
      </b-row>
      <b-row v-if="paikallinenStore">
        <b-col >
          <component :is="paikallinenComponent" :perusteKoosteStore="perusteKoosteStore" :paikallinenStore="paikallinenStore"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</ep-header>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import Paikalliset from './Paikalliset.vue';
import PerusteTile from './PerusteTile.vue';
import { MurupolkuOsa } from '@/tyypit';
import { Meta } from '@shared/utils/decorators';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import { perusteKoulutustyyppiUrlShortParamName } from '@shared/utils/perusteet';
import _ from 'lodash';
import { ENV_PREFIX } from '@shared/utils/defaults';
import { uusiJulkinenToteutus } from '@/utils/peruste';
import { RawLocation } from 'vue-router';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista, { JulkiRivi } from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { OpasStore } from '@/stores/OpasStore';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    Paikalliset,
    EpExternalLink,
    PerusteTile,
    EpJulkiLista,
  },
})
export default class RouteKooste extends Vue {
  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  @Prop({ required: true })
  private paikallinenStore!: IPaikallinenStore;

  @Prop({ required: true })
  private opasStore!: OpasStore;

  @Prop({ required: true })
  private paikallinenComponent!: any;

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: this.koulutustyyppi,
      location: {
        ...this.$route,
      } as RawLocation,
    }];
  }

  get koulutustyyppi() {
    return this.perusteKoosteStore.koulutustyyppi;
  }

  get tiedotteet() {
    if (this.perusteKoosteStore.tiedotteet) {
      return _.chain(this.perusteKoosteStore.tiedotteet)
        .sortBy('luotu')
        .reverse()
        .value();
    }
  }

  get ohjeet() {
    if (this.opasStore.oppaat.value) {
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
    if (this.perusteKoosteStore.julkaistutPerusteet) {
      return _.chain(this.perusteKoosteStore.julkaistutPerusteet)
        .map(julkaisu => ({
          ...julkaisu,
          id: _.toString(julkaisu.peruste!.id),
          kaannettyNimi: this.$kaanna(julkaisu.nimi!),
        }))
        .orderBy(['voimassaoloAlkaa', 'kaannettyNimi'], ['desc', 'asc'])
        .value();
    }
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
}

@media (max-width: 991.98px) {
  .row {
    margin: 0;
  }
}
</style>
