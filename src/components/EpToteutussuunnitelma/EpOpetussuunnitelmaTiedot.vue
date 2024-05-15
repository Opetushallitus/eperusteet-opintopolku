<template>
  <div class="content">
    <h2 class="mb-4" slot="header">{{ $t('opetussuunnitelman-tiedot') }}</h2>
    <ep-spinner v-if="!opetussuunnitelma" />

    <template v-else>
      <ep-form-content name="opetussuunnitelman-nimi" headerType="h3" headerClass="h6">
        <span>{{$kaanna(opetussuunnitelma.nimi)}}</span>
      </ep-form-content>

      <ep-form-content v-if="opetussuunnitelma.kuvaus" name="opetussuunnitelma-tiivistelma" headerType="h3" headerClass="h6">
        <ep-content-viewer :value="$kaanna(opetussuunnitelma.kuvaus)" :kuvat="kuvat" />
      </ep-form-content>

      <ep-form-content name="hyvaksyja" headerType="h3" headerClass="h6">
        <ep-field v-model="opetussuunnitelma.hyvaksyja" />
      </ep-form-content>

      <ep-form-content v-if="opetussuunnitelma.voimaantulo" name="voimaantulo-pvm" headerType="h3" headerClass="h6">
        <span>{{ $sd(opetussuunnitelma.voimaantulo) }}</span>
      </ep-form-content>

      <ep-form-content v-if="opetussuunnitelma.voimassaoloLoppuu" name="voimassaolo-paattymispvm" headerType="h3" headerClass="h6">
        <span>{{ $sd(opetussuunnitelma.voimassaoloLoppuu) }}</span>
      </ep-form-content>

      <ep-form-content v-if="koulutustyyppiName" name="koulutustyyppi" headerType="h3" headerClass="h6">
        <ep-field v-model="koulutustyyppiName" />
      </ep-form-content>

      <ep-form-content name="organisaatio" headerType="h3" headerClass="h6">
        <span>{{$kaanna(koulutustoimija.nimi)}}</span>
      </ep-form-content>

      <ep-form-content name="oppilaitoksen-tyyppi" headerType="h3" headerClass="h6" v-if="opetussuunnitelma.koulutustoimija.oppilaitostyyppi">
        {{$kaanna(opetussuunnitelma.koulutustoimija.oppilaitostyyppi)}}
      </ep-form-content>

      <ep-form-content v-else-if="oppilaitosTyyppiNimi" name="oppilaitoksen-tyyppi" headerType="h3" headerClass="h6">
        <ep-field v-model="oppilaitosTyyppiNimi" />
      </ep-form-content>

      <ep-form-content name="luotu" headerType="h3" headerClass="h6">
        <span>{{ $sd(opetussuunnitelma.luotu) }}</span>
      </ep-form-content>

      <ep-form-content name="muokattu" headerType="h3" headerClass="h6">
        <span>{{ $sd(opetussuunnitelma.muokattu) }}</span>
      </ep-form-content>

      <ep-form-content v-if="opetussuunnitelma.jotpatyyppi" name="jotpa-koulutus" headerType="h3" headerClass="h6">
        <span>{{ $t('koulutus-on-jotpa-rahoitteinen')}}</span>
      </ep-form-content>

      <ep-form-content v-if="dokumenttiUrl" name="opetussuunnitelma-pdfna" headerType="h3" headerClass="h6">
        <EpPdfLink :url="dokumenttiUrl">{{ $t('avaa-opetussuunnitelma-pdf') }}</EpPdfLink>
      </ep-form-content>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { Koulutustyyppi } from '@shared/tyypit';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpContentViewer,
    EpFormContent,
    EpField,
    EpSpinner,
  },
})
export default class EpOpetussuunnitelmaTiedot extends Vue {
  @Prop({ required: true })
  private store!: ToteutussuunnitelmaDataStore | null;

  @Watch('kieli')
  async kieliChanged() {
    await this.store!.getDokumenttiTila();
  }

  get dokumenttiUrl() {
    return this.store!.dokumenttiUrl;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get opetussuunnitelma() {
    return this.store!.opetussuunnitelma;
  }

  get koulutustoimija() {
    return this.store!.koulutustoimija;
  }

  get koulutustyyppiName() {
    if (this.opetussuunnitelma?.jotpatyyppi !== 'MUU') {
      return this.$t(this.store!.koulutustyyppi as Koulutustyyppi);
    }
  }

  get oppilaitosTyyppiNimi() {
    if (this.opetussuunnitelma?.oppilaitosTyyppiKoodi) {
      return _.mapValues(_.keyBy(this.opetussuunnitelma?.oppilaitosTyyppiKoodi.metadata, v => _.toLower(v.kieli)), v => v.nimi);
    }
  }

  get kuvat() {
    return this.store!.kuvat;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding $content-padding;

  a {
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
