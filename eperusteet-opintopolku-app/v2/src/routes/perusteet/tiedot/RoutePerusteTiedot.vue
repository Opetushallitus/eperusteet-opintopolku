v-for="<template>
<div class="content">
  <ep-spinner v-if="isLoading"></ep-spinner>
  <div v-else>
    <h2 class="otsikko" slot="header">
      <slot name="header">
        {{ $t('perusteen-tiedot') }}
      </slot>
    </h2>
    <div class="row">
      <div class="col-md-12" v-if="peruste.nimi">
        <slot name="nimi">
          <ep-form-content name="peruste-nimi" headerType="h3" headerClass="h6">
            <ep-field v-model="peruste.nimi"></ep-field>
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
          <a :href="maarayskirje.url" target="_blank" rel="noopener noreferrer">{{ maarayskirje.nimi }}</a>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasMuutosmaaraykset">
        <ep-form-content name="muutosmaaraykset" headerType="h3" headerClass="h6">
          <ul v-if="muutosmaaraykset && muutosmaaraykset.length > 1">
            <li v-for="(muutosmaarays, idx) in muutosmaaraykset" :key="idx">
              <a :href="muutosmaarays.url" target="_blank" rel="noopener noreferrer">{{ muutosmaarays.nimi }}</a>
            </li>
          </ul>
          <div v-else>
            <div v-for="(muutosmaarays, idx) in muutosmaaraykset" :key="idx">
              <a :href="muutosmaarays.url" target="_blank" rel="noopener noreferrer">{{ muutosmaarays.nimi }}</a>
            </div>
          </div>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasKorvattavatDiaarinumerot">
        <ep-form-content name="korvattavat-perusteet" headerType="h3" headerClass="h6">
          <b-table striped
                   fixed
                   responsive
                   bordered
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
                  {{ $t('perusteita-ei-saatavilla') }}
                </i>
              </div>
            </template>
          </b-table>
        </ep-form-content>
      </div>

      <div class="col-md-12" v-if="!isAmmatillinen && peruste.kuvaus">
        <ep-form-content name="kuvaus" headerType="h3" headerClass="h6">
          <span v-html="$kaanna(peruste.kuvaus)"></span>
        </ep-form-content>
      </div>

      <div v-if="isAmmatillinen">
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

          <div class="col-md-12 mt-3" v-if="peruste.kvliite && peruste.kvliite.suorittaneenOsaaminen">
            <ep-form-content name="suorittaneen-osaaminen" headerType="h3" headerClass="h6">
              <span v-html="$kaanna(peruste.kvliite.suorittaneenOsaaminen)" />
            </ep-form-content>
          </div>

          <div class="col-md-12 mt-3" v-if="peruste.kvliite && peruste.kvliite.tyotehtavatJoissaVoiToimia">
            <ep-form-content name="tyotehtavat-joissa-voi-toimia" headerType="h3" headerClass="h6">
              <span v-html="$kaanna(peruste.kvliite.tyotehtavatJoissaVoiToimia)" />
            </ep-form-content>
          </div>

        <div class="col-md-12" v-if="osaamisalaKuvaukset && osaamisalaKuvaukset.length > 0">
          <ep-form-content name="osaamisalojen-kuvaukset" headerType="h3" headerClass="h6">
            <div v-for="(osaamisalakuvaus, index) in osaamisalaKuvaukset" :key="'osaamisalakuvaus'+index">
              <h4>{{$kaanna(osaamisalakuvaus.nimi)}}</h4>
              <span v-html="$kaanna(osaamisalakuvaus.teksti)"></span>
            </div>
          </ep-form-content>
        </div>
      </div>

      <div class="col-md-12" v-if="dokumentti">
        <ep-form-content name="dokumentti-osoite" headerType="h3" headerClass="h6">
          <a :href="dokumentti" target="_blank" rel="noopener noreferrer">{{ $t('lataa-pdf-dokumentti') }}</a>
        </ep-form-content>
      </div>

      <div class="col-md-12" v-if="kvliitteita">
        <ep-form-content name="kv-liitteet" headerType="h3" headerClass="h6">
          <div><a v-if="kvliitteet['fi']" :href="kvliitteet['fi']" target="_blank" rel="noopener noreferrer">{{ $t('lataa-kvliite-fi') }}</a></div>
          <div><a v-if="kvliitteet['sv']" :href="kvliitteet['sv']" target="_blank" rel="noopener noreferrer">{{ $t('lataa-kvliite-sv') }}</a></div>
          <div><a v-if="kvliitteet['en']" :href="kvliitteet['en']" target="_blank" rel="noopener noreferrer">{{ $t('lataa-kvliite-en') }}</a></div>
        </ep-form-content>
      </div>

    </div>
    <slot name="previous-next-navigation" />
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component, Watch } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { baseURL, LiitetiedostotParam, DokumentitParam } from '@shared/api/eperusteet';
import { isAmmatillinen, isKoulutustyyppiAmmatillinen } from '@shared/utils/perusteet';
import { watch } from '@vue/composition-api';
import { Kielet, UiKielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpFormContent,
    EpField,
    EpDatepicker,
    EpSpinner,
  },
})
export default class RoutePerusteTiedot extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private isLoading = true;
  private maarayskirjeObj;
  private muutosmaarayksetObj = {};

  async mounted() {
    this.handleMaarayskirje();
    this.handleMuutosmaaraykset();
    this.perusteDataStore.getKorvaavatPerusteet();
    this.kieliChanged();
    this.isLoading = false;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  @Watch('Kielet.getSisaltoKieli.value')
  async kieliChanged() {
    // Dokumentti on toteuttu vain ammatillisille
    if (this.isAmmatillinen) {
      await this.perusteDataStore.getDokumentit();
    }
  }

  get isAmmatillinen() {
    return this.peruste && isKoulutustyyppiAmmatillinen(this.peruste.koulutustyyppi!);
  }

  get korvaavatPerusteet() {
    return this.perusteDataStore.korvaavatPerusteet;
  }

  get peruste() {
    return this.perusteDataStore.peruste!;
  }

  get kvliitteita() {
    return _.some(UiKielet, uiKieli => {
      return this.perusteDataStore.kvLiitteet[uiKieli];
    });
  }

  get kvliitteet() {
    return this.perusteDataStore.kvLiitteet;
  }

  get osaamisalaKuvaukset() {
    return _.chain(this.peruste.suoritustavat)
      .map(suoritustapa => this.perusteDataStore.osaamisalaKuvaukset[suoritustapa.suoritustapakoodi!])
      .map(suoritustavanOsaamisalakuvaukset => _.values(suoritustavanOsaamisalakuvaukset))
      .flatMap()
      .flatMap()
      .value();
  }

  handleMaarayskirje() {
    this.maarayskirjeObj = this.handleMaarays(this.peruste!.maarayskirje);
  }

  handleMuutosmaaraykset() {
    _.each(this.peruste!.muutosmaaraykset, muutosmaarays => {
      const maaraysObj = this.handleMaarays(muutosmaarays);
      _.each(maaraysObj, (maarays, kieli) => {
        if (!this.muutosmaarayksetObj[kieli]) {
          this.muutosmaarayksetObj[kieli] = [];
        }
        this.muutosmaarayksetObj[kieli].push(maarays);
      });
    });
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
    return (this as any).$kaanna(this.maarayskirjeObj);
  }

  get hasMaarayskirje() {
    return this.peruste.maarayskirje && (this as any).$kaanna(this.maarayskirjeObj);
  }

  get hasMuutosmaaraykset() {
    return !_.isEmpty(this.peruste.muutosmaaraykset);
  }

  get muutosmaaraykset() {
    return (this as any).$kaanna(this.muutosmaarayksetObj);
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
    if (this.perusteDataStore.dokumentit) {
      return (this as any).$kaanna(this.perusteDataStore.dokumentit);
    }
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
