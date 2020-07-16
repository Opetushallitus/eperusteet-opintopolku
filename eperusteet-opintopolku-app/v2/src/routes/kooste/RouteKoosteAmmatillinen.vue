<template>
  <ep-spinner v-if="!peruste" />
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
    <template slot="header">
      {{ $kaanna(peruste.nimi) }}
    </template>
    <div>
      <b-container fluid>
        <b-row>
          <b-col cols="6" class="tile">
            <h2 class="otsikko">{{ $t('perusteet') }}</h2>
            <router-link :to="{ name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: peruste.id } }">
              <peruste-tile :peruste="peruste" :koulutustyyppi="koulutustyyppi"></peruste-tile>
            </router-link>
          </b-col>
          <b-col cols="6" class="mb-4">
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
        </b-row>
        <b-row>
          <b-col>
            <h2 class="otsikko">{{ $t('paikalliset-toteutussuunnitelmat') }}</h2>
            <div class="search">
              <ep-search v-model="query" :placeholder="$t('etsi-toteutussuunnitelmaa')"/>
            </div>
            <ep-spinner v-if="!opetussuunnitelmat" />
            <div v-else-if="opetussuunnitelmat.length === 0">
              <div class="alert alert-info">
                {{ $t('perusteen-pohjalta-ei-toteutettu-toteutussuunnitelmia') }}
              </div>
            </div>
            <div v-else-if="opetussuunnitelmatFiltered.length === 0">
              <div class="alert alert-info">
                {{ $t('ei-hakutuloksia') }}
              </div>
            </div>
            <div v-else id="opetussuunnitelmat-lista">
              <div v-for="(ops, idx) in opetussuunnitelmatPaginated" :key="idx">

                <router-link :to="{name: 'toteutussuunnitelma', params: { toteutussuunnitelmaId: ops.id}}">
                  <opetussuunnitelma-tile :ops="ops" :query="query"/>
                </router-link>

              </div>
              <b-pagination v-model="page"
                            class="mt-4"
                            :total-rows="opetussuunnitelmatFiltered.length"
                            :per-page="perPage"
                            align="center"
                            aria-controls="opetussuunnitelmat-lista"
                            :first-text="$t('alkuun')"
                            prev-text="«"
                            next-text="»"
                            :last-text="$t('loppuun')" />
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </ep-header>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import PerusteTile from './PerusteTile.vue';
import { MurupolkuOsa } from '@/tyypit';
import { perusteKoulutustyyppiUrlShortParamName } from '@shared/utils/perusteet';
import * as _ from 'lodash';
import { RawLocation } from 'vue-router';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { AmmatillinenPerusteKoosteStore } from '@/stores/AmmatillinenPerusteKoosteStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import { Kielet } from '@shared/stores/kieli';
import { Meta } from '@shared/utils/decorators';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteTile,
    EpJulkiLista,
    EpSearch,
    OpetussuunnitelmaTile,
  },
})
export default class RouteKoosteAmmatillinen extends Vue {
  @Prop({ required: true })
  private ammatillinenPerusteKoosteStore!: AmmatillinenPerusteKoosteStore;

  private query = '';
  private page = 1;
  private perPage = 10;

  get koulutustyyppi() {
    return 'ammatillinen';
  }

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: 'ammatillinen',
      location: {
        ...this.$route,
      } as RawLocation,
    }, {
      label: this.peruste!.nimi!,
      location: {
        ...this.$route,
      } as RawLocation,
    }];
  }

  get tiedotteet() {
    return _.chain(this.ammatillinenPerusteKoosteStore.tiedotteet.value)
      .sortBy('luotu')
      .reverse()
      .value();
  }

  get peruste() {
    return this.ammatillinenPerusteKoosteStore.peruste.value;
  }

  get opetussuunnitelmat(): any {
    return this.ammatillinenPerusteKoosteStore.opetussuunnitelmat.value;
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

  avaaTiedote(tiedote: TiedoteDto) {
    this.$router.push({
      name: 'uutinen',
      params: {
        tiedoteId: '' + tiedote.id,
      },
    });
  }

  @Meta
  getMetaInfo() {
    if (this.peruste) {
      return {
        title: (this as any).$kaanna(this.peruste.nimi),
      };
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

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

.search {
  margin: 20px 0;
}

</style>
