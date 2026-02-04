<template>
  <EpCollapse
    :use-padding="false"
    :expanded-by-default="false"
    chevron-location="right"
    class="maarays-wrapper mb-3"
    :border-bottom="false"
    @toggle="handleClick"
  >
    <template #header>
      <div class="maarays-header d-flex w-100 p-2">
        <img
          :src="kuva"
          :alt="$t('maarays')"
          class="kuva"
        >
        <div class="tiedot flex-grow-1">
          <div class="nimi font-weight-bold mb-2">
            {{ $kaanna(maarays.nimi) }}
          </div>
          <div class="alatiedot d-flex flex-wrap">
            <div class="mr-2">
              {{ $t('voimaantulo') }}: {{ $sd(maarays.voimassaoloAlkaa) }}
            </div>
            <EpVoimassaolo :voimassaolo="maarays as any" />
            <div v-if="maarays.diaarinumero" class="mx-2 valiviiva"> | </div>
            <div v-if="maarays.diaarinumero">{{ $t('diaarinumero') }}: {{ maarays.diaarinumero }}</div>
            <div
              v-if="(maarays as any).asiasanat && (maarays as any).asiasanat[kieli] && (maarays as any).asiasanat[kieli].asiasana.length > 0"
              class="mx-2 valiviiva"
            >
              |
            </div>
            <div v-if="(maarays as any).asiasanat && (maarays as any).asiasanat[kieli] && (maarays as any).asiasanat[kieli].asiasana.length > 0">
              {{ $t('asiasana') }}:
              <span
                v-for="(asiasana, index) in (maarays as any).asiasanat[kieli].asiasana"
                :key="'asiasana' + index"
              >
                {{ asiasana }}<span v-if="(index as number) < (maarays as any).asiasanat[kieli].asiasana.length -1">, </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="maarays-details p-3">
      <EpSpinner v-if="loading" />
      <div
        v-else-if="maarays"
        class="details-content"
      >

      <ep-form-content
        name="maarayksen-paatospaivamaara"
        header-type="h3"
        header-class="h6"
        >
        {{ $sd(maarays.maarayspvm) }}
      </ep-form-content>

      <ep-form-content
        name="maarayksen-diaarinumero"
        header-type="h3"
        header-class="h6"
        >
        {{ maarays.diaarinumero }}
      </ep-form-content>

      <a
        v-if="maaraysPdfUrl"
        class="avaa-maarays-btn d-inline-flex align-items-center"
        :href="maaraysPdfUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{{ $t('avaa-maarays') }}</span>
        <EpMaterialIcon class="ml-2">
          picture_as_pdf
        </EpMaterialIcon>
      </a>

        <ep-form-content
          name="koulutus-tai-tutkinto"
          header-type="h3"
          header-class="h6"
        >
          <div
            v-for="koulutustyyppi in maarays.koulutustyypit"
            :key="koulutustyyppi"
          >
            <EpMaarayskokoelmaKoulutustyyppiSelect
              :model-value="koulutustyyppi"
              :is-editing="false"
            />
          </div>
        </ep-form-content>

        <ep-form-content
          v-if="peruste && perusteRoute"
          name="peruste"
          header-type="h3"
          header-class="h6"
        >
          <router-link
            :to="perusteRoute"
            target="_blank"
          >
            {{ $kaanna(peruste.nimi) }}
          </router-link>
        </ep-form-content>

        <ep-form-content
          v-if="liittyykoToiseenMaaraykseenOtsikko"
          :name="liittyykoToiseenMaaraykseenOtsikko"
          header-type="h3"
          header-class="h6"
        >
          <div
            v-for="muuttuva in muutettavatMaarayksetPdfUrls"
            :key="'muuttaa'+muuttuva.maarays.id"
          >
            <a
              :href="muuttuva.pdfUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $kaanna(muuttuva.maarays.nimi) }} ({{ muuttuva.maarays.diaarinumero }})
            </a> <span>(pdf)</span>
          </div>

          <div
            v-for="korvattava in korvattavatMaarayksetPdfUrls"
            :key="'korvaa'+korvattava.maarays.id"
          >
            <a
              :href="korvattava.pdfUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $kaanna(korvattava.maarays.nimi) }} ({{ korvattava.maarays.diaarinumero }})
            </a> <span>(pdf)</span>
          </div>

          <div
            v-if="(maarays.muutettavatMaaraykset && maarays.muutettavatMaaraykset.length === 0 && maarays.korvattavatMaaraykset && maarays.korvattavatMaaraykset.length === 0)
            || (muutettavatMaarayksetPdfUrls.length === 0 && korvattavatMaarayksetPdfUrls.length === 0)"
            class="font-italic"
          >
            {{ $t('maaraysta-ei-loydy-maarayskokoelmasta') }}
          </div>
        </ep-form-content>

        <ep-form-content
          name="kuvaus"
          header-type="h3"
          header-class="h6"
        >
          <ep-content-viewer :value="$kaanna(maarays.kuvaus)" />
        </ep-form-content>

        <ep-form-content
          v-if="liitteet.length > 0"
          name="liitteet"
          header-type="h3"
          header-class="h6"
        >
          <div
            v-for="liite in liitteet"
            :key="'liite'+liite.id"
          >
            <a
              :href="liite.url"
              target="_blank"
              rel="noopener noreferrer"
            >{{ $kaanna(liite.nimi) }}</a> <span>(pdf)</span>
          </div>
        </ep-form-content>
      </div>
    </div>
  </EpCollapse>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, computed } from 'vue';
import { $kaanna, $sd, $t } from '@shared/utils/globals';
import { Maaraykset, MaarayksetParams, MaaraysDto, MaaraysLiiteDtoTyyppiEnum, baseURL, MaaraysDtoLiittyyTyyppiEnum, Perusteet, PerusteDto, MaaraysKevytDto } from '@shared/api/eperusteet';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpMaarayskokoelmaKoulutustyyppiSelect from '@shared/components/EpMaarayskokoelmaKoulutustyyppiSelect/EpMaarayskokoelmaKoulutustyyppiSelect.vue';
import { koulutustyyppiTheme, tyyppiTheme } from '@shared/utils/perusteet';
import { Kielet } from '@shared/stores/kieli';
import maaraysDocSmall from '@assets/img/images/maarays_doc_small.svg';
import EpPdfLink from '@shared/components/EpPdfLink/EpPdfLink.vue';

const props = defineProps<{
  maarays: MaaraysDto;
}>();

const loading = ref(false);
const peruste = ref<PerusteDto | null>(null);
const korvattavatMaaraykset = ref<MaaraysDto[] | null>(null);
const muutettavatMaaraykset = ref<MaaraysDto[] | null>(null);

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const kuva = computed(() => {
  return maaraysDocSmall;
});

const kaikkiLiitteet = computed(() => {
  if (props.maarays.liitteet) {
    return props.maarays.liitteet[kieli.value]?.liitteet || [];
  }
  return [];
});

const liitteet = computed(() => {
  return _.chain(kaikkiLiitteet.value)
    .filter(liite => liite.tyyppi !== MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI)
    .map(liite => {
      return {
        ...liite,
        url: baseURL + MaarayksetParams.getMaaraysLiite(_.toString(liite.id)).url,
      };
    })
    .value();
});

const maarayskirje = computed(() => {
  if (peruste.value?.maarayskirje?.liitteet) {
    return peruste.value?.maarayskirje?.liitteet[kieli.value] || null;
  }
  return null;
});

const maaraysPdfUrl = computed(() => {
  const maaraysLiite = _.find(kaikkiLiitteet.value, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI);
  if (maaraysLiite) {
    return baseURL + MaarayksetParams.getMaaraysLiite(_.toString(maaraysLiite.id)).url;
  }

  if (peruste.value && maarayskirje.value) {
    return `${baseURL}/api/perusteet/${peruste.value.id!}/liitteet/${maarayskirje.value.id}`;
  }

  return null;
});

const liittyykoToiseenMaaraykseenOtsikko = computed(() => {
  if (props.maarays.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.EILIITY) {
    return null;
  }

  if (props.maarays.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.MUUTTAA) {
    return 'muuttaa-maaraysta';
  }

  if (props.maarays.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.KORVAA) {
    return 'korvaa-maarayksen';
  }

  return null;
});

const perusteRoute = computed(() => {
  if (peruste.value) {
    return {
      name: 'peruste',
      params: {
        koulutustyyppi: peruste.value.koulutustyyppi ? koulutustyyppiTheme(peruste.value.koulutustyyppi!) : tyyppiTheme(peruste.value.tyyppi!),
        perusteId: _.toString(peruste.value.id),
      },
    };
  }
  return null;
});

const korvattavatMaarayksetPdfUrls = computed(() => {
  return _.filter(_.map(korvattavatMaaraykset.value, maarays => {
    const kaikkiLiitteet = maarays.liitteet?.[kieli.value]?.liitteet || [];
    const maaraysLiite = _.find(kaikkiLiitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI);
    if (maaraysLiite) {
      return {
        pdfUrl: baseURL + MaarayksetParams.getMaaraysLiite(_.toString(maaraysLiite.id)).url,
        maarays: maarays,
      };
    }
    return null;
  }), null);
});

const muutettavatMaarayksetPdfUrls = computed(() => {
  return _.filter(_.map(muutettavatMaaraykset.value, maarays => {
    const kaikkiLiitteet = maarays.liitteet?.[kieli.value]?.liitteet || [];
    const maaraysLiite = _.find(kaikkiLiitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI);
    if (maaraysLiite) {
      return {
        pdfUrl: baseURL + MaarayksetParams.getMaaraysLiite(_.toString(maaraysLiite.id)).url,
        maarays: maarays,
      };
    }
    return null;
  }), null);
});

async function handleClick() {
  loading.value = true;
  try {
    if (!korvattavatMaaraykset.value) {
      korvattavatMaaraykset.value = await Promise.all((props.maarays.korvattavatMaaraykset || []).map(async (maarays) => {
        return (await Maaraykset.getMaarays(maarays.id!)).data;
      }));
    }

    if (!muutettavatMaaraykset.value) {
      muutettavatMaaraykset.value = await Promise.all((props.maarays.muutettavatMaaraykset || []).map(async (maarays) => {
        return (await Maaraykset.getMaarays(maarays.id!)).data;
      }));
    }

    if (props.maarays.peruste && !peruste.value) {
      peruste.value = (await Perusteet.getPerusteenTiedot(props.maarays.peruste.id!)).data;
    }
  }
  catch (error) {
    console.error('Error fetching maarays details:', error);
  }
  finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.maarays-wrapper {
  :deep(.ep-collapse) {
    border: 1px solid $gray-lighten-9;
    border-radius: 2px;
  }
}

.maarays-header {
  .kuva {
    height: 55px;
  }

  .tiedot {
    margin-left: 15px;

    .valiviiva {
      color: $gray-lighten-1;
    }
  }
}

.maarays-details {
  padding-top: 20px;

  .details-content {
    max-width: 900px;
  }

  .avaa-maarays-btn {
    color: $white;
    background-color: $green;
    padding: 10px 20px;
    display: inline-block;
    text-decoration: none;
    margin-bottom: 30px;

    &:hover {
      background-color: darken($green, 5%);
      color: $white;
    }
  }
}
</style>
