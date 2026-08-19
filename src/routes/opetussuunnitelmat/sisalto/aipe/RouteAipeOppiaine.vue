<template>
  <div>
    <router-view
      v-if="kurssiId"
      v-slot="{ Component }"
    >
      <component
        :is="Component"
        v-if="Component"
      >
        <template #previous-next-navigation>
          <slot name="previous-next-navigation" />
        </template>
      </component>
    </router-view>

    <div
      v-else-if="oppiaine"
      class="content"
    >
      <h2>{{ $kaanna(oppiaineNimi) || $t('nimetön-oppiaine') }}</h2>

      <div
        v-if="perusteSisalto?.koodi"
        class="mt-4"
      >
        <h3>{{ $t('koodi') }}</h3>
        <span>{{ perusteSisalto.koodi.arvo }}</span>
      </div>

      <div
        v-if="perusteSisalto?.tehtava"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.tehtava.otsikko) || $t('tehtava') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.tehtava.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.tyotavat"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.tyotavat.otsikko) || $t('oppiaine-osio-tyotavat') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.tyotavat.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.ohjaus"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.ohjaus.otsikko) || $t('oppiaine-osio-ohjaus') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.ohjaus.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.arviointi"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.arviointi.otsikko) || $t('arviointi') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.arviointi.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.sisaltoalueinfo"
        class="mt-4"
      >
        <h3>{{ $kaanna(perusteSisalto.sisaltoalueinfo.otsikko) || $t('sisaltoalueet') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.sisaltoalueinfo.teksti)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.pakollinenKurssiKuvaus"
        class="mt-4"
      >
        <h3>{{ $t('pakollinen-kurssi-kuvaus-header') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.pakollinenKurssiKuvaus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.syventavaKurssiKuvaus"
        class="mt-4"
      >
        <h3>{{ $t('syventava-kurssi-kuvaus-header') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.syventavaKurssiKuvaus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <div
        v-if="perusteSisalto?.soveltavaKurssiKuvaus"
        class="mt-4"
      >
        <h3>{{ $t('soveltava-kurssi-kuvaus-header') }}</h3>
        <ep-content-viewer
          :value="$kaanna(perusteSisalto.soveltavaKurssiKuvaus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </div>

      <template v-if="perusteSisalto?.vapaatTekstit?.length">
        <div
          v-for="(vapaaTeksti, index) in perusteSisalto.vapaatTekstit"
          :key="'vapaateksti'+index"
          class="mt-4"
        >
          <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vapaaTeksti.teksti)"
            :kuvat="kuvat"
            :termit="termit"
          />
        </div>
      </template>

      <div
        v-if="perusteSisalto?.sisaltoalueet?.length"
        class="mt-4"
      >
        <h3>{{ $t('keskeiset-sisaltoalueet') }}</h3>
        <div
          v-for="(alue, index) in perusteSisalto.sisaltoalueet"
          :key="'alue'+index"
          class="mb-3"
        >
          <h4>{{ $kaanna(alue.nimi) }}</h4>
          <ep-content-viewer
            :value="$kaanna(alue.kuvaus)"
            :kuvat="kuvat"
            :termit="termit"
          />
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
            <ep-content-viewer
              :value="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <div v-if="tavoite.kohdealue">
            <h4>{{ $t('kohdealueet') }}</h4>
            <span>{{ $kaanna(tavoite.kohdealue.nimi) }}</span>
          </div>

          <div
            v-if="tavoite.laajaalaisetosaamiset.length > 0"
            class="mt-4"
          >
            <h4>{{ $t('laaja-alaisen-osaamisen-alueet') }}</h4>

            <ep-collapse
              v-for="(lao, laoIndex) in tavoite.laajaalaisetosaamiset"
              :key="'lao'+laoIndex"
              class="lao"
              :border-bottom="false"
              :expanded-by-default="false"
              chevron-location="left"
              :use-padding="false"
            >
              <template #header>
                <h5>{{ $kaanna(lao.nimi) }}</h5>
              </template>
              <ep-content-viewer
                :value="$kaanna(lao.kuvaus)"
                :kuvat="kuvat"
                :termit="termit"
              />
            </ep-collapse>
          </div>

          <div
            v-if="tavoite.kohdeTeksti"
            class="mt-4"
          >
            <h4>{{ $t('arvioinnin-kohde') }}</h4>
            <ep-content-viewer
              :value="$kaanna(tavoite.kohdeTeksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>

          <div
            v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0"
            class="mt-4"
          >
            <h4
              v-if="tavoite.arvioinninOtsikko"
              class="mb-0 pb-0"
            >
              {{ $kaanna(tavoite.arvioinninOtsikko) }}
            </h4>
            <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
          </div>

          <div
            v-if="tavoite.vapaaTeksti"
            class="mt-4"
          >
            <ep-content-viewer
              :value="$kaanna(tavoite.vapaaTeksti)"
              :kuvat="kuvat"
              :termit="termit"
            />
          </div>
        </div>
      </ep-collapse>

      <EpPaikallinenTarkennus
        v-if="$kaanna(oppiaine.paikallinenTarkennus)"
        class="mt-4"
        headerh4
      >
        <ep-content-viewer
          :value="$kaanna(oppiaine.paikallinenTarkennus)"
          :kuvat="kuvat"
          :termit="termit"
        />
      </EpPaikallinenTarkennus>

      <div
        v-if="oppimaarat.length > 0"
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
        v-if="kurssit.length > 0"
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

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpArvioinninkohteetTable from '@shared/components/EpArvioinninkohteetTable/EpArvioinninkohteetTable.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { getSulussaNumero } from '@shared/utils/perusteet';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();
const route = useRoute();
const tavoitecollapse = useTemplateRef('tavoitecollapse');

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const kurssiId = computed(() => {
  return route.params.kurssiId;
});

const oppiaine = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: oppiaineId.value });
});

const perusteSisalto = computed(() => {
  return oppiaine.value?.perusteSisalto;
});

const oppiaineNimi = computed(() => {
  return oppiaine.value?.nimi;
});

const oppimaarat = computed(() => {
  return _.map(oppiaine.value?.oppimaarat, oppimaara => {
    return {
      ...oppimaara,
      route: {
        name: 'opetussuunnitelmaaipeoppiaine',
        params: {
          vaiheId: _.toString(route.params.vaiheId),
          oppiaineId: _.toString(oppimaara.id),
        },
      },
    };
  });
});

const kurssit = computed(() => {
  return _.map(oppiaine.value?.kurssit, kurssi => {
    return {
      ...kurssi,
      route: {
        name: 'opetussuunnitelmaaipekurssi',
        params: {
          vaiheId: _.toString(route.params.vaiheId),
          oppiaineId: _.toString(oppiaine.value.id),
          kurssiId: _.toString(kurssi.id),
        },
      },
    };
  });
});

const arvioinninKohteenTeksti = (tavoite) => {
  const hyvanOsaamisenArvio = _.find(tavoite.arvioinninkohteet, (arvioinninkohde: any) => arvioinninkohde.arvosana === 8);

  if (hyvanOsaamisenArvio && !_.isEmpty(hyvanOsaamisenArvio.arvioinninKohde)) {
    return hyvanOsaamisenArvio.arvioinninKohde;
  }

  return tavoite.arvioinninKuvaus;
};

const tavoitteet = computed(() => {
  return _.map(perusteSisalto.value?.tavoitteet, (tavoite: any) => {
    const kohdealueet = tavoite.kohdealueet || [];
    return {
      ...tavoite,
      kohdealue: _.head(kohdealueet),
      laajaalaisetosaamiset: _.sortBy(tavoite.laajaalaisetosaamiset || [], lao => getSulussaNumero(lao.nimi)),
      kohdeTeksti: arvioinninKohteenTeksti(tavoite),
    };
  });
});

const toggleTavoite = () => {
  _.forEach(tavoitecollapse.value, (tavoite: any) => tavoite.toggle());
};

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
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
