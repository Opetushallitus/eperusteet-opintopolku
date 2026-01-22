<template>
  <div>
    <slot name="sisalto-nimi" />

    <div class="flex flex-wrap">
      <div class="w-full md:w-1/2">
        <ep-form-content
          :name="$t(opintokokonaisuusNimiOtsikko(opintokokonaisuus.tyyppi))"
          header-type="h4"
        >
          <span>{{ $kaanna(sisaltoviite.nimi) }}</span>
        </ep-form-content>
      </div>
      <div class="w-full md:w-1/2">
        <ep-form-content
          name="laajuus"
          header-type="h4"
        >
          <span v-if="opintokokonaisuus.laajuus && laajuusYksikkoLyhenne">{{ opintokokonaisuus.laajuus }} {{ laajuusYksikkoLyhenne }}</span>
          <span v-else>-</span>
        </ep-form-content>
      </div>
    </div>
    <div
      v-if="opintokokonaisuus.koodiArvo"
      class="flex flex-wrap mb-4"
    >
      <div class="w-full">
        <h4>{{ $t('opintokokonaisuuden-koodi') }}</h4>
        <div>{{ opintokokonaisuus.koodiArvo }}</div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="w-full">
        <h4 role="presentation">
          {{ $t('kuvaus') }}
        </h4>
        <ep-content-viewer
          :value="$kaanna(opintokokonaisuus.kuvaus)"
          :kuvat="kuvat"
        />
      </div>
    </div>
    <hr>
    <div class="flex flex-wrap">
      <div class="w-full">
        <h3 class="mt-3 mb-4">
          {{ $t(opintokokonaisuusTavoiteOtsikko(opintokokonaisuus.tyyppi)) }}
        </h3>
      </div>
    </div>
    <div
      v-if="opintokokonaisuus.tavoitteidenKuvaus"
      class="flex flex-wrap"
    >
      <div class="w-full">
        <h4>{{ $t('tavoitteiden-kuvaus') }}</h4>
        <ep-content-viewer
          :value="$kaanna(opintokokonaisuus.tavoitteidenKuvaus)"
          :kuvat="kuvat"
        />
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="w-full">
        <h4>{{ $kaanna(opintokokonaisuus.opetuksenTavoiteOtsikko) }}</h4>
        <ul>
          <li
            v-for="tavoiteItem in opintokokonaisuus.tavoitteet"
            :key="tavoiteItem.id"
          >
            {{ $kaanna(tavoiteItem.tavoite) }}
          </li>
        </ul>
      </div>
    </div>
    <template v-if="opintokokonaisuus.keskeisetSisallot">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <h3 class="mt-3 mb-4">
            {{ $t('keskeiset-sisallot') }}
          </h3>
          <ep-content-viewer
            :value="$kaanna(opintokokonaisuus.keskeisetSisallot)"
            :kuvat="kuvat"
          />
        </div>
      </div>
    </template>
    <hr>
    <div class="flex flex-wrap">
      <div class="w-full">
        <h3 class="mt-3 mb-4">
          {{ $t('arviointi') }}
        </h3>
      </div>
    </div>
    <div
      v-if="opintokokonaisuus.arvioinninKuvaus"
      class="flex flex-wrap"
    >
      <div class="w-full">
        <h4>{{ $t('arvioinnin-kuvaus') }}</h4>
        <ep-content-viewer
          :value="$kaanna(opintokokonaisuus.arvioinninKuvaus)"
          :kuvat="kuvat"
        />
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="w-full">
        <h4>{{ $t('opiskelijan-osaamisen-arvioinnin-kohteet') }}</h4>
        <ul>
          <li
            v-for="arviointiItem in opintokokonaisuus.arvioinnit"
            :key="arviointiItem.id"
          >
            {{ $kaanna(arviointiItem.arviointi) }}
          </li>
        </ul>
      </div>
    </div>
    <template v-if="opintokokonaisuus.osaamismerkkiKappale && (opintokokonaisuus.osaamismerkkiKappale.kuvaus || osaamisMerkkiKoodit.length > 0)">
      <hr>
      <div class="flex flex-wrap">
        <div class="w-full">
          <h3 class="mb-4">
            {{ $t('kansalliset-perustaitojen-osaamismerkit') }}
          </h3>
        </div>
      </div>
      <div
        v-if="opintokokonaisuus.osaamismerkkiKappale.kuvaus"
        class="flex flex-wrap"
      >
        <div class="w-full">
          <h4 class="mb-4">
            {{ $t('osaamismerkkien-suorittaminen') }}
          </h4>
          <ep-content-viewer
            :value="$kaanna(opintokokonaisuus.osaamismerkkiKappale.kuvaus)"
            :kuvat="kuvat"
            class="mb-5"
          />
        </div>
      </div>
      <div
        v-if="osaamisMerkkiKoodit.length > 0"
        class="flex flex-wrap"
      >
        <div class="w-full">
          <EpOsaamismerkit
            :osaamismerkit="osaamismerkit"
            :osaamismerkki-kategoriat="osaamismerkkiKategoriat"
            hide-kuvaus
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Matala, OpintokokonaisuusDtoTyyppiEnum } from '@shared/api/amosaa';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import * as _ from 'lodash';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import EpOsaamismerkit from '@/routes/osaamismerkit/EpOsaamismerkit.vue';
import { $kaanna, $t } from '@shared/utils/globals';
import { pinia } from '@/pinia';


const props = defineProps({
  sisaltoviite: {
    type: Object as () => Matala,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
});

const osaamismerkitStore = useOsaamismerkitStore(pinia);

onMounted(async () => {
  if (osaamisMerkkiKoodit.value.length > 0) {
    await osaamismerkitStore.updateOsaamismerkitQuery({ koodit: osaamisMerkkiKoodit.value, poistunut: true });
    await osaamismerkitStore.fetchKategoriat({ poistunut: true });
  }
});

const osaamisMerkkiKoodit = computed(() => {
  return _.map(props.sisaltoviite.opintokokonaisuus?.osaamismerkkiKappale?.osaamismerkkiKoodit, koodi => _.toNumber(koodi.koodi));
});

const osaamismerkit = computed(() => {
  return osaamismerkitStore.osaamismerkit;
});

const osaamismerkkiKategoriat = computed(() => {
  return _.chain(osaamismerkitStore.kategoriat)
    .uniqWith(_.isEqual)
    .sortBy(kategoria => $kaanna(kategoria.nimi))
    .filter(kategoria => !!$kaanna(kategoria.nimi))
    .value();
});

const opintokokonaisuus = computed(() => {
  return props.sisaltoviite.opintokokonaisuus;
});

const opintokokonaisuusNimiOtsikko = (tyyppi: OpintokokonaisuusDtoTyyppiEnum): string => {
  return {
    [_.toLower(OpintokokonaisuusDtoTyyppiEnum.OMA)]: 'opintokokonaisuuden-nimi',
    [_.toLower(OpintokokonaisuusDtoTyyppiEnum.PERUSTEESTA)]: 'osaamiskokonaisuuden-nimi',
  }[tyyppi];
};

const opintokokonaisuusTavoiteOtsikko = (tyyppi: OpintokokonaisuusDtoTyyppiEnum): string => {
  return {
    [_.toLower(OpintokokonaisuusDtoTyyppiEnum.OMA)]: 'osaamistavoitteet',
    [_.toLower(OpintokokonaisuusDtoTyyppiEnum.PERUSTEESTA)]: 'opetuksen-tavoitteet',
  }[tyyppi];
};

const laajuusYksikkoLyhenne = computed(() => {
  return opintokokonaisuus.value?.laajuusYksikko
    ? $t(opintokokonaisuus.value?.laajuusYksikko.toLowerCase() + '-lyhenne')
    : $t('opintopiste');
});
</script>

<style scoped lang="scss">

</style>
