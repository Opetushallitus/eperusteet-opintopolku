<template>
  <div class="content">
    <h2
      class="otsikko"
    >
      {{ $t('opetussuunnitelman-tiedot') }}
    </h2>

    <ep-spinner v-if="!opetussuunnitelma" />
    <div v-else>
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
          v-if="opetussuunnitelma.koulutustyyppi"
          class="col-md-12"
        >
          <ep-form-content
            name="koulutustyyppi"
            header-type="h3"
            header-class="h6"
          >
            {{ $t(opetussuunnitelma.koulutustyyppi) }}
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

<script setup lang="ts">
import _ from 'lodash';
import { computed, watch } from 'vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { Kielet } from '@shared/stores/kieli';
import { $kaanna } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { useRoute, useRouter } from 'vue-router';
import EpPdfLink from '@shared/components/EpPdfLink/EpPdfLink.vue';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const opetussuunnitelma = computed(() => {
  return opetussuunnitelmaDataStore.opetussuunnitelma || {};
});

const kunnat = computed(() => {
  return opetussuunnitelma.value.kunnat;
});

const hasKunnat = computed(() => {
  return !_.isEmpty(kunnat.value);
});

const organisaatiot = computed(() => {
  return _.sortBy(opetussuunnitelma.value.organisaatiot, (org: any) => getOrganisaatioNimi(org));
});

const hasOrganisaatiot = computed(() => {
  return !_.isEmpty(organisaatiot.value);
});

const hasTiivistelma = computed(() => {
  return !_.isEmpty(_.get(opetussuunnitelma.value.kuvaus, Kielet.getUiKieli.value));
});

const dokumentti = computed(() => {
  return opetussuunnitelmaDataStore.dokumentti;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.termit;
});

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const getOrganisaatioNimi = (organisaatio) => {
  const nimi = $kaanna(organisaatio.nimi);
  const tyypit = organisaatio.tyypit;
  if (!_.isEmpty(tyypit)) {
    return nimi + ' (' + _.join(tyypit, ', ') + ')';
  }
  else {
    return nimi;
  }
};

watch(kieli, async () => {
  await opetussuunnitelmaDataStore.getDokumentti();
});
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
