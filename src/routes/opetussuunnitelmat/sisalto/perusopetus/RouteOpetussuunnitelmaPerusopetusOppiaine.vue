<template>
  <div class="content">
    <EpSpinner v-if="!oppiaine" />
    <template v-else>
      <h2>{{ $kaanna(oppiaine.nimi) }}</h2>

      <template v-if="perusteOppiaine">
        <ep-peruste-content
          :nayta-sisalto-tyhjana="false"
          :peruste-object="perusteOppiaine.tehtava"
          :pohja-object="pohjanOppiaine.tehtava"
          :object="oppiaine.tehtava"
          :kuvat="kuvat"
          :termit="termit"
        />

        <template v-if="perusteOppiaineVapaatTekstit">
          <div
            v-for="(vapaaTeksti, index) in perusteOppiaineVapaatTekstit"
            :key="'vapaateksti'+index"
            class="mt-5"
          >
            <h4>{{ $kaanna(vapaaTeksti.nimi) }}</h4>
            <ep-content-viewer
              :value="$kaanna(vapaaTeksti.teksti)"
              :kuvat="kuvat"
              :termit="termit"
            />

            <EpPaikallinenTarkennus
              v-if="vapaaTeksti.oppiaineVapaaTeksti.paikallinenTarkennus"
              headerh4
            >
              <ep-content-viewer
                :value="$kaanna(vapaaTeksti.oppiaineVapaaTeksti.paikallinenTarkennus)"
                :kuvat="kuvat"
                :termit="termit"
              />
            </EpPaikallinenTarkennus>
          </div>
        </template>
      </template>

      <b-tabs
        v-if="!vlkId"
        class="ml-0 pl-0 mt-4"
      >
        <b-tab
          v-for="(opVlk, index) in oppiaineenVuosiluokkakokonaisuudetSorted"
          :key="'vlk'+index"
          class="mt-4"
          :title="$kaanna(opVlk.vuosiluokkakokonaisuus.nimi)"
        >
          <oppiaineen-vuosiluokkakokonaisuus
            :tietue="opVlk"
            :kuvat="kuvat"
            :termit="termit"
          />
        </b-tab>
      </b-tabs>

      <oppiaineen-vuosiluokkakokonaisuus
        v-else-if="oppiaineenVuosiluokkakokonaisuus"
        :tietue="oppiaineenVuosiluokkakokonaisuus"
        :kuvat="kuvat"
        :termit="termit"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import OppiaineenVuosiluokkakokonaisuus from './OppiaineenVuosiluokkakokonaisuus.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { UnwrappedOpsOppiaineDtoTyyppiEnum } from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpAlert from '@shared/components/EpAlert/EpAlert.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { oppiaineenVuosiluokkakokonaisuudenRakennin } from './vuosiluokka';
import { $kaanna } from '@shared/utils/globals';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const route = useRoute();

const kuvat = computed(() => {
  return opetussuunnitelmaDataStore.kuvat;
});

const termit = computed(() => {
  return opetussuunnitelmaDataStore.kaikkiTermit;
});

const vlkId = computed(() => {
  return route.params.vlkId;
});

const oppiaineId = computed(() => {
  return _.toNumber(route.params.oppiaineId);
});

const oppiaine = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: oppiaineId.value });
});

const pohjanOppiaine = computed(() => {
  return oppiaine.value?.pohjanOppiaine ?? {};
});

const perusteOppiaine = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ tunniste: oppiaine.value?.tunniste });
});

const opetussuunnitelmanVuosiluokkakokonaisuudet = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuSisalto('vuosiluokkakokonaisuudet');
});

const perusteenVuosiluokkakokonaisuudet = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.vuosiluokkakokonaisuudet');
});

const perusteOppiaineVuosiluokkakokonaisuudet = computed(() => {
  return _.map(perusteOppiaine.value?.vuosiluokkakokonaisuudet, ovlk => {
    return {
      ...ovlk,
      tunniste: _.get(_.find(perusteenVuosiluokkakokonaisuudet.value, pvlk => _.toString(pvlk.id) === _.get(ovlk, '_vuosiluokkaKokonaisuus')), 'tunniste'),
    };
  });
});

const perusteOppiaineVapaatTekstit = computed(() => {
  return _.map(perusteOppiaine.value?.vapaatTekstit, povt => {
    return {
      ...povt,
      oppiaineVapaaTeksti: _.find(oppiaine.value?.vapaatTekstit, ovt => _.toString(povt.id) === _.toString(ovt.perusteenVapaaTekstiId)) || {},
    };
  });
});

const oppiaineenPohjanVuosiluokkakokonaisuudet = computed(() => {
  return oppiaine.value?.pohjanOppiaine?.vuosiluokkakokonaisuudet;
});

const laajaalaisetOsaamiset = computed(() => {
  return opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset');
});

const oppiaineenVuosiluokkakokonaisuudet = computed(() => {
  const oppiaineenVlk = _.chain(oppiaine.value?.vuosiluokkakokonaisuudet)
    .filter(vlk =>
      _.includes(_.map(opetussuunnitelmanVuosiluokkakokonaisuudet.value, 'vuosiluokkakokonaisuus._tunniste'), _.get(vlk, '_vuosiluokkakokonaisuus')))
    .filter(vlk => oppiaine.value?.tyyppi !== _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN) || _.includes(_.map(perusteOppiaineVuosiluokkakokonaisuudet.value, 'tunniste'), _.get(vlk, '_vuosiluokkakokonaisuus')))
    .value();

  return _.map(oppiaineenVlk, (oppiaineenVuosiluokkakokonaisuus) => {
    const opetussuunnitelmanVuosiluokkakokonaisuus = _.get(_.find(opetussuunnitelmanVuosiluokkakokonaisuudet.value, vlk => _.get(vlk.vuosiluokkakokonaisuus, '_tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus')), 'vuosiluokkakokonaisuus') as any;
    const perusteenVuosiluokkakokonaisuus = _.find(perusteenVuosiluokkakokonaisuudet.value, vlk => vlk.tunniste === (opetussuunnitelmanVuosiluokkakokonaisuus as any)._tunniste);

    if (oppiaine.value?.tyyppi === _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN)) {
      const perusteenOppiaineenVlk = _.find(perusteOppiaineVuosiluokkakokonaisuudet.value, vlk => vlk.tunniste === (opetussuunnitelmanVuosiluokkakokonaisuus as any)._tunniste);
      const oppiaineenPohjanVuosiluokkakokonaisuus = _.find(oppiaineenPohjanVuosiluokkakokonaisuudet.value, ovlk => _.get(ovlk, '_vuosiluokkakokonaisuus') === _.get(opetussuunnitelmanVuosiluokkakokonaisuus, '_tunniste'));

      return oppiaineenVuosiluokkakokonaisuudenRakennin(
        oppiaine.value,
        perusteOppiaine.value,
        laajaalaisetOsaamiset.value,
        oppiaineenVuosiluokkakokonaisuus,
        opetussuunnitelmanVuosiluokkakokonaisuus,
        perusteenOppiaineenVlk,
        oppiaineenPohjanVuosiluokkakokonaisuus,
        perusteenVuosiluokkakokonaisuus,
      );
    }
    else {
      return {
        vuosiluokkakokonaisuus: opetussuunnitelmanVuosiluokkakokonaisuus,
        oppiaineenVuosiluokkakokonaisuus,
        oppiaine: oppiaine.value,
      };
    }
  });
});

const oppiaineenVuosiluokkakokonaisuudetSorted = computed(() => {
  return _.chain(oppiaineenVuosiluokkakokonaisuudet.value)
    .map(ovlk => {
      return {
        ...ovlk,
        oppiaineenPohjanVuosiluokkakokonaisuus: _.find(oppiaineenPohjanVuosiluokkakokonaisuudet.value, opvlk => opvlk._vuosiluokkakokonaisuus === ovlk.vuosiluokkakokonaisuus._tunniste),
      };
    })
    .sortBy(ovlk => $kaanna(ovlk.vuosiluokkakokonaisuus.nimi))
    .value();
});

const oppiaineenVuosiluokkakokonaisuus = computed(() => {
  return _.chain(oppiaineenVuosiluokkakokonaisuudet.value)
    .map(ovlk => {
      return {
        ...ovlk,
        oppiaineenPohjanVuosiluokkakokonaisuus: _.find(oppiaineenPohjanVuosiluokkakokonaisuudet.value, opvlk => opvlk._vuosiluokkakokonaisuus === ovlk.vuosiluokkakokonaisuus._tunniste),
      };
    })
    .find(ovlk => _.toNumber(ovlk.vuosiluokkakokonaisuus.id) === _.toNumber(vlkId.value))
    .value();
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
