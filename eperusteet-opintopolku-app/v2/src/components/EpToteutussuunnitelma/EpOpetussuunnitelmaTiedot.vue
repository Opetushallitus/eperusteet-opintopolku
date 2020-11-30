<template>
  <div class="content">
    <h2 class="mb-4" slot="header">{{ $t('opetussuunnitelman-tiedot') }}</h2>
    <ep-spinner v-if="!opetussuunnitelma" />
    <template v-else>
      <ep-form-content name="opetussuunnitelman-nimi" headerType="h3" headerClass="h6">
        <span>{{$kaanna(opetussuunnitelma.nimi)}}</span>
      </ep-form-content>

      <!-- Tiivistelmä -->

      <ep-form-content name="hyvaksyja" headerType="h3" headerClass="h6">
        <ep-field v-model="opetussuunnitelma.hyvaksyja" />
      </ep-form-content>

      <!-- Hyväksymispäivämäärä -->

      <ep-form-content name="maarayksen-diaarinumero" headerType="h3" headerClass="h6">
        <ep-field v-model="opetussuunnitelma.perusteDiaarinumero" />
      </ep-form-content>

      <ep-form-content name="koulutustyyppi" headerType="h3" headerClass="h6">
        <ep-field v-model="koulutustyyppiName" />
      </ep-form-content>

      <!-- Kunnat -->

      <ep-form-content name="organisaatio" headerType="h3" headerClass="h6">
        <ep-field v-model="koulutustoimija.nimi" />
      </ep-form-content>

      <ep-form-content name="luotu" headerType="h3" headerClass="h6">
        <span>{{ $sd(opetussuunnitelma.luotu) }}</span>
      </ep-form-content>

      <ep-form-content name="muokattu" headerType="h3" headerClass="h6">
        <span>{{ $sd(opetussuunnitelma.muokattu) }}</span>
      </ep-form-content>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';

import { Koulutustyyppi } from '@shared/tyypit';

import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

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

  get opetussuunnitelma() {
    return this.store!.opetussuunnitelma;
  }

  get koulutustoimija() {
    return this.store!.koulutustoimija;
  }

  get koulutustyyppiName() {
    return this.$t(this.store!.koulutustyyppi as Koulutustyyppi);
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
