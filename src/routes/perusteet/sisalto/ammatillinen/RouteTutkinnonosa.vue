<template>
  <div class="content">
    <ep-spinner v-if="!tutkinnonosa" />
    <div v-else>
      <h2
        class="otsikko mb-4"
      >
        {{ $kaanna(tutkinnonosa.nimi) }}{{ laajuusText }}
      </h2>

      <ep-tutkinnonosa-normaali
        v-if="tutkinnonosa.tyyppi === 'normaali'"
        :tutkinnonosa="tutkinnonosa"
        :arviointiasteikot="arviointiasteikot"
      />
      <ep-tutkinnonosa-tutke
        v-else
        :tutkinnonosa="tutkinnonosa"
        :arviointiasteikot="arviointiasteikot"
        :perusteen-kielet="perusteenKielet"
      />

      <EpOpasKiinnitysLinkki
        v-if="tutkinnonosaKoodiUri"
        :koodi-uri="tutkinnonosaKoodiUri"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { $t } from '@shared/utils/globals';

const perusteDataStore = getCachedPerusteStore();

const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (route.query?.redirect) {
    const viite = _.find(perusteenTutkinnonosaViitteet.value, viite => _.toNumber(viite._tutkinnonOsa) === _.toNumber(route.params.tutkinnonOsaViiteId));
    router.replace(
      {
        name: 'tutkinnonosa',
        params: {
          perusteId: _.toString(perusteDataStore.peruste?.id),
          tutkinnonOsaViiteId: viite.id,
        },
      });
  }
});

const tutkinnonosaViiteId = computed(() => {
  return _.toNumber(route.params.tutkinnonOsaViiteId);
});

const tutkinnonosaViite = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: tutkinnonosaViiteId.value }) as any;
});

const perusteenTutkinnonosaViitteet = computed(() => {
  return _.chain(perusteDataStore.getJulkaistuPerusteSisalto('suoritustavat'))
    .map(st => st.tutkinnonOsaViitteet)
    .flatMap()
    .value();
});

const perusteenTutkinnonosa = computed(() => {
  return perusteDataStore.getJulkaistuPerusteSisalto({ id: _.toNumber(_.get(tutkinnonosaViite.value, '_tutkinnonOsa')) }) as any;
});

const laajuus = computed(() => {
  if (_.isNumber(tutkinnonosaViite.value.laajuus) && _.isNumber(tutkinnonosaViite.value.laajuusMaksimi)) {
    return tutkinnonosaViite.value.laajuus + ' - ' + tutkinnonosaViite.value.laajuusMaksimi;
  }

  return tutkinnonosaViite.value.laajuus;
});

const laajuusText = computed(() => {
  if (!tutkinnonosaViite.value.laajuus) {
    return '';
  }
  return ', ' + laajuus.value + ' ' + $t('osaamispiste');
});

const arviointiasteikot = computed(() => {
  return perusteDataStore.arviointiasteikot;
});

const tutkinnonosaKoodiUri = computed(() => {
  return tutkinnonosa.value?.koodi?.uri;
});

const perusteenKielet = computed(() => {
  return perusteDataStore.peruste?.kielet;
});

const tutkinnonosa = computed(() => {
  let tutkinnonosa = _.cloneDeep(perusteenTutkinnonosa.value);

  if (_.get(tutkinnonosa, 'geneerinenArviointiasteikko') && !!_.get(tutkinnonosa.geneerinenArviointiasteikko, '_arviointiAsteikko')) {
    const arviointiAsteikko = _.keyBy(arviointiasteikot.value, 'id')[_.get(tutkinnonosa.geneerinenArviointiasteikko, '_arviointiAsteikko')];
    const osaamistasot = _.keyBy(arviointiAsteikko.osaamistasot, 'id');
    tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit = _.map(tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit, otKriteeri => {
      return {
        ...otKriteeri,
        osaamistaso: osaamistasot[_.get(otKriteeri, '_osaamistaso')],
      };
    });
  }

  return tutkinnonosa;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
