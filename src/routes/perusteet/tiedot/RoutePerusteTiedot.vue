<template>
<div class="content">
  <ep-spinner v-if="isLoading"></ep-spinner>
  <div v-else>
    <h2 class="otsikko mb-4" slot="header">
      <slot name="header">
        {{ $t('perusteen-tiedot') }}
      </slot>
    </h2>
    <div class="row">
      <div class="col-md-12" v-if="peruste.nimi">
        <slot name="nimi">
          <ep-form-content name="peruste-nimi" headerType="h3" headerClass="h6">
            <div>{{$kaanna(peruste.nimi)}} <span v-if="peruste.laajuus">{{peruste.laajuus}} {{$t('osaamispiste')}}</span></div>
          </ep-form-content>
        </slot>
      </div>
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
      <div class="col-md-12" v-if="hasMaarayskirje">
        <ep-form-content name="maarayskirje" headerType="h3" headerClass="h6">
          <EpPdfLink :url="maarayskirje.url">{{ $kaanna(peruste.nimi) }}</EpPdfLink>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasMuutosmaaraykset">
        <ep-form-content name="muutosmaaraykset" headerType="h3" headerClass="h6">
          <b-table
            :items="muutosmaaraykset"
            :fields="muutosmaarayksetFields"
            striped>

            <template v-slot:cell(nimi)="{ item }">
              <EpPdfLink :url="item.url">{{ $kaanna(item.nimi) }}</EpPdfLink>

              <div v-if="item.liitteet.length > 0" class="d-flex mt-3">
                <div class="mr-3">{{ $t('liitteet')}}:</div>
                <div class="flex-row">
                  <div v-for="(liite, idx) in item.liitteet" :key="'maaraysliite' + idx" class="mb-1">
                    <EpPdfLink :url="liite.url">{{ $kaanna(liite.nimi) }}</EpPdfLink>
                  </div>
                </div>
              </div>
            </template>
          </b-table>

        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasKorvattavatDiaarinumerot">
        <ep-form-content name="korvattavat-perusteet" headerType="h3" headerClass="h6">
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
              <div v-else>
                <i>
                  {{ $t('perusteita-ei-saatavilla-koska-perustetta-ei-loydy-eperusteet-palvelusta') }}
                </i>
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

      <div class="col-md-12" v-if="dokumentti">
        <ep-form-content :name="dokumenttiKielistykset.otsikko" headerType="h3" headerClass="h6">
          <EpPdfLink :url="dokumentti">{{ $t(dokumenttiKielistykset.linkki) }}</EpPdfLink>
        </ep-form-content>
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

      <div class="col-md-12" v-if="julkaisut && julkaisut.length > 0">
        <ep-form-content name="muutoshistoria" headerType="h3" headerClass="h6">
          <EpJulkaisuHistoriaJulkinen :julkaisut="julkaisut"></EpJulkaisuHistoriaJulkinen>
        </ep-form-content>
      </div>

    </div>
    <slot name="previous-next-navigation" />
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component } from 'vue-property-decorator';
import { baseURL, LiiteDtoTyyppiEnum, LiitetiedostotParam, MaarayksetParams, MaaraysLiiteDtoTyyppiEnum, PerusteKaikkiDtoTyyppiEnum } from '@shared/api/eperusteet';
import { isKoulutustyyppiAmmatillinen, isKoulutustyyppiPdfTuettuOpintopolku } from '@shared/utils/perusteet';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import EpJulkaisuHistoriaJulkinen from '@shared/components/EpJulkaisuHistoriaJulkinen/EpJulkaisuHistoriaJulkinen.vue';

@Component({
  components: {
    EpJulkaisuHistoriaJulkinen,
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

  private isLoading = true;
  private maarayskirjeObj;

  async mounted() {
    this.handleMaarayskirje();
    this.isLoading = false;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
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

  handleMaarayskirje() {
    this.maarayskirjeObj = this.handleMaarays(this.peruste!.maarayskirje);
  }

  handleMaarays(maaraysObj) {
    const result = {};
    if (maaraysObj) {
      // Käytetään ensisijaisesti liitteitä
      if (!_.isEmpty(maaraysObj.liitteet)) {
        _.each(maaraysObj.liitteet, (liite, kieli) => {
          result[kieli] = {
            ...liite,
            url: baseURL + LiitetiedostotParam.getLiite(this.peruste!.id!, liite.id!).url,
          };
        });
      }
      else if (!_.isEmpty(maaraysObj.url)) {
        _.each(maaraysObj.url, (url, kieli) => {
          result[kieli] = {
            nimi: url,
            url,
          };
        });
      }
    }
    return result;
  }

  get maarayskirje() {
    return this.maarayskirjeObj[Kielet.sisaltoKieli.value];
  }

  get hasMaarayskirje() {
    return this.peruste?.maarayskirje && this.maarayskirjeObj[Kielet.sisaltoKieli.value];
  }

  get hasMuutosmaaraykset() {
    return !_.isEmpty(this.muutosmaaraykset);
  }

  get muutosmaaraykset() {
    return [
      ...this.perusteenMuutosmaaraykset,
      ...this.maarayskokoelmanMuutosmaaraykset,
    ];
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

  get maarayskokoelmanMuutosmaaraykset() {
    return _.chain(this.perusteDataStore.muutosmaaraykset)
      .map(muutosmaarays => {
        const muutosmaaraysLiite = _.find(muutosmaarays!.liitteet![this.kieli].liitteet, { tyyppi: MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI });
        const liitteet = _.filter(muutosmaarays!.liitteet![this.kieli].liitteet, { tyyppi: MaaraysLiiteDtoTyyppiEnum.LIITE });
        return {
          ...muutosmaarays,
          ...(!!muutosmaaraysLiite && { url: baseURL + MaarayksetParams.getMaaraysLiite(_.toString(muutosmaaraysLiite!.id)).url }),
          liitteet: _.sortBy(_.map(liitteet, liite => {
            return {
              ...liite,
              url: baseURL + MaarayksetParams.getMaaraysLiite(_.toString(liite.id)).url,
            };
          }), liite => this.$kaanna(liite.nimi)),
        };
      })
      .filter('url')
      .sortBy('voimassaoloAlkaa')
      .reverse()
      .value();
  }

  get hasKorvattavatDiaarinumerot() {
    return !_.isEmpty(this.korvaavatPerusteet);
  }

  get korvattavatDiaarinumerotFields() {
    return [{
      key: 'diaarinumero',
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

  get muutosmaarayksetFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
      thStyle: { width: '75%' },
      thClass: 'border-bottom-1',
      sortable: false,
    }, {
      key: 'voimassaoloAlkaa',
      label: this.$t('voimassaolo-alkaa'),
      thClass: 'border-bottom-1',
      sortable: false,
      formatter: (value: any, key: any, item: any) => {
        return (this as any).$sd(value);
      },
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
