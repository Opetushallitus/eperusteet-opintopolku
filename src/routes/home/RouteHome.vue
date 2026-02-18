<template>
  <div id="main">
    <div class="ylaosa">
      <div class="container">
        <div class="laatikko">
          <h1 class="otsikko">
            {{ $t('eperusteet-opintopolku-etusivu-otsikko') }}
          </h1>
          <p>{{ $t('eperusteet-kuvaus') }}</p>
        </div>
      </div>
    </div>
    <div class="search">
      <div class="container">
        <b-container fluid>
          <section class="section">
            <EpEtusivuHaku />
          </section>
        </b-container>
      </div>
    </div>
    <div class="container">
      <section class="section my-5">
        <h2 class="tile-heading">
          {{ $t('ajankohtaista') }}
        </h2>
        <EpSpinnerSlot :is-loading="!tiedotteet">
          <EpJulkiLista
            :tiedot="tiedotteetMapped"
            :tieto-maara="3"
            listaus-tyyppi="none"
            @avaa-tieto="avaaTiedote"
          >
            <template #eiTietoja>
              <div>
                {{ $t('ei-tiedotteita') }}
              </div>
            </template>
          </EpJulkiLista>
          <EpSecondaryButton
            class="mt-2"
            :to="{ name: 'uutiset' }"
          >
            {{ $t('kaikki-ajankohtaiset') }}
          </EpSecondaryButton>
        </EpSpinnerSlot>
      </section>
    </div>
    <div class="info">
      <div class="container">
        <b-container fluid>
          <section class="section mt-4">
            <h2 class="tile-heading">
              {{ $t('valtakunnalliset-perusteet-ja-paikalliset-opetussuunnitelmat') }}
            </h2>
            <EpSpinner v-if="!julkaistutKoulutustyypit" />
            <div class="d-md-flex flex-wrap justify-content-start">
              <KoulutustyyppiTile
                v-for="(item, idx) in koulutustyyppiItems"
                :key="idx"
                :tyyppi="item"
                class="mr-3 mb-3"
              />
            </div>
          </section>

          <section class="section mt-4">
            <h2 class="tile-heading">
              {{ $t('osaaminen-ja-maaraykset') }}
            </h2>
            <EpSpinner v-if="!otherItems" />
            <div class="d-md-flex flex-wrap justify-content-start">
              <KoulutustyyppiTile
                v-for="(item, idx) in otherItems"
                :key="idx"
                :tyyppi="item"
                class="mr-2 mb-2"
              />
            </div>
          </section>
        </b-container>
      </div>
    </div>
    <div class="container">
      <b-container fluid>
        <section class="section d-md-flex flex-wrap justify-content-start mt-4">
          <InfoTile
            v-for="(infoLink, idx) in infoLinkit"
            :key="'info-' + idx"
            class="mr-2 mb-2"
            :header="infoLink.name"
            :text="infoLink.text"
            :translated-text="infoLink.translatedText"
            :link="infoLink.link"
            :route="infoLink.route"
            :link-text="infoLink.linkText"
          />
        </section>
      </b-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Kielet } from '@shared/stores/kieli';
import { onkoUusi } from '@shared/utils/tiedote';
import EpSpinnerSlot from '@shared/components/EpSpinner/EpSpinnerSlot.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { useTiedoteStore } from '@/stores/TiedoteStore';
import { useTietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { useJulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { BrowserStore } from '@shared/stores/BrowserStore';
import EpEtusivuHaku from '@/routes/home/EpEtusivuHaku.vue';
import KoulutustyyppiTile from '@/routes/home/KoulutustyyppiTile.vue';
import InfoTile from '@/routes/home/InfoTile.vue';
import { navigoitavatKoulutustyyppiRyhmat, otherLinks, navigoitavatMuutRyhmat } from '@/utils/navigointi';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import EpSecondaryButton from '@shared/components/EpSecondaryButton/EpSecondaryButton.vue';
import { TiedoteDto } from '@shared/api/eperusteet';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { pinia } from '@/pinia';
import { useHead  } from '@unhead/vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';

const router = useRouter();
const browserStore = new BrowserStore();
const tiedoteStore = useTiedoteStore(pinia);
const julkaistutKoulutustyypitStore = useJulkaistutKoulutustyypitStore(pinia);
const tietoapalvelustaStore = useTietoapalvelustaStore(pinia);
const osaamismerkitStore = useOsaamismerkitStore(pinia);

onMounted(async () => {
  await osaamismerkitStore.fetchKategoriat({ poistunut: false });
  const h1 = document.querySelector('h1');
  h1?.setAttribute('tabindex', '-1');
  h1?.focus();
  await fetchTiedotteet();
});

const julkaistutKoulutustyypit = computed(() => {
  return julkaistutKoulutustyypitStore.julkaistutKoulutustyypit;
});

watch(() => julkaistutKoulutustyypit.value, async () => {
  await fetchTiedotteet();
});

const fetchTiedotteet = async () => {
  if (julkaistutKoulutustyypit.value) {
    await tiedoteStore.getUusimmat([sisaltoKieli.value], _.map(julkaistutKoulutustyypitStore.koulutustyyppiLukumaarat, 'koulutustyyppi') as string[]);
  }
};

const avaaTiedote = (tiedote: TiedoteDto) => {
  router.push({
    name: 'uutinen',
    params: {
      tiedoteId: '' + tiedote.id,
    },
  });
};

const sisaltoKieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

watch(() => sisaltoKieli.value, async () => {
  await osaamismerkitStore.fetchKategoriat({ poistunut: false });
  const h1 = document.querySelector('h1');
  h1?.setAttribute('tabindex', '-1');
  h1?.focus();
});

const tiedotteet = computed(() => {
  return tiedoteStore.uusimmatTiedotteet;
});

const tiedotteetMapped = computed(() => {
  return _.chain(tiedotteet.value)
    .map(tiedote => {
      return {
        ...tiedote,
        uusi: onkoUusi((tiedote as any).luotu),
        perusteNimi: tiedote.perusteet && tiedote.perusteet.length === 1 ? tiedote.perusteet[0].nimi : null,
        koulutustyyppi: tiedote.koulutustyypit && tiedote.koulutustyypit.length === 1 ? tiedote.koulutustyypit[0] : null,
      };
    })
    .take(browserStore.window.value.width > 991 ? 10 : 3)
    .value();
});

const digitaalinenOsaaminenPeruste = computed(() => {
  return _.first(julkaistutKoulutustyypitStore.digitaalinenOsaaminen);
});

const koulutustyyppiItems = computed(() => {
  return navigoitavatKoulutustyyppiRyhmat(julkaistutKoulutustyypitStore.julkaistutKoulutustyypit as any);
});

const otherItems = computed(() => {
  return navigoitavatMuutRyhmat(osaamismerkitStore.kategoriat as any, digitaalinenOsaaminenPeruste.value ?? {});
});

const tietoapalvelusta = computed(() => {
  return tietoapalvelustaStore.tietoapalvelusta;
});

const infoLinkit = computed(() => {
  return [
    ...(tietoapalvelusta.value ? [tietoapalvelusta.value] : []),
    ...otherLinks(),
  ];
});

const ajankohtaistaUrl = () => {
  return `${window.location.origin}/#/${sisaltoKieli.value}/ajankohtaista`;
};

// Meta information
useHead(() => ({
  title: 'ePerusteet',
}));
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.ylaosa {
  background-image: url('@assets/img/banners/opintopolku/aallot_etusivu.svg'), url('@assets/img/banners/opintopolku/aallot_etusivu_bg.svg');
  background-size: auto 200px, auto;
  background-position: right top, right top;
  background-repeat: no-repeat, repeat;
  margin-top: -1px;

  @media (max-width: 991.98px) {
    background-blend-mode: color-burn;
  }

  .container {
    padding: 0;

    @media (max-width: 767.98px) {
      max-width: none;
    }

    @media (min-width: 768px) {
      min-height: 260px;
      padding-top: 30px;
    }
  }

  .laatikko {
    padding: 15px;
    color: $black;
    max-width: 680px;

    h1.otsikko {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 15px;
    }
  }
}

.container {
  .nayta-kaikki {
    color: $oph-green;
    margin-top: 20px;
    font-weight: 600;

    a {
      color: $oph-green;
    }
  }

  :deep(a) {
    color: $oph-green;
  }
}

.search {
  padding: 30px 0;
  background-color: $oph-green;
  color: $white;
}

.info {
  padding: 10px 0 70px 0;
  background-color: $table-odd-row-bg-color;
}

.tile-heading {
  margin-bottom: 25px;
}

@media (max-width: 991.98px) {
  .row {
    margin: 0;
  }
  .section {
    padding-left: 15px;
    padding-right: 15px;
  }

  :deep(.filter.query) {
    max-width: 100%;
  }
}

:deep(.content) {
  .tieto {
    background-color: unset !important;
    padding-left: 0 !important;
  }
}
</style>
