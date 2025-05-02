<template>
  <div>
    <ep-spinner v-if="!koulutustyyppi" />
    <ep-header
      v-else
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template #header>
        {{ $t(ylaotsikko) }}
      </template>
    </ep-header>
    <div
      id="main"
      class="container-lg"
    >
      <div v-if="$route.name === 'ammatillinenSelaus'">
        <div class="d-flex justify-content-between flex-lg-row flex-column">
          <router-link
            v-for="(linkki, index) in linkit"
            :key="'linkki'+index"
            :to="linkki.route"
          >
            <div class="box tile-background-shadow-selected shadow-tile d-inline-block text-center d-flex align-items-center">
              <EpMaterialIcon
                v-if="linkki.icon"
                icon-shape="outlined"
              >
                {{ linkki.icon }}
              </EpMaterialIcon>
              <div class="align-self-center">
                {{ $t(linkki.text) }}
              </div>
            </div>
          </router-link>
        </div>

        <div class="row mb-4">
          <div class="col-12 col-lg-6 pr-5">
            <h2 class="mb-2">
              {{ $t('mita-ovat-ammatilliset-tutkinnot') }}
            </h2>

            <p class="kuvaus">
              {{ $t('kooste-kuvaus-ammatillinen-koulutus') }}
            </p>
            <p class="kuvaus">
              {{ $t('kooste-kuvaus-perusteet') }}
            </p>

            <h2 class="mb-2 mt-4">
              {{ $t('osallistu-kehitystyohon') }}
            </h2>
            <p class="kuvaus">
              {{ $t('ammatillinen-kehitystyo-kuvaus') }}
              <EpLinkki
                :url="furtherFeedbackUrl"
                icon="launch"
                icon-right
              >
                {{ $t('kerro-ehdotuksesi') }}
              </EpLinkki>
            </p>
          </div>

          <div class="col-12 col-lg-6">
            <h2 class="mb-2">
              {{ $t('ajankohtaista') }}
            </h2>
            <ep-julki-lista
              :tiedot="tiedotteet"
              @avaaTieto="avaaTiedote"
            >
              <template #lisaaBtnText>
                <div class="mt-2">
                  {{ $t('katso-lisaa-ajankohtaisia') }}
                </div>
              </template>
              <template #eiTietoja>
                <div>
                  {{ $t('ei-tiedotteita') }}
                </div>
              </template>
            </ep-julki-lista>
          </div>
        </div>

        <h2 class="mb-2">
          {{ $t('tutkinnon-perusteet-ja-tutkinnon-osat') }}
        </h2>
        <peruste-ammatillinen-haku
          tyyppi="peruste"
        />
      </div>

      <div v-else>
        <div class="mb-4">
          <router-link :to="{ name: 'ammatillinenSelaus' }">
            <EpMaterialIcon>arrow_back</EpMaterialIcon>
            {{ $t('palaa-ammatillinen-koulutus-sivulle') }}
          </router-link>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpJulkiLista from '@shared/components/EpJulkiLista/EpJulkiLista.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import PerusteAmmatillinenHaku from './PerusteAmmatillinenHaku.vue';
import { AmmatillistenTiedoteStore } from '@/stores/AmmatillistenTiedoteStore';
import { koulutustyyppiRyhmat, KoulutustyyppiRyhma } from '@shared/utils/perusteet';
import * as _ from 'lodash';
import { MaaraysDtoTyyppiEnum, TiedoteDto } from '@shared/api/eperusteet';
import { Kielet } from '@shared/stores/kieli';
import { useRouter, useRoute } from 'vue-router';

interface Ylalinkki {
  route: { name: string, query?: any, };
  text: string;
  icon?: string;
}

const route = useRoute();
const router = useRouter();
const ammatillistenTiedotteetStore = new AmmatillistenTiedoteStore();

onMounted(async () => {
  ammatillistenTiedotteetStore.init({ koulutusTyyppi: ammatillisetkoulutusryhmat.value.koulutustyypit });
  ammatillistenTiedotteetStore.fetch();
});

const tiedotteet = computed(() => {
  return ammatillistenTiedotteetStore.tiedotteet.value;
});

const ammatillisetkoulutusryhmat = computed((): KoulutustyyppiRyhma => {
  return _.filter(koulutustyyppiRyhmat(), koulutusryhma => koulutusryhma.ryhma === 'ammatillinen')[0];
});

const linkit = computed((): Ylalinkki[] => {
  return [
    {
      route: {
        name: 'maaraykset',
        query: {
          tyyppi: MaaraysDtoTyyppiEnum.AMMATILLINENMUU,
        },
      },
      text: 'maaraykset',
      icon: 'picture_as_pdf',
    },
    {
      route: { name: 'ammatillinenOhjeet' },
      text: 'ohjeet-ja-materiaalit',
      icon: 'menu_book',
    },
    {
      route: { name: 'ammatillinenKoulutuksenjarjestajat' },
      text: 'koulutuksen-jarjestajat',
      icon: 'location_on',
    },
  ];
});

const ylaotsikko = computed(() => {
  switch (route.name) {
  case 'ammatillinenKoulutuksenjarjestajat': return 'koulutuksen-jarjestajat';
  case 'ammatillinenOhjeet': return 'ohjeet-ja-materiaalit';
  case 'ammatillinenKoulutusviennit': return 'koulutusviennit';
  case 'ammatillinenTyopajat': return 'selaa-tyopajoja';
  case 'ammatillinenValmisteillaOlevat': return 'valmisteilla-olevat-perusteet';
  case 'ammatillinenMaaraykset': return 'maaraykset';
  default: return 'ammatillinen-koulutus';
  }
});

const koulutustyyppi = computed(() => {
  return 'koulutustyyppi_1';
});

const murupolku = computed(() => {
  return [{
    label: 'ammatillinen-koulutus',
    location: {
      name: 'ammatillinenSelaus',
    },
  },
  ...alamurupolku.value,
  ];
});

const alamurupolku = computed(() => {
  if (ylaotsikko.value !== 'ammatillinen-koulutus') {
    return [{
      label: ylaotsikko.value,
    }];
  }
  return [];
});

useHead({
  title: computed(() => `${ylaotsikko.value}`),
});

const avaaTiedote = (tiedote: TiedoteDto) => {
  router.push({
    name: 'uutinen',
    params: {
      tiedoteId: '' + tiedote.id,
    },
  });
};

const sisaltokieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const furtherFeedbackUrl = computed(() => {
  return `https://www.oph.fi/${sisaltokieli.value}/koulutus-ja-tutkinnot/tutkintorakenne/lomake`;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';
@include shadow-tile;

.container-lg {
  margin-top: 1.5rem;
}

.container-md {
  padding: 0 30px;
}

.box {
  margin-bottom: 20px;
  padding: 20px 30px;
  border-radius: 10px;
  height: 60px;
}

.icon {
  font-size: 1.6rem;
  margin-right: 10px;
}

.kuvaus {
  font-size: smaller;
  color: $gray-lighten-12;
}

@media (max-width: 991.98px) {
  .container-md {
    padding: 0 15px;
  }
}
</style>
