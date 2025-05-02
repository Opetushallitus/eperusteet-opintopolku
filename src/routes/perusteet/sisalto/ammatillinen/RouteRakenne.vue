<template>
  <div class="content">
    <ep-spinner v-if="!rakenne || !peruste" />
    <div v-else>
      <h2>{{ $t('tutkinnon-muodostuminen') }}</h2>

      <div
        class="mb-5"
        v-html="$kaanna(rakenne.kuvaus)"
      />

      <h3>{{ $kaanna(peruste.nimi) }} <span v-if="laajuus">{{ laajuus }} {{ $t('osaamispiste') }}</span></h3>

      <ep-peruste-rakenne
        v-if="rakenneOsat"
        :rakenne-osat="rakenneOsat"
      >
        <template #nimi="{ rakenneosa }">
          <div class="d-flex">
            <div v-if="rakenneosa.tutkinnonosa">
              <router-link :to="{name: 'tutkinnonosa', params: { tutkinnonOsaViiteId: rakenneosa._tutkinnonOsaViite}}">
                <ep-color-indicator
                  :id="'tutkinto'+rakenneosa._tutkinnonOsaViite"
                  :tooltip="false"
                  :kind="rakenneosa.pakollinen ? 'pakollinen' : 'valinnainen'"
                  class="mr-2"
                />
                {{ $kaanna(rakenneosa.tutkinnonosa.tutkinnonOsa.nimi) }} <span v-if="rakenneosa.koodiArvo">({{ rakenneosa.koodiArvo }})</span>
              </router-link>
              <b-popover
                :target="'tutkinto'+rakenneosa._tutkinnonOsaViite"
                :placement="'top'"
                triggers="hover"
                variant="primary"
              >
                <span v-if="rakenneosa.pakollinen">{{ $t('pakollinen-tutkinnon-osa') }}</span>
                <span v-if="!rakenneosa.pakollinen">{{ $t('valinnainen-tutkinnon-osa') }}</span>
              </b-popover>
            </div>
            <span v-else>
              {{ $kaanna(rakenneosa.nimi) }} <span v-if="rakenneosa.koodiArvo">({{ rakenneosa.koodiArvo }})</span>
            </span>
          </div>
        </template>
      </ep-peruste-rakenne>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, useTemplateRef } from 'vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import PerusteRakenneOsa from '@/components/EpAmmatillinen/PerusteRakenneOsa.vue';

import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpPerusteRakenne from '@/components/EpAmmatillinen/EpPerusteRakenne.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

const perusteDataStore = getCachedPerusteStore();

const naytaRakenteet = ref(false);
const naytaKuvaukset = ref(false);
const query = ref('');
const rakenneosa = useTemplateRef('rakenneosa');

const peruste = computed(() => {
  return perusteDataStore.peruste;
});

const rakenne = computed((): any => {
  return _.get(_.first(perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat')), 'rakenne');
});

const perusteenTutkinnonosaViitteetById = computed(() => {
  return _.keyBy(_.chain(perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat'))
    .map(st => st.tutkinnonOsaViitteet)
    .flatMap()
    .value(), 'id');
});

const perusteenTutkinnonosatById = computed(() => {
  return _.keyBy(perusteDataStore.getJulkaistuPerusteSisalto('tutkinnonOsat'), 'id');
});

const setRakenneOsaKoodi = (rakenneOsat) => {
  return _.map(rakenneOsat, rakenneosa => {
    let tutkinnonosaviite;
    let tutkinnonOsa;
    if (_.get(rakenneosa, '_tutkinnonOsaViite')) {
      tutkinnonosaviite = perusteenTutkinnonosaViitteetById.value[_.get(rakenneosa, '_tutkinnonOsaViite')];
      tutkinnonOsa = perusteenTutkinnonosatById.value[_.get(tutkinnonosaviite, '_tutkinnonOsa')];
    }
    return {
      ...rakenneosa,
      koodiArvo: getRakenneosaKoodiArvo(rakenneosa),
      osat: setRakenneOsaKoodi(rakenneosa.osat),
      ...(tutkinnonosaviite && { tutkinnonosa: {
        ...tutkinnonosaviite,
        tutkinnonOsa,
      } }),
    };
  });
};

const getRakenneosaKoodiArvo = (rakenneosa) => {
  if (rakenneosa.tutkintonimike?.arvo) {
    return rakenneosa.tutkintonimike?.arvo;
  }

  if (rakenneosa.tutkinnonosa?.tutkinnonOsa?.koodi?.arvo) {
    return rakenneosa.tutkinnonosa?.tutkinnonOsa?.koodi?.arvo;
  }

  if (rakenneosa.osaamisala?.osaamisalakoodiArvo) {
    return rakenneosa.osaamisala?.osaamisalakoodiArvo;
  }
};

const rakenneOsat = computed(() => {
  return setRakenneOsaKoodi(rakenne.value?.osat);
});

const laajuus = computed(() => {
  if (rakenne.value.muodostumisSaanto && rakenne.value.muodostumisSaanto.laajuus) {
    return rakenne.value.muodostumisSaanto.laajuus.maksimi;
  }
});

const rakenneOsaSuljeTeksti = computed(() => {
  if (!naytaRakenteet.value) {
    return 'avaa-kaikki';
  }
  else {
    return 'sulje-kaikki';
  }
});

const rakenneOsaKuvasTeksti = computed(() => {
  if (!naytaKuvaukset.value) {
    return 'nayta-ryhmien-kuvaukset';
  }
  else {
    return 'piilota-ryhmien-kuvaukset';
  }
});

const toggleRakenne = () => {
  naytaRakenteet.value = !naytaRakenteet.value;
  _.forEach(rakenneosa.value, (rakenneosa: any) => rakenneosa.toggleRakenne(naytaRakenteet.value));
};

const toggleKuvaukset = () => {
  naytaKuvaukset.value = !naytaKuvaukset.value;
  _.forEach(rakenneosa.value, (rakenneosa: any) => rakenneosa.toggleKuvaus(naytaKuvaukset.value));
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
