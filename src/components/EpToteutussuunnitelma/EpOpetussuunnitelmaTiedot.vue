<template>
  <div class="content">
    <h2
      class="mb-4"
    >
      {{ $t('opetussuunnitelman-tiedot') }}
    </h2>
    <ep-spinner v-if="!opetussuunnitelma" />

    <template v-else>
      <ep-form-content
        name="opetussuunnitelman-nimi"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $kaanna(opetussuunnitelma.nimi) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="opetussuunnitelma.kuvaus"
        name="opetussuunnitelma-tiivistelma"
        header-type="h3"
        header-class="h6"
      >
        <ep-content-viewer
          :value="$kaanna(opetussuunnitelma.kuvaus)"
          :kuvat="kuvat"
        />
      </ep-form-content>

      <ep-form-content
        name="hyvaksyja"
        header-type="h3"
        header-class="h6"
      >
        <ep-field v-model="opetussuunnitelma.hyvaksyja" />
      </ep-form-content>

      <ep-form-content
        v-if="opetussuunnitelma.voimaantulo"
        name="voimaantulo-pvm"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $sd(opetussuunnitelma.voimaantulo) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="opetussuunnitelma.voimassaoloLoppuu"
        name="voimassaolo-paattymispvm"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $sd(opetussuunnitelma.voimassaoloLoppuu) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="koulutustyyppiName"
        name="koulutustyyppi"
        header-type="h3"
        header-class="h6"
      >
        <ep-field v-model="koulutustyyppiName" />
      </ep-form-content>

      <ep-form-content
        name="organisaatio"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $kaanna(koulutustoimija.nimi) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="opetussuunnitelma.koulutustoimija.oppilaitostyyppi"
        name="oppilaitoksen-tyyppi"
        header-type="h3"
        header-class="h6"
      >
        {{ $kaanna(opetussuunnitelma.koulutustoimija.oppilaitostyyppi) }}
      </ep-form-content>

      <ep-form-content
        v-else-if="oppilaitosTyyppiNimi"
        name="oppilaitoksen-tyyppi"
        header-type="h3"
        header-class="h6"
      >
        <ep-field v-model="oppilaitosTyyppiNimi" />
      </ep-form-content>

      <ep-form-content
        name="luotu"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $sd(opetussuunnitelma.luotu) }}</span>
      </ep-form-content>

      <ep-form-content
        name="muokattu"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $sd(opetussuunnitelma.muokattu) }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="opetussuunnitelma.jotpatyyppi"
        name="jotpa-koulutus"
        header-type="h3"
        header-class="h6"
      >
        <span>{{ $t('koulutus-on-jotpa-rahoitteinen') }}</span>
      </ep-form-content>

      <ep-form-content
        v-if="dokumenttiUrl"
        name="opetussuunnitelma-pdfna"
        header-type="h3"
        header-class="h6"
      >
        <EpPdfLink :url="dokumenttiUrl">
          {{ $t('avaa-opetussuunnitelma-pdf') }}
        </EpPdfLink>
      </ep-form-content>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { Koulutustyyppi } from '@shared/tyypit';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPdfLink from '@shared/components/EpPdfLink/EpPdfLink.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  store: {
    type: Object as () => ToteutussuunnitelmaDataStore | null,
    required: true,
  },
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

watch(kieli, async () => {
  await props.store!.getDokumenttiTila();
});

const dokumenttiUrl = computed(() => {
  return props.store!.dokumenttiUrl;
});

const opetussuunnitelma = computed(() => {
  return props.store!.opetussuunnitelma;
});

const koulutustoimija = computed(() => {
  return opetussuunnitelma.value?.koulutustoimija;
});

const koulutustyyppiName = computed(() => {
  if (opetussuunnitelma.value?.jotpatyyppi !== 'MUU') {
    return $t(props.store!.koulutustyyppi as Koulutustyyppi);
  }
  return undefined;
});

const oppilaitosTyyppiNimi = computed(() => {
  if (opetussuunnitelma.value?.oppilaitosTyyppiKoodi) {
    return _.mapValues(_.keyBy(opetussuunnitelma.value?.oppilaitosTyyppiKoodi.metadata, v => _.toLower(v.kieli)), v => v.nimi);
  }
  return undefined;
});

const kuvat = computed(() => {
  return props.store!.kuvat;
});
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
