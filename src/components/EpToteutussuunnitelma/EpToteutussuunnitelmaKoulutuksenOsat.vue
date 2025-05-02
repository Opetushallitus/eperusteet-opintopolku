<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header" />

    <EpSpinner v-if="!koulutuksenosat" />

    <template v-else>
      <div
        v-if="yhteisetKoulutuksenosat.length > 0"
        class="mb-4"
      >
        <h3>{{ $t('yhteiset-opinnot') }}</h3>

        <EpKoulutuksenOsaKortti
          v-for="koulutuksenosaViite in yhteisetKoulutuksenosat"
          :key="'koulutuksenosa'+koulutuksenosaViite.id"
          :koulutuksenosa="koulutuksenosaViite.koulutuksenosa"
          :route="{name: 'toteutussuunnitelmaSisalto', params: {'sisaltoviiteId': koulutuksenosaViite.id}}"
        />
      </div>

      <template v-if="valinnaisetKoulutuksenosat.length > 0">
        <h3>{{ $t('valinnaiset-opinnot') }}</h3>

        <EpKoulutuksenOsaKortti
          v-for="koulutuksenosaViite in valinnaisetKoulutuksenosat"
          :key="'koulutuksenosa'+koulutuksenosaViite.id"
          :koulutuksenosa="koulutuksenosaViite.koulutuksenosa"
          :route="{name: 'toteutussuunnitelmaSisalto', params: {'sisaltoviiteId': koulutuksenosaViite.id}}"
        />
      </template>

      <template v-if="yhteisetKoulutuksenosat.length === 0 && valinnaisetKoulutuksenosat.length === 0 && koulutuksenosat.length > 0">
        <EpKoulutuksenOsaKortti
          v-for="koulutuksenosaViite in koulutuksenosat"
          :key="'koulutuksenosa'+koulutuksenosaViite.id"
          :koulutuksenosa="koulutuksenosaViite.koulutuksenosa"
          :route="{name: 'toteutussuunnitelmaSisalto', params: {'sisaltoviiteId': koulutuksenosaViite.id}}"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { KoulutuksenOsaDtoKoulutusOsanTyyppiEnum, Matala, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { KoulutuksenOsatStore } from '@/stores/KoulutuksenOsatStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpKoulutuksenOsaKortti from '@shared/components/EpKoulutuksenosa/EpKoulutuksenOsaKortti.vue';
import * as _ from 'lodash';
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
    type: Object as () => OpetussuunnitelmaDto,
    required: true,
  },
});

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const koulutuksenosat = computed(() => {
  return _.map(props.sisaltoviite.lapset, (viite: any) => {
    let perusteenOsa;
    if (viite.perusteenOsaId) {
      perusteenOsa = opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: viite.perusteenOsaId });
    }

    return {
      ...viite,
      koulutuksenosa: {
        ...viite.koulutuksenosa,
        laajuusMinimi: !_.isNil(perusteenOsa?.laajuusMinimi) ? perusteenOsa.laajuusMinimi : viite?.koulutuksenosa?.laajuusMinimi,
        laajuusMaksimi: !_.isNil(perusteenOsa?.laajuusMaksimi) ? perusteenOsa?.laajuusMaksimi : viite?.koulutuksenosa?.laajuusMaksimi,
      },
    };
  }) as any;
});

const yhteisetKoulutuksenosat = computed(() => {
  return _.filter(koulutuksenosat.value, koulutuksenosaViite =>
    koulutuksenosaViite.koulutuksenosa?.koulutusOsanTyyppi === _.toLower(KoulutuksenOsaDtoKoulutusOsanTyyppiEnum.YHTEINEN));
});

const valinnaisetKoulutuksenosat = computed(() => {
  return _.filter(koulutuksenosat.value, koulutuksenosaViite =>
    koulutuksenosaViite.koulutuksenosa?.koulutusOsanTyyppi === _.toLower(KoulutuksenOsaDtoKoulutusOsanTyyppiEnum.VALINNAINEN));
});
</script>

<style scoped lang="scss">

</style>
