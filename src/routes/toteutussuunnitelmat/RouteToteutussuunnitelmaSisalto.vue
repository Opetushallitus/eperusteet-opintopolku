<template>
  <div class="content">
    <ep-spinner v-if="fetching" />

    <div
      v-else-if="sisaltoviite"
      class="content"
    >
      <portal to="toteutussuunnitelma-sisalto-header">
        <h2 v-if="sisaltoviite.nimi">
          <span v-if="numerointi">{{ numerointi }}</span>
          {{ $kaanna(sisaltoviite.nimi) }}
        </h2>
      </portal>

      <ep-toteutussuunnitelma-tekstikappale
        v-if="sisaltoviite.tyyppi === 'tekstikappale'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />

      <ep-toteutussuunnitelma-tutkinnonosa
        v-else-if="sisaltoviite.tyyppi === 'tutkinnonosa'"
        :sisaltoviite="sisaltoviite"
        :perusteen-tutkinnonosa="perusteenTutkinnonosa"
        :perusteen-tutkinnonosa-viite="perusteenTutkinnonosaViite"
        :kuvat="kuvat"
        :arviointiasteikot="arviointiasteikot"
        :julkaisukielet="opetussuunnitelma.julkaisukielet"
      />
      <ep-toteutussuunnitelma-suorituspolku
        v-else-if="sisaltoviite.tyyppi === 'suorituspolku' || sisaltoviite.tyyppi === 'osasuorituspolku'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
      />
      <ep-toteutussuunnitelma-opintokokonaisuus
        v-else-if="sisaltoviite.tyyppi === 'opintokokonaisuus'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />

      <ep-toteutussuunnitelma-laajaalainen-osaaminen
        v-else-if="sisaltoviite.tyyppi === 'laajaalainenosaaminen'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />

      <ep-toteutussuunnitelma-koulutuksen-osat
        v-else-if="sisaltoviite.tyyppi === 'koulutuksenosat'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
      />

      <ep-toteutussuunnitelma-koulutuksen-osa
        v-else-if="sisaltoviite.tyyppi === 'koulutuksenosa'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
      />

      <ep-toteutussuunnitelma-koto-laaja-alainen-osaaminen
        v-else-if="sisaltoviite.tyyppi === 'koto_laajaalainenosaaminen'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
      />

      <ep-toteutussuunnitelma-koto-opinto-sisalto
        v-else-if="sisaltoviite.tyyppi === 'koto_kielitaitotaso'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        sisalto-viite-sisalto="kotoKielitaitotaso"
      />

      <ep-toteutussuunnitelma-koto-opinto-sisalto
        v-else-if="sisaltoviite.tyyppi === 'koto_opinto'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
        :opetussuunnitelma="opetussuunnitelma"
        sisalto-viite-sisalto="kotoOpinto"
      />

      <EpToteutussuunnitelmaOsaamismerkki
        v-else-if="sisaltoviite.tyyppi === 'osaamismerkki'"
        :sisaltoviite="sisaltoviite"
        :kuvat="kuvat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpToteutussuunnitelmaTekstikappale from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTekstikappale.vue';
import EpToteutussuunnitelmaTutkinnonosa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTutkinnonosa.vue';
import EpToteutussuunnitelmaSuorituspolku from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaSuorituspolku.vue';
import EpToteutussuunnitelmaOpintokokonaisuus from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOpintokokonaisuus.vue';
import EpToteutussuunnitelmaLaajaalainenOsaaminen from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaLaajaalainenOsaaminen.vue';
import EpToteutussuunnitelmaKoulutuksenOsat from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsat.vue';
import EpToteutussuunnitelmaKoulutuksenOsa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKoulutuksenOsa.vue';
import EpToteutussuunnitelmaKotoOpintoSisalto from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKotoOpintoSisalto.vue';
import EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaKotoLaajaAlainenOsaaminen.vue';
import EpToteutussuunnitelmaOsaamismerkki from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaOsaamismerkki.vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import { $kaanna } from '@shared/utils/globals';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const route = useRoute();
const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const sisaltoviiteId = computed(() => {
  return _.toNumber(route.params.sisaltoviiteId);
});

const sisaltoviite = computed(() => {
  const julkaistuSisalto = opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: sisaltoviiteId.value });

  if (_.get(julkaistuSisalto, 'tosa')) {
    const tutkinnonosat = opetussuunnitelmaDataStore.getJulkaistuSisalto('tutkinnonOsat');
    const tutkinnonosa = _.find(tutkinnonosat, tutkinnonosa => tutkinnonosa.tosa.id === julkaistuSisalto.tosa.id);

    if (tutkinnonosa) {
      return {
        ...julkaistuSisalto,
        tosa: tutkinnonosa.tosa,
      };
    }
  }

  return julkaistuSisalto;
});

const fetching = computed(() => {
  return !sisaltoviite.value;
});

const perusteenTutkinnonOsanId = computed(() => {
  return sisaltoviite.value.tosa?.vierastutkinnonosa?.tosaId || sisaltoviite.value.tosa?.perusteentutkinnonosa;
});

const perusteenTutkinnonosaViite = computed(() => {
  return _.find(opetussuunnitelmaDataStore.perusteidenTutkinnonOsienViitteet, perusteTosaViite =>
    _.get(perusteTosaViite, '_tutkinnonOsa') === _.toString(perusteenTutkinnonOsanId.value));
});

const perusteenTutkinnonosa = computed(() => {
  return _.find(opetussuunnitelmaDataStore.perusteidenTutkinnonOsat, perusteTosaViite =>
    _.get(perusteTosaViite, 'id') === _.toNumber(perusteenTutkinnonOsanId.value));
});

const opetussuunnitelma = computed(() => {
  return opetussuunnitelmaDataStore.opetussuunnitelma;
});

const kuvat = computed(() => {
  return [
    ...opetussuunnitelmaDataStore.kuvat,
    ...opetussuunnitelmaDataStore.perusteKuvat,
  ];
});

const arviointiasteikot = computed(() => {
  return opetussuunnitelmaDataStore.arviointiasteikot;
});

const current = computed((): NavigationNode | null => {
  return opetussuunnitelmaDataStore.current;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});

const alikappaleNumeroinnitById = computed(() => {
  if (current.value?.children) {
    return current.value?.children?.reduce((acc: any, child: any) => {
      acc[child.id] = child?.meta?.numerointi;
      return acc;
    }, {});
  }

  return {};
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
