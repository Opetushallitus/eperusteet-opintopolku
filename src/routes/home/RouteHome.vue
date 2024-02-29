<template>
<div id="main">
  <div class="ylaosa">
    <div class="container">
      <div class="laatikko">
        <h1 class="otsikko">{{ $t('eperusteet') }}</h1>
        <p>{{ $t('eperusteet-kuvaus') }}</p>
        <p>{{ $t('palvelusta-loydat-myos-ajantasaiset') }}</p>
      </div>
    </div>
  </div>
  <div class="container">
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
  </div>
  <div class="search">
    <div class="container">
      <b-container fluid>
        <section class="section">
          <h2 class="tile-heading">{{ $t('hae-opetus-ja-toteutussuunnitelmia-tai-valtakunnallisia-perusteita') }}</h2>
          <EtusivuHaku :peruste-store="perusteStore"></EtusivuHaku>
        </section>
      </b-container>
    </div>
  </div>
  <div class="container mb-5">
    <b-container fluid>
      <section class="section mt-4">
        <h2 class="tile-heading">{{ $t('etusivu-opetussuunnitelmat-ja-perusteet') }}</h2>
        <div class="d-md-flex flex-wrap justify-content-between">
          <div v-for="(item, idx) in koulutustyyppiItems" :key="idx">
            <KoulutustyyppiTile :tyyppi="item"></KoulutustyyppiTile>
          </div>
        </div>
      </section>

      <section class="section mt-4">
        <h2 class="tile-heading">{{ $t('etusivu-osaaminen-ja-maaraykset') }}</h2>
        <div class="d-md-flex flex-wrap justify-content-between">
          <div v-for="(item, idx) in otherItems" :key="idx">
            <KoulutustyyppiTile :tyyppi="item"></KoulutustyyppiTile>
          </div>
        </div>
      </section>
    </b-container>
  </div>
  <div class="info">
    <div class="container">
      <b-container fluid>
        <section class="section d-md-flex flex-wrap justify-content-between">
          <InfoTile header="tietoa-palvelusta"
                    text="palvelu-info"
                    link-text="tutustu-palveluun"
                    :link="infoLinkit.palvelu">
            <img :src="palveluImage" :alt="$t('tietoa-palvelusta')">
          </InfoTile>
          <InfoTile header="rajapinnat"
                    text="rajapinnat-info"
                    link-text="tutustu-rajapintoihin"
                    :link="infoLinkit.rajapinnat">
            <img :src="rajapintaImage" :alt="$t('rajapinnat')">
          </InfoTile>
        </section>
      </b-container>
    </div>
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
import EtusivuHaku from '@/routes/home/EtusivuHaku.vue';
import KoulutustyyppiTile from '@/routes/home/KoulutustyyppiTile.vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import InfoTile from '@/routes/home/InfoTile.vue';
import kukka from '@assets/img/images/kukka.png';
import rajapinnat from '@assets/img/images/rajapinnat.png';
import { koulutustyyppiLinks, osaaminenJaMaarayksetLinks, otherLinks } from '@/utils/navigointi';

@Component({
  components: {
    InfoTile,
    EpLinkki,
    KoulutustyyppiTile,
    EtusivuHaku,
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

  get digitaalinenOsaaminenPeruste() {
    return _.first(this.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
  }

  get koulutustyyppiItems() {
    return koulutustyyppiLinks();
  }

  get otherItems() {
    return osaaminenJaMaarayksetLinks(this.digitaalinenOsaaminenPeruste?.id);
  }

  get infoLinkit() {
    return otherLinks();
  }

  get palveluImage() {
    return kukka;
  }

  get rajapintaImage() {
    return rajapinnat;
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

.ylaosa {
  .container {
    padding: 0;

    @media (max-width: 767.98px) {
      max-width: none;
    }

    @media (min-width: 768px) {
      min-height: 335px;
      padding-top: 60px;
    }
  }

  background-image: url('~@assets/img/banners/opintopolku/opiskelijat.png');
  background-size: cover;
  background-position: 50% 33%;

  .laatikko {
    margin-left: 15px;
    padding: 15px;
    color: #000;
    background: #fff;
    opacity: 0.80;
    border-radius: 10px;
    box-shadow: 0 5px 10px 1px rgb(0 0 0 / 50%);

    @media (min-width: 768px) {
      max-width: 600px;
      padding: 20px;
    }

    @media (max-width: 767.98px) {
      border-radius: 0;
      box-shadow: unset;
    }

    h1.otsikko {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 15px;
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

.search {
  padding: 20px 0;
  background-color: $paletti-background-light-2;
}

.info {
  padding: 40px 0;
  background-color: $gray-lighten-6;
}

.tile-heading {
  margin-bottom: 25px;
}

@media (max-width: 991.98px) {
  .row {
    margin: 0;
  }
  .section {
    padding-left: 15px;
    padding-right: 15px;
  }

  ::v-deep .filter.query {
    max-width: 100%;
  }
}

</style>
