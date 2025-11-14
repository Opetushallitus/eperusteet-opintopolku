<template>
  <div class="content">
    <h2
      class="otsikko mb-4"
      tabindex="-1"
    >
      {{ $t(koulutustyyppiKohtaisetKaannokset.perusteentiedot) }}
    </h2>
    <div class="row">
      <div
        v-if="peruste.nimi"
        class="col-md-12"
      >
        <ep-form-content
          :name="koulutustyyppiKohtaisetKaannokset.perusteennimi"
          header-type="h3"
          header-class="h6"
        >
          <div>{{ $kaanna(peruste.nimi) }} <span v-if="peruste.laajuus">{{ peruste.laajuus }} {{ $t('osaamispiste') }}</span></div>
        </ep-form-content>
      </div>
      <template v-if="isAmmatillinen">
        <div
          v-if="peruste.diaarinumero"
          class="col-md-12"
        >
          <ep-form-content
            name="maarayksen-diaarinumero"
            header-type="h3"
            header-class="h6"
          >
            <ep-field v-model="peruste.diaarinumero" />
          </ep-form-content>
        </div>
        <div
          v-if="peruste.paatospvm"
          class="col-md-12"
        >
          <ep-form-content
            name="maarayksen-paatospaivamaara"
            header-type="h3"
            header-class="h6"
          >
            <ep-datepicker v-model="peruste.paatospvm" />
          </ep-form-content>
        </div>
      </template>
      <div
        v-if="peruste.voimassaoloAlkaa"
        class="col-md-12"
      >
        <ep-form-content
          name="voimaantulo-pvm"
          header-type="h3"
          header-class="h6"
        >
          <ep-datepicker v-model="peruste.voimassaoloAlkaa" />
        </ep-form-content>
      </div>
      <div
        v-if="peruste.voimassaoloLoppuu"
        class="col-md-12"
      >
        <ep-form-content
          name="voimassaolo-paattymispvm"
          header-type="h3"
          header-class="h6"
        >
          <ep-datepicker v-model="peruste.voimassaoloLoppuu" />
        </ep-form-content>
      </div>
      <div
        v-if="peruste.siirtymaPaattyy"
        class="col-md-12"
      >
        <ep-form-content
          name="siirtyman-paattyminen"
          header-type="h3"
          header-class="h6"
        >
          <ep-datepicker v-model="peruste.siirtymaPaattyy" />
          <p class="help">
            {{ $t('siirtyman-kuvaus') }}
          </p>
        </ep-form-content>
      </div>
      <div
        v-if="dokumentti !== ''"
        class="col-md-12"
      >
        <ep-form-content
          :name="dokumenttiKielistykset.otsikko"
          header-type="h3"
          header-class="h6"
          class="text-left"
        >
          <EpSpinner
            v-if="!dokumentti"
            class="d-inline-block"
          />
          <div
            v-else
            class="pl-2"
          >
            <EpPdfLink :url="dokumentti">
              {{ $t(dokumenttiKielistykset.linkki) }}
            </EpPdfLink>
          </div>
        </ep-form-content>
      </div>
      <div
        v-if="hasMaaraykset"
        class="col-md-12"
      >
        <ep-form-content
          name="maaraykset"
          header-type="h3"
          header-class="h6"
        >
          <div
            v-for="maarays in maaraykset"
            :key="'maarays'+maarays.id"
            class="taulukko-rivi-varitys px-2 py-3"
          >
            <EpPdfLink
              v-if="maarays.url"
              :url="maarays.url"
            >
              {{ $kaanna(maarays.nimi) }}
            </EpPdfLink>
            <router-link
              v-else
              :to="{ name: 'maarays', params: { maaraysId: maarays.id } }"
            >
              {{ $kaanna(maarays.nimi) }}
            </router-link>
            <div class="mt-2">
              <span v-if="maarays.voimassaoloAlkaa">{{ $t('voimaantulo') }}: {{ $sd(maarays.voimassaoloAlkaa) }}</span>
              <span
                v-if="maarays.voimassaoloAlkaa && maarays.diaarinumero"
                class="px-2"
              >|</span>
              <span v-if="maarays.diaarinumero">{{ $t('diaarinumero') }}: {{ maarays.diaarinumero }}</span>
            </div>
          </div>
        </ep-form-content>
      </div>
      <div
        v-if="hasKorvattavatDiaarinumerot"
        class="col-md-12"
      >
        <ep-form-content
          :name="koulutustyyppiKohtaisetKaannokset.korvattavatperusteet"
          header-type="h3"
          header-class="h6"
        >
          <b-table
            striped
            fixed
            responsive
            hover
            :fields="korvattavatDiaarinumerotFields"
            :items="korvaavatPerusteet"
          >
            <template #cell(perusteet)="data">
              <div v-if="data.item.perusteet.length > 0">
                <div
                  v-for="(peruste, idx) in data.item.perusteet"
                  :key="idx"
                >
                  <router-link :to="{ name: 'perusteTiedot', params: { perusteId: peruste.id } }">
                    {{ $kaanna(peruste.nimi) }}
                  </router-link>
                </div>
              </div>
              <div
                v-else
                class="font-italic"
              >
                {{ $t('peruste-saatavilla-opetushallituksen-arkistosta') }}
              </div>
            </template>
          </b-table>
        </ep-form-content>
      </div>

      <div
        v-if="kaannokset && kaannokset.length > 0"
        class="col-md-12"
      >
        <ep-form-content
          name="saamen-kielelle-kaannetyt-perusteet"
          header-type="h3"
          header-class="h6"
        >
          <div
            v-for="(kaannos, idx) in kaannokset"
            :key="idx"
          >
            <a
              :href="kaannos.url"
              target="_blank"
              rel="noopener noreferrer"
            >{{ kaannos.nimi }}</a>
          </div>
        </ep-form-content>
      </div>

      <div v-if="isAmmatillinen">
        <div
          v-if="showKoulutusvienninOhje"
          class="col-md-12 mt-3"
        >
          <ep-form-content
            name="koulutusviennin-ohje"
            header-type="h3"
            header-class="h6"
          >
            <span v-if="isEiTarvitaOhjettaTyyppi">{{ $t('voi-kayttaa-tutkintoviennissa') }}</span>
            <span v-else-if="isEiVoiPoiketaTyyppi">{{ $t('ei-voi-poiketa-tutkinnon-perusteista-tutkintoviennin-yhteydessa') }}</span>

            <div v-if="isKoulutusvientiliiteTyyppi && koulutusvienninOhjeet && koulutusvienninOhjeet.length > 0">
              <b-table
                striped
                fixed
                responsive
                :fields="koulutusvienninohjeFields"
                :items="koulutusvienninOhjeet"
              >
                <template #cell(nimi)="{ item }">
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ item.nimi }}</a>
                </template>
              </b-table>
            </div>

            <ep-form-content
              v-if="peruste.poikkeamismaaraysTarkennus"
              name="tarkennus"
              header-class="h6"
              class="ml-3 mt-3"
            >
              <ep-content-viewer :value="$kaanna(peruste.poikkeamismaaraysTarkennus)" />
            </ep-form-content>
          </ep-form-content>
        </div>

        <div
          v-if="peruste.koulutukset && peruste.koulutukset.length > 0"
          class="col-md-12 mt-3"
        >
          <ep-form-content
            name="koulutuskoodit"
            header-type="h3"
            header-class="h6"
          >
            <b-table
              striped
              fixed
              responsive
              hover
              :fields="koulutuskooditFields"
              :items="peruste.koulutukset"
            />
          </ep-form-content>
        </div>

        <div
          v-if="peruste.osaamisalat && peruste.osaamisalat.length > 0"
          class="col-md-12 mt-3"
        >
          <ep-form-content
            name="osaamisalat"
            header-type="h3"
            header-class="h6"
          >
            <b-table
              striped
              fixed
              responsive
              hover
              :fields="osaamisalatFields"
              :items="peruste.osaamisalat"
            />
          </ep-form-content>
        </div>

        <div
          v-if="peruste.tutkintonimikkeet && peruste.tutkintonimikkeet.length > 0"
          class="col-md-12 mt-3"
        >
          <ep-form-content
            name="tutkintonimikkeet"
            header-type="h3"
            header-class="h6"
          >
            <b-table
              striped
              fixed
              responsive
              hover
              :fields="tutkintonimikkeetFields"
              :items="peruste.tutkintonimikkeet"
            />
          </ep-form-content>
        </div>

        <div
          v-if="peruste.suorittaneenOsaaminen"
          class="col-md-12 mt-3"
        >
          <ep-form-content
            name="suorittaneen-osaaminen"
            header-type="h3"
            header-class="h6"
          >
            <ep-content-viewer
              :value="$kaanna(peruste.suorittaneenOsaaminen)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </ep-form-content>
        </div>

        <div
          v-if="peruste.tyotehtavatJoissaVoiToimia"
          class="col-md-12 mt-3"
        >
          <ep-form-content
            name="tyotehtavat-joissa-voi-toimia"
            header-type="h3"
            header-class="h6"
          >
            <ep-content-viewer
              :value="$kaanna(peruste.tyotehtavatJoissaVoiToimia)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </ep-form-content>
        </div>

        <div
          v-if="osaamisalaKuvaukset && osaamisalaKuvaukset.length > 0"
          class="col-md-12"
        >
          <ep-form-content
            name="osaamisalojen-kuvaukset"
            header-type="h3"
            header-class="h6"
          >
            <div
              v-for="(osaamisalakuvaus, index) in osaamisalaKuvaukset"
              :key="'osaamisalakuvaus'+index"
            >
              <h4>{{ $kaanna(osaamisalakuvaus.nimi) }}</h4>
              <ep-content-viewer
                :value="$kaanna(osaamisalakuvaus.teksti)"
                :termit="termit"
                :kuvat="kuvat"
              />
            </div>
          </ep-form-content>
        </div>
      </div>

      <div
        v-if="isAmmatillinen && !isOpas"
        class="col-md-12"
      >
        <ep-form-content
          name="englanninkieliset-sisallot"
          header-type="h3"
          header-class="h6"
        >
          <router-link :to="{name: 'perusteKoosteEng'}">
            <span>{{ $t('katso-tutkinnon-englanninkieliset-sisallot') }}</span>
          </router-link>
        </ep-form-content>
      </div>

      <div
        v-if="kvliitteita"
        class="col-md-12"
      >
        <ep-form-content
          name="kv-liitteet"
          header-type="h3"
          header-class="h6"
        >
          <EpPdfLink
            v-if="kvliitteet['fi']"
            :url="kvliitteet['fi']"
          >
            {{ $t('lataa-kvliite-fi') }}
          </EpPdfLink>
          <EpPdfLink
            v-if="kvliitteet['sv']"
            :url="kvliitteet['sv']"
          >
            {{ $t('lataa-kvliite-sv') }}
          </EpPdfLink>
          <EpPdfLink
            v-if="kvliitteet['en']"
            :url="kvliitteet['en']"
          >
            {{ $t('lataa-kvliite-en') }}
          </EpPdfLink>
        </ep-form-content>
      </div>

      <div
        v-if="!isOpas"
        class="col-md-12"
      >
        <ep-form-content
          name="muutoshistoria"
          header-type="h3"
          header-class="h6"
        >
          <router-link :to="{ name: 'perusteMuutoshistoria' }">
            <span>{{ $t('katsele-perusteen-muutoshistoriaa') }}</span>
          </router-link>
        </ep-form-content>
      </div>
    </div>
    <slot name="previous-next-navigation" />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, watch } from 'vue';
import { baseURL, LiiteDtoTyyppiEnum, LiitetiedostotParam, PerusteKaikkiDtoTyyppiEnum } from '@shared/api/eperusteet';
import { isKoulutustyyppiAmmatillinen, isKoulutustyyppiPdfTuettuOpintopolku, isYleissivistavaKoulutustyyppi } from '@shared/utils/perusteet';
import { Kielet, UiKielet } from '@shared/stores/kieli';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpDatepicker from '@shared/components/forms/EpDatepicker.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpExternalLink from '@shared/components/EpExternalLink/EpExternalLink.vue';
import EpPdfLink from '@shared/components/EpPdfLink/EpPdfLink.vue';
import { $t, $kaanna, $sd } from '@shared/utils/globals';
import { useRoute, useRouter } from 'vue-router';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { pinia } from '@/pinia';

const route = useRoute();
const perusteDataStore = getCachedPerusteStore();

const kieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

// Watch for changes in the content language
watch(kieli, async () => {
  await perusteDataStore.getDokumentti();
});

const peruste = computed(() => {
  return perusteDataStore.peruste;
});

const isAmmatillinen = computed(() => {
  return peruste.value && isKoulutustyyppiAmmatillinen(peruste.value.koulutustyyppi!);
});

const isOpas = computed(() => {
  return peruste.value?.tyyppi === _.toLower(PerusteKaikkiDtoTyyppiEnum.OPAS);
});

const korvaavatPerusteet = computed(() => {
  const perusteetByDiaarinumero = _.groupBy(perusteDataStore.korvaavatPerusteet, 'diaarinumero');
  return _.map(peruste.value?.korvattavatDiaarinumerot, diaarinumero => ({
    diaarinumero,
    perusteet: perusteetByDiaarinumero[diaarinumero] || [],
  }));
});

const kvliitteita = computed(() => {
  return _.some(UiKielet, uiKieli => {
    return perusteDataStore.kvLiitteet[uiKieli];
  });
});

const kvliitteet = computed(() => {
  return perusteDataStore.kvLiitteet;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const julkaisut = computed(() => {
  return perusteDataStore.julkaisut;
});

const liitteet = computed(() => {
  return _.map(perusteDataStore.liitteet, kvo => (
    {
      ...kvo,
      url: baseURL + LiitetiedostotParam.getLiite(peruste.value!.id!, kvo.id!).url,
    }
  ));
});

const koulutusvienninOhjeet = computed(() => {
  return _.filter(liitteet.value, liite => liite.tyyppi === _.toLower(LiiteDtoTyyppiEnum.KOULUTUSVIENNINOHJE));
});

const kaannokset = computed(() => {
  return _.filter(liitteet.value, liite => liite.tyyppi === _.toLower(LiiteDtoTyyppiEnum.KAANNOS));
});

const osaamisalaKuvaukset = computed(() => {
  return _.chain((peruste.value?.suoritustavat as any[]))
    .map(suoritustapa => perusteDataStore.osaamisalaKuvaukset[suoritustapa.suoritustapakoodi!])
    .map(suoritustavanOsaamisalakuvaukset => _.values(suoritustavanOsaamisalakuvaukset))
    .flatMap()
    .flatMap()
    .value();
});

const perusteenMaarays = computed(() => {
  if (perusteDataStore?.maarays) {
    return [{
      ...perusteDataStore.maarays,
      voimassaoloAlkaa: _.size(perusteDataStore?.maarays?.korvattavatMaaraykset) > 0
        || _.size(perusteDataStore.maarays?.muutettavatMaaraykset) > 0
        ? perusteDataStore.maarays?.voimassaoloAlkaa : null,
    }];
  }

  if (_.has(peruste.value?.maarayskirje?.liitteet, kieli.value)) {
    const maaryskirje = peruste.value?.maarayskirje?.liitteet![kieli.value];
    return [{
      ...maaryskirje,
      url: baseURL + LiitetiedostotParam.getLiite(peruste.value!.id!, maaryskirje!.id!).url,
    }];
  }

  return [];
});

const maarayskokoelmanMuutosmaaraykset = computed(() => {
  return _.chain(perusteDataStore.muutosmaaraykset)
    .sortBy('voimassaoloAlkaa')
    .reverse()
    .value();
});

const perusteenMuutosmaaraykset = computed(() => {
  return _.chain(peruste.value?.muutosmaaraykset)
    .filter(muutosmaarays => _.has(muutosmaarays.liitteet, kieli.value))
    .map(muutosmaarays => {
      return {
        ...muutosmaarays,
        url: baseURL + LiitetiedostotParam.getLiite(peruste.value!.id!, muutosmaarays.liitteet![kieli.value].id!).url,
        nimi: !!muutosmaarays.nimi && muutosmaarays.nimi[kieli.value]
          ? muutosmaarays.nimi[kieli.value]
          : muutosmaarays.liitteet![kieli.value].nimi,
      };
    })
    .value();
});

const julkaisujenMuutosMaaraykset = computed(() => {
  return _.chain(julkaisut.value)
    .filter(julkaisu => (julkaisu.liitteet || []).length > 0)
    .map(julkaisu => {
      return _.map(julkaisu.liitteet, liite => {
        return {
          voimassaoloAlkaa: julkaisu.muutosmaaraysVoimaan,
          ...liite,
          url: baseURL + LiitetiedostotParam.getJulkaisuLiite(peruste.value!.id!, liite.liite!.id!).url,
        };
      });
    })
    .flatMap()
    .filter(liite => liite.kieli === kieli.value)
    .value();
});

const maaraykset = computed(() => {
  return _.sortBy([
    ...maarayskokoelmanMuutosmaaraykset.value,
    ...perusteenMuutosmaaraykset.value,
    ...perusteenMaarays.value,
    ...julkaisujenMuutosMaaraykset.value,
  ], (maarays: any) => maarays.voimassaoloAlkaa || 0).reverse();
});

const hasMaaraykset = computed(() => {
  return !_.isEmpty(maaraykset.value);
});

const hasKorvattavatDiaarinumerot = computed(() => {
  return !_.isEmpty(korvaavatPerusteet.value);
});

const korvattavatDiaarinumerotFields = computed(() => {
  return [{
    key: 'diaarinumero',
    thStyle: 'width: 30%',
    label: $t('diaarinumero'),
  }, {
    key: 'perusteet',
    label: $t('perusteet'),
  }];
});

const dokumentti = computed(() => {
  if (isOpas.value || isKoulutustyyppiPdfTuettuOpintopolku(peruste.value?.koulutustyyppi)) {
    return perusteDataStore.dokumentti;
  }

  return '';
});

const dokumenttiKielistykset = computed(() => {
  return {
    'opas': {
      'otsikko': 'opas-pdfna',
      'linkki': 'avaa-opas-pdfna',
    },
    'normaali': {
      'otsikko': 'peruste-pdfna',
      'linkki': 'avaa-peruste-pdfna',
    },
  }[peruste.value?.tyyppi || 'normaali'];
});

const koulutuskooditFields = computed(() => {
  return [{
    key: 'koulutuskoodiArvo',
    label: $t('koodi'),
    thStyle: 'width: 15%',
  }, {
    key: 'nimi',
    label: $t('koulutuksen-nimi'),
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(value);
    },
  }];
});

const koulutusvienninohjeFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('tiedosto'),
  }, {
    key: 'lisatieto',
    label: $t('diaarinumero'),
    thStyle: 'width: 30%',
  }];
});

const osaamisalatFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi'),
    thStyle: 'width: 75%',
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(value);
    },
  }, {
    key: 'arvo',
    label: $t('koodi'),
    thStyle: 'width: 15%',
  }];
});

const tutkintonimikkeetFields = computed(() => {
  return [{
    key: 'nimi',
    label: $t('nimi'),
    thStyle: 'width: 75%',
    formatter: (value: any, key: string, item: any) => {
      return $kaanna(value);
    },
  }, {
    key: 'tutkintonimikeArvo',
    label: $t('koodi'),
    thStyle: 'width: 15%',
  }];
});

const isEiTarvitaOhjettaTyyppi = computed(() => {
  return peruste.value?.poikkeamismaaraysTyyppi?.valueOf() === 'ei_tarvita_ohjetta';
});

const isEiVoiPoiketaTyyppi = computed(() => {
  return peruste.value?.poikkeamismaaraysTyyppi?.valueOf() === 'ei_voi_poiketa';
});

const isKoulutusvientiliiteTyyppi = computed(() => {
  return peruste.value?.poikkeamismaaraysTyyppi?.valueOf() === 'koulutusvientiliite';
});

const showKoulutusvienninOhje = computed(() => {
  return isEiTarvitaOhjettaTyyppi.value
    || isEiVoiPoiketaTyyppi.value
    || (isKoulutusvientiliiteTyyppi.value && koulutusvienninOhjeet.value && koulutusvienninOhjeet.value.length > 0);
});

const koulutustyyppiKohtaisetKaannokset = computed(() => {
  return {
    perusteentiedot: isYleissivistavaKoulutustyyppi(peruste.value?.koulutustyyppi)
      ? 'perusteen-tiedot-yleissivistava'
      : 'perusteen-tiedot',
    perusteennimi: isYleissivistavaKoulutustyyppi(peruste.value?.koulutustyyppi)
      ? 'perusteen-nimi-yleissivistava'
      : 'perusteen-nimi',
    korvattavatperusteet: isYleissivistavaKoulutustyyppi(peruste.value?.koulutustyyppi)
      ? 'korvattavat-perusteet-yleissivistava'
      : 'korvattavat-perusteet',
  };
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;

  .help {
    color: $gray;
  }

  a {
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
