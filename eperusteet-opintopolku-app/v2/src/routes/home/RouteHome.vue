<template>
<div>
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
        <b-col md="6" class="tile">
          <h2 class="tile-heading">{{ $t('uutisia') }}</h2>
          <ep-spinner-slot :is-loading="!tiedotteet">
            <div class="box" v-for="(tiedote, idx) in tiedotteet" :key="idx">
              <div class="nimi">
                <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
                  {{ $kaanna(tiedote.otsikko) }}
                </router-link>
              </div>
              <div class="luotu">{{ $sd(tiedote.luotu) }}</div>
            </div>
            <div class="box">
              <div class="nimi">
                <router-link :to="{ name: 'uutiset' }">
                  {{ $t('nayta-kaikki-uutiset') }}
                </router-link>
              </div>
            </div>
          </ep-spinner-slot>
        </b-col>

        <b-col md="6" class="tile">
          <h2 class="tile-heading">{{ $t('uusimmat-eperusteet') }}</h2>
          <ep-spinner-slot :is-loading="!uusimmat">
            <div class="box" v-for="(peruste, idx) in uusimmat" :key="idx">
              <div class="nimi">
                <router-link :to="peruste.route">
                  {{ $kaanna(peruste.nimi) }}
                </router-link>
              </div>
              <div class="luotu">{{ $sd(peruste.paatospvm) }}</div>
            </div>
          </ep-spinner-slot>
        </b-col>
      </b-row>

      <h2 class="tile-heading">{{ $t('valtakunnalliset-eperusteet') }}</h2>
      <ep-spinner-slot :is-loading="!perusteet">
        <div class="d-flex flex-wrap justify-content-between">
          <div class="valtakunnallinen" v-for="(peruste, idx) in perusteet" :key="idx">
            <div class="d-flex justify-content-between align-content-stretch">
              <div class="raita mx-3 my-2" :class="peruste.theme"></div>
              <div class="nimi flex-fill my-3 mr-3">
                <router-link :to="peruste.route">
                  {{ $kaanna(peruste.nimi) }}
                </router-link>
                <div class="luotu">{{ $t('voimaantulo-pvm')}}: {{ $sd(peruste.luotu) }}</div>
              </div>
            </div>
          </div>
        </div>
      </ep-spinner-slot>
    </b-container>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import { PerusteDto } from '@shared/api/tyypit';
import { PerusteStore } from '@/stores/PerusteStore';
import { Prop, Component, Vue } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { koulutustyyppiStateName } from '@shared/utils/perusteet';
import { Meta } from '@shared/utils/decorators';


function mapRoutes(perusteet: PerusteDto[] | null) {
  return perusteet
    ? _.map(perusteet, peruste => {
      if (!peruste.koulutustyyppi) {
        throw new Error('koulutustyyppi-ei-maaritelty');
      }
      return {
        ...peruste,
        route: {
          name: 'kooste',
          params: {
            koulutustyyppi: koulutustyyppiStateName(peruste.koulutustyyppi),
          },
        }
      };
    })
    : null;
}


@Component({
  components: {
    EpSpinnerSlot,
  },
})
export default class RouteHome extends Vue {
  @Prop({ required: true })
  private perusteStore!: PerusteStore;

  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;

  get perusteet() {
    return mapRoutes(this.perusteStore.perusteet);
  }

  get uusimmat() {
    return mapRoutes(this.perusteStore.uusimmat);
  }

  get tiedotteet() {
    return this.tiedoteStore.uusimmatTiedotteet;
  }

  async mounted() {
    this.perusteStore.getYleisetPerusteet();
    this.perusteStore.getUusimmat();
    this.tiedoteStore.getUusimmat();
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.$t('eperusteet'),
      titleTemplate: null,
    };
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

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

  background-color: $etusivu-header-background; /* TODO: Lisää kuva */
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
  .valtakunnallinen {
    min-height: 80px;
    border: 1px solid #DADADA;
    margin-bottom: 10px;
    border-radius: 2px;
    width: calc(1 / 2 * 100% - (1 - 1 / 2) * 10px);

    @media (max-width: 991.98px) {
      width: 100%;
    }

    .nimi {
      overflow-x: auto;
    }

    .raita {
      flex: 0 0 5px;
      min-height: 60px;
      background-color: #368715;
      border-radius: 3px;
    }

    .luotu {
      color: #878787;
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
        color: #878787;
        font-size: 80%;
      }
    }

  }
}

</style>
