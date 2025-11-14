<template>
  <ep-header
    tyyppi="maarayskokoelma"
    :murupolku="murupolku"
  >
    <template #header>
      <div>
        <EpSpinner v-if="!maarays" />
        <template v-else>
          {{ $kaanna(maarays.nimi) }}

          <div class="d-flex mt-3">
            <div
              v-for="(asiasana, index) in maarays.asiasanat[kieli].asiasana"
              :key="'asiasana' + index"
              class="asiasana mr-2"
            >
              {{ asiasana }}
            </div>
          </div>
        </template>
      </div>
    </template>

    <EpSpinner v-if="!maarays" />

    <div
      v-else
      class="maarays d-flex flex-column-reverse flex-md-row"
    >
      <div class="pdf mr-4 mb-4 mr-5">
        <img
          :src="kuva"
          :alt="$t('maarays')"
          class="kuva"
        >
        <div class="nimi font-weight-bold d-flex align-items-end">
          <div>{{ $kaanna(maarays.nimi) }}</div>
        </div>

        <a
          v-if="maaraysPdfUrl"
          class="url d-inline-flex"
          :href="maaraysPdfUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>{{ $t('avaa-maarays-pdf') }}</div>
          <EpMaterialIcon class="ml-3">arrow_forward</EpMaterialIcon>
        </a>
      </div>

      <div class="tiedot flex-grow-1">
        <ep-form-content
          name="voimaantulo"
          header-type="h3"
          header-class="h6"
        >
          {{ $sd(maarays.voimassaoloAlkaa) }} <EpVoimassaolo :voimassaolo="maarays" />
        </ep-form-content>

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

        <ep-form-content
          v-if="peruste"
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
          name="koulutus-tai-tutkinto"
          header-type="h3"
          header-class="h6"
        >
          <EpMaarayskokoelmaKoulutustyyppiSelect
            v-for="koulutustyyppi in maarays.koulutustyypit"
            :key="koulutustyyppi"
            :value="koulutustyyppi"
          />
        </ep-form-content>

        <ep-form-content
          v-if="liittyykoToiseenMaaraykseenOtsikko"
          :name="liittyykoToiseenMaaraykseenOtsikko"
          header-type="h3"
          header-class="h6"
        >
          <router-link
            v-for="muuttuva in maarays.muutettavatMaaraykset"
            :key="'muuttaa'+muuttuva.id"
            :to="{name: 'maarays', params: {maaraysId: muuttuva.id}}"
            class="d-block"
          >
            {{ $kaanna(muuttuva.nimi) }} ({{ muuttuva.diaarinumero }})
          </router-link>

          <router-link
            v-for="korvattava in maarays.korvattavatMaaraykset"
            :key="'korvaa'+korvattava.id"
            :to="{name: 'maarays', params: {maaraysId: korvattava.id}}"
            class="d-block"
          >
            {{ $kaanna(korvattava.nimi) }} ({{ korvattava.diaarinumero }})
          </router-link>

          <div
            v-if="maarays.muutettavatMaaraykset.length === 0 && maarays.korvattavatMaaraykset.length === 0"
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

        <ep-form-content
          v-if="korvaavatMuuttavatMaaraykset && korvaavatMuuttavatMaaraykset.length > 0"
          name="maaraykseen-liittyvat-uudemmat-maaraykset"
          header-type="h3"
          header-class="h6"
        >
          <b-table
            :items="korvaavatMuuttavatMaaraykset"
            :fields="korvaavatMuuttavatFields"
            striped
          >
            <template #cell(nimi)="{ item }">
              <router-link
                :to="{name: 'maarays', params: {maaraysId: item.id}}"
                class="d-block"
              >
                {{ $kaanna(item.nimi) }} ({{ item.diaarinumero }})
              </router-link>
            </template>
          </b-table>
        </ep-form-content>
      </div>
    </div>
  </ep-header>
</template>

<script setup lang="ts">
import { Maaraykset, MaarayksetParams, MaaraysDto, MaaraysLiiteDtoTyyppiEnum, baseURL, MaaraysDtoLiittyyTyyppiEnum, Perusteet, PerusteDto, MaaraysDtoTilaEnum } from '@shared/api/eperusteet';
import * as _ from 'lodash';
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { $kaanna, $sd } from '@shared/utils/globals';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { Kielet } from '@shared/stores/kieli';
import maaraysDoc from '@assets/img/images/maarays_doc.svg';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import EpMaarayskokoelmaKoulutustyyppiSelect from '@shared/components/EpMaarayskokoelmaKoulutustyyppiSelect/EpMaarayskokoelmaKoulutustyyppiSelect.vue';
import { koulutustyyppiTheme } from '@shared/utils/perusteet';
import { MaaraysKevytDtoTilaEnum } from '@shared/generated/eperusteet';
import { $t } from '@shared/utils/globals';

const route = useRoute();

const maarays = ref<MaaraysDto | null>(null);
const peruste = ref<PerusteDto | null>(null);

const maaraysId = computed(() => {
  return _.toNumber(route.params.maaraysId);
});

async function fetchMaarays() {
  maarays.value = null;
  maarays.value = (await Maaraykset.getMaarays(maaraysId.value)).data;
  if (maarays.value?.peruste) {
    peruste.value = (await Perusteet.getPerusteenTiedot(maarays.value.peruste.id!)).data;
  }
}

watch(maaraysId, async () => {
  await fetchMaarays();
}, { immediate: true });

useHead({
  title: computed(() => maarays.value ? $kaanna(maarays.value.nimi) : $t('maarays')),
});

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const kuva = computed(() => {
  return maaraysDoc;
});

const murupolku = computed(() => {
  return [
    {
      label: 'route-maarayskokoelma',
      location: {
        name: 'maaraykset',
      },
    },
    {
      label: 'tiedot',
      location: {
        name: 'maarays',
        params: {
          maaraysId: maaraysId.value,
        },
      },
    },
  ];
});

const kaikkiLiitteet = computed(() => {
  if (maarays.value?.liitteet) {
    return maarays.value?.liitteet[kieli.value].liitteet;
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
  if (maarays.value?.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.EILIITY) {
    return null;
  }

  if (maarays.value?.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.MUUTTAA) {
    return 'muuttaa-maaraysta';
  }

  if (maarays.value?.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.KORVAA) {
    return 'korvaa-maarayksen';
  }

  return null;
});

const perusteRoute = computed(() => {
  if (peruste.value) {
    return {
      name: 'peruste',
      params: {
        koulutustyyppi: koulutustyyppiTheme(peruste.value.koulutustyyppi!),
        perusteId: _.toString(peruste.value.id),
      },
    };
  }
  return null;
});

const korvaavatMuuttavatMaaraykset = computed(() => {
  if (maarays.value) {
    return _.chain([
      ...(maarays.value.korvaavatMaaraykset || []),
      ...(maarays.value.muuttavatMaaraykset || []),
    ])
      .filter({ tila: MaaraysKevytDtoTilaEnum.JULKAISTU })
      .sortBy('voimassaoloAlkaa')
      .reverse()
      .value();
  }
  return [];
});

const korvaavatMuuttavatFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi'),
    thStyle: { width: '60%' },
    thClass: 'border-bottom-1',
    tdClass: 'align-middle',
    sortable: false,
  }, {
    key: 'voimassaoloAlkaa',
    label: $t('voimassaolo-alkaa'),
    thClass: 'border-bottom-1',
    tdClass: 'align-middle',
    sortable: false,
    formatter: (value: any) => {
      return $sd(value);
    },
  }];
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .asiasana {
    font-size: 0.7rem;
    font-weight: 400;

    padding: 5px 10px;
    border: 1px solid $gray-lighten-3;
    border-radius: 10px;
    background-color: $gray-lighten-5;
  }

  .maarays {
    .pdf {
      .kuva {
        height: 350px;

        @media (max-width: 767.98px) {
          display:none;
        }
      }
      .nimi {
        height: 350px;
        width: 250px;
        margin-top: -360px;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 30px;

        @media (max-width: 767.98px) {
          display:none !important;
        }
      }
      .url {
        color: $white;
        background-color: $blue-lighten-5;
        padding: 10px 20px;
        display: inline-block;
        border-radius: 2rem;
      }
    }
  }

</style>
