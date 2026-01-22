<template>
  <div>
    <h2>{{ $kaanna(sisaltoviite.tekstiKappale.nimi) }}<span v-if="laajuus">, {{ laajuus }} {{ $t('osaamispiste-lyhenne') }}</span></h2>
    <ep-content-viewer
      :value="$kaanna(sisaltoviite.tekstiKappale.teksti)"
      :kuvat="kuvat"
    />

    <ep-spinner v-if="!rakenne" />

    <div v-else>
      <ep-content-viewer
        v-if="sisaltoviite.naytaPerusteenTeksti"
        :value="$kaanna(rakenne.kuvaus)"
        :kuvat="kuvat"
      />
      <ep-peruste-rakenne :rakenne-osat="filteredRakenneOsat">
        <template #nimi="{ rakenneosa }">
          <div v-if="rakenneosa.tutkinnonosa && rakenneosa.tutkinnonosa.nimi">
            <EpPopover :triggers="['hover']">
              <template #trigger>
                <router-link :to="{name: 'toteutussuunnitelmaSisalto', params: { sisaltoviiteId: rakenneosa.tutkinnonosa.id}}">
                  <ep-color-indicator
                    :id="'tutkinto'+rakenneosa.tutkinnonosa.id"
                    :tooltip="false"
                    :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'"
                    class="mr-2"
                  />
                  <span>{{ $kaanna(rakenneosa.tutkinnonosa.nimi) }}</span>
                </router-link>
              </template>
              <span v-if="rakenneosa.pakollinen">{{ $t('pakollinen-tutkinnon-osa') }}</span>
              <span v-if="!rakenneosa.pakollinen">{{ $t('valinnainen-tutkinnon-osa') }}</span>
            </EpPopover>
          </div>
          <div v-else-if="rakenneosa.tutkinnonosa && rakenneosa.tutkinnonosa.perusteenTutkinnonosa">
            <ep-color-indicator
              :id="'tutkinto'+rakenneosa.tutkinnonosa.perusteenTutkinnonosa.id"
              :tooltip="false"
              :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'"
              class="mr-2"
            />
            <span>{{ $kaanna(rakenneosa.tutkinnonosa.perusteenTutkinnonosa.nimi) }}</span>
          </div>
          <span v-else>
            {{ $kaanna(rakenneosa.nimi) }}
          </span>
        </template>
      </ep-peruste-rakenne>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Matala, OpetussuunnitelmaKaikkiDto } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPerusteRakenne from '@/components/EpAmmatillinen/EpPerusteRakenne.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpPopover from '@shared/components/EpPopover/EpPopover.vue';
import * as _ from 'lodash';
import { flattenTree } from '@shared/utils/helpers';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => Matala,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
  opetussuunnitelma: {
    type: Object as () => OpetussuunnitelmaKaikkiDto,
    required: true,
  },
});

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const rakenne = computed((): any => {
  const suorituspolku = _.find(props.opetussuunnitelma.suorituspolut, polku => polku.sisaltoviiteId === props.sisaltoviite.id);

  return {
    ...suorituspolku,
    osat: lisaaTutkinnonOsat(suorituspolku?.osat || []),
  };
});

const lisaaTutkinnonOsat = (osat: any[]) => {
  return _.map(osat, osa => {
    const perusteenTutkinnonosaViite = perusteidenTutkinnonosienViitteetById.value[_.toNumber(osa['_tutkinnonOsaViite'])];
    const tutkinnonosa = tutkinnonosaViitteetById.value[_.toNumber(osa['_tutkinnonOsaViite'])];
    return {
      ...osa,
      tutkinnonosa: {
        ...(!!tutkinnonosa && tutkinnonosa),
        ...(!!perusteenTutkinnonosaViite && { perusteenTutkinnonosaViite: perusteenTutkinnonosaViite }),
        ...(!!perusteenTutkinnonosaViite && { perusteenTutkinnonosa: perusteidenTutkinnonOsatById.value[_.toNumber(_.get(perusteenTutkinnonosaViite, '_tutkinnonOsa'))] }),
      },
      osat: lisaaTutkinnonOsat(osa.osat),
    };
  });
};

const rakenneTutkinnonOsilla = computed(() => {
  if (rakenne.value) {
    return setTutkinnonOsaViitteet(rakenne.value.osat);
  }
  return undefined;
});

const setTutkinnonOsaViitteet = (osat: any[]) => {
  return _.chain(osat)
    .map(osa => {
      let paikallisetOsat: any[] = [];
      if (_.size(osa.paikallinenKuvaus?.koodit) > 0) {
        paikallisetOsat = paikallisetTutkinnonOsatKoodeistaOsiksi(_.map(osa.paikallinenKuvaus?.koodit, koodi => trimkoodiarvo(koodi)));
      }

      return {
        ...osa,
        osat: setTutkinnonOsaViitteet([
          ...(osa.osat ? osa.osat : []),
          ...paikallisetOsat,
        ]),
      };
    })
    .value();
};

const paikallisetTutkinnonOsatKoodeistaOsiksi = (koodit): any[] => {
  return _.map(koodit, koodi => {
    return {
      tutkinnonosa: _.find(tutkinnonosaViitteet.value, tosaviite => trimkoodiarvo(tosaviite?.tosa?.omatutkinnonosa?.koodi) === koodi || trimkoodiarvo(tosaviite?.tosa?.koodi) === koodi),
    };
  });
};

const trimkoodiarvo = (koodi) => {
  return _.trim(_.split(koodi, '_')[_.size(_.split(koodi, '_')) - 1]);
};

const filteredRakenneOsat = computed(() => {
  if (rakenne.value) {
    return filterRakenneOsat(rakenneTutkinnonOsilla.value);
  }
  return undefined;
});

const filterRakenneOsat = (osat: any[]) => {
  return _.chain(osat)
    .filter(osa => !_.includes(piilotetutTunnisteet.value, osa.tunniste))
    .map(osa => {
      return {
        ...osa,
        osat: filterRakenneOsat(osa.osat),
      };
    })
    .value();
};

const julkaistuTutkinnonosaViitteet = computed(() => {
  const tutkinnonosatViite = opetussuunnitelmaDataStore.getJulkaistuSisalto({ 'tyyppi': 'tutkinnonosat' });
  return _.filter(flattenTree(tutkinnonosatViite, 'lapset'), viite => viite.tyyppi === 'tutkinnonosa');
});

const julkaistutTutkinnonOsat = computed(() => {
  return _.filter(opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat'), tosa => tosa.tyyppi === 'tutkinnonosa');
});

const perusteenTutkinnonosaViite = (perusteenTutkinnonosaId) => {
  return _.find(opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, perusteTosaViite => _.get(perusteTosaViite, '_tutkinnonOsa') === _.toString(perusteenTutkinnonosaId));
};

const perusteenTutkinnonosa = (perusteenTutkinnonosaId) => {
  return _.find(opetussuunnitelmaDataStore.perusteidenTutkinnonOsat, perusteTosa => perusteTosa.id === perusteenTutkinnonosaId);
};

const tutkinnonosaViitteet = computed(() => {
  return _.chain(julkaistuTutkinnonosaViitteet.value)
    .map(tutkinnonosaViite => {
      const tutkinnonosa = _.find(julkaistutTutkinnonOsat.value, tutkinnonosa => tutkinnonosa.tosa.id === tutkinnonosaViite.tosa.id);
      return {
        ...tutkinnonosaViite,
        perusteenTutkinnonosaViite: perusteenTutkinnonosaViite(tutkinnonosa.tosa.perusteentutkinnonosa),
        perusteenTutkinnonosa: perusteenTutkinnonosa(tutkinnonosa.tosa.perusteentutkinnonosa),
        tosa: tutkinnonosa.tosa,
      };
    })
    .sortBy('perusteenTutkinnonosaViite.jarjestys')
    .value();
});

const tutkinnonosaViitteetById = computed(() => {
  return _.keyBy(tutkinnonosaViitteet.value, 'perusteenTutkinnonosaViite.id');
});

const perusteidenTutkinnonosienViitteetById = computed(() => {
  return _.keyBy(opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, 'id');
});

const perusteidenTutkinnonOsatById = computed(() => {
  return _.keyBy(opetussuunnitelmaDataStore.perusteidenTutkinnonOsat, 'id');
});

const piilotetutTunnisteet = computed(() => {
  return _.chain(props.sisaltoviite.suorituspolku!.rivit)
    .filter('piilotettu')
    .map('rakennemoduuli')
    .value();
});

const laajuus = computed(() => {
  return props.sisaltoviite?.suorituspolku?.osasuorituspolkuLaajuus;
});
</script>

<style scoped lang="scss">

</style>
