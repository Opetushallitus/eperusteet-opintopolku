<template>
<ep-spinner v-if="!koulutustyyppi" />
<ep-header :murupolku="[]" :koulutustyyppi="koulutustyyppi" v-else>
  <template slot="header">
    {{ $t(koulutustyyppi) }}
  </template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col lg="8" class="tile">
          <h2>{{ $t('perusteet') }}</h2>
          <div class="perustebox d-flex">
            <div class="peruste" v-for="(peruste, idx) in perusteet" :key="idx">
              <div class="upper">
                <div class="peruste-ikoni">
                  <img src="../../../public/img/icons/hallitus.svg" :alt="$t('peruste')" style="fill: #0041DC" />
                </div>
                <div class="nimi">
                  <router-link :to="{ name: 'peruste', params: { perusteId: peruste.id } }">
                    {{ $kaanna(peruste.nimi) }}
                  </router-link>
                </div>
              </div>
              <div class="voimaantulo-viiva"></div>
              <div>
                <div class="d-flex align-items-center justify-content-center">
                  <div class="voimaantulo">
                    {{ $t('voimaantulo') }}:
                    {{ $sd(peruste.voimaantulopvm) }}
                  </div>
                </div>
              </div>
              <!-- <router-link :to="{ name: 'perusteTiedot', params: { perusteId: peruste.id } }" -->
              <!--              tag="a">                                                           -->
              <!--   <div class="nimi d-flex justify-content-center align-items-center">           -->
              <!--     <div class="">                                                              -->
              <!--       {{ $kaanna(peruste.nimi) }}                                               -->
              <!--     </div>                                                                      -->
              <!--   </div>                                                                        -->
              <!--   <div class="kuvaus" v-html="$kaanna(peruste.kuvaus)"></div>                   -->
              <!-- </router-link>                                                                  -->
            </div>
          </div>
        </b-col>
        <b-col lg="4" class="tile">
          <h2>{{ $t('tiedotteet') }}</h2>
          <div class="tiedotebox">
            <div v-if="tiedotteet">
              <div v-if="tiedotteet.length === 0">
                {{ $t('ei-tiedotteita') }}
              </div>
              <div v-else>
                <div class="tiedote" v-for="(tiedote, idx) in tiedotteet" :key="idx">
                  <div class="otsikko">
                    <router-link :to="{ name: 'uutiset', params: { uutinenId: tiedote.id } }">
                      {{ $kaanna(tiedote.otsikko) }}
                    </router-link>
                  </div>
                  <div class="aikaleima">
                    {{ $ld(tiedote.luotu) }}
                  </div>
                </div>
              </div>
            </div>
            <ep-spinner v-else />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <paikalliset :peruste-kooste-store="perusteKoosteStore" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</ep-header>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import Paikalliset from './Paikalliset.vue';
import _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    Paikalliset,
  },
})
export default class RouteKooste extends Vue {
  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  get koulutustyyppi() {
    return this.perusteKoosteStore.koulutustyyppi;
  }

  get tiedotteet() {
    return this.perusteKoosteStore.tiedotteet;
  }

  get perusteet() {
    return this.perusteKoosteStore.perusteet;
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
      .value();
  }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.container {
  .paikalliset {
    margin-top: 31px;

    h2.otsikko {
      font-weight: bolder;
      margin-bottom: 43px;
      font-size: 29px;
    }
  }

  .paikalliset {
    margin: 0 10px 10px 10px;

    .peruste-nav {
      .peruste {
        color: #575757;
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

  .tile {
    margin-top: 31px;

    h2 {
      font-weight: bolder;
    }

    .perustebox {
      margin-top: 43px;

      .peruste {
        border-radius: 10px;
        border: 1px solid #E7E7E7;
        box-shadow: 5px 5px 20px 1px rgba(27,61,142,0.08);
        height: 230px;
        width: 192px;
        margin-right: 8px;

        .voimaantulo-viiva {
          width: 152px;
        }

        .voimaantulo {
          border-top: 1px solid #EBEBEB;
          color: #001A58;
          font-size: 15px;
          height: 40px;
          padding-top: 4px;
          text-align: center;
        }

        .upper {
          height: 180px;

          .peruste-ikoni {
            color: #0041DC;
            text-align: center;

            img {
              margin: 20px;
              height: 32px;
              width: 32px;
            }
          }

          .nimi {
            width: 100%;
            padding: 12px;
            padding-top: 0;
            font-weight: bold;
            text-align: center;
          }
        }
      }
    }

    .tiedotebox {
      margin-top: 43px;
      min-height: 310px;

      .tiedote {
        margin-bottom: 15px;
        padding: 5px;

        &:nth-child(odd) {
          background-color: #F9F9F9;
        }

        .aikaleima {
          font-size: smaller;
          color: #555;
        }
      }
    }
  }
}
</style>
