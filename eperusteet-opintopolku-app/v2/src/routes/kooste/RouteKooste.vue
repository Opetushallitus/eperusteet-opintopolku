<template>
<ep-spinner v-if="!koulutustyyppi" />
<ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
  <template slot="header">
    {{ $t(koulutustyyppi) }}
  </template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col lg="7" class="tile">
          <h2>{{ $t('perusteet') }}</h2>
          <div class="perustebox d-flex flex-wrap" v-if="perusteet">
            <div v-if="perusteet.length === 0">
              {{ $t('perusteita-ei-saatavilla') }}
            </div>
            <div v-else class="peruste" v-for="(peruste, idx) in perusteet" :key="idx">
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
                    <div>
                      {{ peruste.diaarinumero }}
                    </div>
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
          <ep-spinner v-else />
        </b-col>
        <b-col lg="5" class="tile">
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import Paikalliset from './Paikalliset.vue';
import { MurupolkuOsa } from '@/tyypit';

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

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: (this as any).$t('kooste'),
      location: {
        ...this.$route,
      },
    }];
  }

  get koulutustyyppi() {
    return this.perusteKoosteStore.koulutustyyppi;
  }

  get tiedotteet() {
    return this.perusteKoosteStore.tiedotteet;
  }

  get perusteet() {
    return this.perusteKoosteStore.perusteet;
  }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.container {
  .tile {
    // Todo: käytä muuttujia
    @media (max-width: 991.98px) {
      &:not(:first-child) {
        margin-top: 3rem;
      }
    }

    h2 {
      font-weight: bolder;
    }

    .perustebox {
      margin-top: 3rem;

      .peruste {
        border-radius: 10px;
        border: 1px solid #E7E7E7;
        box-shadow: 5px 5px 20px 1px rgba(27,61,142,0.08);
        min-height: 230px;
        //margin: 0 8px 8px 0;
        width: 340px;
        overflow-x: auto;

        @media(max-width: 575.98px) {
          width: 100%;
        }

        .voimaantulo {
          border-top: 1px solid #EBEBEB;
          color: #001A58;
          font-size: smaller;
          height: 40px;
          padding-top: 4px;
          text-align: center;
        }

        .upper {
          height: 180px;
          overflow-y: auto;

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
            hyphens: auto;
            overflow-x: hide;
            overflow: hidden;
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
      margin-top: 3rem;

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
      }
    }
  }
}

.row {
  margin-bottom: 3rem;
}

</style>
