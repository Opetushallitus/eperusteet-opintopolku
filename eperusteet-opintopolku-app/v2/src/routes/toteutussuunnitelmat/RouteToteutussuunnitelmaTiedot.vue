<template>
  <div class="content">
    <h2 class="otsikko" slot="header">{{ $t('toteutussuunnitelman-tiedot') }}</h2>
    <ep-spinner v-if="!toteutussuunnitelma"></ep-spinner>
    <div v-else>

      <ep-form-content name="toteutussuunnitelman-nimi" headerType="h3" headerClass="h6">
        <span>{{$kaanna(toteutussuunnitelma.nimi)}}</span>
      </ep-form-content>

      <ep-form-content name="tiivistelma" headerType="h3" headerClass="h6">
        <span v-html="$kaanna(toteutussuunnitelma.kuvaus)"></span>
      </ep-form-content>

      <ep-form-content name="paatosnumero" headerType="h3" headerClass="h6">
        <span>{{toteutussuunnitelma.paatosnumero}}</span>
      </ep-form-content>

      <ep-form-content name="hyvaksyja" headerType="h3" headerClass="h6">
        <span>{{toteutussuunnitelma.hyvaksyja}}</span>
      </ep-form-content>

      <ep-form-content name="paatospaivamaara" headerType="h3" headerClass="h6">
        <span>{{$sd(toteutussuunnitelma.paatospaivamaara)}}</span>
      </ep-form-content>

      <ep-form-content name="voimassaolo" headerType="h3" headerClass="h6">
        <div>
          <span v-if="toteutussuunnitelma.voimaantulo">{{$sd(toteutussuunnitelma.voimaantulo)}}</span> -
          <span v-if="toteutussuunnitelma.paatospaivamaara">{{$sd(toteutussuunnitelma.paatospaivamaara)}}</span>
        </div>
      </ep-form-content>

      <ep-form-content name="peruste" headerType="h3" headerClass="h6">
        <router-link :to="{ name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: toteutussuunnitelma.peruste.perusteId } }">
          <span>{{$kaanna(toteutussuunnitelma.peruste.nimi)}}</span>
        </router-link>
      </ep-form-content>

      <ep-form-content name="koulutuksen-jarjestaja" headerType="h3" headerClass="h6">
        <router-link :to="{}">
          <span>{{$kaanna(toteutussuunnitelma.koulutustoimija.nimi)}}</span>
        </router-link>
      </ep-form-content>

      <ep-form-content name="dokumentti" headerType="h3" headerClass="h6" v-if="dokumenttiUrl">
        <a :href="dokumenttiUrl" target="_blank" rel="noopener noreferrer">{{ $t('avaa-toteutusuunnitelma-pdf') }}</a>
      </ep-form-content>

    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import { DokumenttiDtoTilaEnum } from '@shared/api/amosaa';

@Component({
  components: {
    EpFormContent,
    EpField,
  },
})
export default class RouteToteutussuunnitelmaTiedot extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get toteutussuunnitelma() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma;
  }

  get dokumenttiUrl() {
    return this.opetussuunnitelmaDataStore.dokumenttiUrl;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
  padding-top: 0px;

  a {
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
