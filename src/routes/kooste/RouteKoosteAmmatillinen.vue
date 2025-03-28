<template>
  <div>
    <ep-spinner v-if="!peruste" />
    <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
      <template slot="header">
        {{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{peruste.laajuus}} {{$t('osaamispiste')}}</span>
      </template>
      <div class="selaus">
        <b-container fluid>
          <b-row class="mb-0">
            <b-col cols="12" lg="6" class="tile mb-5">
              <h2 class="otsikko mb-4">{{ $t('peruste') }}</h2>
              <router-link :to="perusteRoute">
                <peruste-tile :julkaisu="peruste" :koulutustyyppi="koulutustyyppi"></peruste-tile>
              </router-link>
            </b-col>
            <b-col cols="12" lg="6" class="mb-5">
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
              <h2 class="otsikko mb-2">{{ $t('paikalliset-toteutussuunnitelmat') }}</h2>
              <div class="search mb-2">
                <div class="mb-2">{{$t('voit-hakea-toteutussuunnitelmaa-nimella-tutkinnon-osalla-tai-organisaatiolla')}}</div>
                <ep-search v-model="query.haku" :placeholder="$t('')" class="my-3">
                  <template #label>
                    <span class="font-weight-600">{{$t('hae-toteutussuunnitelmaa')}}</span>
                  </template>
                </ep-search>
              </div>
              <ep-spinner v-if="!opetussuunnitelmatPage" />
              <div v-else-if="opetussuunnitelmat.length === 0 && !query.haku">
                <div class="alert alert-info">
                  {{ $t('perusteen-pohjalta-ei-toteutettu-toteutussuunnitelmia') }}
                </div>
              </div>
              <div v-else-if="opetussuunnitelmat.length === 0 && query.haku">
                <div class="alert alert-info">
                  {{ $t('ei-hakutuloksia') }}
                </div>
              </div>
              <div v-else id="opetussuunnitelmat-lista" class="opetussuunnitelma-container">

                <EpHakutulosmaara :kokonaismaara="opetussuunnitelmatPage.kokonaismäärä" piilotaNakyvaTulosmaara/>

                <div v-for="(ops, idx) in opetussuunnitelmat" :key="idx">

                  <router-link :to="ops.route" class="d-block">
                    <opetussuunnitelma-tile :ops="ops" :query="query.haku"/>
                  </router-link>

                </div>
                <EpBPagination v-model="page"
                              :items-per-page="perPage"
                              :total="opetussuunnitelmatPage.kokonaismäärä"
                              aria-controls="opetussuunnitelmat-lista">
                </EpBPagination>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </ep-header>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import PerusteTile from './PerusteTile.vue';
import * as _ from 'lodash';
import { RawLocation } from 'vue-router';
import { TiedoteDto } from '@shared/api/eperusteet';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { AmmatillinenPerusteKoosteStore } from '@/stores/AmmatillinenPerusteKoosteStore';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import OpetussuunnitelmaTile from './OpetussuunnitelmaTile.vue';
import { Meta } from '@shared/utils/decorators';
import { OpetussuunnitelmaDto } from '@shared/api/amosaa';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import { murupolkuAmmatillinenRoot } from '@/utils/murupolku';
import EpHakutulosmaara from '@/components/common/EpHakutulosmaara.vue';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    PerusteTile,
    EpJulkiLista,
    EpSearch,
    OpetussuunnitelmaTile,
    EpBPagination,
    EpHakutulosmaara,
  },
})
export default class RouteKoosteAmmatillinen extends Vue {
  @Prop({ required: true })
  private ammatillinenPerusteKoosteStore!: AmmatillinenPerusteKoosteStore;

  private query = {
    haku: null,
    sivu: 0,
  };

  get koulutustyyppi() {
    return 'ammatillinen';
  }

  get murupolku() {
    return [
      murupolkuAmmatillinenRoot(this.koulutustyyppi),
      {
        label: this.peruste!.nimi!,
        location: {
          ...this.$route,
        } as RawLocation,
      },
    ];
  }

  get tiedotteet() {
    if (this.ammatillinenPerusteKoosteStore.tiedotteet.value) {
      return _.chain(this.ammatillinenPerusteKoosteStore.tiedotteet.value)
        .sortBy('luotu')
        .reverse()
        .value();
    }
  }

  get peruste() {
    if (this.ammatillinenPerusteKoosteStore.peruste.value) {
      return {
        ...this.ammatillinenPerusteKoosteStore.peruste.value,
        laajuus: _.get(this.ammatillinenPerusteKoosteStore.peruste.value, 'suoritustavat[0].rakenne.muodostumisSaanto.laajuus.minimi'),
      } as any;
    }
  }

  get perusteRoute() {
    return { name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: _.toString(this.peruste!.id) } };
  }

  get opetussuunnitelmatPage() {
    return this.ammatillinenPerusteKoosteStore.opetussuunnitelmat.value;
  }

  get opetussuunnitelmat(): any {
    if (this.opetussuunnitelmatPage) {
      return _.map(this.opetussuunnitelmatPage.data, (opetussuunnitelma: OpetussuunnitelmaDto) => (
        {
          ...opetussuunnitelma,
          route: {
            name: 'toteutussuunnitelma',
            params: {
              toteutussuunnitelmaId: _.toString(opetussuunnitelma.id),
              koulutustyyppi: 'ammatillinen',
            },
          },
        }
      ));
    }
  }

  get page() {
    return this.opetussuunnitelmatPage!.sivu + 1;
  }

  set page(page) {
    this.query = {
      ...this.query,
      sivu: page - 1,
    };
  }

  get perPage() {
    return this.opetussuunnitelmatPage!.sivukoko;
  }

  get queryNimi() {
    return this.query.haku;
  }

  @Watch('queryNimi')
  nimiChange() {
    this.query.sivu = 0;
  }

  @Watch('query', { deep: true })
  async queryChange(oldVal, newVal) {
    await this.fetch(this.query);

    if (oldVal.sivu !== newVal.sivu) {
      (this.$el.querySelector('.opetussuunnitelma-container a') as any)?.focus();
    }
  }

  async fetch(query) {
    if (_.size(query.haku) === 0 || _.size(query.haku) > 2) {
      await this.ammatillinenPerusteKoosteStore.fetchOpetussuunnitelmat({ nimi: query.haku, sivu: query.sivu });
    }
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
  margin-bottom: 2rem;
}

.search {
  .placeholder {
    font-size: small;
    color: $gray;
  }
}

@media (max-width: 991.98px) {
  .selaus {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
}
</style>
