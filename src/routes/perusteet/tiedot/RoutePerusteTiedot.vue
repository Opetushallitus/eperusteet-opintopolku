<template>
  <div class="content">
    <h2 class="otsikko mb-4" tabindex="-1">
      {{ $t(koulutustyyppiKohtaisetKaannokset.perusteentiedot) }}
    </h2>
    <div class="row">
      <div class="col-md-12" v-if="peruste.nimi">
        <ep-form-content :name="koulutustyyppiKohtaisetKaannokset.perusteennimi" headerType="h3" headerClass="h6">
          <div>{{$kaanna(peruste.nimi)}} <span v-if="peruste.laajuus">{{peruste.laajuus}} {{$t('osaamispiste')}}</span></div>
        </ep-form-content>
      </div>
      <template v-if="isAmmatillinen">
        <div class="col-md-12" v-if="peruste.diaarinumero">
          <ep-form-content name="maarayksen-diaarinumero" headerType="h3" headerClass="h6">
            <ep-field v-model="peruste.diaarinumero"></ep-field>
          </ep-form-content>
        </div>
        <div class="col-md-12" v-if="peruste.paatospvm">
          <ep-form-content name="maarayksen-paatospaivamaara" headerType="h3" headerClass="h6">
            <ep-datepicker v-model="peruste.paatospvm"></ep-datepicker>
          </ep-form-content>
        </div>
      </template>
      <div class="col-md-12" v-if="peruste.voimassaoloAlkaa" >
        <ep-form-content name="voimaantulo-pvm" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="peruste.voimassaoloAlkaa"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.voimassaoloLoppuu">
        <ep-form-content name="voimassaolo-paattymispvm" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="peruste.voimassaoloLoppuu"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.siirtymaPaattyy">
        <ep-form-content name="siirtyman-paattyminen" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="peruste.siirtymaPaattyy"></ep-datepicker>
          <p class="help">{{ $t('siirtyman-kuvaus') }}</p>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="dokumentti !== ''">
        <ep-form-content :name="dokumenttiKielistykset.otsikko" headerType="h3" headerClass="h6" class="text-left">
          <EpSpinner class="d-inline-block" v-if="!dokumentti"/>
          <div class="pl-2" v-else>
            <EpPdfLink :url="dokumentti">{{ $t(dokumenttiKielistykset.linkki) }}</EpPdfLink>
          </div>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasMaaraykset">
        <ep-form-content name="maaraykset" headerType="h3" headerClass="h6">

          <div v-for="maarays in maaraykset" :key="'maarays'+maarays.id" class="taulukko-rivi-varitys px-2 py-3">
            <EpPdfLink v-if="maarays.url" :url="maarays.url">{{ $kaanna(maarays.nimi) }}</EpPdfLink>
            <router-link v-else :to="{ name: 'maarays', params: { maaraysId: maarays.id } }">{{ $kaanna(maarays.nimi) }}</router-link>
            <div class="mt-2">
              <span v-if="maarays.voimassaoloAlkaa">{{ $t('voimaantulo')}}: {{ $sd(maarays.voimassaoloAlkaa)}}</span>
              <span v-if="maarays.voimassaoloAlkaa && maarays.diaarinumero" class="px-2">|</span>
              <span v-if="maarays.diaarinumero">{{ $t('diaarinumero')}}: {{ maarays.diaarinumero }}</span>
            </div>
          </div>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasKorvattavatDiaarinumerot">
        <ep-form-content :name="koulutustyyppiKohtaisetKaannokset.korvattavatperusteet" headerType="h3" headerClass="h6">
          <b-table striped
                   fixed
                   responsive
                   hover
                   :fields="korvattavatDiaarinumerotFields"
                   :items="korvaavatPerusteet">
            <template v-slot:cell(perusteet)="data">
              <div v-if="data.item.perusteet.length > 0">
                <div v-for="(peruste, idx) in data.item.perusteet" :key="idx">
                  <router-link :to="{ name: 'perusteTiedot', params: { perusteId: peruste.id } }">
                    {{ $kaanna(peruste.nimi) }}
                  </router-link>
                </div>
              </div>
              <div v-else class="font-italic">
                {{ $t('peruste-saatavilla-opetushallituksen-arkistosta') }}
              </div>
            </template>
          </b-table>
        </ep-form-content>
      </div>

      <div class="col-md-12" v-if="kaannokset && kaannokset.length > 0">
        <ep-form-content name="saamen-kielelle-kaannetyt-perusteet" headerType="h3" headerClass="h6">
          <div v-for="(kaannos, idx) in kaannokset" :key="idx">
            <a :href="kaannos.url" target="_blank" rel="noopener noreferrer">{{ kaannos.nimi }}</a>
          </div>
        </ep-form-content>
      </div>

      <div v-if="isAmmatillinen">

        <div class="col-md-12 mt-3" v-if="showKoulutusvienninOhje">
          <ep-form-content name="koulutusviennin-ohje" headerType="h3" headerClass="h6">
            <span v-if="isEiTarvitaOhjettaTyyppi">{{$t('voi-kayttaa-tutkintoviennissa')}}</span>
            <span v-else-if="isEiVoiPoiketaTyyppi">{{$t('ei-voi-poiketa-tutkinnon-perusteista-tutkintoviennin-yhteydessa')}}</span>

            <div v-if="isKoulutusvientiliiteTyyppi && koulutusvienninOhjeet && koulutusvienninOhjeet.length > 0">
              <b-table striped
                       fixed
                       responsive
                       :fields="koulutusvienninohjeFields"
                       :items="koulutusvienninOhjeet">
                <template v-slot:cell(nimi)="{ item }">
                  <a :href="item.url" target="_blank" rel="noopener noreferrer">{{item.nimi}}</a>
                </template>
              </b-table>
            </div>

            <ep-form-content v-if="peruste.poikkeamismaaraysTarkennus" name="tarkennus" headerClass="h6" class="ml-3 mt-3">
              <ep-content-viewer :value="$kaanna(peruste.poikkeamismaaraysTarkennus)"/>
            </ep-form-content>
          </ep-form-content>
        </div>

        <div class="col-md-12 mt-3" v-if="peruste.koulutukset && peruste.koulutukset.length > 0">
          <ep-form-content name="koulutuskoodit" headerType="h3" headerClass="h6">
            <b-table striped
                    fixed
                    responsive
                    hover
                    :fields="koulutuskooditFields"
                    :items="peruste.koulutukset">
            </b-table>
          </ep-form-content>
        </div>

        <div class="col-md-12 mt-3" v-if="peruste.osaamisalat && peruste.osaamisalat.length > 0">
          <ep-form-content name="osaamisalat" headerType="h3" headerClass="h6">
            <b-table striped
                    fixed
                    responsive
                    hover
                    :fields="osaamisalatFields"
                    :items="peruste.osaamisalat">
            </b-table>
          </ep-form-content>
        </div>

        <div class="col-md-12 mt-3" v-if="peruste.tutkintonimikkeet && peruste.tutkintonimikkeet.length > 0">
          <ep-form-content name="tutkintonimikkeet" headerType="h3" headerClass="h6">
            <b-table striped
                    fixed
                    responsive
                    hover
                    :fields="tutkintonimikkeetFields"
                    :items="peruste.tutkintonimikkeet">
            </b-table>
          </ep-form-content>
        </div>

        <div class="col-md-12 mt-3" v-if="peruste.suorittaneenOsaaminen">
          <ep-form-content name="suorittaneen-osaaminen" headerType="h3" headerClass="h6">
            <ep-content-viewer :value="$kaanna(peruste.suorittaneenOsaaminen)"
                :termit="termit"
                :kuvat="kuvat" />
          </ep-form-content>
        </div>

        <div class="col-md-12 mt-3" v-if="peruste.tyotehtavatJoissaVoiToimia">
          <ep-form-content name="tyotehtavat-joissa-voi-toimia" headerType="h3" headerClass="h6">
            <ep-content-viewer :value="$kaanna(peruste.tyotehtavatJoissaVoiToimia)"
                :termit="termit"
                :kuvat="kuvat" />
          </ep-form-content>
        </div>

        <div class="col-md-12" v-if="osaamisalaKuvaukset && osaamisalaKuvaukset.length > 0">
          <ep-form-content name="osaamisalojen-kuvaukset" headerType="h3" headerClass="h6">
            <div v-for="(osaamisalakuvaus, index) in osaamisalaKuvaukset" :key="'osaamisalakuvaus'+index">
              <h4>{{$kaanna(osaamisalakuvaus.nimi)}}</h4>
              <ep-content-viewer :value="$kaanna(osaamisalakuvaus.teksti)"
                  :termit="termit"
                  :kuvat="kuvat" />
            </div>
          </ep-form-content>
        </div>
      </div>

      <div v-if="isAmmatillinen && !isOpas" class="col-md-12">
        <ep-form-content name="englanninkieliset-sisallot" headerType="h3" headerClass="h6">
          <router-link :to="{name: 'perusteKoosteEng'}">
            <span>{{ $t('katso-tutkinnon-englanninkieliset-sisallot') }}</span>
          </router-link>
        </ep-form-content>
      </div>

      <div class="col-md-12" v-if="kvliitteita">
        <ep-form-content name="kv-liitteet" headerType="h3" headerClass="h6">
          <EpPdfLink v-if="kvliitteet['fi']" :url="kvliitteet['fi']">{{ $t('lataa-kvliite-fi') }}</EpPdfLink>
          <EpPdfLink v-if="kvliitteet['sv']" :url="kvliitteet['sv']">{{ $t('lataa-kvliite-sv') }}</EpPdfLink>
          <EpPdfLink v-if="kvliitteet['en']" :url="kvliitteet['en']">{{ $t('lataa-kvliite-en') }}</EpPdfLink>
        </ep-form-content>
      </div>

      <div class="col-md-12" v-if="!isOpas">
        <ep-form-content name="muutoshistoria" headerType="h3" headerClass="h6">
          <router-link :to="{ name: 'perusteMuutoshistoria' }">
            <span>{{ $t('katsele-perusteen-muutoshistoriaa') }}</span>
          </router-link>
        </ep-form-content>
      </div>
    </div>
    <slot name="previous-next-navigation" />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component, Watch } from 'vue-property-decorator';
import { baseURL, LiiteDtoTyyppiEnum, LiitetiedostotParam, PerusteKaikkiDtoTyyppiEnum } from '@shared/api/eperusteet';
import { isKoulutustyyppiAmmatillinen, isKoulutustyyppiPdfTuettuOpintopolku, isYleissivistavaKoulutustyyppi } from '@shared/utils/perusteet';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';

@Component({
  components: {
    EpFormContent,
    EpField,
    EpDatepicker,
    EpSpinner,
    EpContentViewer,
    EpExternalLink,
  },
})
export default class RoutePerusteTiedot extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  @Watch('kieli')
  async onKieliChange() {
    await this.perusteDataStore.getDokumentti();
  }

  get isAmmatillinen() {
    return this.peruste && isKoulutustyyppiAmmatillinen(this.peruste.koulutustyyppi!);
  }

  get isOpas() {
    return this.peruste?.tyyppi === _.toLower(PerusteKaikkiDtoTyyppiEnum.OPAS);
  }

  get korvaavatPerusteet() {
    const perusteetByDiaarinumero = _.groupBy(this.perusteDataStore.korvaavatPerusteet, 'diaarinumero');
    return _.map(this.peruste?.korvattavatDiaarinumerot, diaarinumero => ({
      diaarinumero,
      perusteet: perusteetByDiaarinumero[diaarinumero] || [],
    }));
  }

  get peruste() {
    return this.perusteDataStore.peruste;
  }

  get kvliitteita() {
    return _.some(UiKielet, uiKieli => {
      return this.perusteDataStore.kvLiitteet[uiKieli];
    });
  }

  get kvliitteet() {
    return this.perusteDataStore.kvLiitteet;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get julkaisut() {
    return this.perusteDataStore.julkaisut;
  }

  get liitteet() {
    return _.map(this.perusteDataStore.liitteet, kvo => (
      {
        ...kvo,
        url: baseURL + LiitetiedostotParam.getLiite(this.peruste!.id!, kvo.id!).url,
      }
    ));
  }

  get koulutusvienninOhjeet() {
    return _.filter(this.liitteet, liite => liite.tyyppi === _.toLower(LiiteDtoTyyppiEnum.KOULUTUSVIENNINOHJE));
  }

  get kaannokset() {
    return _.filter(this.liitteet, liite => liite.tyyppi === _.toLower(LiiteDtoTyyppiEnum.KAANNOS));
  }

  get osaamisalaKuvaukset() {
    return _.chain((this.peruste?.suoritustavat as any[]))
      .map(suoritustapa => this.perusteDataStore.osaamisalaKuvaukset[suoritustapa.suoritustapakoodi!])
      .map(suoritustavanOsaamisalakuvaukset => _.values(suoritustavanOsaamisalakuvaukset))
      .flatMap()
      .flatMap()
      .value();
  }

  get hasMaaraykset() {
    return !_.isEmpty(this.maaraykset);
  }

  get maaraykset() {
    return _.sortBy([
      ...this.maarayskokoelmanMuutosmaaraykset,
      ...this.perusteenMuutosmaaraykset,
      ...this.perusteenMaarays,
      ...(this.julkaisujenMuutosMaaraykset),
    ], (maarays: any) => maarays.voimassaoloAlkaa || 0).reverse();
  }

  get perusteenMaarays() {
    if (this.perusteDataStore?.maarays) {
      return [{
        ...this.perusteDataStore.maarays,
        voimassaoloAlkaa: _.size(this.perusteDataStore?.maarays?.korvattavatMaaraykset) > 0 || _.size(this.perusteDataStore.maarays?.muutettavatMaaraykset) > 0 ? this.perusteDataStore.maarays?.voimassaoloAlkaa : null,
      }];
    }

    if (_.has(this.peruste?.maarayskirje?.liitteet, this.kieli)) {
      const maaryskirje = this.peruste?.maarayskirje?.liitteet![this.kieli];
      return [{
        ...maaryskirje,
        url: baseURL + LiitetiedostotParam.getLiite(this.peruste!.id!, maaryskirje!.id!).url,
      }];
    }

    return [];
  }

  get maarayskokoelmanMuutosmaaraykset() {
    return _.chain(this.perusteDataStore.muutosmaaraykset)
      .sortBy('voimassaoloAlkaa')
      .reverse()
      .value();
  }

  get perusteenMuutosmaaraykset() {
    return _.chain(this.peruste?.muutosmaaraykset)
      .filter(muutosmaarays => _.has(muutosmaarays.liitteet, this.kieli))
      .map(muutosmaarays => {
        return {
          ...muutosmaarays,
          url: baseURL + LiitetiedostotParam.getLiite(this.peruste!.id!, muutosmaarays.liitteet![this.kieli].id!).url,
          nimi: !!muutosmaarays.nimi && muutosmaarays.nimi[this.kieli] ? muutosmaarays.nimi[this.kieli] : muutosmaarays.liitteet![this.kieli].nimi,
        };
      })
      .value();
  }

  get julkaisujenMuutosMaaraykset() {
    return _.chain(this.julkaisut)
      .filter(julkaisu => (julkaisu.liitteet || []).length > 0)
      .map(julkaisu => {
        return _.map(julkaisu.liitteet, liite => {
          return {
            voimassaoloAlkaa: julkaisu.muutosmaaraysVoimaan,
            ...liite,
            url: baseURL + LiitetiedostotParam.getJulkaisuLiite(this.peruste!.id!, liite.liite!.id!).url,
          };
        });
      })
      .flatMap()
      .filter(liite => liite.kieli === this.kieli)
      .value();
  }

  get hasKorvattavatDiaarinumerot() {
    return !_.isEmpty(this.korvaavatPerusteet);
  }

  get korvattavatDiaarinumerotFields() {
    return [{
      key: 'diaarinumero',
      thStyle: 'width: 30%',
      label: this.$t('diaarinumero'),
    }, {
      key: 'perusteet',
      label: this.$t('perusteet'),
    }];
  }

  get dokumentti() {
    if (this.isOpas || isKoulutustyyppiPdfTuettuOpintopolku(this.peruste?.koulutustyyppi)) {
      return this.perusteDataStore.dokumentti;
    }

    return '';
  }

  get dokumenttiKielistykset() {
    return {
      'opas': {
        'otsikko': 'opas-pdfna',
        'linkki': 'avaa-opas-pdfna',
      },
      'normaali': {
        'otsikko': 'peruste-pdfna',
        'linkki': 'avaa-peruste-pdfna',
      },
    }[this.peruste?.tyyppi || 'normaali'];
  }

  get koulutuskooditFields() {
    return [{
      key: 'koulutuskoodiArvo',
      label: this.$t('koodi'),
      thStyle: 'width: 15%',
    }, {
      key: 'nimi',
      label: this.$t('koulutuksen-nimi'),
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(value);
      },
    }];
  }

  get koulutusvienninohjeFields() {
    return [{
      key: 'nimi',
      label: this.$t('tiedosto'),
    }, {
      key: 'lisatieto',
      label: this.$t('diaarinumero'),
      thStyle: 'width: 30%',
    }];
  }

  get osaamisalatFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
      thStyle: 'width: 75%',
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'arvo',
      label: this.$t('koodi'),
      thStyle: 'width: 15%',
    }];
  }

  get tutkintonimikkeetFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
      thStyle: 'width: 75%',
      formatter: (value: any, key: string, item: any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'tutkintonimikeArvo',
      label: this.$t('koodi'),
      thStyle: 'width: 15%',
    }];
  }

  get isEiTarvitaOhjettaTyyppi() {
    return this.peruste?.poikkeamismaaraysTyyppi?.valueOf() === 'ei_tarvita_ohjetta';
  }

  get isEiVoiPoiketaTyyppi() {
    return this.peruste?.poikkeamismaaraysTyyppi?.valueOf() === 'ei_voi_poiketa';
  }

  get isKoulutusvientiliiteTyyppi() {
    return this.peruste?.poikkeamismaaraysTyyppi?.valueOf() === 'koulutusvientiliite';
  }

  get showKoulutusvienninOhje() {
    return this.isEiTarvitaOhjettaTyyppi || this.isEiVoiPoiketaTyyppi || (this.isKoulutusvientiliiteTyyppi && this.koulutusvienninOhjeet && this.koulutusvienninOhjeet.length > 0);
  }

  protected get koulutustyyppiKohtaisetKaannokset() {
    return {
      perusteentiedot: isYleissivistavaKoulutustyyppi(this.peruste?.koulutustyyppi)
        ? 'perusteen-tiedot-yleissivistava'
        : 'perusteen-tiedot',
      perusteennimi: isYleissivistavaKoulutustyyppi(this.peruste?.koulutustyyppi)
        ? 'perusteen-nimi-yleissivistava'
        : 'perusteen-nimi',
      korvattavatperusteet: isYleissivistavaKoulutustyyppi(this.peruste?.koulutustyyppi)
        ? 'korvattavat-perusteet-yleissivistava'
        : 'korvattavat-perusteet',
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;

  .help {
    color: $gray;
  }

  a {
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
