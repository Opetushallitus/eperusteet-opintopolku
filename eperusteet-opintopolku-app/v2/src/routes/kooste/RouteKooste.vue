<template>
<ep-spinner v-if="!koulutustyyppi" />
<ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi" v-else>
  <template slot="header">
    {{ $t(koulutustyyppi) }}
  </template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col xl="7" class="tile">
          <h2 class="otsikko">{{ $t('perusteet') }}</h2>
          <div class="perustebox d-flex flex-wrap justify-content-between" v-if="perusteet">
            <div v-if="perusteet.length === 0">
              {{ $t('perusteita-ei-saatavilla') }}
            </div>
              <div v-else class="peruste tile-background-shadow-selected" v-for="(peruste, idx) in perusteet" :key="idx">
                <router-link v-if="!peruste.ulkoinenlinkki" :to="{ name: 'peruste', params: { perusteId: peruste.id } }">
                  <peruste-tile :peruste="peruste" :koulutustyyppi="koulutustyyppi"></peruste-tile>
                </router-link>
                <ep-external-link v-else :url="peruste.ulkoinenlinkki" :showIcon="false">
                  <peruste-tile :peruste="peruste" :koulutustyyppi="koulutustyyppi"></peruste-tile>
                </ep-external-link>
              </div>
          </div>
          <ep-spinner v-else />
        </b-col>
        <b-col xl="5" class="tile">
          <h2 class="otsikko">{{ $t('tiedotteet') }}</h2>
          <div class="tiedotebox">
            <div v-if="tiedotteet">
              <div v-if="tiedotteet.length === 0">
                {{ $t('ei-tiedotteita') }}
              </div>
              <div v-else>
                <div class="tiedote" v-for="(tiedote, idx) in tiedotteet" :key="idx">
                  <div class="otsikko">
                    <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
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
import PerusteTile from './PerusteTile.vue';
import { MurupolkuOsa } from '@/tyypit';
import { Meta } from '@shared/utils/decorators';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import { KoulutustyyppiToteutus } from '../../../eperusteet-frontend-utils/vue/src/tyypit';
import { perusteKoulutustyyppiUrlShortParamName } from '../../../eperusteet-frontend-utils/vue/src/utils/perusteet';
import _ from 'lodash';
import { ENV_PREFIX } from '@shared/utils/defaults';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    Paikalliset,
    EpExternalLink,
    PerusteTile,
  },
})
export default class RouteKooste extends Vue {
  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  get murupolku(): Array<MurupolkuOsa> {
    return [{
      label: this.koulutustyyppi,
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
    return _.chain(this.perusteKoosteStore.perusteet)
      .map(peruste => ({
        ...peruste,
        ulkoinenlinkki: this.ulkoinenlinkki(peruste)
      }))
      .value();
  }

  ulkoinenlinkki(peruste) {

    if (peruste.toteutus === KoulutustyyppiToteutus.yksinkertainen.valueOf()
        || peruste.toteutus === KoulutustyyppiToteutus.lops2019.valueOf()) {
      return undefined;
    }

    return `${ENV_PREFIX}/#/${this.$route.params.lang || 'fi'}/${perusteKoulutustyyppiUrlShortParamName(peruste.koulutustyyppi)}/${peruste.id}/tiedot`;
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t(this.koulutustyyppi),
    };
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

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

      .peruste {
        border-radius: 10px;
        border: 1px solid #E7E7E7;
        box-shadow: 5px 5px 20px 1px rgba(27,61,142,0.08);
        min-height: 230px;
        overflow-x: auto;

        margin-bottom: 10px;
        width: calc(1 / 2 * 100% - (1 - 1 / 2) * 10px);
        // width: 343px;
        // height: 172px;

        @media(max-width: 648.98px) {
          width: 100%;
          margin-left: 0;
          margin-right: 0;
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

    .tile-background-shadow-selected:hover, .tile-background-shadow-selected:focus {
      box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
    }
  }
}

.row {
  margin-bottom: 3rem;
}

</style>
