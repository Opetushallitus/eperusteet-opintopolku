<template>
<div class="content">
  <h2 class="otsikko" slot="header">{{ $t('opetussuunnitelman-tiedot') }}</h2>
  <ep-spinner v-if="isLoading"></ep-spinner>
  <div v-else>
    <div class="row">
      <div class="col-md-12" v-if="opetussuunnitelma.nimi">
        <ep-form-content name="opetussuunnitelman-nimi" headerType="h3" headerClass="h6">
          <ep-field v-model="opetussuunnitelma.nimi"></ep-field>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="opetussuunnitelma.perusteenDiaarinumero">
        <ep-form-content name="maarayksen-diaarinumero" headerType="h3" headerClass="h6">
          <ep-field v-model="opetussuunnitelma.perusteenDiaarinumero"></ep-field>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="koulutustyyppi">
        <ep-form-content name="koulutustyyppi" headerType="h3" headerClass="h6">
          <ep-field v-model="koulutustyyppi"></ep-field>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasKunnat">
        <ep-form-content name="kunnat" headerType="h3" headerClass="h6">
          <ul v-if="kunnat && kunnat.length > 1">
            <li v-for="(kunta, idx) in kunnat" :key="idx">
              <ep-field v-model="kunta.nimi"></ep-field>
            </li>
          </ul>
          <div v-else>
            <div v-for="(kunta, idx) in kunnat" :key="idx">
              <ep-field v-model="kunta.nimi"></ep-field>
            </div>
          </div>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasOrganisaatiot">
        <ep-form-content name="organisaatiot" headerType="h3" headerClass="h6">
          <ul v-if="organisaatiot && organisaatiot.length > 1">
            <li v-for="(organisaatio, idx) in organisaatiot" :key="idx">
              {{ getOrganisaatioNimi(organisaatio) }}
            </li>
          </ul>
          <div v-else>
            <div v-for="(organisaatio, idx) in organisaatiot" :key="idx">
              {{ getOrganisaatioNimi(organisaatio) }}
            </div>
          </div>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="opetussuunnitelma.luotu">
        <ep-form-content name="luotu" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="opetussuunnitelma.luotu"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="!opetussuunnitelma.viimeisinJulkaisuAika && opetussuunnitelma.muokattu">
        <ep-form-content name="muokattu" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="opetussuunnitelma.muokattu"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="opetussuunnitelma.viimeisinJulkaisuAika">
        <ep-form-content name="julkaistu" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="opetussuunnitelma.viimeisinJulkaisuAika"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="opetussuunnitelma.paatospaivamaara">
        <ep-form-content name="paatospaivamaara" headerType="h3" headerClass="h6">
          <ep-datepicker v-model="opetussuunnitelma.paatospaivamaara"></ep-datepicker>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="hasTiivistelma">
        <ep-form-content name="ops-kuvaus" headerType="h3" headerClass="h6">
          <ep-content-viewer :value="$kaanna(opetussuunnitelma.kuvaus)" :termit="termit" :kuvat="kuvat"/>
        </ep-form-content>
      </div>
      <div class="col-md-12" v-if="dokumentti">
        <ep-form-content name="opetussuunnitelma-pdfna" headerType="h3" headerClass="h6">
          <EpPdfLink :url="dokumentti">{{ $t('avaa-opetussuunnitelma-pdf') }}</EpPdfLink>
        </ep-form-content>
      </div>

    </div>
    <slot name="previous-next-navigation" />
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpFormContent,
    EpField,
    EpDatepicker,
    EpSpinner,
    EpPreviousNextNavigation,
    EpContentViewer,
  },
})
export default class RouteOpetussuunnitelmaTiedot extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  private isLoading = true;

  async mounted() {
    await this.opetussuunnitelmaDataStore.getDokumentit();
    this.isLoading = false;
  }

  get opetussuunnitelma() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma!;
  }

  get koulutustyyppi() {
    return this.$t(this.opetussuunnitelma.koulutustyyppi as string);
  }

  get kunnat() {
    return this.opetussuunnitelma.kunnat;
  }

  get hasKunnat() {
    return !_.isEmpty(this.kunnat);
  }

  get organisaatiot() {
    return _.sortBy(this.opetussuunnitelma.organisaatiot, (org: any) => this.getOrganisaatioNimi(org));
  }

  get hasOrganisaatiot() {
    return !_.isEmpty(this.organisaatiot);
  }

  get hasTiivistelma() {
    return !_.isEmpty(_.get(this.opetussuunnitelma.kuvaus, Kielet.getUiKieli.value));
  }

  get dokumentti() {
    const dokumentit = this.opetussuunnitelmaDataStore.dokumentit;
    if (_.get(dokumentit, Kielet.getUiKieli.value)) {
      return (this as any).$kaanna(dokumentit);
    }
    return null;
  }

  private getOrganisaatioNimi(organisaatio) {
    const nimi = (this as any).$kaanna(organisaatio.nimi);
    const tyypit = organisaatio.tyypit;
    if (!_.isEmpty(tyypit)) {
      return nimi + ' (' + _.join(tyypit, ', ') + ')';
    }
    else {
      return nimi;
    }
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;

  a {
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
