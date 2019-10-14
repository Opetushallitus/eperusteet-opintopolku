<template>
<ep-spinner v-if="!koulutustyyppi" />
<ep-header v-else>
  <template slot="header">
    {{ $t(koulutustyyppi) }}
  </template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col md="6" class="tile">
          <h4>{{ $t('perusteet') }}</h4>
          <div class="perustebox">
            <div class="peruste" v-for="(peruste, idx) in perusteet" :key="idx">
              <router-link :to="{ name: 'perusteTiedot', params: { perusteId: peruste.id } }"
                           tag="a">
                <div class="nimi d-flex justify-content-center align-items-center">
                  <div class="">
                    {{ $kaanna(peruste.nimi) }}
                  </div>
                </div>
                <div class="kuvaus" v-html="$kaanna(peruste.kuvaus)"></div>
              </router-link>
            </div>
          </div>
        </b-col>
        <b-col md="6" class="tile">
          <h4>{{ $t('tiedotteet') }}</h4>
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
    </b-container>
    <div class="paikalliset">
      <h4>{{ $t('paikalliset-opetussuunnitelmat') }}</h4>
      <div class="opetussuunnitelma" v-for="(ops, idx) in opetussuunnitelmat" :key="idx">
        <div class="d-flex align-items-center">
          <div class="opsicon-wrapper">
            <div class="opsicon"></div>
          </div>
          <div class="nimi flex-fill">
            <div class="ops">
              <router-link :to="{ name: 'ops', params: { 'opsId': ops.id } }">
                {{ $kaanna(ops.nimi) }}
              </router-link>
            </div>
            <div class="organisaatiot">
              <div v-if="ops.toimijat.length > 0">
                <span>{{ $t('toimijat') }}</span>
                <span class="mr-1">:</span>
                <span class="toimijat" v-for="(toimija, tidx) in ops.toimijat" :key="tidx">
                  {{ $kaanna(toimija.nimi) }}<span v-if="tidx < ops.toimijat.length - 1">, </span>
                </span>
              </div>
              <div v-if="ops.oppilaitokset.length > 0">
                <span>{{ $t('oppilaitokset') }}</span>
                <span class="mr-1">:</span>
                <span class="toimijat" v-for="(oppilaitos, tidx) in ops.oppilaitokset" :key="tidx">
                  {{ $kaanna(oppilaitos.nimi) }}<span v-if="tidx < ops.oppilaitokset.length - 1">, </span>
                </span>
              </div>
            </div>
          </div>
          <div class="perusteen-nimi">
          </div>
        </div>
      </div>
    </div>
  </div>
</ep-header>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    EpHeader,
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
  }

  .paikalliset {
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
      }
    }
  }

  .tile {
    padding: 0;

    .perustebox {
      margin-right: 31px;

      .peruste {
        min-height: 310px;
        border: 1px solid #DADADA;
        border-radius: 10px;

        .nimi {
          padding: 0px 30px 0px 30px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          height: 120px;
          background: #0041DC;
          color: white;
          font-size: 22px;
          text-align: center;
        }

        .kuvaus {
          padding: 35px 30px 35px 30px;
        }

      }
    }

    .tiedotebox {
      padding: 35px 30px 35px 30px;
      min-height: 310px;
      border: 1px solid #DADADA;
      border-radius: 10px;

      .tiedote {
        margin-bottom: 15px;

        .aikaleima {
          font-size: smaller;
          color: #555;
        }
      }

    }
  }
}
</style>
