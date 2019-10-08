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
              <div class="nimi d-flex justify-content-center align-items-center">
                <div class="">
                  {{ $kaanna(peruste.nimi) }}
                </div>
              </div>
              <div class="kuvaus" v-html="$kaanna(peruste.kuvaus)"></div>
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
        <div class="nimi">
          {{ $kaanna(ops.nimi) }}
        </div>
        <div class="organisaatiot">
          <div class="toimijat" v-if="ops.toimijat.length > 0">
            <span>{{ $t('toimijat') }}</span>
            <span class="mr-1">:</span>
            <span v-for="(toimija, tidx) in ops.toimijat" :key="tidx">
              {{ $kaanna(toimija.nimi) }}
            </span>
          </div>
          <div class="oppilaitokset" v-if="ops.oppilaitokset.length > 0">
            <span>{{ $t('oppilaitokset') }}</span>
            <span class="mr-1">:</span>
            <span v-for="(oppilaitos, tidx) in ops.oppilaitokset" :key="tidx">
              {{ $kaanna(oppilaitos.nimi) }}
            </span>
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
