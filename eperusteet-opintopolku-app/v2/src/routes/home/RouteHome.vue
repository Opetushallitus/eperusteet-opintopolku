<template>
<div>
  <div class="ylaosa">
    <div class="container">
      <div class="laatikko">
        <h3 class="otsikko">{{ $t('eperusteet') }}</h3>
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
                {{ $kaanna(tiedote.otsikko) }}
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
                <router-link :to="peruste.$$route">
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
        <div class="valtakunnallinen" v-for="(peruste, idx) in perusteet" :key="idx">
          <div class="d-flex align-items-center">
            <div class="raita"></div>
            <div class="nimi flex-fill">
              <router-link :to="peruste.$$route">
                {{ $kaanna(peruste.nimi) }}
              </router-link>
            </div>
            <div class="luotu">{{ $sd(peruste.luotu) }}</div>
          </div>
        </div>
      </ep-spinner-slot>
    </b-container>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import EpNavigation from '@/components/EpNavigation/EpNavigation.vue';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import { Opetussuunnitelmat } from '@shared/api/ylops';
import { PerusteDto, PerusteHakuDto, TiedoteDto } from '@shared/api/tyypit';
import { PerusteStore } from '@/stores/PerusteStore';
import { Perusteet, Tiedotteet } from '@shared/api/eperusteet';
import { Prop, Component, Vue } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { delay } from '@shared/utils/delay';
import { koulutustyyppiStateName } from '@/utils/perusteet';


function mapRoutes(perusteet: PerusteDto[] | null) {
  return perusteet
    ? _.map(perusteet, peruste => {
      if (!peruste.koulutustyyppi) {
        throw new Error('koulutustyyppi-ei-maaritelty');
      }
      return {
        ...peruste,
        $$route: {
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

  background: #fee; /* TODO: Lisää kuva */

  .laatikko {
    padding: 15px;
    color: #fff;
    background: #1B47AF;

    @media (min-width: 768px) {
      max-width: 406px;
      min-height: 285px;
    }

    h3.otsikko {
      margin-bottom: 47px;
    }
  }
}

.container {
  .valtakunnallinen {
    height: 80px;
    border: 2px solid #DADADA;
    margin-bottom: 5px;
    border-radius: 2px;

    .raita {
      display: block;
      width: 5px;
      height: 50px;
      margin: 15px 20px 15px 15px;
      background-color: #368715;
      border-radius: 3px;
    }

    .luotu {
      color: #878787;
      font-size: 80%;
      margin: 15px 15px 15px 20px;
    }
  }

  .tile-heading {
    margin-bottom: 25px;
  }

  .tile {
    margin: 25px 0 25px 0;

    .box {
      margin-bottom: 15px;

      .luotu {
        color: #878787;
        font-size: 80%;
      }
    }

  }
}

</style>
