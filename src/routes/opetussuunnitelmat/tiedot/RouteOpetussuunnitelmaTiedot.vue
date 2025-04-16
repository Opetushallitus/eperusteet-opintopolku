<template>
  <div class="content">
    <h2
      class="otsikko"
    >
      {{ $t('opetussuunnitelman-tiedot') }}
    </h2>
    <div>
      <div class="row">
        <div
          v-if="opetussuunnitelma.nimi"
          class="col-md-12"
        >
          <ep-form-content
            name="opetussuunnitelman-nimi"
            header-type="h3"
            header-class="h6"
          >
            <ep-field v-model="opetussuunnitelma.nimi" />
          </ep-form-content>
        </div>
        <div
          v-if="opetussuunnitelma.perusteenDiaarinumero"
          class="col-md-12"
        >
          <ep-form-content
            name="maarayksen-diaarinumero"
            header-type="h3"
            header-class="h6"
          >
            <ep-field v-model="opetussuunnitelma.perusteenDiaarinumero" />
          </ep-form-content>
        </div>
        <div
          v-if="koulutustyyppi"
          class="col-md-12"
        >
          <ep-form-content
            name="koulutustyyppi"
            header-type="h3"
            header-class="h6"
          >
            <ep-field v-model="koulutustyyppi" />
          </ep-form-content>
        </div>
        <div
          v-if="hasKunnat"
          class="col-md-12"
        >
          <ep-form-content
            name="kunnat"
            header-type="h3"
            header-class="h6"
          >
            <ul v-if="kunnat && kunnat.length > 1">
              <li
                v-for="(kunta, idx) in kunnat"
                :key="idx"
              >
                <ep-field v-model="kunta.nimi" />
              </li>
            </ul>
            <div v-else>
              <div
                v-for="(kunta, idx) in kunnat"
                :key="idx"
              >
                <ep-field v-model="kunta.nimi" />
              </div>
            </div>
          </ep-form-content>
        </div>
        <div
          v-if="hasOrganisaatiot"
          class="col-md-12"
        >
          <ep-form-content
            name="organisaatiot"
            header-type="h3"
            header-class="h6"
          >
            <ul v-if="organisaatiot && organisaatiot.length > 1">
              <li
                v-for="(organisaatio, idx) in organisaatiot"
                :key="idx"
              >
                {{ getOrganisaatioNimi(organisaatio) }}
              </li>
            </ul>
            <div v-else>
              <div
                v-for="(organisaatio, idx) in organisaatiot"
                :key="idx"
              >
                {{ getOrganisaatioNimi(organisaatio) }}
              </div>
            </div>
          </ep-form-content>
        </div>
        <div
          v-if="opetussuunnitelma.luotu"
          class="col-md-12"
        >
          <ep-form-content
            name="luotu"
            header-type="h3"
            header-class="h6"
          >
            <ep-datepicker v-model="opetussuunnitelma.luotu" />
          </ep-form-content>
        </div>
        <div
          v-if="!opetussuunnitelma.viimeisinJulkaisuAika && opetussuunnitelma.muokattu"
          class="col-md-12"
        >
          <ep-form-content
            name="muokattu"
            header-type="h3"
            header-class="h6"
          >
            <ep-datepicker v-model="opetussuunnitelma.muokattu" />
          </ep-form-content>
        </div>
        <div
          v-if="opetussuunnitelma.viimeisinJulkaisuAika"
          class="col-md-12"
        >
          <ep-form-content
            name="julkaistu"
            header-type="h3"
            header-class="h6"
          >
            <ep-datepicker v-model="opetussuunnitelma.viimeisinJulkaisuAika" />
          </ep-form-content>
        </div>
        <div
          v-if="opetussuunnitelma.paatospaivamaara"
          class="col-md-12"
        >
          <ep-form-content
            name="paatospaivamaara"
            header-type="h3"
            header-class="h6"
          >
            <ep-datepicker v-model="opetussuunnitelma.paatospaivamaara" />
          </ep-form-content>
        </div>
        <div
          v-if="hasTiivistelma"
          class="col-md-12"
        >
          <ep-form-content
            name="ops-kuvaus"
            header-type="h3"
            header-class="h6"
          >
            <ep-content-viewer
              :value="$kaanna(opetussuunnitelma.kuvaus)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </ep-form-content>
        </div>
        <div
          v-if="dokumentti !== ''"
          class="col-md-12"
        >
          <ep-form-content
            name="opetussuunnitelma-pdfna"
            header-type="h3"
            header-class="h6"
          >
            <EpSpinner
              v-if="!dokumentti"
              class="d-inline-block"
            />
            <EpPdfLink
              v-else
              :url="dokumentti"
            >
              {{ $t('avaa-opetussuunnitelma-pdf') }}
            </EpPdfLink>
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
    return this.opetussuunnitelmaDataStore.dokumentti;
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

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  @Watch('kieli')
  async onKieliChange() {
    await this.opetussuunnitelmaDataStore.getDokumentti();
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  a {
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
