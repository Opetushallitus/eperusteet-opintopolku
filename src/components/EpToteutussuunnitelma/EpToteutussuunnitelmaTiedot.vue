<template>
  <div class="content">
    <h2
      slot="header"
      class="mb-4"
    >
      {{ $t('toteutussuunnitelman-tiedot') }}
    </h2>
    <ep-spinner v-if="!toteutussuunnitelma" />

    <template v-else>
      <ep-form-content
        name="toteutussuunnitelman-nimi"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $kaanna(toteutussuunnitelma.nimi) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="toteutussuunnitelma.kuvaus"
        :name="kuvausOtsikko"
        header-type="h3"
        header-class="h6"
      >
        <ep-content-viewer
          :value="$kaanna(toteutussuunnitelma.kuvaus)"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <ep-form-content
        name="paatosnumero"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ toteutussuunnitelma.paatosnumero }}</span>
      </ep-form-content>

      <ep-form-content
        name="hyvaksyja"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ toteutussuunnitelma.hyvaksyja }}</span>
      </ep-form-content>

      <ep-form-content
        name="paatospaivamaara"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $sd(toteutussuunnitelma.paatospaivamaara) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="toteutussuunnitelma.voimaantulo"
        name="voimaantulo"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $sd(toteutussuunnitelma.voimaantulo) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="toteutussuunnitelma.peruste"
        name="peruste"
        header-type="h3"
        header-class="h6"
      >
        <router-link :to="{ name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: toteutussuunnitelma.peruste.perusteId } }">
          <span>{{ $kaanna(toteutussuunnitelma.peruste.nimi) }}</span>
        </router-link>
      </ep-form-content>

      <ep-form-content
        v-if="dokumenttiUrl"
        name="toteutussuunnitelma-pdfna"
        header-type="h3"
        header-class="h6"
      >
        <EpPdfLink :url="dokumenttiUrl">
          {{ $t('avaa-toteutusuunnitelma-pdf') }}
        </EpPdfLink>
      </ep-form-content>

      <ep-form-content
        name="koulutuksen-jarjestaja"
        header-type="h3"
        header-class="h6"
      >
        <router-link :to="{name:'ammatillinenKoulutuksenjarjestaja', params: {koulutuksenjarjestajaId: toteutussuunnitelma.koulutustoimija.id}}">
          <span>{{ $kaanna(toteutussuunnitelma.koulutustoimija.nimi) }}</span>
        </router-link>
      </ep-form-content>

      <ep-form-content
        v-if="koulutustoimija.kuvaus"
        name="koulutuksen-jarjestajan-kuvaus"
        header-type="h3"
        header-class="h6"
      >
        <ep-content-viewer :value="$kaanna(koulutustoimija.kuvaus)" />
      </ep-form-content>

      <ep-form-content
        v-if="toteutussuunnitelma.osaamisenArvioinninToteutussuunnitelmat && toteutussuunnitelma.osaamisenArvioinninToteutussuunnitelmat.length > 0"
        name="osaamisen-arvioinnin-toteutussuunnitelma"
        header-type="h3"
        header-class="h6"
      >
        <div
          v-for="(oat, index) in toteutussuunnitelma.osaamisenArvioinninToteutussuunnitelmat"
          :key="'oat' + index"
          class="mb-2"
        >
          <div class="d-flex">
            <router-link
              v-if="oat.oatOpetussuunnitelma"
              :to="{ name: 'toteutussuunnitelma', params: { toteutussuunnitelmaId: oat.oatOpetussuunnitelma.id } }"
            >
              {{ $kaanna(oat.oatOpetussuunnitelma.nimi) }}
            </router-link>
            <ep-external-link
              v-else
              :url="$kaanna(oat.url)"
            >
              {{ $kaanna(oat.nimi) }}
            </ep-external-link>
          </div>
        </div>
      </ep-form-content>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpContentViewer,
    EpFormContent,
    EpField,
    EpSpinner,
  },
})
export default class EpToteutussuunnitelmaTiedot extends Vue {
  @Prop({ required: true })
  private store!: ToteutussuunnitelmaDataStore | null;

  async mounted() {
    this.kieliChanged();
  }

  @Watch('kieli')
  async kieliChanged() {
    await this.store!.getDokumenttiTila();
  }

  get toteutussuunnitelma() {
    return this.store!.opetussuunnitelma;
  }

  get dokumenttiUrl() {
    return this.store!.dokumenttiUrl;
  }

  get kuvat() {
    return this.store!.kuvat;
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get koulutustoimija() {
    return this.store?.koulutustoimija;
  }

  get kuvausOtsikko() {
    return this.store?.isAmmatillinen ? 'tutkinnon-suorittaneen-osaaminen' : 'opetussuunnitelma-tiivistelma';
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
