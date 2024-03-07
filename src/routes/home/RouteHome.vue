<template>
<div id="main">
  <div class="ylaosa">
    <div class="container">
      <div class="laatikko">
        <h1 class="otsikko">{{ $t('eperusteet') }}</h1>
        <p>{{ $t('eperusteet-kuvaus') }}</p>
        <p>{{ $t('palvelusta-loydat-myos-ajantasaiset-maaraykset') }}</p>
      </div>
    </div>
  </div>
  <div class="container">
    <section class="section my-4">
      <h2 class="tile-heading">{{ $t('ajankohtaista') }}</h2>
      <EpSpinnerSlot :is-loading="!tiedotteet">
        <EpJulkiLista :tiedot="tiedotteetMapped" @avaaTieto="avaaTiedote" tieto-maara="5" listaus-tyyppi="none">
          <div slot="eiTietoja">{{$t('ei-tiedotteita')}}</div>
        </EpJulkiLista>
        <div class="nayta-kaikki">
          <EpMaterialIcon size="18px">chevron_right</EpMaterialIcon>
          <router-link :to="{ name: 'uutiset' }">
            {{ $t('nayta-kaikki') }}
          </router-link>
        </div>
      </EpSpinnerSlot>
    </section>
  </div>
  <div class="search">
    <div class="container">
      <b-container fluid>
        <section class="section">
          <h2 class="tile-heading">{{ $t('hae-opetus-ja-toteutussuunnitelmia-tai-valtakunnallisia-perusteita') }}</h2>
          <EpEtusivuHaku :peruste-store="perusteStore"></EpEtusivuHaku>
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
<!--          <InfoTile header="tietoa-palvelusta"-->
<!--                    text="palvelu-info"-->
<!--                    link-text="tutustu-palveluun"-->
<!--                    :link="infoLinkit.palvelu.link">-->
<!--            <img :src="palveluImage" :alt="$t('tietoa-palvelusta')">-->
<!--          </InfoTile>-->
          <InfoTile header="rajapinnat"
                    text="rajapinnat-info"
                    link-text="tutustu-rajapintoihin"
                    :link="infoLinkit.rajapinnat.link">
            <img :src="rajapintaImage" :alt="$t('rajapinnat')">
          </InfoTile>
          <InfoTile header="koulutuksiin-haku"
                    text="koulutuksiin-haku-info"
                    link-text="siirry-opintopolkuun"
                    :link="infoLinkit.koulutus.link">
            <img :src="koulutuksiinHakuImage" :alt="$t('koulutuksiin-haku')" class="mt-5 mb-5">
          </InfoTile>
        </section>
      </b-container>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { Meta } from '@shared/utils/decorators';
import { Kielet } from '@shared/stores/kieli';
import { onkoUusi } from '@shared/utils/tiedote';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpEtusivuHaku from '@/routes/home/EpEtusivuHaku.vue';
import KoulutustyyppiTile from '@/routes/home/KoulutustyyppiTile.vue';
import InfoTile from '@/routes/home/InfoTile.vue';
import tietoapalvelusta from '@assets/img/banners/opintopolku/tietoapalvelusta.svg';
import rajapinnat from '@assets/img/banners/opintopolku/rajapinnat.svg';
import koulutuksiinHaku from '@assets/img/banners/opintopolku/opintopolku.svg';
import { koulutustyyppiLinks, osaaminenJaMaarayksetLinks, otherLinks } from '@/utils/navigointi';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { TiedoteDto } from '@shared/api/eperusteet';

@Component({
  components: {
    EpJulkiLista,
    InfoTile,
    KoulutustyyppiTile,
    EpEtusivuHaku,
    EpSpinnerSlot,
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

  avaaTiedote(tiedote: TiedoteDto) {
    this.$router.push({
      name: 'uutinen',
      params: {
        tiedoteId: '' + tiedote.id,
      },
    });
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
    return tietoapalvelusta;
  }

  get rajapintaImage() {
    return rajapinnat;
  }

  get koulutuksiinHakuImage() {
    return koulutuksiinHaku;
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
  background-image: url('~@assets/img/banners/opintopolku/aalto_etusivu.svg'), url('~@assets/img/banners/opintopolku/header_bg_repeat_etusivu.svg');
  background-position: right top, right top;
  background-repeat: no-repeat, repeat;

  @media (max-width: 767.98px) {
    background-blend-mode: color-burn;
  }

  .container {
    padding: 0;

    @media (max-width: 767.98px) {
      max-width: none;
    }

    @media (min-width: 768px) {
      min-height: 315px;
      padding-top: 60px;
    }
  }

  .laatikko {
    margin-left: 15px;
    color: $black;
    max-width: 600px;

    h1.otsikko {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 15px;
    }
  }
}

.container {
  .nayta-kaikki {
    color: #3367E3;
    margin-top: 10px;
    font-weight: 600;
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
