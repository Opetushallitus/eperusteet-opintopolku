<template>
<div id="main">
  <div class="ylaosa">
    <div class="container">
      <div class="laatikko">
        <h1 class="otsikko">{{ $t('tervetuloa-palveluun') }}</h1>
        <p>{{ $t('eperusteet-kuvaus') }}</p>
      </div>
    </div>
  </div>
  <div class="search">
    <div class="container">
      <b-container fluid>
        <section class="section">
          <EpEtusivuHaku :peruste-store="perusteStore"></EpEtusivuHaku>
        </section>
      </b-container>
    </div>
  </div>
  <div class="container">
    <section class="section my-5">
      <h2 class="tile-heading">{{ $t('ajankohtaista') }}</h2>
      <EpSpinnerSlot :is-loading="!tiedotteet">
        <EpJulkiLista :tiedot="tiedotteetMapped" @avaaTieto="avaaTiedote" tieto-maara="5" listaus-tyyppi="none">
          <div slot="eiTietoja">{{$t('ei-tiedotteita')}}</div>
        </EpJulkiLista>
        <div class="nayta-kaikki">
          <EpMaterialIcon size="18px">chevron_right</EpMaterialIcon>
          <a :href="ajankohtaistaUrl()" target="_blank">{{ $t('siirry-ajankohtaista-sivulle') }}</a>
        </div>
      </EpSpinnerSlot>
    </section>
  </div>
  <div class="info">
    <div class="container">
      <b-container fluid>
        <section class="section mt-4">
          <h2 class="tile-heading">{{ $t('valtakunnalliset-perusteet-ja-paikalliset-opetussuunnitelmat') }}</h2>
          <EpSpinner v-if="!julkaistutKoulutustyypit" />
          <div class="d-md-flex flex-wrap justify-content-start">
            <KoulutustyyppiTile :tyyppi="item" v-for="(item, idx) in koulutustyyppiItems" :key="idx" class="mr-3 mb-3"></KoulutustyyppiTile>
          </div>
        </section>

        <section class="section mt-4">
          <h2 class="tile-heading">{{ $t('osaaminen-ja-maaraykset') }}</h2>
          <EpSpinner v-if="!otherItems" />
          <div class="d-md-flex flex-wrap justify-content-start">
            <KoulutustyyppiTile :tyyppi="item" v-for="(item, idx) in otherItems" :key="idx" class="mr-2 mb-2"></KoulutustyyppiTile>
          </div>
        </section>
      </b-container>
    </div>
  </div>
  <div class="container">
    <b-container fluid>
      <section class="section d-md-flex flex-wrap justify-content-start mt-4">
        <InfoTile
          v-for="(infoLink, idx) in infoLinkit"
          :key="'info-' + idx"
          class="mr-2 mb-2"
          :header="infoLink.name"
          :text="infoLink.text"
          :translatedText="infoLink.translatedText"
          :link="infoLink.link"
          :route="infoLink.route"
          :link-text="infoLink.linkText">
        </InfoTile>
      </section>
    </b-container>
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
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpEtusivuHaku from '@/routes/home/EpEtusivuHaku.vue';
import KoulutustyyppiTile from '@/routes/home/KoulutustyyppiTile.vue';
import InfoTile from '@/routes/home/InfoTile.vue';
import { navigoitavatKoulutustyyppiRyhmat, otherLinks, navigoitavatMuutRyhmat } from '@/utils/navigointi';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import { TiedoteDto } from '@shared/api/eperusteet';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';

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

  @Prop({ required: true })
  private tietoapalvelustaStore!: TietoapalvelustaStore;

  @Prop({ required: true })
  private osaamismerkitStore!: OsaamismerkitStore;

  private browserStore = new BrowserStore();

  async mounted() {
    await this.osaamismerkitStore.fetchKategoriat({ poistunut: false });
    const h1 = this.$el.querySelector('h1');
    h1?.setAttribute('tabindex', '-1');
    h1?.focus();
  }

  @Watch('julkaistutKoulutustyypit', { immediate: true })
  async julkaistutKoulutustyypitChange() {
    if (this.julkaistutKoulutustyypit) {
      await this.tiedoteStore.getUusimmat(this.sisaltoKieli, _.map(this.julkaistutKoulutustyypitStore.koulutustyyppiLukumaarat.value, 'koulutustyyppi'));
    }
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
    await this.mounted();
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
          perusteNimi: tiedote.perusteet && tiedote.perusteet.length === 1 ? this.$kaanna(tiedote.perusteet[0].nimi) : null,
          koulutustyyppi: tiedote.koulutustyypit && tiedote.koulutustyypit.length === 1 ? this.$t(tiedote.koulutustyypit[0]) : null,
        };
      })
      .take(this.browserStore.window.value.width > 991 ? 10 : 3)
      .value();
  }

  get digitaalinenOsaaminenPeruste() {
    return _.first(this.julkaistutKoulutustyypitStore.digitaalinenOsaaminen.value);
  }

  get koulutustyyppiItems() {
    return navigoitavatKoulutustyyppiRyhmat(this.julkaistutKoulutustyypitStore.julkaistutKoulutustyypit.value as any);
  }

  get otherItems() {
    return navigoitavatMuutRyhmat(this.osaamismerkitStore.kategoriat.value as any, this.digitaalinenOsaaminenPeruste ?? {});
  }

  get tietoapalvelusta() {
    return this.tietoapalvelustaStore.tietoapalvelusta.value;
  }

  get infoLinkit() {
    return [
      ...(this.tietoapalvelusta ? [this.tietoapalvelusta] : []),
      ...otherLinks(),
    ];
  }

  ajankohtaistaUrl() {
    return `${window.location.origin}/#/${this.sisaltoKieli}/ajankohtaista`;
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
  background-image: url('@assets/img/banners/opintopolku/aallot_etusivu.svg'), url('@assets/img/banners/opintopolku/aallot_etusivu_bg.svg');
  background-position: right top, right top;
  background-repeat: no-repeat, repeat;
  margin-top: -1px;

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
    padding: 15px;
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
    color: $oph-green;
    margin-top: 20px;
    font-weight: 600;

    a {
      color: $oph-green;
    }
  }

  ::v-deep a {
    color: $oph-green;
  }
}

.search {
  padding: 40px 0;
  background-color: $oph-green;
  color: $white;
}

.info {
  padding: 10px 0 70px 0;
  background-color: $table-odd-row-bg-color;
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

::v-deep .content {
  .tieto {
    background-color: unset !important;
    padding-left: 0 !important;
    .otsikko {
      color: $oph-green;
      font-weight: 600;
    }
  }
}
</style>
