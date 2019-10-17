<template>
<div class="content">
  <h2 class="otsikko" slot="header">{{ $t('perusteen-tiedot') }}</h2>
  <ep-spinner v-if="isLoading"></ep-spinner>
  <div v-else>
    <div class="row">
      <div class="col-md-12" v-if="peruste.nimi">
        <ep-form-content name="peruste-nimi">
          <ep-field v-model="peruste.nimi"></ep-field>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.diaarinumero">
        <ep-form-content name="maarayksen-diaarinumero">
          <ep-field v-model="peruste.diaarinumero"></ep-field>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.paatospvm">
        <ep-form-content name="maarayksen-paatospaivamaara">
          <ep-datepicker v-model="peruste.paatospvm"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.voimassaoloAlkaa">
        <ep-form-content name="voimaantulo-pvm">
          <ep-datepicker v-model="peruste.voimassaoloAlkaa"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.voimassaoloLoppuu">
        <ep-form-content name="voimassaolo-paattymispvm">
          <ep-datepicker v-model="peruste.voimassaoloLoppuu"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="peruste.siirtymaPaattyy">
        <ep-form-content name="siirtyman-paattyminen">
          <ep-datepicker v-model="peruste.siirtymaPaattyy"></ep-datepicker>
          <p class="help">{{ $t('siirtyman-kuvaus') }}</p>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasMaarayskirje">
        <ep-form-content name="maarayskirje">
          <a :href="maarayskirje.url" target="_blank" rel="noopener noreferrer">{{ maarayskirje.nimi }}</a>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasMuutosmaaraykset">
        <ep-form-content name="muutosmaaraykset">
          <div v-for="(muutosmaarays, idx) in muutosmaaraykset" :key="idx">
            <a :href="muutosmaarays.url" target="_blank" rel="noopener noreferrer">{{ muutosmaarays.nimi }}</a>
          </div>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasKorvattavatDiaarinumerot">
        <ep-form-content name="korvattavat-perusteet">
          <b-table striped
                   fixed
                   responsive
                   bordered
                   hover
                   :fields="korvattavatDiaarinumerotFields"
                   :items="korvaavatPerusteet">
            <template v-slot:cell(perusteet)="data">
              <div v-for="(peruste, idx) in data.item.perusteet" :key="idx">
                <router-link :to="{ name: 'perusteTiedot', params: { perusteId: peruste.id } }">
                  {{ $kaanna(peruste.nimi) }}
                </router-link>
              </div>
            </template>
          </b-table>
        </ep-form-content>
      </div>
      <!-- todo: peruste-koulutukset -->
      <!-- todo: osaamisalat -->
      <!-- todo: tutkintonimikkeet -->
      <!-- todo: kvliite -->
        <!-- todo: suorittaneen-osaaminen -->
        <!-- todo: tyotehtavat-joissa-voi-toimia -->
        <!-- todo: osaamisalojen-kuvaukset -->
      <!-- todo: kuvaus -->
      <div class="col-md-12" v-if="hasDokumentti">
        <ep-form-content name="dokumentti-osoite">
          <a :href="dokumentti" target="_blank" rel="noopener noreferrer">{{ $t('lataa-dokumentti') }}</a>
        </ep-form-content>
      </div>
      <!-- todo: kv-liitteet -->
    </div>
  </div>
  <ep-previous-next-navigation :sidenav="sidenav"></ep-previous-next-navigation>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component, Mixins } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSelect from '@shared/components/forms/EpSelect.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { baseURL, LiitetiedostotParam, Dokumentit, DokumentitParam } from '@shared/api/eperusteet';
import { perusteetQuery } from '@/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';


@Component({
  components: {
    EpFormContent,
    EpField,
    EpSelect,
    EpDatepicker,
    EpSpinner,
    EpPreviousNextNavigation,
  },
})
export default class RouteTiedot extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  private isLoading = true;
  private maarayskirjeObj;
  private muutosmaarayksetObj = {};
  private korvaavatPerusteet: object[] = [];
  private dokumenttiObj = {};

  async mounted() {
    await this.handleMaarayskirje();
    await this.handleMuutosmaaraykset();
    await this.handleKorvaavatPerusteet();
    await this.handleDokumentti();
    this.isLoading = false;
  }

  get peruste() {
    return this.perusteDataStore.peruste!;
  }

  get sidenav() {
    return this.perusteDataStore.sidenav;
  }

  handleMaarayskirje() {
    this.maarayskirjeObj = this.handleMaarays(this.peruste!.maarayskirje);
  }

  handleMuutosmaaraykset() {
    _.each(this.peruste!.muutosmaaraykset, muutosmaarays => {
      const maaraysObj = this.handleMaarays(muutosmaarays);
      _.each(maaraysObj, (maarays, kieli) => {
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
            url: baseURL + LiitetiedostotParam.getAllLiitteet(this.peruste!.id!, liite.id!).url
          };
        });
      }
      else if (!_.isEmpty(maaraysObj.url)) {
        _.each(maaraysObj.url, (url, kieli) => {
          result[kieli] = {
            nimi: url,
            url
          };
        });
      }
    }
    return result;
  }

  async handleKorvaavatPerusteet() {
    const diaarinumerot = this.peruste.korvattavatDiaarinumerot;
    if (!diaarinumerot) {
      return;
    }

    const result: object[] = [];

    for(let i = 0; i < diaarinumerot.length; i++) {
      const diaarinumero = diaarinumerot[i];
      const perusteet = await perusteetQuery({
        diaarinumero
      });

      result.push({
        diaarinumero,
        perusteet: perusteet
      });
    }
    this.korvaavatPerusteet = result;
  }

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli();
  }

  async handleDokumentti() {
    const suoritustavat = this.peruste.suoritustavat;
    if (suoritustavat) {
      for (let i = 0; i < suoritustavat.length; i++) {
        const st = suoritustavat[i];
        const suoritustapakoodi = st.suoritustapakoodi;
        if (suoritustapakoodi) {
          const dokumenttiId = await Dokumentit.getDokumenttiId(this.peruste!.id!, this.sisaltoKieli, suoritustapakoodi);
          this.dokumenttiObj[this.sisaltoKieli] = baseURL + DokumentitParam.getDokumentti(dokumenttiId.data).url;
        }
      }
    }
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
    return !_.isEmpty(this.peruste.korvattavatDiaarinumerot);
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

  get hasDokumentti() {
    return this.dokumenttiObj && (this as any).$kaanna(this.dokumenttiObj);
  }

  get dokumentti() {
    return (this as any).$kaanna(this.dokumenttiObj);
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/_variables.scss';

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
