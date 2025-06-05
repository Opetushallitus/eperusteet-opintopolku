<template>
  <router-view v-if="kurssi" />

  <div
    v-else
    class="content"
  >
    <h2>{{ $kaanna(oppiaine.nimi) }}</h2>

    <div
      v-if="oppiaine.koodi"
      class="mt-4"
    >
      <h3>{{ $t('koodi') }}</h3>
      <span>{{ oppiaine.koodi.arvo }}</span>
    </div>

    <div
      v-if="oppiaine.tehtava"
      class="mt-4"
    >
      <h3>{{ $kaanna(oppiaine.tehtava.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.tehtava.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.tyotavat"
      class="mt-4"
    >
      <h3>{{ $kaanna(oppiaine.tyotavat.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.tyotavat.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.ohjaus"
      class="mt-4"
    >
      <h3>{{ $kaanna(oppiaine.ohjaus.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.ohjaus.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.arviointi"
      class="mt-4"
    >
      <h3>{{ $kaanna(oppiaine.arviointi.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.arviointi.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.sisaltoalueinfo"
      class="mt-4"
    >
      <h3>{{ $kaanna(oppiaine.sisaltoalueinfo.otsikko) }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.sisaltoalueinfo.teksti)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.pakollinenKurssiKuvaus"
      class="mt-4"
    >
      <h3>{{ $t('pakollinen-kurssi-kuvaus-header') }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.pakollinenKurssiKuvaus)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.syventavaKurssiKuvaus"
      class="mt-4"
    >
      <h3>{{ $t('syventava-kurssi-kuvaus-header') }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.syventavaKurssiKuvaus)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppiaine.soveltavaKurssiKuvaus"
      class="mt-4"
    >
      <h3>{{ $t('soveltava-kurssi-kuvaus-header') }}</h3>
      <ep-content-viewer
        :value="$kaanna(oppiaine.soveltavaKurssiKuvaus)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="oppimaarat && oppimaarat.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('oppimaarat') }}</h3>
      <div
        v-for="oppimaara in oppimaarat"
        :key="'oppimaara'+oppimaara.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        <router-link :to="oppimaara.route">
          {{ $kaanna(oppimaara.nimi) }}
        </router-link>
      </div>
    </div>

    <div
      v-if="kurssit && kurssit.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('kurssit') }}</h3>
      <div
        v-for="kurssi in kurssit"
        :key="'kurssi'+kurssi.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        <router-link :to="kurssi.route">
          {{ $kaanna(kurssi.nimi) }}
        </router-link>
      </div>
    </div>

    <ep-button
      v-if="tavoitteet.length > 0"
      class="mt-5"
      variant="link"
      @click="toggleTavoite()"
    >
      {{ $t('avaa-sulje-kaikki') }}
    </ep-button>

    <ep-collapse
      v-for="(tavoite, index) in tavoitteet"
      ref="tavoitecollapse"
      :key="'tavoite'+index"
      :border-bottom="false"
      :expanded-by-default="false"
      :shadow="true"
    >
      <template #header>
        <h3 v-html="$kaanna(tavoite.tavoite)" />
      </template>

      <div class="mt-4">
        <div v-if="tavoite.tavoitteistaJohdetutOppimisenTavoitteet">
          <h4>{{ $t('tavoitteista-johdetut-oppimisen-tavoitteet') }}</h4>
          <span v-html="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)" />
        </div>

        <div v-if="tavoite.kohdealue">
          <h4>{{ $t('kohdealueet') }}</h4>
          <span v-html="$kaanna(tavoite.kohdealue.nimi)" />
        </div>

        <div
          v-if="tavoite.laajaalaisetosaamiset.length > 0"
          class="mt-4"
        >
          <h4>{{ $t('laaja-alaisen-osaamisen-alueet') }}</h4>

          <ep-collapse
            v-for="(lao, index) in tavoite.laajaalaisetosaamiset"
            :key="'lao'+index"
            class="lao"
            :border-bottom="false"
            :expanded-by-default="false"
            chevron-location="left"
          >
            <template #header>
              <h5 v-html="$kaanna(lao.nimi)" />
            </template>

            <div v-html="$kaanna(lao.kuvaus)" />
          </ep-collapse>

          <div
            v-if="tavoite.kohdeTeksti"
            class="mt-4"
          >
            <h4>{{ $t('arvioinnin-kohde') }}</h4>
            <span v-html="$kaanna(tavoite.kohdeTeksti)" />
          </div>
        </div>

        <div
          v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0"
          class="mt-4"
        >
          <h4 class="mb-0 pb-0">
            {{ $kaanna(tavoite.arvioinninOtsikko) }}
          </h4>
          <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
        </div>

        <div
          v-if="tavoite.vapaaTeksti "
          class="mt-4"
        >
          <ep-content-viewer
            :value="$kaanna(tavoite.vapaaTeksti)"
            :kuvat="kuvat"
          />
        </div>
      </div>
    </ep-collapse>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

import EpArvioinninkohteetTable from '@shared/components/EpArvioinninkohteetTable/EpArvioinninkohteetTable.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();
const tavoitecollapse = useTemplateRef('tavoitecollapse');

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: oppiaineId.value });
});

const vaiheId = computed(() => {
  return _.toNumber(route.params.vaiheId);
});

const vaihe = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: vaiheId.value });
});

const oppimaarat = computed(() => {
  if (oppiaine.value.oppimaarat) {
    return _.map(oppiaine.value.oppimaarat, oppimaara => {
      return {
        ...oppimaara,
        route: { name: 'aipeoppiaine', params: { oppiaineId: _.toString(oppimaara.id) } },
      };
    });
  }
  return [];
});

const kurssit = computed(() => {
  if (oppiaine.value) {
    return _.map(oppiaine.value.kurssit, kurssi => {
      return {
        ...kurssi,
        route: { name: 'aipekurssi', params: { kurssiId: _.toString(kurssi.id) } },
      };
    });
  }
  return [];
});

const laajaAlaisetOsaamisetById = computed(() => {
  return _.keyBy(perusteDataStore.getJulkaistuPerusteSisalto('aipe.laajaalaisetosaamiset'), 'id');
});

const kohdealueetById = computed(() => {
  if (vaihe.value) {
    return _.keyBy(vaihe.value.opetuksenKohdealueet, 'id');
  }
  else {
    return {};
  }
});

const arvioinninKohteenTeksti = (tavoite) => {
  const hyvanOsaamisenArvio = _.find(tavoite.arvioinninkohteet, (arvioinninkohde: any) => arvioinninkohde.arvosana === 8);

  if (hyvanOsaamisenArvio && !_.isEmpty(hyvanOsaamisenArvio.arvioinninKohde)) {
    return hyvanOsaamisenArvio.arvioinninKohde;
  }

  return tavoite.arvioinninKuvaus;
};

const tavoitteet = computed(() => {
  if (oppiaine.value) {
    return _.map(oppiaine.value.tavoitteet, (tavoite: any) => {
      return {
        ...tavoite,
        kohdealue: kohdealueetById.value[_.head(tavoite.kohdealueet) as any],
        laajaalaisetosaamiset: _.map(tavoite.laajattavoitteet, lao => laajaAlaisetOsaamisetById.value[lao as any]),
        kohdeTeksti: arvioinninKohteenTeksti(tavoite),
      };
    });
  }
  return [];
});

const kurssi = computed(() => {
  return route.params.kurssiId;
});

const fields = computed(() => {
  return [{
    key: 'nimi',
    thStyle: {
      display: 'none',
    },
  }];
});

const toggleTavoite = () => {
  _.forEach(tavoitecollapse.value, (tavoite: any) => tavoite.toggle());
};

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  :deep(.ep-button .btn-link) {
    padding-left: 0px;
  }

  .lao {
    :deep(.ep-collapse) {
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
}
</style>
