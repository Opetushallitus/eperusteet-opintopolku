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
      <section class="section my-4">
        <h2 class="tile-heading">{{ $t('ajankohtaista') }}</h2>
        <ep-spinner-slot :is-loading="!tiedotteet">
          <b-row>
            <b-col lg="6" md="12" class="mb-3" v-for="(tiedote, idx) in tiedotteetMapped" :key="idx">
              <div class="nimi">
                <router-link :to="{ name: 'uutinen', params: { tiedoteId: tiedote.id } }">
                  {{ $kaanna(tiedote.otsikko) }} <span class="uusi" v-if="tiedote.uusi">{{$t('uusi')}}</span>
                </router-link>
              </div>
              <div class="luotu">{{ $sd(tiedote.luotu) }}</div>
            </b-col>
          </b-row>
          <div class="box">
            <div class="kaikki-uutiset">
              <router-link :to="{ name: 'uutiset' }">
                {{ $t('nayta-kaikki') }}
              </router-link>
            </div>
          </div>
        </ep-spinner-slot>
      </section>

      <section class="section">
        <h2 class="tile-heading">{{ $t('hae-opetus-ja-toteutussuunnitelmia-tai-valtakunnallisia-perusteita') }}</h2>
        <EpMasterHakuLista :peruste-store="perusteStore"></EpMasterHakuLista>
      </section>
    </b-container>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import { PerusteStore } from '@/stores/PerusteStore';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { Meta } from '@shared/utils/decorators';
import { Kielet } from '@shared/stores/kieli';
import { onkoUusi } from '@shared/utils/tiedote';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpMasterHakuLista from '@/routes/home/EpMasterHakuLista.vue';

@Component({
  components: {
    EpMasterHakuLista,
    EpSpinnerSlot,
    EpExternalLink,
  },
})
export default class RouteHome extends Vue {
  @Prop({ required: true })
  private perusteStore!: PerusteStore;

  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;

  @Prop({ required: true })
  private julkaistutKoulutustyypitStore!: JulkaistutKoulutustyypitStore;

  private browserStore = new BrowserStore();

  async mounted() {
    await this.fetchAll();
  }

  async fetchAll() {
    this.tiedoteStore.getUusimmat(this.sisaltoKieli, this.julkaistutKoulutustyypit);
  }

  get julkaistutKoulutustyypit() {
    return this.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value;
  }

  @Watch('sisaltoKieli')
  async sisaltoKieliChange() {
    await this.fetchAll();
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get tiedotteet() {
    return this.tiedoteStore.uusimmatTiedotteet;
  }

  get tiedotteetMapped() {
    return _.chain(this.tiedotteet)
      .map(tiedote => {
        return {
          ...tiedote,
          uusi: onkoUusi((tiedote as any).luotu),
        };
      })
      .take(this.browserStore.window.value.width > 991 ? 10 : 3)
      .value();
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
  background-image: url('~@assets/img/banners/opintopolku/opiskelijat.png');
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

    ::v-deep a, div.linkki a {
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

@media (max-width: 991.98px) {
  .row {
    margin: 0;
  }
  .section {
    padding-left: 15px;
    padding-right: 15px;
    background: $blue-lighten-10;
  }

  ::v-deep .filter.query {
    max-width: 100%;
  }
}

</style>
