<template>
<div id="main">
  <div class="ylaosa">
    <div class="container">
      <div class="laatikko">
        <h1 class="otsikko">{{ $t('eperusteet') }}</h1>
        <p class="kuvaus">{{ $t('eperusteet-kuvaus') }}</p>
      </div>
    </div>
  </div>
  <div class="container">
    <b-container fluid>
      <b-row>
        <b-col md="12" class="tile">
          <section>
            <h2 class="tile-heading">{{ $t('ajankohtaista') }}</h2>
            <ep-spinner-slot :is-loading="!tiedotteet">
            <div class="d-flex flex-wrap">
              <div class="box w-50" v-for="(tiedote, idx) in tiedotteetMapped" :key="idx">
                <div class="nimi">
                  <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
                    {{ $kaanna(tiedote.otsikko) }} <span class="uusi" v-if="tiedote.uusi">{{$t('uusi')}}</span>
                  </router-link>
                </div>
                <div class="luotu">{{ $sd(tiedote.luotu) }}</div>
              </div>
            </div>
            <div class="box">
              <div class="kaikki-uutiset">
                <router-link :to="{ name: 'uutiset' }">
                  {{ $t('nayta-kaikki') }}
                </router-link>
              </div>
            </div>
            </ep-spinner-slot>
          </section>
        </b-col>
      </b-row>

      <section class="valtakunnalliset">
        <h2 class="tile-heading">{{ $t('valtakunnalliset-eperusteet') }}</h2>
        <ep-search class="query" v-model="query" :placeholder="$t('etsi-perusteista')"/>

        <ep-spinner-slot :is-loading="!perusteet">

            <div v-for="(ryhma, idx) in perusteetRyhmittain" :key="idx" class="mb-4 mt-4">
              <h3>{{ $t(ryhma.theme) }}</h3>

              <div v-if="ryhma.kooste" class="d-flex flex-wrap justify-content-between">
                <div class="valtakunnallinen">
                  <router-link :to="ryhma.route">
                    <div class="sisalto d-flex justify-content-between align-content-stretch tile-background-shadow-selected shadow-tile">
                      <div class="raita mx-3 my-2" :class="ryhma.theme"></div>
                      <div class="d-flex flex-fill align-items-center">
                        <div class="nimi my-3 mr-3">
                          {{ $t(ryhma.theme) }}
                          <div class="luotu" >{{ $t('useampia')}}:
                            <span v-for="(maara, index) in ryhma.perustemaarat" :key="'kt'+maara.koulutustyyppi">
                              <span v-if="index > 0">, </span>
                              <span>{{$t(maara.koulutustyyppi)}} {{maara.lukumaara}} {{$t('kpl')}}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>

              <template v-else>
                <div class="d-flex flex-wrap justify-content-between" v-for="peruste in ryhma.perusteet" :key="'peruste'+peruste.id">
                  <div class="valtakunnallinen">
                    <router-link v-if="!peruste.ulkoinenlinkki" :to="peruste.route">
                      <div class="sisalto d-flex justify-content-between align-content-stretch tile-background-shadow-selected shadow-tile">
                        <div class="raita mx-3 my-2" :class="ryhma.theme"></div>
                        <div class="d-flex flex-fill align-items-center">
                          <div class="nimi my-3 mr-3">
                            {{ $kaanna(peruste.nimi) }}
                            <div class="luotu">{{ $t('voimaantulo-pvm')}}: {{ $sd(peruste.luotu) }}</div>
                          </div>
                        </div>
                      </div>
                    </router-link>

                    <ep-external-link v-else :url="peruste.ulkoinenlinkki" :showIcon="false">
                      <div class="sisalto d-flex justify-content-between align-content-stretch tile-background-shadow-selected shadow-tile">
                      <div class="raita mx-3 my-2" :class="ryhma.theme"></div>
                      <div class="d-flex flex-fill align-items-center">
                        <div class="nimi my-3 mr-3">
                          <fas fixed-width icon="external-link-alt" class="mr-1"></fas>
                          {{ $kaanna(peruste.nimi) }}
                          <div class="luotu">{{ $t('voimaantulo-pvm')}}: {{ $sd(peruste.luotu) }}</div>
                        </div>
                      </div>
                    </div>
                    </ep-external-link>
                  </div>
                </div>
              </template>
            </div>

            <div v-if="perusteet && perusteetRyhmittain.length === 0" class="alert alert-info mt-4">
              {{$t('ei-hakutuloksia')}}
            </div>

        </ep-spinner-slot>
      </section>
    </b-container>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import { PerusteDto } from '@shared/api/eperusteet';
import { PerusteStore } from '@/stores/PerusteStore';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import {
  AmmatillisetKoulutustyypit,
  EperusteetKoulutustyyppiRyhmaSort,
  EperusteetKoulutustyyppiRyhmat,
  koulutustyyppiStateName,
  koulutustyyppiTheme,
  perusteKoulutustyyppiUrlShortParamName,
  Toteutus,
  yleissivistavat,
} from '@shared/utils/perusteet';
import { Meta } from '@shared/utils/decorators';
import { uusiJulkinenToteutus } from '@/utils/peruste';
import { ENV_PREFIX } from '@shared/utils/defaults';
import { Kielet } from '@shared/stores/kieli';
import { Koulutustyyppi } from '@shared/tyypit';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { onkoUusi } from '@shared/utils/tiedote';

@Component({
  components: {
    EpSpinnerSlot,
    EpExternalLink,
    EpSearch,
  },
})
export default class RouteHome extends Vue {
  @Prop({ required: true })
  private perusteStore!: PerusteStore;

  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;

  private query = '';

  async mounted() {
    this.fetcPerusteet();
    this.tiedoteStore.getUusimmat();
  }

  get perusteet() {
    if (this.perusteStore.perusteet) {
      return _.map(this.perusteStore.perusteet, peruste => {
        if (!peruste.koulutustyyppi) {
          throw new Error('koulutustyyppi-ei-maaritelty');
        }
        return {
          ...peruste,
          ulkoinenlinkki: this.ulkoinenlinkki(peruste),
          route: {
            name: 'peruste',
            params: {
              koulutustyyppi: koulutustyyppiStateName(peruste.koulutustyyppi),
              perusteId: _.toString(peruste.id),
            },
          },
        };
      });
    }
    else {
      return null;
    }
  }

  private async fetcPerusteet() {
    await this.perusteStore.getYleisetPerusteet(
      {
        nimi: this.query,
        ...(!_.isEmpty(this.query) && { koulutustyyppi: undefined }),
      });
  }

  @Watch('query')
  private async queryChange() {
    if (_.isEmpty(this.query) || _.size(this.query) > 2) {
      await this.fetcPerusteet();
    }
  }

  get latestQueryWithNimi() {
    return !_.isEmpty(this.perusteStore.query?.nimi);
  }

  get perusteetRyhmittain() {
    const ryhmatPerusteista = _.chain(EperusteetKoulutustyyppiRyhmat)
      .keys()
      .map(toteutus => {
        return {
          toteutus,
          perusteet: _.filter(this.perusteet, peruste => _.includes(EperusteetKoulutustyyppiRyhmat[toteutus], peruste.koulutustyyppi)),
        };
      })
      .filter(ryhma => _.size(ryhma.perusteet) > 0)
      .map(ryhma => {
        return {
          ...ryhma,
          theme: 'koulutustyyppi-' + koulutustyyppiTheme(ryhma.perusteet[0].koulutustyyppi!),
        };
      })
      .value();

    return _.sortBy([
      ...ryhmatPerusteista,
      ...(!this.latestQueryWithNimi ? [this.ammatillinenPerusteRyhma] : []),
    ], ryhma => EperusteetKoulutustyyppiRyhmaSort[ryhma.toteutus]);
  }

  get ammatillinenPerusteRyhma() {
    return {
      toteutus: Toteutus.AMMATILLINEN,
      theme: 'koulutustyyppi-ammatillinen',
      perustemaarat: this.perusteStore.ammatillisetLukumaarat,
      kooste: true,
      route: {
        name: 'ammatillinenSelaus',
        params: {
          koulutustyyppi: koulutustyyppiStateName(Koulutustyyppi.ammattitutkinto),
        },
      },
    };
  }

  get tiedotteet() {
    return this.tiedoteStore.uusimmatTiedotteet;
  }

  get tiedotteetMapped() {
    return _.map(this.tiedotteet, tiedote => {
      return {
        ...tiedote,
        uusi: onkoUusi((tiedote as any).luotu),
      };
    });
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('eperusteet'),
      titleTemplate: null,
    };
  }

  ulkoinenlinkki(peruste) {
    if (uusiJulkinenToteutus(peruste)) {
      return undefined;
    }

    if (koulutustyyppiTheme(peruste.koulutustyyppi) === 'ammatillinen') {
      return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/kooste/${peruste.id}`;
    }
    else {
      return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/${perusteKoulutustyyppiUrlShortParamName(peruste.koulutustyyppi)}/${peruste.id}/tiedot`;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.ylaosa {
  .container {
    padding: 0;

    @media (max-width: 767.98px) {
      max-width: none;
    }

    @media (min-width: 768px) {
      min-height: 335px;
      padding: 25px;
    }
  }

  background-color: $etusivu-header-background;
  background-image: url('../../../public/img/banners/opiskelijat.png');
  background-size: cover;
  background-position: 50% 33%;

  .laatikko {
    padding: 15px;
    color: #000;
    background: #fff;
    opacity: 0.80;

    @media (min-width: 768px) {
      max-width: 400px;
      padding: 20px;
    }

    h1.otsikko {
      font-size: 1.5rem;
      font-weight: bolder;
      margin-bottom: 20px;
    }

    .kuvaus {
      margin-bottom: 0;
    }
  }
}

.container {

  .nimi {
    color: #2B2B2B;
    /deep/ a, div.linkki a {
      color: #2B2B2B;
    }

    .uusi {
      background-color: $blue-lighten-3;
      border-radius: 5px;
      padding: 2px 4px;
      font-size: 0.7rem;
      margin-left: 5px;
    }

  }

  .kaikki-uutiset {
    font-weight: 600;
  }

  .valtakunnallinen {
    border: 1px solid #DADADA;
    margin-bottom: 10px;
    border-radius: 2px;
    width: calc(2 / 3 * 100% - (1 - 1 / 2) * 10px);

    @media (max-width: 991.98px) {
      width: 100%;
    }

    .sisalto {
      height: 100%;
    }

    .nimi {
      overflow-x: auto;
    }

    .raita {
      flex: 0 0 6px;
      min-height: 60px;
      background-color: #368715;
      border-radius: 3px;
      &.koulutustyyppi-ammatillinen {
        background-color: $koulutustyyppi-ammatillinen-color;
      }
      &.koulutustyyppi-esiopetus {
        background-color: $koulutustyyppi-esiopetus-color;
      }
      &.koulutustyyppi-lukio {
        background-color: $koulutustyyppi-lukio-color;
      }
      &.koulutustyyppi-perusopetus {
        background-color: $koulutustyyppi-perusopetus-color;
      }
      &.koulutustyyppi-varhaiskasvatus {
        background-color: $koulutustyyppi-varhaiskasvatus-color;
      }
      &.koulutustyyppi-taiteenperusopetus {
        background-color: $koulutustyyppi-taiteenperusopetus-color;
      }
      &.koulutustyyppi-vapaasivistystyo {
        background-color: $koulutustyyppi-vapaasivistystyo-color;
      }
      &.koulutustyyppi-tutkintoonvalmentava {
        background-color: $koulutustyyppi-tutkintoonvalmentava-color;
      }
    }

    .luotu {
      color: #2b2b2b;
      font-size: 80%;
    }
  }

  .tile-heading {
    margin-bottom: 25px;
  }

  .tile {
    margin: 25px 0 25px 0;

    .box {
      margin-bottom: 1rem;

      .luotu {
        color: #595959;
        font-size: 80%;
      }
    }

  }

}

@media (max-width: 991.98px) {
  .row {
    margin: 0;
  }
  .valtakunnalliset {
    padding-left: 15px;
    padding-right: 15px;
  }

  ::v-deep .filter.query {
    max-width: 100%;
  }

}

</style>
